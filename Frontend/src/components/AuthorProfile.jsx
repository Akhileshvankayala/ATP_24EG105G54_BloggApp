import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { pageWrapper, navLinkClass, divider } from "../styles/common";

/**
 * AuthorProfile Component
 * The main dashboard for authors. It provides a navigation interface to manage 
 * their published articles and create new content.
 */
function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  /**
   * Handle user logout and clean up local session
   */
  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className={pageWrapper}>
      {/* Profile Header: Displays author info and the logout action */}
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar: Shows Cloudinary image or fallback initials */}
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border"
              alt={`${currentUser.firstName}'s avatar`}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Greeting and Author Name */}
          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back, Writer</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">
              {currentUser?.firstName}
            </h2>
          </div>
        </div>

        {/* Global Logout Action */}
        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition-colors"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {/* Internal Navigation: Tabs to switch between viewing and writing articles */}
      <div className="flex gap-3 mb-6 bg-[#f5f5f7] p-2 rounded-full w-fit">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm"
              : `${navLinkClass} px-5 py-2`
          }
        >
          My Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-medium shadow-sm"
              : `${navLinkClass} px-5 py-2`
          }
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      {/* Nested Route Content: Renders either AuthorArticles or WriteArticles */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;

