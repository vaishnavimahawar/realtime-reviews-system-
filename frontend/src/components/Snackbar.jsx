import { useEffect, useState } from 'react';

function Snackbar({ message, onUndo, onClose, duration = 5000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="snackbar">
      <span className="snackbar-message">{message}</span>
      {onUndo && (
        <button className="snackbar-undo" onClick={onUndo}>
          Undo
        </button>
      )}
      <button
        className="snackbar-close"
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default Snackbar;
