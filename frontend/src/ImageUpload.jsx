import React, { useEffect, useMemo, useRef, useState } from "react";

const INITIAL_BOOKS = [
    {
        id: 1,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Software Engineering",
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80",
        hasCustomCover: false,
    },
    {
        id: 2,
        title: "Design Patterns",
        author: "Erich Gamma",
        category: "Software Engineering",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
        hasCustomCover: false,
    },
    {
        id: 3,
        title: "Database System Concepts",
        author: "Abraham Silberschatz",
        category: "Databases",
        cover: "",
        hasCustomCover: false,
    },
    {
        id: 4,
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        category: "Programming",
        cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=400&q=80",
        hasCustomCover: false,
    },
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageUpload({
    book: singleBook = null,
    books: initialBooksProp = INITIAL_BOOKS,
    currentUser = { name: "Library Staff", role: "Librarian" },
    onCoverSaved,
}) {
    const normalizedInitialBooks = useMemo(() => {
        if (singleBook) {
            return [
                {
                    ...singleBook,
                    cover: singleBook.cover || "",
                    hasCustomCover: Boolean(singleBook.hasCustomCover),
                },
            ];
        }
        return initialBooksProp;
    }, [singleBook, initialBooksProp]);

    const [books, setBooks] = useState(normalizedInitialBooks);
    const [selectedBookId, setSelectedBookId] = useState(
        normalizedInitialBooks[0]?.id ?? null
    );
    const [previewUrl, setPreviewUrl] = useState("");
    const [selectedFileMeta, setSelectedFileMeta] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        setBooks(normalizedInitialBooks);
        setSelectedBookId(normalizedInitialBooks[0]?.id ?? null);
    }, [normalizedInitialBooks]);

    const activeBook = useMemo(
        () => books.find((b) => b.id === selectedBookId) || books[0],
        [books, selectedBookId]
    );

    const isLibrarian = currentUser?.role === "Librarian";

    const resetPendingSelection = () => {
        setPreviewUrl("");
        setSelectedFileMeta(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSelectBook = (bookId) => {
        setSelectedBookId(bookId);
        resetPendingSelection();
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleFileChange = (e) => {
        setErrorMessage("");
        setSuccessMessage("");

        const file = e.target.files?.[0];
        if (!file) {
            resetPendingSelection();
            return;
        }

        if (!file.type || !file.type.startsWith("image/")) {
            resetPendingSelection();
            setErrorMessage("Please select a valid image file (PNG, JPG, JPEG, or WEBP).");
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            resetPendingSelection();
            setErrorMessage("Image file size must be 5 MB or smaller.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setPreviewUrl(reader.result);
                setSelectedFileMeta({
                    name: file.name,
                    size: formatFileSize(file.size),
                });
            }
        };
        reader.onerror = () => {
            resetPendingSelection();
            setErrorMessage("Could not read the selected image file.");
        };
        reader.readAsDataURL(file);
    };

    const handleSaveCover = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!isLibrarian) {
            setErrorMessage("Only librarians can upload or update book cover images.");
            return;
        }

        if (!previewUrl || !activeBook) {
            setErrorMessage("Please choose a cover image before saving.");
            return;
        }

        setBooks((prev) =>
            prev.map((b) =>
                b.id === activeBook.id
                    ? { ...b, cover: previewUrl, hasCustomCover: true }
                    : b
            )
        );

        if (onCoverSaved) {
            onCoverSaved(activeBook.id, previewUrl, selectedFileMeta?.name || "");
        }

        setSuccessMessage(`Cover image saved for "${activeBook.title}".`);
        resetPendingSelection();
    };

    if (!activeBook) {
        return null;
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.headerCard}>
                    <h1 style={styles.title}>Book Cover Image Upload</h1>
                    <p style={styles.subtitle}>
                        Librarians can choose a cover image from their device, preview it, and save it so books appear with their real covers.
                    </p>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>Upload Book Cover</h2>

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

                    {!isLibrarian ? (
                        <div style={styles.lockedBox}>
                            Only librarians are authorized to upload or update book cover images.
                        </div>
                    ) : (
                        <form onSubmit={handleSaveCover} style={styles.form}>
                            {!singleBook && books.length > 1 && (
                                <div style={styles.fieldGroup}>
                                    <label htmlFor="cover-book-select" style={styles.label}>
                                        Select Book
                                    </label>
                                    <select
                                        id="cover-book-select"
                                        value={activeBook.id}
                                        onChange={(e) => handleSelectBook(Number(e.target.value))}
                                        style={styles.select}
                                    >
                                        {books.map((bookItem) => (
                                            <option key={bookItem.id} value={bookItem.id}>
                                                {bookItem.title} — {bookItem.author}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div style={styles.fieldGroup}>
                                <label htmlFor="cover-file-input" style={styles.label}>
                                    Choose Cover Image from Device
                                </label>
                                <input
                                    ref={fileInputRef}
                                    id="cover-file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                />
                                <span style={styles.helperText}>
                                    Supported formats: PNG, JPG, JPEG, WEBP (max 5 MB)
                                </span>
                            </div>

                            <div style={styles.previewGrid}>
                                <div style={styles.previewCard}>
                                    <span style={styles.previewLabel}>Current Saved Cover</span>
                                    <div style={styles.previewImageFrame}>
                                        {activeBook.cover ? (
                                            <img
                                                src={activeBook.cover}
                                                alt={`${activeBook.title} current cover`}
                                                style={styles.previewImage}
                                            />
                                        ) : (
                                            <div style={styles.noCoverPlaceholder}>
                                                No cover uploaded yet
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={styles.previewCard}>
                                    <span style={styles.previewLabel}>New Cover Preview</span>
                                    <div style={styles.previewImageFrame}>
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Selected cover preview"
                                                style={styles.previewImage}
                                            />
                                        ) : (
                                            <div style={styles.noCoverPlaceholder}>
                                                Select an image to preview it here
                                            </div>
                                        )}
                                    </div>
                                    {selectedFileMeta && (
                                        <span style={styles.fileMetaText}>
                                            {selectedFileMeta.name} ({selectedFileMeta.size})
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.actionsRow}>
                                <button
                                    type="submit"
                                    disabled={!previewUrl}
                                    style={{
                                        ...styles.saveBtn,
                                        backgroundColor: previewUrl ? "#5b5ce6" : "#a5b4fc",
                                        cursor: previewUrl ? "pointer" : "not-allowed",
                                    }}
                                >
                                    Save Cover Image
                                </button>

                                {previewUrl && (
                                    <button
                                        type="button"
                                        onClick={resetPendingSelection}
                                        style={styles.cancelBtn}
                                    >
                                        Clear Selection
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                <div style={styles.card}>
                    <div style={styles.galleryHeader}>
                        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
                            Library Books ({books.length})
                        </h2>
                        <span style={styles.galleryHint}>Books displayed with their saved covers</span>
                    </div>

                    <div style={styles.booksGrid}>
                        {books.map((bookItem) => (
                            <div
                                key={bookItem.id}
                                style={{
                                    ...styles.bookCard,
                                    borderColor:
                                        bookItem.id === activeBook.id ? "#5b5ce6" : "#e5e7eb",
                                }}
                            >
                                <div style={styles.bookCoverWrapper}>
                                    {bookItem.cover ? (
                                        <img
                                            src={bookItem.cover}
                                            alt={`${bookItem.title} cover`}
                                            style={styles.bookCoverImg}
                                        />
                                    ) : (
                                        <div style={styles.bookCoverEmpty}>No Cover</div>
                                    )}
                                </div>

                                <div style={styles.bookCardBody}>
                                    <span
                                        style={{
                                            ...styles.coverBadge,
                                            backgroundColor: bookItem.hasCustomCover
                                                ? "#dcfce7"
                                                : bookItem.cover
                                                  ? "#eeeeff"
                                                  : "#f3f4f6",
                                            color: bookItem.hasCustomCover
                                                ? "#166534"
                                                : bookItem.cover
                                                  ? "#5b5ce6"
                                                  : "#6b7280",
                                        }}
                                    >
                                        {bookItem.hasCustomCover
                                            ? "Uploaded Cover"
                                            : bookItem.cover
                                              ? "Default Cover"
                                              : "Missing Cover"}
                                    </span>

                                    <div style={styles.bookTitle}>{bookItem.title}</div>
                                    <div style={styles.bookAuthor}>{bookItem.author}</div>
                                    <div style={styles.bookCategory}>{bookItem.category}</div>
                                </div>
                            </div>
                        ))}
                    </div>
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
        maxWidth: "920px",
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
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
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
    select: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        cursor: "pointer",
    },
    fileInput: {
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px dashed #c7d2fe",
        backgroundColor: "#fafbff",
        fontSize: "13px",
        color: "#374151",
        cursor: "pointer",
    },
    helperText: {
        fontSize: "12px",
        color: "#6b7280",
    },
    previewGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "14px",
    },
    previewCard: {
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "12px",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    previewLabel: {
        fontSize: "12px",
        fontWeight: 700,
        color: "#4b5563",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
    },
    previewImageFrame: {
        width: "100%",
        height: "200px",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#eef0f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    previewImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    },
    noCoverPlaceholder: {
        padding: "16px",
        textAlign: "center",
        fontSize: "13px",
        color: "#6b7280",
    },
    fileMetaText: {
        fontSize: "12px",
        color: "#4b5563",
        wordBreak: "break-word",
    },
    actionsRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
    },
    saveBtn: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "7px",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 600,
    },
    cancelBtn: {
        padding: "10px 16px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        backgroundColor: "#ffffff",
        color: "#374151",
        fontSize: "13px",
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
    alertError: {
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
        fontWeight: 500,
        marginBottom: "14px",
    },
    alertSuccess: {
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#166534",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
        fontWeight: 500,
        marginBottom: "14px",
    },
    galleryHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "16px",
    },
    galleryHint: {
        fontSize: "12px",
        color: "#6b7280",
        backgroundColor: "#f3f4f6",
        padding: "3px 10px",
        borderRadius: "999px",
    },
    booksGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))",
        gap: "16px",
    },
    bookCard: {
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
    },
    bookCoverWrapper: {
        width: "100%",
        height: "170px",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    bookCoverImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    },
    bookCoverEmpty: {
        fontSize: "13px",
        color: "#9ca3af",
        fontWeight: 500,
    },
    bookCardBody: {
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    coverBadge: {
        alignSelf: "flex-start",
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 9px",
        borderRadius: "999px",
        marginBottom: "4px",
    },
    bookTitle: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#111827",
    },
    bookAuthor: {
        fontSize: "12.5px",
        color: "#6b7280",
    },
    bookCategory: {
        fontSize: "11.5px",
        color: "#9ca3af",
    },
};
