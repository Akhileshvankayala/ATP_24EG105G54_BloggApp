import { useAuth } from '../store/authStore'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

/**
 * ProtectedRoute Component
 * A higher-order component used to guard routes that require authentication or specific roles.
 * 
 * @param {ReactNode} children - The component to render if access is granted
 * @param {Array<string>} allowedRoles - Optional list of roles permitted to access this route
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { loading, currentUser, isAuthenticated } = useAuth()

  /**
   * Monitor authentication state and provide feedback if access is denied
   */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error('You need to be logged in to access this page.')
    }
  }, [loading, isAuthenticated])

  // Show a basic loading state while checking the user's session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#6e6e73] animate-pulse">Verifying session...</p>
      </div>
    )
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if the user has one of the required roles for this route
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" replace state={{ redirectTo: '/' }} />
  }

  // All checks passed: grant access to the protected content
  return children
}

export default ProtectedRoute

