import React, { useState } from "react";
import styles from "./EditBookForm.module.css";
import { Button } from "../ui/Button/Button";
import type { BookDTO } from "../../types/book";
import { useTranslation } from "react-i18next";

interface EditBookFormProps {
  book: BookDTO;
  onSave: (updatedData: Partial<BookDTO>) => Promise<void>;
  onCancel: () => void;
}

const LANGUAGES = [
  "ENGLISH",
  "SPANISH",
  "FRENCH",
  "GERMAN",
  "JAPANESE",
  "UKRAINIAN",
  "OTHER",
];

const EditBookForm = ({ book, onSave, onCancel }: EditBookFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<BookDTO>>({ ...book });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "pages" || name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await onSave(formData);
    } catch (err: any) {
      // Extract the 'errors' map from your GlobalExceptionHandler Response
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        setFieldErrors(backendErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className={styles.title}>{t("admin.editBook.title")}</h2>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>{t("admin.editBook.labels.name")}</label>
          <input
            name="name"
            className={fieldErrors.name ? styles.inputError : ""}
            value={formData.name || ""}
            onChange={handleChange}
          />
          {fieldErrors.name && (
            <span className={styles.errorText}>{fieldErrors.name}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>{t("admin.editBook.labels.author")}</label>
          <input
            name="author"
            className={fieldErrors.author ? styles.inputError : ""}
            value={formData.author || ""}
            onChange={handleChange}
          />
          {fieldErrors.author && (
            <span className={styles.errorText}>{fieldErrors.author}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>{t("admin.editBook.labels.genre")}</label>
          <input
            name="genre"
            className={fieldErrors.genre ? styles.inputError : ""}
            value={formData.genre || ""}
            onChange={handleChange}
          />
          {fieldErrors.genre && (
            <span className={styles.errorText}>{fieldErrors.genre}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>{t("admin.editBook.labels.price")}</label>
          <input
            name="price"
            type="number"
            step="0.01"
            className={fieldErrors.price ? styles.inputError : ""}
            value={formData.price ?? ""}
            onChange={handleChange}
          />
          {fieldErrors.price && (
            <span className={styles.errorText}>{fieldErrors.price}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>{t("admin.editBook.labels.pages")}</label>
          <input
            name="pages"
            type="number"
            className={fieldErrors.pages ? styles.inputError : ""}
            value={formData.pages ?? ""}
            onChange={handleChange}
          />
          {fieldErrors.pages && (
            <span className={styles.errorText}>{fieldErrors.pages}</span>
          )}
        </div>

        <div className={styles.field}>
          <label>{t("admin.editBook.labels.language")}</label>
          <select
            name="language"
            className={fieldErrors.language ? styles.inputError : ""}
            value={formData.language || ""}
            onChange={handleChange}
          >
            <option value="">{t("admin.editBook.selectLanguage")}</option>
            {LANGUAGES.map((lang) => (
              <option
                key={lang}
                value={lang}
              >
                {lang}
              </option>
            ))}
          </select>
          {fieldErrors.language && (
            <span className={styles.errorText}>{fieldErrors.language}</span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label>{t("admin.editBook.labels.description")}</label>
        <textarea
          name="description"
          rows={5}
          className={fieldErrors.description ? styles.inputError : ""}
          value={formData.description || ""}
          onChange={handleChange}
        />
        {fieldErrors.description && (
          <span className={styles.errorText}>{fieldErrors.description}</span>
        )}
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("admin.editBook.cancel")}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("admin.editBook.saving") : t("admin.editBook.save")}
        </Button>
      </div>
    </form>
  );
};

export default EditBookForm;
