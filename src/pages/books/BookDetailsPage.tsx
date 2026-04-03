import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom"; // Added Link
import { bookService } from "../../api/book.service";
import { Button } from "../../components/ui/Button/Button";
import styles from "./BookDetails.module.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext"; // 1. Import useAuth
import type { BookDTO } from "../../types/book";

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false); // Feedback state

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated, isEmployee } = useAuth(); // 2. Get auth/role status

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (id) {
          const data = await bookService.getById(Number(id));
          setBook(data);
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="container">Loading book details...</div>;
  if (!book) return <div className="container">Book not found.</div>;

  // 3. Determine if the button should be disabled
  // Logic: Disable if not logged in OR if user is an employee (employees don't buy)
  const isDisableDisabled = !isAuthenticated || isEmployee;
  const tooltipText = !isAuthenticated
    ? "Please log in to add items to your cart"
    : isEmployee
      ? "Employees cannot make purchases"
      : "";

  return (
    <div className={`${styles.container} fade-in`}>
      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.tag}>{book.genre}</span>
          <h1>{book.name}</h1>
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
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={isDisableDisabled}
                title={tooltipText} // 4. Hover prompt
                style={{
                  minWidth: "200px",
                  cursor: isDisableDisabled ? "not-allowed" : "pointer",
                }}
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </Button>

              {/* 5. Conditional Login Prompt */}
              {!isAuthenticated && (
                <p className={styles.authHint}>
                  <Link
                    to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                  >
                    Log in
                  </Link>{" "}
                  to purchase this book
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
