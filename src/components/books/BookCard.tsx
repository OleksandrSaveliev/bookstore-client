import React from "react";
import { Link } from "react-router-dom";
import styles from "./BookCard.module.css";
import type { BookDTO } from "../../types/book";
import { Button } from "../ui/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface BookCardProps {
  book: BookDTO;
}

interface BookCardProps {
  book: BookDTO;
  showAction?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  showAction = true,
}) => {
  const { t } = useTranslation();
  const { isEmployee, isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(book);
    toast.success(t("bookDetails.toast.added", { name: book.name }));
  };

  return (
    <div className={styles.cardWrapper}>
      <Link
        to={`/app/books/${book.id}`}
        className={styles.card}
      >
        <div className={styles.content}>
          <span className={styles.genreTag}>{book.genre}</span>
          <h3 className={styles.title}>{book.name}</h3>
          <p className={styles.author}>
            {t("bookDetails.by")} {book.author}
          </p>

          <div className={styles.meta}>
            <span>{t(`catalog.languages.${book.language}`)}</span>
            <span>{book.ageGroup}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>${book.price.toFixed(2)}</span>

          <div className={styles.actions}>
            {/* Logic: Only show if NOT employee AND showAction is true */}
            {!isEmployee && showAction && (
              <Button
                variant="primary"
                size="sm"
                disabled={!isAuthenticated}
                onClick={handleAddToCart}
              >
                {t("bookDetails.addToCart")}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
