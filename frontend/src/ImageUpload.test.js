import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ImageUpload from "./ImageUpload";

describe("ImageUpload Component", () => {
    test("allows librarian to choose an image, preview it, and save it as the book cover", async () => {
        const onCoverSaved = jest.fn();
        render(<ImageUpload onCoverSaved={onCoverSaved} />);

        // Select "Database System Concepts" which initially has no cover
        fireEvent.change(screen.getByLabelText(/Select Book/i), {
            target: { value: "3" },
        });
        expect(screen.getByText(/No cover uploaded yet/i)).toBeInTheDocument();

        const saveBtn = screen.getByRole("button", { name: /Save Cover Image/i });
        expect(saveBtn).toBeDisabled();

        const file = new File(["fake-image-bytes"], "db-cover.png", {
            type: "image/png",
        });

        const fileInput = screen.getByLabelText(/Choose Cover Image from Device/i);
        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByAltText("Selected cover preview")).toBeInTheDocument();
        });
        expect(screen.getByText(/db-cover\.png/i)).toBeInTheDocument();
        expect(saveBtn).toBeEnabled();

        fireEvent.click(saveBtn);

        expect(screen.getByRole("status")).toHaveTextContent(
            /Cover image saved for "Database System Concepts"/i
        );
        expect(
            screen.getByAltText("Database System Concepts cover")
        ).toBeInTheDocument();
        expect(screen.getByText("Uploaded Cover")).toBeInTheDocument();
        expect(onCoverSaved).toHaveBeenCalledWith(
            3,
            expect.stringMatching(/^data:image\/png;base64,/),
            "db-cover.png"
        );
    });

    test("rejects non-image files with a clear validation message", () => {
        render(<ImageUpload />);

        const badFile = new File(["hello"], "notes.txt", { type: "text/plain" });
        const fileInput = screen.getByLabelText(/Choose Cover Image from Device/i);
        fireEvent.change(fileInput, { target: { files: [badFile] } });

        expect(screen.getByRole("alert")).toHaveTextContent(
            /valid image file/i
        );
        expect(screen.getByRole("button", { name: /Save Cover Image/i })).toBeDisabled();
    });

    test("restricts upload controls to librarians", () => {
        render(<ImageUpload currentUser={{ name: "Ahmed", role: "Student" }} />);

        expect(
            screen.getByText(/Only librarians are authorized to upload/i)
        ).toBeInTheDocument();
        expect(
            screen.queryByLabelText(/Choose Cover Image from Device/i)
        ).not.toBeInTheDocument();
    });
});
