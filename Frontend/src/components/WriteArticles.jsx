import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import BASE_URL from '../config'
import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass
} from '../styles/common'
import { useAuth } from '../store/authStore'

/**
 * WriteArticles Component
 * Provides a form interface for authors to create and publish new blog posts.
 * Includes validation for title, category, and content length.
 */
function WriteArticles() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const currentUser = useAuth((state) => state.currentUser)

  // React Hook Form setup for managed inputs and validation
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  /**
   * Submission handler for the article creation form
   * @param {object} articleObj - Data from form fields
   */
  const submitArticle = async (articleObj) => {
    // Inject the current user's ID as the author of the article
    articleObj.author = currentUser._id
    
    try {
      setLoading(true)
      const res = await axios.post(
        `${BASE_URL}/author-api/articles`,
        articleObj,
        { withCredentials: true }
      )
      
      if (res.status === 201) {
        toast.success('Your article has been published successfully!')
        // Redirect to the author's list of articles to see the new addition
        navigate('/author-profile/articles')
      }
    } catch (err) {
      console.error('Publishing error:', err)
      toast.error(err.response?.data?.error || 'Failed to publish article. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${formCard} fade-in shadow-md`}>
      <h2 className={formTitle}>Draft Your Masterpiece</h2>
      <p className="text-sm text-gray-500 mb-6">Share your knowledge and insights with the community.</p>

      <form onSubmit={handleSubmit(submitArticle)}>
        {/* Article Title Field */}
        <div className={formGroup}>
          <label className={labelClass}>Article Title</label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g., The Future of Web Development"
            {...register('title', {
              required: 'A title is required to publish',
              minLength: {
                value: 5,
                message: 'Title should be more descriptive (at least 5 characters)'
              }
            })}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category Selection */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            {...register('category', {
              required: 'Please select a relevant category'
            })}
          >
            <option value="">Choose a topic...</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="web-development">Web Development</option>
          </select>
          {errors.category && (
            <p className={errorClass}>{errors.category.message}</p>
          )}
        </div>

        {/* Article Body Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>
          <textarea
            rows="10"
            className={`${inputClass} resize-none`}
            placeholder="Start writing here..."
            {...register('content', {
              required: 'Article body cannot be empty',
              minLength: {
                value: 50,
                message: 'Content must be at least 50 characters long to provide value to readers'
              }
            })}
          />
          {errors.content && (
            <p className={errorClass}>{errors.content.message}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button className={submitBtn} type="submit" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Article Now'}
          </button>
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <p className={`${loadingClass} text-xs`}>Uploading to server...</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default WriteArticles

