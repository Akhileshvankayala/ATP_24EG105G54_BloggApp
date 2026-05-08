import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../store/authStore'
import { toast } from 'react-hot-toast'
import BASE_URL from '../config'
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
  commentsWrapper,
  commentCard,
  commentHeader,
  commentUserRow,
  avatar,
  commentUser,
  commentTime,
  commentText
} from '../styles/common.js'
import { useForm } from 'react-hook-form'

/**
 * ArticleById Component
 * Displays the full content of a specific article.
 * Provides different functionalities based on the viewer's role:
 * - Authors: Can edit or toggle the active status (delete/restore) of their own articles.
 * - Users/Admins: Can read and add comments.
 */
function ArticleById() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  // React Hook Form for handling comment submission
  const { register, handleSubmit, reset } = useForm()

  // Authentication state from global store
  const user = useAuth((state) => state.currentUser)

  // Use state passed from navigation if available, otherwise fetch it
  const [article, setArticle] = useState(location.state || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Effect hook to fetch article details if not provided via navigation state
   */
  useEffect(() => {
    if (article) return

    const getArticle = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/user-api/article/${id}`, {
          withCredentials: true
        })
        setArticle(res.data.payload)
      } catch (err) {
        console.error('Error fetching article:', err)
        setError(err.response?.data?.error || 'Article not found.')
      } finally {
        setLoading(false)
      }
    }

    getArticle()
  }, [id, article])

  /**
   * Standardizes date display across the component (IST)
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  /**
   * Toggle the article's active/deleted status.
   * Only accessible by the author.
   */
  const toggleArticleStatus = async () => {
    const newStatus = !article.isActive
    const confirmMsg = newStatus
      ? 'Are you sure you want to restore this article for public viewing?'
      : 'Are you sure you want to delete this article? It will be archived and hidden from readers.'
    
    if (!window.confirm(confirmMsg)) return

    try {
      const res = await axios.patch(
        `${BASE_URL}/author-api/articles`,
        { articleId: article._id, isArticleActive: newStatus },
        { withCredentials: true }
      )
      
      setArticle(res.data.payload)
      toast.success(res.data.message)
      
      // Redirect back to profile to reflect changes in the list
      navigate('/author-profile/articles', {
        replace: true,
        state: { refreshedAt: Date.now() }
      })
    } catch (err) {
      console.error('Status toggle failed:', err)
      toast.error(err.response?.data?.message || 'Operation failed. Please try again.')
    }
  }

  /**
   * Navigates to the edit page for this article
   */
  const handleEdit = () => {
    navigate(`/edit-article/${article._id}`, { state: article })
  }

  /**
   * Handles comment submission for readers and administrators
   * @param {object} commentObj - The comment text from the form
   */
  const addComment = async (commentObj) => {
    if (!commentObj.comment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      // Link comment to current article
      commentObj.articleId = article._id
      
      const res = await axios.put(`${BASE_URL}/user-api/articles`, commentObj, {
        withCredentials: true
      })
      
      if (res.status === 200) {
        toast.success('Your comment has been posted.')
        setArticle(res.data.payload) // Refresh article state to show new comment
        reset() // Clear the input field
      }
    } catch (err) {
      toast.error('Failed to post comment. Please try again.')
    }
  }

  // Early returns for loading and error states
  if (loading) return <div className="py-20 text-center"><p className={loadingClass}>Opening article...</p></div>
  if (error) return <div className="py-20 text-center"><p className={errorClass}>{error}</p></div>
  if (!article) return null

  // Determine label for the author row
  const displayRole = user?.role === 'AUTHOR' || user?.role === 'ADMIN' ? user.role : (article.author?.role || 'AUTHOR')

  return (
    <div className={`${articlePageWrapper} fade-in`}>
      {/* Top Banner: Category and Title */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>
        <h1 className={articleMainTitle}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>Published by: <span className="font-bold">{displayRole}</span></div>
          <div className="text-gray-400">{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Main Body Content */}
      <div className={articleContent}>
        {article.content}
      </div>

      {/* Control Panel: Author-only actions */}
      {user?.role === 'AUTHOR' && String(article.author?._id || article.author) === String(user._id) && (
        <div className={`${articleActions} border-t border-gray-100 pt-8 mt-10`}>
          <button className={editBtn} onClick={handleEdit}>
            Edit Article
          </button>
          <button 
            className={`${deleteBtn} ${article.isActive ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white'}`} 
            onClick={toggleArticleStatus}
          >
            {article.isActive ? 'Delete Article' : 'Restore Article'}
          </button>
        </div>
      )}

      {/* Engagement Section: Comments form for readers and admins */}
      {(user?.role === 'USER' || user?.role === 'ADMIN') && (
        <div className="mt-16 bg-gray-50 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-4">Join the conversation</h3>
          <form onSubmit={handleSubmit(addComment)}>
            <textarea
              {...register('comment')}
              className={`${inputClass} min-h-[100px] resize-none`}
              placeholder="What are your thoughts on this?"
            />
            <button
              type="submit"
              className="bg-[#0066cc] text-white px-8 py-3 rounded-full mt-4 text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Post Comment
            </button>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className={commentsWrapper}>
        <h4 className="text-xl font-bold mb-8">Comments ({article.comments?.length || 0})</h4>
        
        {article.comments?.length === 0 ? (
          <p className="text-[#a1a1a6] text-sm text-center py-10">No comments have been posted yet. Be the first!</p>
        ) : (
          <div className="space-y-6">
            {article.comments?.map((commentObj, index) => {
              const email = commentObj.user?.email || commentObj.userEmail || commentObj.email || 'Anonymous'
              const firstLetter = email.charAt(0).toUpperCase()

              return (
                <div key={index} className={commentCard}>
                  <div className={commentHeader}>
                    <div className={commentUserRow}>
                      <div className={`${avatar} bg-gray-200 text-gray-700`}>{firstLetter}</div>
                      <div>
                        <p className={commentUser}>{email}</p>
                        <p className={commentTime}>
                          {formatDate(commentObj.createdAt || new Date())}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className={commentText}>{commentObj.comment}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className={`${articleFooter} mt-12 pt-8 border-t border-gray-100 text-xs text-gray-400`}>
        Article ID: {article._id} | Last updated: {formatDate(article.updatedAt)}
      </div>
    </div>
  )
}

export default ArticleById

