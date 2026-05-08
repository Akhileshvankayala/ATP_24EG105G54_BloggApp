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
 * UserList Component
 * Displays a list of all registered standard users for administrators.
 * Provides functionality to activate or deactivate user accounts.
 */
function UserList() {
  // Local state for user data and operation feedback
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  /**
   * Fetch all standard users from the backend
   */
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/admin-api/users`, {
          withCredentials: true
        })
        if (res.status === 200) {
          setUsers(res.data.payload)
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Could not retrieve user list.')
      } finally {
        setLoading(false)
      }
    }

    getUsers()
  }, [])

  /**
   * Toggles the active/inactive status of a specific user
   * @param {string} userId - ID of the user to update
   * @param {boolean} currentStatus - Current active status
   */
  const toggleUserStatus = async (userId, currentStatus) => {
    setTogglingId(userId)
    try {
      const res = await axios.put(
        `${BASE_URL}/admin-api/users/${userId}/status`,
        { isUserActive: !currentStatus },
        { withCredentials: true }
      )
      
      if (res.status === 200) {
        // Optimistically update local state to reflect change
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isUserActive: !currentStatus } : u
          )
        )
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update account status.')
    } finally {
      setTogglingId(null)
    }
  }

  // Loading and error views
  if (loading) return <div className="py-10 text-center"><p className={loadingClass}>Loading user directory...</p></div>
  if (error) return <div className="py-10 text-center"><p className={errorClass}>{error}</p></div>

  // Calculate summary stats
  const activeCount = users.filter((u) => u.isUserActive).length
  const inactiveCount = users.length - activeCount

  return (
    <div className="fade-in">
      {/* View Header and Summary Stats */}
      <div className="mb-6">
        <p className={tagClass}>System Management</p>
        <h2 className={`${headingClass} mt-1`}>
          Registered Users{' '}
          <span className={`${mutedText} font-normal text-base`}>({users.length} total)</span>
        </h2>
        
        <div className="flex gap-4 mt-5">
          <div className="bg-[#34c759]/10 border border-[#34c759]/20 rounded-2xl px-5 py-3 min-w-[100px]">
            <p className="text-xl font-bold text-[#248a3d]">{activeCount}</p>
            <p className="text-xs font-medium text-[#248a3d]/70 uppercase tracking-wider">Active</p>
          </div>
          <div className="bg-[#ff3b30]/10 border border-[#ff3b30]/20 rounded-2xl px-5 py-3 min-w-[100px]">
            <p className="text-xl font-bold text-[#cc2f26]">{inactiveCount}</p>
            <p className="text-xs font-medium text-[#cc2f26]/70 uppercase tracking-wider">Inactive</p>
          </div>
        </div>
      </div>

      <div className={divider} />

      {/* User Listing */}
      {users.length === 0 ? (
        <div className="py-20 text-center">
          <p className={emptyStateClass}>No users have registered yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {/* User Image or Initials */}
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={`${user.firstName}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className={`${avatar} w-12 h-12 text-lg`}>
                    {user.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-[#1d1d1f]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                {/* Status Indicator */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    user.isUserActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.isUserActive ? 'Active' : 'Inactive'}
                </span>

                {/* Status Toggle Action */}
                <button
                  disabled={togglingId === user._id}
                  onClick={() => toggleUserStatus(user._id, user.isUserActive)}
                  className={`text-xs font-semibold px-5 py-2 rounded-full border transition-all ${
                    user.isUserActive
                      ? 'border-red-200 text-red-600 hover:bg-red-600 hover:text-white'
                      : 'border-green-200 text-green-600 hover:bg-green-600 hover:text-white'
                  } disabled:opacity-30 disabled:cursor-wait`}
                >
                  {togglingId === user._id
                    ? 'Updating...'
                    : user.isUserActive
                      ? 'Deactivate'
                      : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserList


