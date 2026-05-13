# Blog App - Frontend

A modern, responsive, and role-based blogging platform interface built with **React**, **Vite**, and **Tailwind CSS**. Designed with premium aesthetics, smooth transitions, and a clean user experience.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16.x or higher)
- **npm** or **yarn**

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🏗️ Architecture & Structure

The project follows a component-based architecture with centralized state management.

### Directory Map
- `src/components/`: Modular UI components (Dashboards, Auth forms, Article views).
- `src/store/`: State management using **Zustand** (Auth and User state).
- `src/styles/`: Global styles and common design tokens (`common.js`).
- `src/App.jsx`: Main routing configuration using `react-router-dom`.
- `src/config.js`: API base URLs and environment settings.

---

## 🔐 Authentication & Roles

The application implements a multi-tier authentication system:

| Role | Permissions |
| :--- | :--- |
| **User** | Read articles, post comments. |
| **Author** | Create, edit, and archive articles; manage their own workspace. |
| **Admin** | System management, user/author account control. |

**Route Protection:** Centralized via `ProtectedRoute.jsx` which validates both authentication status and specific role requirements before rendering views.

---

## 🎨 Design Principles

- **Typography**: Uses modern sans-serif stacks for maximum readability.
- **Micro-interactions**: Subtle hover effects and fade-in animations for a "live" feel.
- **Consistency**: Centralized style tokens in `common.js` ensure a unified look across all 20+ components.
- **Responsiveness**: Fully adaptive grid layouts for mobile, tablet, and desktop views.

---

## 🛠️ Key Technologies

- **React 18**: Frontend framework.
- **Vite**: Ultra-fast build tool and dev server.
- **Zustand**: Lightweight state management for global auth.
- **React Hook Form**: Optimized form handling and validation.
- **Axios**: Promised-based HTTP client for API interactions.
- **React Hot Toast**: Elegant notification system.




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
