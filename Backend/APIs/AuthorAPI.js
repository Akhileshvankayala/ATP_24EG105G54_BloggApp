import exp from "express";
import { userModel } from "../models/UserModel.js";
import { articleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

// Router for Author-specific operations
export const authorApp = exp.Router();

/**
 * Route: POST /articles
 * Purpose: Allows authors to publish new articles
 */
authorApp.post("/articles", verifyToken("AUTHOR"), async (req, res) => {
  const articleObj = req.body;
  const user = req.user;

  // Verify that the author exists in the system
  const author = await userModel.findById(articleObj.author);
  if (!author) {
    return res.status(404).json({ message: "The specified author was not found" });
  }

  // Security check: Ensure the logged-in user is the one publishing the article
  if (author.email !== user.email) {
    return res.status(403).json({ message: "You are not authorized to publish as this author" });
  }

  // Create and save the new article document
  const articleDocument = new articleModel(articleObj);
  await articleDocument.save();

  res.status(201).json({ message: "Your article has been published successfully" });
});

/**
 * Route: GET /articles
 * Purpose: Retrieves all articles written by the logged-in author
 */
authorApp.get("/articles", verifyToken("AUTHOR"), async (req, res) => {
  const authorIdOfToken = req.user?.id;

  // Find all articles matching the author's ID
  const articlesList = await articleModel.find({ author: authorIdOfToken });
  
  if (!articlesList || articlesList.length === 0) {
    return res.status(404).json({ message: "No articles found for this author" });
  }

  res.status(200).json({ message: "Articles retrieved", payload: articlesList });
});

/**
 * Route: PUT /articles
 * Purpose: Enables authors to edit their existing articles
 */
authorApp.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
  const authorIdOfToken = req.user?.id;
  const { articleId, title, category, content } = req.body;

  // Find the article by ID and ensure it belongs to the author before updating
  const modifiedArticle = await articleModel.findOneAndUpdate(
    { _id: articleId, author: authorIdOfToken },
    { $set: { title, category, content } },
    { new: true },
  );

  if (!modifiedArticle) {
    return res.status(403).json({ message: "Unauthorized: You can only edit your own articles" });
  }

  res.status(200).json({ 
    message: "Article updated successfully", 
    payload: modifiedArticle 
  });
});

/**
 * Route: PATCH /articles
 * Purpose: Soft delete or restore an article (toggles isActive state)
 */
authorApp.patch("/articles", verifyToken("AUTHOR"), async (req, res) => {
  const authorIdOfToken = req.user?.id;
  const { articleId } = req.body;
  const isArticleActive = req.body.hasOwnProperty('isArticleActive')
    ? req.body.isArticleActive
    : req.body.isActive;

  // Verify ownership of the article
  const articleOfDB = await articleModel.findOne({
    _id: articleId,
    author: authorIdOfToken,
  });

  if (!articleOfDB) {
    return res.status(404).json({ message: "Article not found or access denied" });
  }

  // Check if the state is already what was requested
  if (isArticleActive === articleOfDB.isActive) {
    return res.status(200).json({ message: "Article is already in the requested state" });
  }

  // Update and save the status
  articleOfDB.isActive = isArticleActive;
  await articleOfDB.save();

  res.status(200).json({ 
    message: `Article ${isArticleActive ? "restored" : "deactivated"} successfully`, 
    payload: articleOfDB 
  });
});

