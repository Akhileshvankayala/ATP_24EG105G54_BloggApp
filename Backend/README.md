# Blog App Backend

This is the server-side component of the Blog application, built using Node.js, Express, and MongoDB. It handles authentication, article management, and user roles (User, Author, Admin).

## Directory Structure

- **APIs/**: Contains the route handlers for different application areas.
  - `AdminAPI.js`: Routes for administrative tasks like managing users and viewing all articles.
  - `AuthorAPI.js`: Routes for authors to create, edit, and manage their own articles.
  - `CommonAPI.js`: Shared routes for authentication (login, logout, registration) and profile management.
  - `UserAPI.js`: Routes for standard users to browse articles and leave comments.

- **config/**: Configuration files for external services and middleware.
  - `cloudinary.js`: Sets up the connection to Cloudinary for image storage.
  - `cloudinaryUpload.js`: Helper function to handle the stream upload process to Cloudinary.
  - `multer.js`: Configures file upload handling and restrictions.

- **middlewares/**: Custom middleware functions.
  - `verifyToken.js`: Security middleware that validates JWTs and checks user permissions.

- **models/**: Mongoose schemas defining the data structure in MongoDB.
  - `ArticleModel.js`: Defines the structure for blog posts and comments.
  - `UserModel.js`: Defines the structure for user accounts and roles.

- **server.js**: The entry point of the application. It initializes Express, connects to the database, and mounts all API routes.

## Getting Started

1. Ensure you have Node.js installed.
2. Install dependencies using `npm install`.
3. Set up your `.env` file with the necessary credentials (DB_URL, PORT, SECRET_KEY, CLOUDINARY details).
4. Start the server with `npm start` or `npm run dev`.
