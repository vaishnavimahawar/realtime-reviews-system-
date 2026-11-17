import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchReview,
  createReview,
  updateReview,
  deleteReview,
} from '../api';

function ReviewForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── Load existing review when editing ──────────────────────── */
  useEffect(() => {
    if (isEditing) {
      loadReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadReview = async () => {
    try {
      setLoading(true);
      const review = await fetchReview(id);
      setTitle(review.title);
      setContent(review.content);
    } catch {
      setError('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  /* ── Submit (create or update) ──────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await updateReview(id, {
          title: title.trim(),
          content: content.trim(),
        });
      } else {
        await createReview({
          title: title.trim(),
          content: content.trim(),
        });
      }
      navigate('/');
    } catch {
      setError(`Failed to ${isEditing ? 'update' : 'create'} review`);
    } finally {
      setLoading(false);
    }
  };

  /* ── Reset ──────────────────────────────────────────────────── */
  const handleReset = () => {
    if (isEditing) {
      loadReview();
    } else {
      setTitle('');
      setContent('');
    }
    setError(null);
  };

  /* ── Delete (edit view only) ────────────────────────────────── */
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteReview(id);
      navigate('/');
    } catch {
      setError('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !title) {
    return <div className="loading">Loading review…</div>;
  }

  return (
    <div className="review-form-container">
      <h2>{isEditing ? 'Edit Review' : 'New Review'}</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter review title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your review…"
            rows={6}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-delete"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
