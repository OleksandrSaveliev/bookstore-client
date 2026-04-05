import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { bookService } from "../../api/book.service";
import { Button } from "../../components/ui/Button/Button";
import styles from "./BookDetails.module.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import type { BookDTO } from "../../types/book";
import EditBookForm from "../../components/books/EditBookForm"; // Import the new component

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // New State

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated, isEmployee } = useAuth();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      if (id) {
        const data = await bookService.getById(Number(id));
        setBook(data);
      }
    } catch (err) {
      toast.error("Could not load book details.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: Partial<BookDTO>) => {
    try {
      await bookService.update(Number(id), updatedData);
      toast.success("Inventory updated successfully!");
      setIsEditing(false);
      await fetchBook(); // Refresh data
    } catch (err) {
      toast.error("Failed to update book.");
    }
  };

  if (loading) return <div className="container">Loading book details...</div>;
  if (!book) return <div className="container">Book not found.</div>;

  // If in edit mode, show form instead of details
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
      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.tag}>{book.genre}</span>
          <h1>{book.name}</h1>
          {/* ... existing details ... */}
          <p className={styles.author}>by {book.author}</p>

          <div className={styles.metaGrid}>
            <div>
              <strong>Language:</strong> {book.language}
            </div>
            <div>
              <strong>Pages:</strong> {book.pages}
            </div>
            <div>
              <strong>Age Group:</strong> {book.ageGroup}
            </div>
            <div>
              <strong>Published:</strong> {book.publicationDate}
            </div>
          </div>

          <div className={styles.description}>
            <h3>About this book</h3>
            <p>{book.description}</p>
          </div>

          <div className={styles.actionSection}>
            <div className={styles.priceContainer}>
              <span className={styles.priceLabel}>Price</span>
              <span className={styles.priceValue}>
                ${book.price.toFixed(2)}
              </span>
            </div>

            <div className={styles.buttonWrapper}>
              {isEmployee ? (
                // Employee View: Show Edit Button
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  style={{ minWidth: "200px" }}
                >
                  Edit Inventory Data
                </Button>
              ) : (
                // Customer View: Show Add to Cart
                <Button
                  variant="primary"
                  onClick={() => {
                    addToCart(book);
                    toast.success(`${book.name} added to cart!`);
                  }}
                  disabled={!isAuthenticated}
                  title={!isAuthenticated ? "Login to purchase" : ""}
                  style={{ minWidth: "200px" }}
                >
                  Add to Cart
                </Button>
              )}

              {/* ... hints ... */}
              {!isAuthenticated && (
                <p className={styles.authHint}>
                  <Link
                    to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                  >
                    Log in
                  </Link>{" "}
                  to purchase
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
