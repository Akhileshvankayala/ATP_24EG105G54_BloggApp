import { useAuth } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import BASE_URL from '../config'
import axios from 'axios'
import { useEffect, useState } from 'react'

import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass
} from '../styles/common.js'

/**
 * UserProfile Component
 * Dashboard for standard users where they can view their profile info and browse latest articles.
 */
function UserProfile() {
  const logout = useAuth((state) => state.logout)
  const currentUser = useAuth((state) => state.currentUser)
  const navigate = useNavigate()

  // Local state for article data and loading/error feedback
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [articles, setArticles] = useState([])

  /**
   * Effect hook to fetch all available articles on component mount
   */
  useEffect(() => {
    const getArticles = async () => {
      setLoading(true)
      try {
        // Fetch articles intended for standard users
        const res = await axios.get(`${BASE_URL}/user-api/articles`, {
          withCredentials: true
        })
        
        if (res.status === 200) {
          setArticles(res.data.payload)
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load articles at this time.')
      } finally {
        setLoading(false)
      }
    }

    getArticles()
  }, [])

  /**
   * Utility to format ISO dates into a human-readable IST format
   * @param {string} date - ISO date string
   * @returns {string} Formatted date and time
   */
  const formatDateIST = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  /**
   * Handle user logout and redirection
   */
  const onLogout = async () => {
    await logout()
    navigate('/login')
  }

  /**
   * Navigates to a specific article details page
   * @param {object} articleObj - The article data object
   */
  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj
    })
  }

  // Display loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className={loadingClass}>Fetching latest articles...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Global Error Display */}
      {error && <p className={`${errorClass} text-center mb-6`}>{error}</p>}

      {/* Profile Header: User identity and logout action */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* User Avatar (Cloudinary URL or fallback initial) */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border flex-shrink-0"
              alt={`${currentUser.firstName}'s profile`}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold flex-shrink-0">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* User Name/Greeting */}
          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              {currentUser?.firstName}
            </h2>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition-colors"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* Articles Feed */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">
          Explore Latest Articles
        </h3>

        {/* Empty State vs Article Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-[#a1a1a6] text-sm">No articles have been published yet.</p>
          </div>
        ) : (
          <div className={articleGrid}>
            {articles.map((articleObj) => (
              <div
                className={`${articleCardClass} flex flex-col h-full`}
                key={articleObj._id}
              >
                {/* Article Content Preview */}
                <div className="flex flex-col gap-1 min-w-0">
                  <p className={`${articleTitle} line-clamp-2`}>
                    {articleObj.title}
                  </p>

                  <p className="text-sm text-[#6e6e73] mt-1 line-clamp-3 break-words">
                    {articleObj.content}
                  </p>

                  <p className={`${timestampClass} mt-2`}>
                    {formatDateIST(articleObj.createdAt)}
                  </p>
                </div>

                {/* Read More Link */}
                <button
                  className={`${ghostBtn} mt-auto pt-4 text-left`}
                  onClick={() => navigateToArticleByID(articleObj)}
                >
                  Read Full Article →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
file
