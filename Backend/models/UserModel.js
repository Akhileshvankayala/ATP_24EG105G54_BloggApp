import { Schema, model } from "mongoose";

/**
 * User Schema Definition
 * Represents users, authors, and admins in the blog platform
 */
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "This email is already registered"],
    },
    password: {
      type: String,
      required: [true, "Password is required for security"],
    },
    role: {
      type: String,
      enum: ["USER", "AUTHOR", "ADMIN"],
      required: [true, "A valid role must be assigned"],
    },
    profileImageUrl: {
      type: String,
    },
    isUserActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
    // Remove __v version key from responses
    versionKey: false,
    // Throw error if fields outside schema are provided
    strict: "throw",
  },
);

// Create and export the User model for database operations
export const userModel = model("user", userSchema);

