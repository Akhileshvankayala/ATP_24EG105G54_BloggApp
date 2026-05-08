import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

// Load environment variables
config()

const { verify } = jwt

/**
 * Middleware: verifyToken
 * Purpose: Authenticates the user via JWT and checks if their role is permitted for the route
 * @param {...string} allowedRoles - List of roles that are authorized to access the route
 */
export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Extract the token from the secure cookie
      const token = req.cookies?.token
      
      // If no token is found, the user is not logged in
      if (!token) {
        return res.status(401).json({ message: 'Authentication required. Please log in.' })
      }

      // Verify the token using the secret key
      const decodedToken = verify(token, process.env.SECRET_KEY)

      // Authorization: Check if the user's role is in the list of allowed roles
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: 'Access denied: You do not have the required permissions' })
      }

      // Attach the decoded user information to the request object for use in routes
      req.user = decodedToken
      
      // Proceed to the next middleware or route handler
      next()
    } catch (err) {
      // If verification fails (e.g., token expired or tampered with)
      res.status(401).json({ message: 'Your session has expired or the token is invalid' })
    }
  }
}

