import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../config"
import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";

/**
 * EditArticle Component
 * Provides a specialized interface for authors to modify existing articles.
 * Prefills the form with the article's current data.
 */
function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const applyValues = (currentArticle) => {
      setValue("title", currentArticle.title);
      setValue("category", currentArticle.category);
      setValue("content", currentArticle.content);
    };

    if (article) {
      applyValues(article);
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/user-api/article/${id}`, {
          withCredentials: true,
        });

        setArticle(res.data.payload);
        applyValues(res.data.payload);
      } catch (err) {
        console.error("Unable to load article for editing:", err);
        setError(err.response?.data?.message || "Could not load article. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [article, id, navigate, setValue]);

  const updateArticle = async (modifiedArticle) => {
    if (!article) {
      setError("Article data is missing. Please return to your articles list.");
      return;
    }

    modifiedArticle.articleId = article._id;

    try {
      const res = await axios.put(
        `${BASE_URL}/author-api/articles`,
        modifiedArticle,
        { withCredentials: true },
      );

      if (res.status === 200) {
        navigate(`/article/${article._id}`, {
          state: res.data.payload,
          replace: true,
        });
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Could not save the article. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className={loadingClass}>Loading article for editing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className={errorClass}>{error}</p>
        <button
          className={submitBtn}
          onClick={() => navigate('/author-profile/articles')}
        >
          Back to My Articles
        </button>
      </div>
    );
  }

  return (
    <div className={`${formCard} mt-10 shadow-lg`}>
      <h2 className={formTitle}>Edit Your Article</h2>
      <p className="text-sm text-gray-500 mb-6">Refine your thoughts and update your content.</p>

      <form onSubmit={handleSubmit(updateArticle)}>
        <div className={formGroup}>
          <label className={labelClass}>Article Title</label>
          <input
            className={inputClass}
            placeholder="Updating the title?"
            {...register("title", {
              required: "A title is required",
              minLength: { value: 5, message: "Title is too short" },
            })}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            {...register("category", { required: "Please select a category" })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="web-development">Web Development</option>
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        <div className={formGroup}>
          <label className={labelClass}>Content</label>
          <textarea
            rows="12"
            className={`${inputClass} resize-none leading-relaxed`}
            placeholder="Edit your content here..."
            {...register("content", {
              required: "Content cannot be empty",
              minLength: { value: 50, message: "Content must be at least 50 characters" },
            })}
          />
          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <div className="pt-4">
          <button className={submitBtn} type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditArticle;

