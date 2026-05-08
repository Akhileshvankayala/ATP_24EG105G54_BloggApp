import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Unauthorized Component
 * Displays a 403 Forbidden message when a user tries to access a restricted route.
 * Automatically redirects the user back to a safe page (defaulting to Home/Login) after a brief delay.
 * 
 * @param {number} delay - Time in milliseconds before auto-redirecting (default 5000ms)
 */
const Unauthorized = ({ delay = 5000 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to send the user; fallback to login if no specific path is provided
  const redirectTo = location.state?.redirectTo || "/login";

  /**
   * Set up a timer to handle the automatic redirection
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, delay);

    // Clean up the timer if the component unmounts before the redirect triggers
    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f5f7]">
      <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md">
        {/* Visual indicator for restricted access */}
        <div className="text-6xl mb-6">🚫</div>
        
        <h1 className="text-3xl font-bold text-[#1d1d1f] mb-4">
          Access Restricted
        </h1>
        
        <p className="text-lg text-[#6e6e73] mb-8">
          Sorry, your current account doesn't have the permissions required to view this page.
        </p>

        {/* Dynamic redirection status */}
        <div className="flex items-center justify-center gap-2 text-sm text-[#0066cc] font-medium">
          <div className="w-4 h-4 border-2 border-[#0066cc] border-t-transparent rounded-full animate-spin"></div>
          <span>Taking you back in {delay / 1000} seconds...</span>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

