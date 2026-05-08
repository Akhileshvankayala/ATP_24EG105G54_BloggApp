import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
  loadingClass,
} from "../styles/common";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

/**
 * Login Component
 * Provides a user interface for existing users to authenticate.
 * Redirects users to their respective dashboards based on their role upon success.
 */
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  
  // Extract authentication state and actions from the global store
  const { login, currentUser, loading, error, isAuthenticated } = useAuth(
    (state) => state,
  );

  /**
   * Form submission handler
   * @param {object} userCredObj - The credentials entered by the user
   */
  const onUserLogin = (userCredObj) => {
    login(userCredObj);
  };

  /**
   * Effect hook to handle redirection after a successful login
   */
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.role) {
      return;
    }

    // Role-based redirection logic
    if (currentUser.role === "USER") {
      toast.success("Signed in successfully. Redirecting to your dashboard...");
      navigate("/user-profile");
    } else if (currentUser.role === "AUTHOR") {
      toast.success("Author access granted. Loading your profile...");
      navigate("/author-profile");
    } else if (currentUser.role === "ADMIN") {
      toast.success("Administrative access granted. Loading control panel...");
      navigate("/admin-profile");
    }
  }, [currentUser, isAuthenticated, navigate]);

  // Render a loading state while the authentication request is in progress
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className={loadingClass}>Authenticating, please wait...</p>
      </div>
    );
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Sign-in Heading */}
        <h2 className={formTitle}>Sign In</h2>

        {/* Display any server-side authentication errors */}
        {error && <p className={`${errorClass} text-center mb-4`}>{error}</p>}

        <form onSubmit={handleSubmit(onUserLogin)}>
          {/* Email Input Field */}
          <div className={formGroup}>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className={inputClass}
              {...register("email", {
                required: "Please enter your email",
                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password Input Field */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Please enter your password",
                validate: (value) => value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* Helper links */}
          {/* Form Action Button */}
          <button type="submit" className={submitBtn}>
            Sign In
          </button>
        </form>

        {/* Link to Registration page */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className={`${mutedText} text-center`}>
            New to MyBlog?{" "}
            <NavLink to="/register" className={linkClass}>
              Create an account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

