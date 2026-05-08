import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { articleModel } from '../models/ArticleModel.js'

// Router for User-specific operations
export const userApp = exp.Router()

/**
 * Route: GET /articles
 * Purpose: Fetch all active articles for readers (Users and Admins)
 */
userApp.get('/articles', verifyToken('USER', 'AUTHOR', 'ADMIN'), async (req, res) => {
  // Retrieve all articles that are currently active
  const articlesList = await articleModel.find({ isActive: true })
  res.status(200).json({ message: 'List of articles fetched successfully', payload: articlesList })
})

/**
 * Route: GET /article/:id
 * Purpose: Fetch a single article by its ID, including comments
 */
userApp.get('/article/:id', verifyToken('USER', 'AUTHOR', 'ADMIN'), async (req, res) => {
  const { id } = req.params

  const query = { _id: id }

  if (req.user.role === 'USER') {
    query.isActive = true
  } else if (req.user.role === 'AUTHOR') {
    query.$or = [{ author: req.user.id }, { isActive: true }]
  } else {
    query.isActive = true
  }

  const articleDocument = await articleModel
    .findOne(query)
    .populate('comments.user')

  if (!articleDocument) {
    return res.status(404).json({ message: 'Article not found' })
  }

  res.status(200).json({ message: 'Article retrieved successfully', payload: articleDocument })
})

/**
 * Route: PUT /articles
 * Purpose: Add a new comment to an existing article
 */
userApp.put('/articles', verifyToken('USER', 'ADMIN'), async (req, res) => {
  const { articleId, comment } = req.body

  // Look for the article and ensure it's still active
  const articleDocument = await articleModel
    .findOne({ _id: articleId, isActive: true })
    .populate('comments.user')

  // If the article doesn't exist or is inactive, return an error
  if (!articleDocument) {
    return res.status(404).json({ message: 'The article could not be found' })
  }

  // Identify the user from the verified token
  const userId = req.user?.id
  
  // Append the new comment and save the changes
  articleDocument.comments.push({ user: userId, comment: comment })
  await articleDocument.save()
  
  // Re-populate to include fresh user details in the response
  await articleDocument.populate('comments.user')

  res.status(200).json({ 
    message: 'Your comment has been added', 
    payload: articleDocument 
  })
})

