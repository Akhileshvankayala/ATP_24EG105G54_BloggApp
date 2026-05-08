import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../store/authStore";

/**
 * Root Layout Component
 * Serves as the primary wrapper for the application, handling consistent layout 
 * and initial authentication checks.
 */
function Root() {
  // Access the authentication check function from the store
  const checkAuth = useAuth((state) => state.checkAuth);

  // Perform an authentication check when the application first loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Navigation Header */}
      <Header />
      
      {/* Main Content Area: Renders the active route's component */}
      <main className="flex-grow mx-auto px-4 sm:px-6 lg:px-32 py-8">
        <Outlet />
      </main>
      
      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default Root;

