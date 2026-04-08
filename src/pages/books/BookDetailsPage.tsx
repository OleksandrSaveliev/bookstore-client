import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { bookService } from "../../api/book.service";
import { Button } from "../../components/ui/Button/Button";
import styles from "./BookDetails.module.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import type { BookDTO } from "../../types/book";
import EditBookForm from "../../components/books/EditBookForm";
import { useTranslation } from "react-i18next";

const BookDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated, isEmployee } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (id) {
          const data = await bookService.getById(Number(id));
          setBook(data);
        }
      } catch (err) {
        toast.error(t("bookDetails.error.load"));
        navigate("/app/books");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate, t]);

  const handleUpdate = async (updatedData: Partial<BookDTO>) => {
    try {
      await bookService.update(Number(id), updatedData);
      toast.success(t("bookDetails.admin.updateSuccess"));
      setIsEditing(false);

      // Refresh local state with updated data from server
      const data = await bookService.getById(Number(id));
      setBook(data);
    } catch (err: any) {
      // 1. If it's a validation error (400), don't show a generic toast here.
      // 2. IMPORTANT: Re-throw the error so EditBookForm can catch it and show inline messages!
      if (err.response?.status !== 400) {
        toast.error(t("bookDetails.admin.updateError"));
      }
      throw err;
    }
  };

  if (loading)
    return <div className="container">{t("bookDetails.loading")}</div>;
  if (!book)
    return <div className="container">{t("bookDetails.notFound")}</div>;

  if (isEditing) {
    return (
      <div className={`${styles.container} fade-in`}>
        <EditBookForm
          book={book}
          onSave={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.container} fade-in`}>
      {/* Added a Back Button for better UX */}
      <button
        onClick={() => navigate(-1)}
        className={styles.backButton}
      >
        ← {t("bookDetails.back")}
      </button>

      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.tag}>{book.genre}</span>
          <h1>{book.name}</h1>
          <p className={styles.author}>
            {t("bookDetails.by")} {book.author}
          </p>

          <div className={styles.metaGrid}>
            <div>
              <strong>{t("bookDetails.meta.language")}:</strong>{" "}
              {t(`catalog.languages.${book.language}`)}
            </div>
            <div>
              <strong>{t("bookDetails.meta.pages")}:</strong> {book.pages}
            </div>
            <div>
              <strong>{t("bookDetails.meta.ageGroup")}:</strong> {book.ageGroup}
            </div>
            <div>
              <strong>{t("bookDetails.meta.published")}:</strong>{" "}
              {book.publicationDate}
            </div>
          </div>

          <div className={styles.description}>
            <h3>{t("bookDetails.aboutTitle")}</h3>
            <p>{book.description}</p>
          </div>

          <div className={styles.actionSection}>
            <div className={styles.priceContainer}>
              <span className={styles.priceLabel}>
                {t("bookDetails.priceLabel")}
              </span>
              <span className={styles.priceValue}>
                ${book.price.toFixed(2)}
              </span>
            </div>

            <div className={styles.buttonWrapper}>
              {isEmployee ? (
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  style={{ minWidth: "200px" }}
                >
                  {t("bookDetails.admin.editBtn")}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    addToCart(book);
                    toast.success(
                      t("bookDetails.toast.added", { name: book.name }),
                    );
                  }}
                  disabled={!isAuthenticated}
                  style={{ minWidth: "200px" }}
                >
                  {t("bookDetails.addToCart")}
                </Button>
              )}

              {!isAuthenticated && (
                <p className={styles.authHint}>
                  <Link
                    to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                  >
                    {t("bookDetails.hints.loginLink")}
                  </Link>{" "}
                  {t("bookDetails.hints.toPurchase")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
