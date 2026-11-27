import React from 'react';

const books = [
    {
        id: 1,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        available: true,
        cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 2,
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        available: false,
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        title: 'Design Patterns',
        author: 'Erich Gamma',
        available: true,
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 4,
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        available: true,
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=400&q=80',
    },
];

export default function BookCatalog() {
    return (
        <div style={styles.wrapper}>
            <div style={styles.box}>
                <h2 style={styles.heading}>Book Catalog</h2>
                <p style={styles.subtext}>Browse available books in the library</p>

                <div style={styles.grid}>
                    {books.map((book) => (
                        <div key={book.id} style={styles.card}>
                            <img src={book.cover} alt={book.title} style={styles.image} />

                            <div style={styles.body}>
                <span
                    style={{
                        ...styles.badge,
                        backgroundColor: book.available ? '#eeeeff' : '#fee2e2',
                        color: book.available ? '#5b5ce6' : '#dc2626',
                    }}
                >
                  {book.available ? 'Available' : 'Checked Out'}
                </span>

                                <h3 style={styles.bookTitle}>{book.title}</h3>
                                <p style={styles.bookAuthor}>{book.author}</p>

                                <button
                                    type="button"
                                    disabled={!book.available}
                                    style={{
                                        ...styles.btn,
                                        backgroundColor: book.available ? '#5b5ce6' : '#e5e7eb',
                                        color: book.available ? '#ffffff' : '#9ca3af',
                                        cursor: book.available ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {book.available ? 'View Details' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: '100vh',
        backgroundColor: '#f5f6fa',
        padding: '32px 16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
    },
    box: {
        maxWidth: '1040px',
        margin: '0 auto',
    },
    heading: {
        margin: '0 0 6px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#1f2937',
        textAlign: 'center',
    },
    subtext: {
        margin: '0 0 28px 0',
        fontSize: '14px',
        color: '#6b7280',
        textAlign: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    image: {
        width: '100%',
        height: '170px',
        objectFit: 'cover',
        display: 'block',
    },
    body: {
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    badge: {
        alignSelf: 'flex-start',
        fontSize: '12px',
        fontWeight: '600',
        padding: '3px 10px',
        borderRadius: '999px',
        marginBottom: '8px',
    },
    bookTitle: {
        margin: '0 0 4px 0',
        fontSize: '15px',
        fontWeight: '700',
        color: '#1f2937',
    },
    bookAuthor: {
        margin: '0 0 14px 0',
        fontSize: '13px',
        color: '#6b7280',
    },
    btn: {
        marginTop: 'auto',
        width: '100%',
        padding: '9px 12px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
    },
};