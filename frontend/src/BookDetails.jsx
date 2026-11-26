import React, { useState } from 'react';

const defaultBook = {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    availableCopies: 3,
    cover:
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80',
    description:
        'A handbook of agile software craftsmanship covering principles, patterns, and practices for writing clean, maintainable code.',
    reviews: [
        { id: 1, user: 'Sara Ali', rating: 5, comment: 'Must-read book for every developer.' },
        { id: 2, user: 'Omar Hassan', rating: 4, comment: 'Very practical examples and clear explanations.' },
    ],
};

export default function BookDetails({ book = defaultBook, onBack, onAddToCart }) {
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        setAdded(true);
        if (onAddToCart) {
            onAddToCart(book);
        }
        setTimeout(() => setAdded(false), 2000);
    };

    const isAvailable = book.availableCopies > 0;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {onBack && (
                    <button type="button" onClick={onBack} style={styles.backBtn}>
                        ← Back to Catalog
                    </button>
                )}

                <div style={styles.mainCard}>
                    <div style={styles.coverBox}>
                        <img src={book.cover} alt={book.title} style={styles.cover} />
                    </div>

                    <div style={styles.detailsBox}>
                        <span style={styles.badge}>{book.category}</span>

                        <h1 style={styles.title}>{book.title}</h1>
                        <p style={styles.author}>by {book.author}</p>

                        <p style={styles.description}>{book.description}</p>

                        <div style={styles.copiesRow}>
                            <span style={styles.copiesLabel}>Available Copies:</span>
                            <span
                                style={{
                                    ...styles.copiesValue,
                                    color: isAvailable ? '#5b5ce6' : '#dc2626',
                                }}
                            >
                {book.availableCopies} {book.availableCopies === 1 ? 'copy' : 'copies'}
              </span>
                        </div>

                        <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={handleAdd}
                            style={{
                                ...styles.addBtn,
                                backgroundColor: !isAvailable
                                    ? '#e5e7eb'
                                    : added
                                        ? '#16a34a'
                                        : '#5b5ce6',
                                color: !isAvailable ? '#9ca3af' : '#ffffff',
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                            }}
                        >
                            {!isAvailable
                                ? 'Out of Stock'
                                : added
                                    ? 'Added to Cart ✓'
                                    : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                <div style={styles.reviewsCard}>
                    <h2 style={styles.reviewsHeading}>Reviews ({book.reviews.length})</h2>

                    {book.reviews.length === 0 ? (
                        <p style={styles.emptyText}>No reviews yet for this book.</p>
                    ) : (
                        <div style={styles.reviewsList}>
                            {book.reviews.map((rev) => (
                                <div key={rev.id} style={styles.reviewItem}>
                                    <div style={styles.reviewTop}>
                                        <span style={styles.reviewerName}>{rev.user}</span>
                                        <span style={styles.ratingBadge}>★ {rev.rating}/5</span>
                                    </div>
                                    <p style={styles.reviewComment}>{rev.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f5f6fa',
        padding: '32px 16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
    },
    container: {
        maxWidth: '900px',
        margin: '0 auto',
    },
    backBtn: {
        marginBottom: '16px',
        padding: '8px 14px',
        backgroundColor: '#ffffff',
        color: '#5b5ce6',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    mainCard: {
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        alignItems: 'center',
        marginBottom: '20px',
    },
    coverBox: {
        width: '100%',
        maxHeight: '300px',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
    },
    cover: {
        width: '100%',
        height: '280px',
        objectFit: 'cover',
        display: 'block',
    },
    detailsBox: {
        display: 'flex',
        flexDirection: 'column',
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#eeeeff',
        color: '#5b5ce6',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '20px',
        marginBottom: '10px',
    },
    title: {
        margin: '0 0 4px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#1f2937',
    },
    author: {
        margin: '0 0 14px 0',
        fontSize: '14px',
        color: '#6b7280',
    },
    description: {
        margin: '0 0 18px 0',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#374151',
    },
    copiesRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        border: '1px solid #eef0f4',
        marginBottom: '16px',
        fontSize: '14px',
    },
    copiesLabel: {
        color: '#4b5563',
        fontWeight: '500',
    },
    copiesValue: {
        fontWeight: '700',
    },
    addBtn: {
        width: '100%',
        padding: '11px 16px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'background-color 0.2s ease',
    },
    reviewsCard: {
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
        padding: '22px',
    },
    reviewsHeading: {
        margin: '0 0 14px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1f2937',
    },
    emptyText: {
        margin: 0,
        fontSize: '14px',
        color: '#6b7280',
    },
    reviewsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    reviewItem: {
        padding: '12px 14px',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        border: '1px solid #eef0f4',
    },
    reviewTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
    },
    reviewerName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
    },
    ratingBadge: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#5b5ce6',
        backgroundColor: '#eeeeff',
        padding: '2px 8px',
        borderRadius: '12px',
    },
    reviewComment: {
        margin: 0,
        fontSize: '13px',
        color: '#4b5563',
    },
};