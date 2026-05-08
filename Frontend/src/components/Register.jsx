import {
  divider,
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  pageBackground,
  submitBtn,
  mutedText
} from '../styles/common'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import BASE_URL from '../config'

/**
 * Register Component
 * Handles new user and author registrations, including profile image uploads.
 */
function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  
  // Local state for UI feedback
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [preview, setPreview] = useState(null)

  /**
   * Submission handler for registration form
   * Uses FormData to handle mixed text and file data
   * @param {object} userObj - The data collected from the form
   */
  const onUserRegister = async (userObj) => {
    const formData = new FormData()
    
    // Append user details to form data
    formData.append('firstName', userObj.firstName)
    formData.append('lastName', userObj.lastName)
    formData.append('email', userObj.email)
    formData.append('password', userObj.password)
    formData.append('role', userObj.role)
    
    // Append the profile image if one was selected
    if (userObj.profileImageUrl?.[0]) {
      formData.append('profileImageUrl', userObj.profileImageUrl[0])
    }

    try {
      setLoading(true)
      setApiError(null)
      
      const res = await axios.post(
        `${BASE_URL}/auth/users`,
        formData,
        { withCredentials: true }
      )
      
      if (res.status === 201) {
        // Success: take user to login page
        navigate('/login')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setApiError(err.response?.data?.error || 'Something went wrong during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Header */}
        <h2 className={formTitle}>Create an Account</h2>

        {/* Global API Error Message */}
        {apiError && <p className={`${errorClass} text-center mb-4`}>{apiError}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* Role Selection (User vs Author) */}
          <div className="mb-5">
            <p className={labelClass}>I want to register as a:</p>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="USER"
                  {...register('role', { required: 'Please select your role' })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">Reader (User)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="AUTHOR"
                  {...register('role', { required: 'Please select your role' })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">Writer (Author)</span>
              </label>
            </div>
            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>

          <div className={divider} />

          {/* Full Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Jane"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                  validate: (v) => v.trim().length > 0 || 'Cannot be empty'
                })}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Doe"
                {...register('lastName')}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className={formGroup}>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              className={inputClass}
              placeholder="jane.doe@example.com"
              {...register('email', { required: 'A valid email is required' })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Choose a strong password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* Profile Image Upload with Preview */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Photo (Optional)</label>
            <input
              type="file"
              className={inputClass}
              accept="image/png,image/jpeg"
              {...register('profileImageUrl', {
                validate: {
                  fileType: (files) => {
                    if (!files?.[0]) return true
                    return ['image/png', 'image/jpeg'].includes(files[0].type) || 'Only JPG or PNG images are accepted'
                  },
                  fileSize: (files) => {
                    if (!files?.[0]) return true
                    return files[0].size <= 2 * 1024 * 1024 || 'Image size must be under 2MB'
                  }
                }
              })}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) setPreview(URL.createObjectURL(file))
              }}
            />
            {errors.profileImageUrl && <p className={errorClass}>{errors.profileImageUrl.message}</p>}
            
            {preview && (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-20 h-20 object-cover rounded-full border-2 border-blue-100 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Existing User Redirect */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className={mutedText}>
            Already have an account?{' '}
            <NavLink to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

