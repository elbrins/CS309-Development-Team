import React, { useEffect, useMemo, useState } from "react";

const INITIAL_BOOKS = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Software Engineering",
        borrowStatus: "Returned",
        reviews: [
            {
                id: 101,
                user: "Sara Ali",
                rating: 5,
                comment: "Must-read book for every developer. The naming and function chapters changed how I write code.",
                date: "2026-11-18",
            },
            {
                id: 102,
                user: "Omar Hassan",
                rating: 4,
                comment: "Very practical examples and clear explanations, though some Java examples feel a bit dated.",
                date: "2026-11-21",
            },
        ],
    },
    {
        id: 2,
        title: "Design Patterns",
        author: "Erich Gamma",
        category: "Software Engineering",
        borrowStatus: "Borrowed",
        reviews: [
            {
                id: 201,
                user: "Mona Khaled",
                rating: 5,
                comment: "Classic reference for reusable object-oriented design solutions.",
                date: "2026-11-12",
            },
        ],
    },
    {
        id: 3,
        title: "Database System Concepts",
        author: "Abraham Silberschatz",
        category: "Databases",
        borrowStatus: "Not Borrowed",
        reviews: [],
    },
    {
        id: 4,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        category: "Programming",
        borrowStatus: "Returned",
        reviews: [
            {
                id: 401,
                user: "Youssef Tarek",
                rating: 5,
                comment: "Short, actionable tips that stay relevant across any programming language.",
                date: "2026-11-15",
            },
        ],
    },
];

const STATUS_BADGE_STYLES = {
    Returned: { backgroundColor: "#dcfce7", color: "#166534" },
    Borrowed: { backgroundColor: "#fef3c7", color: "#92400e" },
    "Not Borrowed": { backgroundColor: "#f3f4f6", color: "#4b5563" },
};

function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return Number((total / reviews.length).toFixed(1));
}

