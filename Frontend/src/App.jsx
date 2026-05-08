import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Root from '../src/components/Root'
import Home from '../src/components/Home'
import Register from '../src/components/Register'
import Login from '../src/components/Login'
import UserProfile from '../src/components/UserProfile'
import AuthorProfile from '../src/components/AuthorProfile'
import AdminProfile from '../src/components/AdminProfile'
import Articles from '../src/components/Articles'
import ArticleById from '../src/components/ArticleById'
import WriteArticles from '../src/components/WriteArticles'
import AuthorArticles from '../src/components/AuthorArticles'
import UserList from '../src/components/UserList'
import AuthorList from '../src/components/AuthorList'
import EditArticle from '../src/components/EditArticle'
import { Toaster } from 'react-hot-toast'
import Unauthorized from '../src/components/Unauthorized'
import ProtectedRoute from '../src/components/ProtectedRoute'

/**
 * Main App Component
 * Defines the routing structure and global providers for the application
 */
function App() {
  // Configuration for all application routes
  const routerObj = createBrowserRouter([
    {
      path: '/',
      element: <Root />, // Main layout wrapper
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'register',
          element: <Register />
        },
        {
          path: 'login',
          element: <Login />
        },
        // Standard User Routes
        {
          path: 'user-profile',
          element: (
            <ProtectedRoute allowedRoles={['USER']}>
              <UserProfile />
            </ProtectedRoute>
          )
        },
        {
          path: 'articles',
          element: (
            <ProtectedRoute allowedRoles={['USER', 'AUTHOR', 'ADMIN']}>
              <Articles />
            </ProtectedRoute>
          )
        },
        // Author-specific Routes
        {
          path: 'author-profile',
          element: (
            <ProtectedRoute allowedRoles={['AUTHOR']}>
              <AuthorProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <AuthorArticles />
            },
            {
              path: 'articles',
              element: <AuthorArticles />
            },
            {
              path: 'write-article',
              element: <WriteArticles />
            }
          ]
        },
        // Admin-specific Routes
        {
          path: 'admin-profile',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="users" replace />
            },
            {
              path: 'users',
              element: <UserList />
            },
            {
              path: 'authors',
              element: <AuthorList />
            },
            { path: 'articles', element: <Articles /> }
          ]
        },
        // Shared Article Routes
        {
          path: 'article/:id',
          element: (
            <ProtectedRoute allowedRoles={['USER', 'AUTHOR', 'ADMIN']}>
              <ArticleById />
            </ProtectedRoute>
          )
        },
        {
          path: 'edit-article/:id',
          element: (
            <ProtectedRoute allowedRoles={['AUTHOR']}>
              <EditArticle />
            </ProtectedRoute>
          )
        },
        // Error/Permission Routes
        {
          path: 'unauthorized',
          element: <Unauthorized />
        }
      ]
    }
  ])

  return (
    <div className="app-container">
      {/* Toast notifications configuration */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      {/* Provide the router to the application */}
      <RouterProvider router={routerObj} />
    </div>
  )
}

export default App

