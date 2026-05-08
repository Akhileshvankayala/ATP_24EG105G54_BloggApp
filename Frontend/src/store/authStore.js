import { create } from 'zustand'
import axios from 'axios'

// API base URL configuration, prioritizing environment variables
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * useAuth Store
 * Centralized state management for user authentication using Zustand.
 * Handles login, logout, and session persistence checks.
 */
export const useAuth = create((set) => ({
  // Core authentication state
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  /**
   * login - Authenticates a user with credentials
   * @param {object} userCred - Object containing username and password
   */
  login: async (userCred) => {
    try {
      // Reset state for new attempt
      set({
        loading: true,
        currentUser: null,
        isAuthenticated: false,
        error: null
      })
      
      const res = await axios.post(`${BASE_URL}/auth/login`, userCred, {
        withCredentials: true
      })
      
      if (res.status === 200) {
        // Use a light token in local storage to track session intent
        localStorage.setItem('hasAuthToken', 'true')
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null
        })
      }
    } catch (err) {
      // Capture and display API errors
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || 'Authentication failed. Please check your credentials.'
      })
    }
  },

  /**
   * logout - Terminates the user session on both client and server
   */
  logout: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true
      })
      
      if (res.status === 200) {
        // Clear local footprints
        localStorage.removeItem('hasAuthToken')
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false
        })
      }
    } catch (err) {
      console.error('Logout failed:', err)
      // Force clear local state even if server-side logout fails
      localStorage.removeItem('hasAuthToken')
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false
      })
    }
  },

  /**
   * checkAuth - Verifies session validity on app initialization or refresh
   */
  checkAuth: async () => {
    try {
      // If no auth intent found locally, skip network request
      if (!localStorage.getItem('hasAuthToken')) {
        set({ currentUser: null, isAuthenticated: false, loading: false })
        return
      }
      
      set({ loading: true })
      const res = await axios.get(`${BASE_URL}/auth/check-auth`, {
        withCredentials: true,
        validateStatus: (status) => status < 500
      })
      
      if (res.status === 200) {
        set({
          currentUser: res.data.payload,
          isAuthenticated: true,
          loading: false
        })
        return
      }
      
      // If check-auth fails (e.g., cookie expired), clean up
      set({ currentUser: null, isAuthenticated: false, loading: false })
      localStorage.removeItem('hasAuthToken')
    } catch (err) {
      console.error('Initial auth check failed:', err)
      set({ loading: false })
      localStorage.removeItem('hasAuthToken')
    }
  }
}))

