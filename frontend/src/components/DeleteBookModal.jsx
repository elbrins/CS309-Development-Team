import { useState } from "react";

function DeleteBookModal({ book, onCancel, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);

  if (!book) return null;

  const handleConfirmClick = async () => {
    try {
      setSubmitting(true);
      await onConfirm(book);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="lib-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Confirm Book Deletion</h2>
        <p className="subtitle">
          Are you sure you want to delete{" "}
          <strong>&ldquo;{book.title}&rdquo;</strong> by {book.author}? This
          action cannot be undone.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="lib-btn-outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="lib-btn-danger"
            onClick={handleConfirmClick}
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBookModal;