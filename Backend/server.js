import exp from 'express'
import { connect } from 'mongoose'
import { userApp } from './APIs/UserAPI.js'
import { authorApp } from './APIs/AuthorAPI.js'
import { adminApp } from './APIs/AdminAPI.js'
import { commonApp } from './APIs/CommonAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Initialize the express application
const app = exp()

// Middleware configuration
// CORS settings to allow requests from the frontend
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://atp-24-eg-110-a17.vercel.app'],
    credentials: true
  })
)

// Standard middleware for parsing cookies and JSON bodies
app.use(cookieParser())
app.use(exp.json())

// Route definitions for different user roles and common authentication
app.use('/user-api', userApp)
app.use('/author-api', authorApp)
app.use('/admin-api', adminApp)
app.use('/auth', commonApp)

/**
 * Database connection setup
 * Connects to MongoDB and starts the server once successful
 */
const connectDB = async () => {
  try {
    // Attempting to connect using the connection string from environment variables
    await connect(process.env.DB_URL, { family: 4 })
    console.log('Successfully connected to the database')
    
    const port = process.env.PORT || 4000
    app.listen(port, () => console.log(`Backend server is running on port ${port}`))
  } catch (err) {
    console.log('Database connection failed:', err)
  }
}

// Start the database connection process
connectDB()

// Fallback for invalid routes (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: `The requested path ${req.url} was not found` })
})

/**
 * Global Error Handler
 * Catches errors from routes and provides consistent responses
 */
app.use((err, req, res, next) => {
  console.error('Error encountered:', err.name)
  console.error(err)

  // Handling specific Mongoose validation or cast errors
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ 
      message: 'There was a problem with the data provided', 
      error: err.message 
    })
  }

  // Generic server error fallback
  res.status(500).json({ 
    message: 'An internal server error occurred', 
    error: err.message 
  })
})

