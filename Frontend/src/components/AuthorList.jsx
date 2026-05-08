import { useEffect, useState } from 'react'
import axios from 'axios'
import BASE_URL from '../config'
import {
  headingClass,
  mutedText,
  tagClass,
  avatar,
  loadingClass,
  errorClass,
  emptyStateClass,
  divider
} from '../styles/common'

/**
 * AuthorList Component
 * Administrative view to manage registered content creators (Authors).
 * Enables toggling account status to control platform contribution rights.
 */
function AuthorList() {
  // Component state for data and operation management
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  /**
   * Fetch all registered authors from the admin API
   */
  useEffect(() => {
    const getAuthors = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/admin-api/authors`, {
          withCredentials: true
        })
        if (res.status === 200) {
          setAuthors(res.data.payload)
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to retrieve author directory.')
      } finally {
        setLoading(false)
      }
    }

    getAuthors()
  }, [])

  /**
   * Updates the 'isUserActive' status for a specific author
   * @param {string} authorId - MongoDB ID of the author
   * @param {boolean} currentStatus - Their current active state
   */
  const toggleAuthorStatus = async (authorId, currentStatus) => {
    setTogglingId(authorId)
    try {
      const res = await axios.put(
        `${BASE_URL}/admin-api/users/${authorId}/status`,
        { isUserActive: !currentStatus },
        { withCredentials: true }
      )
      
      if (res.status === 200) {
        // Sync local state with backend change
        setAuthors((prev) =>
          prev.map((a) =>
            a._id === authorId ? { ...a, isUserActive: !currentStatus } : a
          )
        )
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update author account status.')
    } finally {
      setTogglingId(null)
    }
  }

  // Feedback views for loading and error states
  if (loading) return <div className="py-10 text-center"><p className={loadingClass}>Loading author records...</p></div>
  if (error) return <div className="py-10 text-center"><p className={errorClass}>{error}</p></div>

  // Quick stats calculation
  const activeCount = authors.filter((a) => a.isUserActive).length
  const inactiveCount = authors.length - activeCount

  return (
    <div className="fade-in">
      {/* Header and Distribution Stats */}
      <div className="mb-6">
        <p className={tagClass}>Content Management</p>
        <h2 className={`${headingClass} mt-1`}>
          Registered Authors{' '}
          <span className={`${mutedText} font-normal text-base`}>({authors.length} total)</span>
        </h2>
        
        <div className="flex gap-4 mt-5">
          <div className="bg-[#007aff]/10 border border-[#007aff]/20 rounded-2xl px-5 py-3 min-w-[100px]">
            <p className="text-xl font-bold text-[#0062cc]">{activeCount}</p>
            <p className="text-xs font-medium text-[#0062cc]/70 uppercase tracking-wider">Active</p>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3 min-w-[100px]">
            <p className="text-xl font-bold text-gray-600">{inactiveCount}</p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Suspended</p>
          </div>
        </div>
      </div>

      <div className={divider} />

      {/* Author Directory */}
      {authors.length === 0 ? (
        <div className="py-20 text-center">
          <p className={emptyStateClass}>No authors found in the system.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {authors.map((author) => (
            <div
              key={author._id}
              className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Author Identity: Image or Initial fallback */}
                {author.profileImageUrl ? (
                  <img
                    src={author.profileImageUrl}
                    alt={`${author.firstName}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className={`${avatar} w-12 h-12 text-lg bg-blue-50 text-blue-600`}>
                    {author.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#1d1d1f]">
                    {author.firstName} {author.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{author.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                {/* Status Badge */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    author.isUserActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {author.isUserActive ? 'Active' : 'Suspended'}
                </span>

                {/* Status Control Button */}
                <button
                  disabled={togglingId === author._id}
                  onClick={() => toggleAuthorStatus(author._id, author.isUserActive)}
                  className={`text-xs font-semibold px-5 py-2 rounded-full border transition-all ${
                    author.isUserActive
                      ? 'border-red-200 text-red-600 hover:bg-red-600 hover:text-white'
                      : 'border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'
                  } disabled:opacity-30 disabled:cursor-wait`}
                >
                  {togglingId === author._id
                    ? 'Updating...'
                    : author.isUserActive
                      ? 'Suspend'
                      : 'Reactivate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuthorList

