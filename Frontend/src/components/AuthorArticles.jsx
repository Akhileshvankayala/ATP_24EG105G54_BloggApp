import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import BASE_URL from '../config'
import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted
} from '../styles/common'

/**
 * AuthorArticles Component
 * Displays a grid of articles specifically created by the logged-in author.
 * Shows status indicators for each article (Active/Deleted).
 */
function AuthorArticles() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuth((state) => state.currentUser)

  // Local state for article collection and UI feedback
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Effect to load articles on mount or when the user profile changes.
   * Also listens for a 'refreshedAt' signal in location state to re-fetch after updates.
   */
  useEffect(() => {
    if (!user) return

    const getAuthorArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/author-api/articles`, {
          withCredentials: true
        })

        if (res.status === 200) {
          setArticles(res.data.payload)
        }
      } catch (err) {
        console.error('Error fetching author articles:', err)
        setError(err.response?.data?.error || 'Unable to load your articles at this time.')
      } finally {
        setLoading(false)
      }
    }

    getAuthorArticles()
  }, [user, location.state?.refreshedAt])

  /**
   * Navigates to the full article view
   * @param {object} article - The article data object
   */
  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article
    })
  }

  // Handle loading and error states
  if (loading) return <div className="py-20 text-center"><p className={loadingClass}>Fetching your workspace...</p></div>
  if (error) return <div className="py-20 text-center"><p className={errorClass}>{error}</p></div>

  // Handle empty state (no articles yet)
  if (articles.length === 0) {
    return (
      <div className={`${emptyStateClass} bg-gray-50 border border-dashed rounded-3xl py-16`}>
        <p>You haven't published any articles yet. Use the 'Write Article' tab to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
      {articles.map((article) => (
        <div
          key={article._id}
          className={`${articleCardClass} relative flex flex-col overflow-hidden group shadow-sm hover:shadow-md transition-all`}
        >
          {/* Article Visibility Status Badge */}
          <span
            className={`${
              article.isActive ? articleStatusActive : articleStatusDeleted
            } absolute top-4 right-4 z-10`}
          >
            {article.isActive ? 'Active' : 'Archived'}
          </span>

          <div className="flex flex-col gap-2 min-w-0">
            {/* Category Tag */}
            <p className={`${articleMeta} uppercase tracking-wider font-bold text-[10px]`}>
              {article.category}
            </p>

            {/* Title with clamping for consistency */}
            <p className={`${articleTitle} line-clamp-2 min-h-[3rem]`}>
              {article.title}
            </p>

            {/* Content Preview */}
            <p className={`${articleExcerpt} line-clamp-3 text-sm text-gray-600`}>
              {article.content}
            </p>
          </div>

          {/* Navigational Action */}
          <button
            className={`${ghostBtn} mt-auto pt-4 text-left font-semibold`}
            onClick={() => openArticle(article)}
          >
            Manage Article →
          </button>
        </div>
      ))}
    </div>
  )
}

export default AuthorArticles

