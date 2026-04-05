import React, { useState } from "react";
import styles from "./EditBookForm.module.css";
import { Button } from "../ui/Button/Button";
import type { BookDTO } from "../../types/book";

interface EditBookFormProps {
  book: BookDTO;
  onSave: (updatedData: Partial<BookDTO>) => Promise<void>;
  onCancel: () => void;
}

const EditBookForm = ({ book, onSave, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState<Partial<BookDTO>>({ ...book });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "pages" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <h2 className={styles.title}>Edit Inventory Item</h2>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Book Title</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Author</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Genre</label>
          <input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Pages</label>
          <input
            name="pages"
            type="number"
            value={formData.pages}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Language</label>
          <input
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label>Description</label>
        <textarea
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditBookForm;
