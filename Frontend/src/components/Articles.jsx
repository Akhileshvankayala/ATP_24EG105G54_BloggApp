import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import BASE_URL from '../config'
import {
  pageWrapper,
  articleGrid,
  articleCardClass,
  articleTitle,
  tagClass,
  ghostBtn,
  timestampClass,
  loadingClass,
  errorClass,
  emptyStateClass
} from '../styles/common'

/**
 * Articles Component
 * A public-facing feed of all active articles.
 * Allows users to browse and select articles to read in detail.
 */
function Articles() {
  const navigate = useNavigate()
  const user = useAuth((state) => state.currentUser)

  // State management for article collection and operation status
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch articles on component mount or when the user context changes
   */
  useEffect(() => {
    // We only fetch if we have a user context (though this might be public in some apps, 
    // here it follows the auth state)
    if (!user) return

    const getArticles = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/user-api/articles`, {
          withCredentials: true
        })
        setArticles(res.data.payload || [])
      } catch (err) {
        console.error('Error loading articles feed:', err)
        setError(err.response?.data?.message || 'We had trouble loading the articles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    getArticles()
  }, [user])

  /**
   * Formats a date string for display in IST
   * @param {string} value - ISO date string
   * @returns {string} Human-friendly date
   */
  const formatDate = (value) =>
    new Date(value).toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium'
    })

  /**
   * Navigates to the individual article details page
   * @param {object} article - The article to view
   */
  const openArticle = (article) => {
    navigate(`/article/${article._id}`, { state: article })
  }

  // Handle various UI states: Loading, Error, and Empty
  if (loading) return <div className="py-20 text-center"><p className={loadingClass}>Curating articles for you...</p></div>
  if (error) return <div className="py-20 text-center"><p className={errorClass}>{error}</p></div>

  return (
    <div className={`${pageWrapper} fade-in`}>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Explore Articles</h1>
        <p className="text-[#6e6e73] mt-2 text-lg">Fresh perspectives from our community of writers.</p>
      </header>

      {articles.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed">
          <p className={emptyStateClass}>There are no articles to show right now. Check back soon!</p>
        </div>
      ) : (
        <div className={articleGrid}>
          {articles.map((article) => (
            <div
              key={article._id}
              className={`${articleCardClass} flex flex-col gap-3 shadow-sm hover:shadow-md transition-all`}
            >
              {/* Categorization Tag */}
              <div>
                <span className={`${tagClass} bg-blue-50 text-blue-600 border-none`}>
                  {article.category}
                </span>
              </div>

              {/* Title with clamping */}
              <p className={`${articleTitle} line-clamp-2 min-h-[3.5rem] leading-tight`}>
                {article.title}
              </p>

              {/* Brief Content Snippet */}
              <p className="text-sm text-[#6e6e73] line-clamp-3 leading-relaxed">
                {article.content}
              </p>

              {/* Article Footer: Date and Read Link */}
              <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50">
                <p className={`${timestampClass} font-medium`}>
                  {formatDate(article.createdAt)}
                </p>
                <button
                  className={`${ghostBtn} font-bold text-blue-600`}
                  onClick={() => openArticle(article)}
                >
                  Read Full Story →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Articles

