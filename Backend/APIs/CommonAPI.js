import exp from 'express'
import { userModel } from '../models/UserModel.js'
import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middlewares/verifyToken.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import cloudinary from '../config/cloudinary.js'

const { sign } = jwt
export const commonApp = exp.Router()

/**
 * Route: POST /users
 * Purpose: Handles new user and author registrations with profile image upload
 */
commonApp.post(
  '/users',
  upload.single('profileImageUrl'),
  async (req, res, next) => {
    let cloudinaryResult = null
    try {
      const allowedRoles = ['USER', 'AUTHOR']
      const newUser = req.body

      // Ensure the role being assigned is valid
      if (!allowedRoles.includes(newUser.role)) {
        return res.status(400).json({ message: 'The provided role is invalid' })
      }

      // If an image was uploaded, send it to Cloudinary
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer)
        newUser.profileImageUrl = cloudinaryResult?.secure_url
      }

      // Initialize the user document and validate against the schema
      const newUserDocument = new userModel(newUser)
      await newUserDocument.validate()

      // Secure the password before saving
      const hashedPassword = await hash(newUser.password, 10)
      newUserDocument.password = hashedPassword

      // Final save to the database
      await newUserDocument.save({ validateBeforeSave: false })
      res.status(201).json({ message: 'Your account has been created successfully' })
    } catch (err) {
      // If something goes wrong, clean up any uploaded image from Cloudinary
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id)
      }
      next(err)
    }
  }
)

/**
 * Route: POST /login
 * Purpose: Authenticates users and issues a JWT via a secure cookie
 */
commonApp.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Check if the user exists
  const user = await userModel.findOne({ email: email })
  if (!user) {
    return res.status(400).json({ message: 'Invalid login credentials' })
  }

  // Verify the provided password
  const isMatched = await compare(password, user.password)
  if (!isMatched) {
    return res.status(400).json({ message: 'Invalid login credentials' })
  }

  // Ensure the account hasn't been disabled by an admin
  if (!user.isUserActive) {
    return res.status(403).json({
      message: 'This account is currently inactive. Please contact support.'
    })
  }

  // Generate a JWT containing essential user info
  const signedToken = sign(
    {
      id: user._id,
      email: email,
      role: user.role,
      firstName: user.firstName,
      profileImageUrl: user.profileImageUrl
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  )

  const isSecureCookie = process.env.NODE_ENV === 'production'
  const sameSiteValue = isSecureCookie ? 'none' : 'lax'

  // Set the token as a secure, HTTP-only cookie
  res.cookie('token', signedToken, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: sameSiteValue
  })

  // Respond with user data (excluding the sensitive password field)
  const userObj = user.toObject()
  delete userObj.password
  res.status(200).json({ message: 'Welcome back! Login successful', payload: userObj })
})

/**
 * Route: GET /logout
 * Purpose: Clears the authentication cookie to log the user out
 */
commonApp.get('/logout', (req, res) => {
  const isSecureCookie = process.env.NODE_ENV === 'production'
  const sameSiteValue = isSecureCookie ? 'none' : 'lax'

  res.clearCookie('token', {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: sameSiteValue
  })
  res.status(200).json({ message: 'You have been logged out successfully' })
})

/**
 * Route: GET /check-auth
 * Purpose: Used by the frontend to verify if the user's session is still active
 */
commonApp.get(
  '/check-auth',
  verifyToken('USER', 'AUTHOR', 'ADMIN'),
  (req, res) => {
    res.status(200).json({ message: 'Session is active', payload: req.user })
  }
)

/**
 * Route: PUT /password
 * Purpose: Allows logged-in users to update their account password
 */
commonApp.put(
  '/password',
  verifyToken('USER', 'AUTHOR', 'ADMIN'),
  async (req, res) => {
    const { currentPassword, newPassword } = req.body

    // Basic check to ensure the new password is actually different
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: 'The new password must be different from your current one'
      })
    }

    const userId = req.user?.id
    const user = await userModel.findById(userId)
    
    if (!user) {
      return res.status(404).json({ message: 'Account not found' })
    }

    // Confirm the current password is correct before allowing a change
    const verifiedPassword = await compare(currentPassword, user.password)
    if (!verifiedPassword) {
      return res.status(401).json({ message: 'The current password provided is incorrect' })
    }

    // Hash and save the new password
    const updatedPassword = await hash(newPassword, 10)
    user.password = updatedPassword
    await user.save()

    res.status(200).json({ message: 'Your password has been updated' })
  }
)

