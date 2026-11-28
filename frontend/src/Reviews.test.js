import { fireEvent, render, screen } from "@testing-library/react";
import Reviews from "./Reviews";

describe("Reviews Component", () => {
    test("displays existing reviews for each book so all users can view them", () => {
        render(<Reviews />);

        expect(screen.getByText("Student Reviews (2)")).toBeInTheDocument();
        expect(screen.getByText("Sara Ali")).toBeInTheDocument();
        expect(screen.getByText("Omar Hassan")).toBeInTheDocument();

        // Switch to Design Patterns (Borrowed, 1 existing review)
        fireEvent.click(screen.getByRole("button", { name: /Design Patterns/i }));
        expect(screen.getByText("Student Reviews (1)")).toBeInTheDocument();
        expect(screen.getByText("Mona Khaled")).toBeInTheDocument();
    });

    test("prevents student from reviewing a book that has not been returned yet", () => {
        render(<Reviews />);

        // Design Patterns starts with borrowStatus: "Borrowed"
        fireEvent.click(screen.getByRole("button", { name: /Design Patterns/i }));
        expect(
            screen.getByText(/Return the book first to leave a star rating and review/i)
        ).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Submit Review/i })).not.toBeInTheDocument();

        // Database System Concepts starts with borrowStatus: "Not Borrowed"
        fireEvent.click(screen.getByRole("button", { name: /Database System Concepts/i }));
        expect(
            screen.getByText(/only after borrowing and returning it/i)
        ).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Submit Review/i })).not.toBeInTheDocument();
    });

    test("allows student to rate with stars and comment after returning a borrowed book", () => {
        render(<Reviews />);

        fireEvent.click(screen.getByRole("button", { name: /Design Patterns/i }));
        fireEvent.click(screen.getByRole("button", { name: /Mark as Returned/i }));

        // Validation when submitting empty form
        fireEvent.click(screen.getByRole("button", { name: /Submit Review/i }));
        expect(screen.getByRole("alert")).toHaveTextContent(/select a star rating/i);

        // Select 4 stars and write a comment
        fireEvent.click(screen.getByRole("radio", { name: "Rate 4 stars" }));
        fireEvent.change(screen.getByLabelText(/Your Comment/i), {
            target: { value: "Great explanation of Gang of Four patterns." },
        });
        fireEvent.click(screen.getByRole("button", { name: /Submit Review/i }));

        expect(screen.getByText("Student Reviews (2)")).toBeInTheDocument();
        expect(screen.getByText("Ahmed Mohamed")).toBeInTheDocument();
        expect(
            screen.getByText("Great explanation of Gang of Four patterns.")
        ).toBeInTheDocument();
    });

    test("works for a single book prop and respects hasReturned prop", () => {
        const sampleBook = {
            id: 99,
            title: "Refactoring",
            author: "Martin Fowler",
            category: "Software Engineering",
            reviews: [
                { id: 1, user: "Nourhan Adel", rating: 5, comment: "Essential read.", date: "2026-11-20" },
            ],
        };

        const { rerender } = render(<Reviews book={sampleBook} hasReturned={false} />);
        expect(screen.getByText("Nourhan Adel")).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /Submit Review/i })).not.toBeInTheDocument();

        rerender(<Reviews book={sampleBook} hasReturned={true} />);
        expect(screen.getByRole("button", { name: /Submit Review/i })).toBeInTheDocument();
    });
});
