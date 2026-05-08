import { NavLink } from 'react-router-dom'
import { navBrandClass, mutedText, linkClass, divider } from '../styles/common'

/**
 * Footer Component
 * Displayed at the bottom of every page, providing quick navigation links and copyright info
 */
function Footer() {
  return (
    <footer className="bg-white border-t border-[#e8e8ed] px-8 py-8 mt-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Brand Name */}
          <p className={navBrandClass}>MyBlog</p>

          {/* Quick Navigation Links */}
          <div className="flex gap-5">
            <NavLink to="/" className={`${linkClass} text-sm`}>
              Home
            </NavLink>
            <NavLink to="/articles" className={`${linkClass} text-sm`}>
              Articles
            </NavLink>
            <NavLink to="/register" className={`${linkClass} text-sm`}>
              Register
            </NavLink>
            <NavLink to="/login" className={`${linkClass} text-sm`}>
              Login
            </NavLink>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className={divider} />

        {/* Copyright and Year */}
        <p className={mutedText}>
          © {new Date().getFullYear()} MyBlog. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer

