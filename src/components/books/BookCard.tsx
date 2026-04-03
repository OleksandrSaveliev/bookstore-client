import React from "react";
import { Link } from "react-router-dom";

import styles from "./BookCard.module.css";
import type { BookDTO } from "../../types/book";

interface BookCardProps {
  book: BookDTO;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link
      to={`/app/books/${book.id}`}
      className={styles.card}
    >
      <h3 className={styles.title}>{book.name}</h3>
      <p className={styles.author}>by {book.author}</p>

      <div className={styles.footer}>
        <span className={styles.price}>${book.price.toFixed(2)}</span>
        <span className={styles.tag}>{book.language}</span>
      </div>
    </Link>
  );
};
