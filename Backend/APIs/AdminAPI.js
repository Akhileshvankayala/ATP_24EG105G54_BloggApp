import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { userModel } from '../models/UserModel.js'
import { articleModel } from '../models/ArticleModel.js'

// Router for Administrator-only operations
export const adminApp = exp.Router()

/**
 * Route: GET /users
 * Purpose: Retrieve a list of all registered standard users
 */
adminApp.get('/users', verifyToken('ADMIN'), async (req, res) => {
  // Fetch users with 'USER' role and exclude their passwords for security
  const users = await userModel.find({ role: 'USER' }).select('-password')
  res.status(200).json({ message: 'User directory retrieved', payload: users })
})

/**
 * Route: GET /authors
 * Purpose: Retrieve a list of all registered authors
 */
adminApp.get('/authors', verifyToken('ADMIN'), async (req, res) => {
  // Fetch users with 'AUTHOR' role and exclude their passwords
  const authors = await userModel.find({ role: 'AUTHOR' }).select('-password')
  res.status(200).json({ message: 'Author directory retrieved', payload: authors })
})

/**
 * Route: PUT /users/:id/status
 * Purpose: Enable or disable a user/author account
 */
adminApp.put('/users/:id/status', verifyToken('ADMIN'), async (req, res) => {
  const { id } = req.params
  const { isUserActive } = req.body

  // Locate the user by their ID
  const user = await userModel.findById(id)
  if (!user) {
    return res.status(404).json({ message: 'The specified user was not found' })
  }

  // Update the active status and save without re-validating the whole schema
  user.isUserActive = isUserActive
  await user.save({ validateBeforeSave: false })

  // Clean up user data before sending it back
  const userData = user.toObject()
  delete userData.password

  res.status(200).json({
    message: `Account has been ${isUserActive ? 'activated' : 'deactivated'} successfully`,
    payload: userData
  })
})

/**
 * Route: GET /articles
 * Purpose: View all active articles across the platform
 */
adminApp.get('/articles', verifyToken('ADMIN'), async (req, res) => {
  const articlesList = await articleModel.find({ isActive: true })
  res.status(200).json({ message: 'Global article list retrieved', payload: articlesList })
})

