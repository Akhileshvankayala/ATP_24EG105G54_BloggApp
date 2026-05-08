import { Schema, model, Types } from "mongoose";

/**
 * Comment Schema
 * Sub-schema for comments within an article
 */
const commentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "A valid user ID is required to comment"],
    },
    comment: {
      type: String,
      required: [true, "Please provide the comment text"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Article Schema Definition
 * Represents the blog posts created by authors
 */
const articleSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "An author reference is mandatory"],
    },
    title: {
      type: String,
      required: [true, "An article must have a title"],
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
    },
    content: {
      type: String,
      required: [true, "Article content cannot be empty"],
    },
    // Array of comments following the commentSchema
    comments: [{ type: commentSchema, default: [] }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Enable timestamps for creation and update tracking
    timestamps: true,
    // Disable the Mongoose version key (__v)
    versionKey: false,
    // Ensure only fields defined in the schema are saved
    strict: "throw",
  },
);

// Exporting the Article model for use in the application
export const articleModel = model("article", articleSchema);

