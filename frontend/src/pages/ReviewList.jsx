import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReviews, deleteReview, createReview } from '../api';
import { useWebSocket } from '../useWebSocket';
import Snackbar from '../components/Snackbar';

function ReviewList() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [highlights, setHighlights] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const [deletedReview, setDeletedReview] = useState(null);

  /* ── Load reviews on mount ──────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchReviews();
        setReviews(data);
      } catch {
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Highlight helper ───────────────────────────────────────── */
  const addHighlight = useCallback((id, type) => {
    setHighlights((prev) => ({ ...prev, [id]: type }));
    setTimeout(() => {
      setHighlights((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 3000);
  }, []);

  /* ── WebSocket handler ──────────────────────────────────────── */
  const handleWsMessage = useCallback(
    (data) => {
      const { type, review } = data;

      switch (type) {
        case 'created':
          setReviews((prev) => {
            if (prev.some((r) => r.id === review.id)) return prev;
            return [review, ...prev];
          });
          addHighlight(review.id, 'created');
          break;

        case 'updated':
          setReviews((prev) =>
            prev.map((r) => (r.id === review.id ? review : r))
          );
          addHighlight(review.id, 'updated');
          break;

        case 'deleted':
          addHighlight(review.id, 'deleted');
          // Keep in list for 3 s so the red highlight is visible, then remove
          setTimeout(() => {
            setReviews((prev) => prev.filter((r) => r.id !== review.id));
          }, 3000);
          break;

        default:
          break;
      }
    },
    [addHighlight]
  );

  useWebSocket(handleWsMessage);

  /* ── Delete handler ─────────────────────────────────────────── */
  const handleDelete = async (id) => {
    try {
      const deleted = await deleteReview(id);
      setDeletedReview(deleted);
      setSnackbar({
        message: `Review "${deleted.title}" deleted successfully`,
      });
    } catch {
      setError('Failed to delete review');
    }
  };

  /* ── Undo handler ───────────────────────────────────────────── */
  const handleUndo = async () => {
    if (!deletedReview) return;
    try {
      await createReview({
        id: deletedReview.id,
        title: deletedReview.title,
        content: deletedReview.content,
        created_at: deletedReview.created_at,
      });
      setSnackbar(null);
      setDeletedReview(null);
    } catch {
      setError('Failed to undo deletion');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(null);
    setDeletedReview(null);
  };

  /* ── Sorting ────────────────────────────────────────────────── */
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) return ' ↕';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  /* ── Filter + sort ──────────────────────────────────────────── */
  const filteredReviews = reviews
    .filter((review) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        review.title.toLowerCase().includes(term) ||
        review.content.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else {
        cmp = new Date(a.created_at) - new Date(b.created_at);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  /* ── Render ─────────────────────────────────────────────────── */
  if (loading) {
    return <div className="loading">Loading reviews…</div>;
  }

  return (
    <div className="review-list">
      <div className="review-list-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search reviews…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/new')}>
          + New Review
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredReviews.length === 0 ? (
        <div className="empty-state">
          {search
            ? 'No reviews match your search.'
            : 'No reviews yet. Create your first review!'}
        </div>
      ) : (
        <div className="table-container">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>#</th>
                <th className="sortable" onClick={() => handleSort('title')}>
                  Title{getSortIndicator('title')}
                </th>
                <th>Content</th>
                <th
                  className="sortable"
                  onClick={() => handleSort('created_at')}
                >
                  Date-time{getSortIndicator('created_at')}
                </th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review, index) => (
                <tr
                  key={review.id}
                  className={
                    highlights[review.id]
                      ? `highlight-${highlights[review.id]}`
                      : ''
                  }
                >
                  <td>{index + 1}</td>
                  <td className="td-title">{review.title}</td>
                  <td className="td-content">{review.content}</td>
                  <td className="td-datetime">
                    {new Date(
                      review.updated_at || review.created_at
                    ).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-edit"
                      onClick={() => navigate(`/${review.id}`)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          onUndo={handleUndo}
          onClose={handleSnackbarClose}
          duration={5000}
        />
      )}
    </div>
  );
}

export default ReviewList;