function StarRatingDisplay({ rating }) {
    const rounded = Math.round(rating);
    return (
        <span style={styles.starsRow} aria-label={`Rating: ${rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    style={{
                        ...styles.starStatic,
                        color: star <= rounded ? "#f59e0b" : "#d1d5db",
                    }}
                >
                    ★
                </span>
            ))}
        </span>
    );
}

function StarRatingInput({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    const activeValue = hovered || value;

    return (
        <div
            style={styles.starInputRow}
            onMouseLeave={() => setHovered(0)}
            role="radiogroup"
            aria-label="Star rating"
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= activeValue;
                return (
                    <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`Rate ${star} ${star === 1 ? "star" : "stars"}`}
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHovered(star)}
                        style={{
                            ...styles.starButton,
                            color: isActive ? "#f59e0b" : "#d1d5db",
                        }}
                    >
                        ★
                    </button>
                );
            })}
            <span style={styles.starValueText}>
                {value > 0 ? `${value} / 5` : "Select stars"}
            </span>
        </div>
    );
}

export default function Reviews({
    book: singleBook = null,
    books: initialBooksProp = INITIAL_BOOKS,
    currentUser = { name: "Ahmed Mohamed", role: "Student" },
    hasReturned,
    onReviewAdded,
}) {
    const normalizedInitialBooks = useMemo(() => {
        if (singleBook) {
            return [
                {
                    ...singleBook,
                    borrowStatus:
                        typeof hasReturned === "boolean"
                            ? hasReturned
                                ? "Returned"
                                : "Borrowed"
                            : singleBook.borrowStatus || "Returned",
                    reviews: singleBook.reviews || [],
                },
            ];
        }
        return initialBooksProp;
    }, [singleBook, initialBooksProp, hasReturned]);

    const [books, setBooks] = useState(normalizedInitialBooks);
    const [selectedBookId, setSelectedBookId] = useState(
        normalizedInitialBooks[0]?.id ?? null
    );

    useEffect(() => {
        setBooks(normalizedInitialBooks);
        setSelectedBookId(normalizedInitialBooks[0]?.id ?? null);
    }, [normalizedInitialBooks]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const activeBook = useMemo(
        () => books.find((b) => b.id === selectedBookId) || books[0],
        [books, selectedBookId]
    );

    const isStudent = currentUser?.role === "Student";
    const isBookReturned =
        typeof hasReturned === "boolean" && singleBook
            ? hasReturned
            : activeBook?.borrowStatus === "Returned";

    const hasAlreadyReviewed = Boolean(
        activeBook?.reviews?.some(
            (rev) => rev.user.toLowerCase() === currentUser.name.toLowerCase()
        )
    );

    const canSubmitReview = isStudent && isBookReturned && !hasAlreadyReviewed;

    const averageRating = useMemo(
        () => calculateAverageRating(activeBook?.reviews || []),
        [activeBook]
    );

    const handleSelectBook = (bookId) => {
        setSelectedBookId(bookId);
        setRating(0);
        setComment("");
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleReturnBook = (bookId) => {
        setBooks((prev) =>
            prev.map((b) =>
                b.id === bookId ? { ...b, borrowStatus: "Returned" } : b
            )
        );
        setErrorMessage("");
        setSuccessMessage("Book marked as returned. You can now add your review.");
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!canSubmitReview) {
            setErrorMessage("You can only review a book after returning it.");
            return;
        }

        if (rating < 1 || rating > 5) {
            setErrorMessage("Please select a star rating between 1 and 5.");
            return;
        }

        const trimmedComment = comment.trim();
        if (!trimmedComment) {
            setErrorMessage("Please write a comment before submitting your review.");
            return;
        }

        const newReview = {
            id: Date.now(),
            user: currentUser.name,
            rating,
            comment: trimmedComment,
            date: new Date().toISOString().split("T")[0],
        };

        setBooks((prev) =>
            prev.map((b) =>
                b.id === activeBook.id
                    ? { ...b, reviews: [newReview, ...b.reviews] }
                    : b
            )
        );

        if (onReviewAdded) {
            onReviewAdded(activeBook.id, newReview);
        }

        setRating(0);
        setComment("");
        setSuccessMessage("Your review has been published.");
    };

    if (!activeBook) {
        return null;
    }

    const badgeStyle =
        STATUS_BADGE_STYLES[activeBook.borrowStatus] ||
        STATUS_BADGE_STYLES["Not Borrowed"];

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.headerCard}>
                    <h1 style={styles.title}>Book Reviews</h1>
                    <p style={styles.subtitle}>
                        Students can rate and review books after returning them. All users can view book reviews.
                    </p>
                </div>

                {!singleBook && books.length > 1 && (
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>Select a Book</h2>
                        <div style={styles.bookSelectorGrid}>
                            {books.map((bookItem) => {
                                const isSelected = bookItem.id === activeBook.id;
                                const itemAvg = calculateAverageRating(bookItem.reviews);
                                const itemBadge =
                                    STATUS_BADGE_STYLES[bookItem.borrowStatus] ||
                                    STATUS_BADGE_STYLES["Not Borrowed"];

                                return (
                                    <button
                                        key={bookItem.id}
                                        type="button"
                                        onClick={() => handleSelectBook(bookItem.id)}
                                        style={{
                                            ...styles.bookTab,
                                            borderColor: isSelected ? "#5b5ce6" : "#e5e7eb",
                                            backgroundColor: isSelected ? "#f5f5ff" : "#fafbff",
                                        }}
                                    >
                                        <div style={styles.bookTabTop}>
                                            <span style={styles.bookTabTitle}>{bookItem.title}</span>
                                            <span style={{ ...styles.statusPill, ...itemBadge }}>
                                                {bookItem.borrowStatus}
                                            </span>
                                        </div>
                                        <span style={styles.bookTabMeta}>
                                            {bookItem.author} •{" "}
                                            {bookItem.reviews.length > 0
                                                ? `★ ${itemAvg} (${bookItem.reviews.length})`
                                                : "No reviews"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div style={styles.card}>
                    <div style={styles.bookHeader}>
                        <div>
                            <span style={styles.categoryBadge}>{activeBook.category}</span>
                            <h2 style={styles.bookTitle}>{activeBook.title}</h2>
                            <p style={styles.bookAuthor}>by {activeBook.author}</p>
                        </div>

                        <div style={styles.ratingSummaryBox}>
                            <div style={styles.avgScore}>
                                {activeBook.reviews.length > 0 ? averageRating : "—"}
                                <span style={styles.avgOutOf}> / 5</span>
                            </div>
                            <StarRatingDisplay rating={averageRating} />
                            <div style={styles.reviewCountText}>
                                {activeBook.reviews.length}{" "}
                                {activeBook.reviews.length === 1 ? "review" : "reviews"}
                            </div>
                        </div>
                    </div>

                    <div style={styles.statusBar}>
                        <div style={styles.statusInfo}>
                            <span style={styles.statusLabel}>Your Borrowing Status:</span>
                            <span style={{ ...styles.statusPill, ...badgeStyle }}>
                                {activeBook.borrowStatus}
                            </span>
                        </div>

                        {!singleBook && activeBook.borrowStatus === "Borrowed" && (
                            <button
                                type="button"
                                onClick={() => handleReturnBook(activeBook.id)}
                                style={styles.returnBtn}
                            >
                                Mark as Returned
                            </button>
                        )}
                    </div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>Write a Review</h3>

                    {errorMessage && (
                        <div role="alert" style={styles.alertError}>
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div role="status" style={styles.alertSuccess}>
                            {successMessage}
                        </div>
                    )}

                    {!isStudent ? (
                        <div style={styles.lockedBox}>
                            Only students can submit book reviews.
                        </div>
                    ) : !isBookReturned ? (
                        <div style={styles.lockedBox}>
                            {activeBook.borrowStatus === "Borrowed"
                                ? "You currently have this book borrowed. Return the book first to leave a star rating and review."
                                : "You can rate and review this book only after borrowing and returning it."}
                        </div>
                    ) : hasAlreadyReviewed ? (
                        <div style={styles.infoBox}>
                            You have already submitted a review for this book. Thank you for your feedback!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitReview} style={styles.form}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>Star Rating</label>
                                <StarRatingInput value={rating} onChange={setRating} />
                            </div>

                            <div style={styles.fieldGroup}>
                                <label htmlFor="review-comment" style={styles.label}>
                                    Your Comment
                                </label>
                                <textarea
                                    id="review-comment"
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your thoughts about this book..."
                                    style={styles.textarea}
                                />
                            </div>

                            <button type="submit" style={styles.submitBtn}>
                                Submit Review
                            </button>
                        </form>
                    )}
                </div>

                <div style={styles.card}>
                    <div style={styles.reviewsHeader}>
                        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>
                            Student Reviews ({activeBook.reviews.length})
                        </h3>
                        <span style={styles.publicHint}>Visible to all users</span>
                    </div>

                    {activeBook.reviews.length === 0 ? (
                        <p style={styles.emptyText}>
                            No reviews yet for this book. Be the first student to review it after returning!
                        </p>
                    ) : (
                        <div style={styles.reviewsList}>
                            {activeBook.reviews.map((rev) => (
                                <div key={rev.id} style={styles.reviewItem}>
                                    <div style={styles.reviewTop}>
                                        <div>
                                            <span style={styles.reviewerName}>{rev.user}</span>
                                            {rev.date && (
                                                <span style={styles.reviewDate}> • {rev.date}</span>
                                            )}
                                        </div>
                                        <div style={styles.reviewRatingGroup}>
                                            <StarRatingDisplay rating={rev.rating} />
                                            <span style={styles.ratingBadge}>
                                                {rev.rating}/5
                                            </span>
                                        </div>
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
        minHeight: "100vh",
        backgroundColor: "#f5f6fa",
        padding: "32px 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: "#1f2937",
        boxSizing: "border-box",
    },
    container: {
        maxWidth: "860px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },
    headerCard: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "22px 26px",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
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
        border: "1px solid #e5e7eb",
        padding: "22px 24px",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
    },
    sectionTitle: {
        margin: "0 0 14px 0",
        fontSize: "17px",
        fontWeight: 700,
        color: "#111827",
    },
    bookSelectorGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "12px",
    },
    bookTab: {
        textAlign: "left",
        padding: "12px 14px",
        borderRadius: "10px",
        border: "1.5px solid #e5e7eb",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
    },
    bookTabTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "8px",
    },
    bookTabTitle: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#111827",
    },
    bookTabMeta: {
        fontSize: "12px",
        color: "#6b7280",
    },
    bookHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "16px",
    },
    categoryBadge: {
        display: "inline-block",
        backgroundColor: "#eeeeff",
        color: "#5b5ce6",
        fontSize: "12px",
        fontWeight: 600,
        padding: "4px 12px",
        borderRadius: "999px",
        marginBottom: "8px",
    },
    bookTitle: {
        margin: "0 0 4px 0",
        fontSize: "21px",
        fontWeight: 700,
        color: "#111827",
    },
    bookAuthor: {
        margin: 0,
        fontSize: "14px",
        color: "#6b7280",
    },
    ratingSummaryBox: {
        backgroundColor: "#f9fafb",
        border: "1px solid #eef0f4",
        borderRadius: "10px",
        padding: "12px 16px",
        textAlign: "center",
        minWidth: "130px",
    },
    avgScore: {
        fontSize: "22px",
        fontWeight: 700,
        color: "#111827",
        marginBottom: "4px",
    },
    avgOutOf: {
        fontSize: "13px",
        fontWeight: 500,
        color: "#6b7280",
    },
    reviewCountText: {
        fontSize: "12px",
        color: "#6b7280",
        marginTop: "4px",
    },
    statusBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        paddingTop: "14px",
        borderTop: "1px solid #eef0f4",
    },
    statusInfo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    statusLabel: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#4b5563",
    },
    statusPill: {
        fontSize: "11px",
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
    },
    returnBtn: {
        padding: "7px 14px",
        borderRadius: "7px",
        border: "none",
        backgroundColor: "#5b5ce6",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "13px",
        fontWeight: 600,
        color: "#374151",
    },
    starInputRow: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    starButton: {
        background: "none",
        border: "none",
        padding: "2px 4px",
        fontSize: "26px",
        lineHeight: 1,
        cursor: "pointer",
        transition: "transform 0.1s ease, color 0.15s ease",
    },
    starValueText: {
        marginLeft: "8px",
        fontSize: "13px",
        fontWeight: 600,
        color: "#4b5563",
    },
    textarea: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        fontFamily: "inherit",
        color: "#111827",
        backgroundColor: "#ffffff",
        resize: "vertical",
        boxSizing: "border-box",
        outline: "none",
    },
    submitBtn: {
        alignSelf: "flex-start",
        padding: "10px 20px",
        backgroundColor: "#5b5ce6",
        color: "#ffffff",
        border: "none",
        borderRadius: "7px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
    },
    lockedBox: {
        backgroundColor: "#fffbeb",
        border: "1px solid #fde68a",
        color: "#92400e",
        borderRadius: "8px",
        padding: "12px 14px",
        fontSize: "13px",
        fontWeight: 500,
    },
    infoBox: {
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#166534",
        borderRadius: "8px",
        padding: "12px 14px",
        fontSize: "13px",
        fontWeight: 500,
    },
    alertError: {
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
        fontWeight: 500,
        marginBottom: "12px",
    },
    alertSuccess: {
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#166534",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
        fontWeight: 500,
        marginBottom: "12px",
    },
    reviewsHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px",
    },
    publicHint: {
        fontSize: "12px",
        color: "#6b7280",
        backgroundColor: "#f3f4f6",
        padding: "3px 10px",
        borderRadius: "999px",
    },
    emptyText: {
        margin: 0,
        fontSize: "14px",
        color: "#6b7280",
    },
    reviewsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    reviewItem: {
        padding: "14px 16px",
        borderRadius: "10px",
        backgroundColor: "#f9fafb",
        border: "1px solid #eef0f4",
    },
    reviewTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "8px",
    },
    reviewerName: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#111827",
    },
    reviewDate: {
        fontSize: "12px",
        color: "#6b7280",
    },
    reviewRatingGroup: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    starsRow: {
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
    },
    starStatic: {
        fontSize: "15px",
        lineHeight: 1,
    },
    ratingBadge: {
        fontSize: "12px",
        fontWeight: 600,
        color: "#5b5ce6",
        backgroundColor: "#eeeeff",
        padding: "2px 8px",
        borderRadius: "12px",
    },
    reviewComment: {
        margin: 0,
        fontSize: "13.5px",
        lineHeight: 1.5,
        color: "#374151",
    },
};
