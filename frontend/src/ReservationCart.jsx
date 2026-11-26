import { useState } from "react";

const booksList = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Programming", available: true },
    { id: 2, title: "Design Patterns", author: "Erich Gamma", category: "Software Engineering", available: true },
    { id: 3, title: "Database System Concepts", author: "Abraham Silberschatz", category: "Databases", available: false },
    { id: 4, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming", available: true },
];

export default function ReservationCart() {
    const [cart, setCart] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [submittedOrder, setSubmittedOrder] = useState(null);

    const handleAddBook = (book) => {
        setStatusMessage("");
        setSubmittedOrder(null);

        if (!book.available) {
            setStatusMessage(`"${book.title}" is currently unavailable.`);
            return;
        }

        const exists = cart.some((item) => item.id === book.id);
        if (exists) {
            setStatusMessage(`"${book.title}" is already in your reservation cart.`);
            return;
        }

        setCart((prev) => [...prev, book]);
    };

    const handleRemoveBook = (id) => {
        setStatusMessage("");
        setSubmittedOrder(null);
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClearCart = () => {
        setStatusMessage("");
        setSubmittedOrder(null);
        setCart([]);
    };

    const handleSubmitReservation = () => {
        if (cart.length === 0) {
            setStatusMessage("Add at least one book before submitting a reservation.");
            return;
        }

        setSubmittedOrder({
            requestId: `RES-${Date.now()}`,
            books: cart,
            totalBooks: cart.length,
        });
        setCart([]);
        setStatusMessage("");
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.headerCard}>
                    <h1 style={styles.title}>Reservation Cart</h1>
                    <p style={styles.subtitle}>Review selected books and submit a single reservation request</p>
                </div>

                {statusMessage && <div style={styles.alertWarning}>{statusMessage}</div>}

                {submittedOrder && (
                    <div style={styles.alertSuccess}>
                        <div style={{ fontWeight: 700, marginBottom: "4px" }}>Reservation Request Submitted</div>
                        <div style={styles.metaText}>Request ID: {submittedOrder.requestId}</div>
                        <div style={styles.metaText}>
                            Total Books: {submittedOrder.totalBooks} (No payment required)
                        </div>
                        <ul style={styles.submittedList}>
                            {submittedOrder.books.map((b) => (
                                <li key={b.id}>
                                    {b.title} — {b.author}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>Available Books</h2>
                    <div style={styles.grid}>
                        {booksList.map((book) => {
                            const inCart = cart.some((item) => item.id === book.id);
                            const disabled = !book.available || inCart;

                            return (
                                <div key={book.id} style={styles.bookItem}>
                                    <div>
                                        <div style={styles.bookTitle}>{book.title}</div>
                                        <div style={styles.bookAuthor}>{book.author}</div>
                                        <div style={styles.bookCategory}>{book.category}</div>
                                    </div>

                                    <div style={styles.bookFooter}>
                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: book.available ? "#16a34a" : "#dc2626",
                        }}
                    >
                      {book.available ? "Available" : "Unavailable"}
                    </span>

                                        <button
                                            type="button"
                                            onClick={() => handleAddBook(book)}
                                            disabled={disabled}
                                            style={{
                                                ...styles.smallButton,
                                                backgroundColor: disabled ? "#a5b4fc" : "#6c63ff",
                                                cursor: disabled ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            {inCart ? "In Cart" : "Add"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={styles.card}>
                    <div style={styles.cartHeader}>
                        <h2 style={styles.sectionTitle}>Selected Books ({cart.length})</h2>
                        {cart.length > 0 && (
                            <button type="button" onClick={handleClearCart} style={styles.linkButton}>
                                Clear all
                            </button>
                        )}
                    </div>

                    {cart.length === 0 ? (
                        <p style={styles.emptyText}>No books added to your cart yet.</p>
                    ) : (
                        <>
                            <div style={styles.cartList}>
                                {cart.map((item) => (
                                    <div key={item.id} style={styles.cartRow}>
                                        <div>
                                            <div style={styles.bookTitle}>{item.title}</div>
                                            <div style={styles.bookAuthor}>{item.author}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBook(item.id)}
                                            style={styles.removeButton}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button type="button" onClick={handleSubmitReservation} style={styles.primaryButton}>
                                Submit Reservation Request
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f4f6fb",
        padding: "36px 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: "#1f2937",
    },
    container: {
        maxWidth: "780px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    headerCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px 28px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
        textAlign: "center",
    },
    title: {
        margin: "0 0 6px 0",
        fontSize: "24px",
        fontWeight: 700,
        color: "#111827",
    },
    subtitle: {
        margin: 0,
        fontSize: "14px",
        color: "#6b7280",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px 28px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
    },
    sectionTitle: {
        margin: "0 0 16px 0",
        fontSize: "17px",
        fontWeight: 700,
        color: "#111827",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "14px",
    },
    bookItem: {
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "14px",
        backgroundColor: "#fafbff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "12px",
    },
    bookTitle: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#111827",
    },
    bookAuthor: {
        fontSize: "13px",
        color: "#6b7280",
        marginTop: "2px",
    },
    bookCategory: {
        fontSize: "12px",
        color: "#9ca3af",
        marginTop: "4px",
    },
    bookFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "8px",
        borderTop: "1px solid #eef0f4",
    },
    smallButton: {
        border: "none",
        borderRadius: "7px",
        padding: "6px 12px",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: 600,
    },
    cartHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },
    linkButton: {
        background: "none",
        border: "none",
        color: "#6c63ff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        padding: 0,
    },
    emptyText: {
        margin: 0,
        fontSize: "14px",
        color: "#6b7280",
    },
    cartList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "18px",
    },
    cartRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 14px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        backgroundColor: "#fafbff",
    },
    removeButton: {
        backgroundColor: "#ffffff",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        padding: "6px 12px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#374151",
        cursor: "pointer",
    },
    primaryButton: {
        width: "100%",
        backgroundColor: "#6c63ff",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        padding: "11px 16px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
    },
    alertWarning: {
        backgroundColor: "#fffbeb",
        border: "1px solid #fde68a",
        color: "#92400e",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "13px",
        fontWeight: 500,
    },
    alertSuccess: {
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#166534",
        borderRadius: "10px",
        padding: "14px 16px",
        fontSize: "13px",
    },
    metaText: {
        marginTop: "2px",
    },
    submittedList: {
        margin: "8px 0 0 0",
        paddingLeft: "18px",
    },
};