import { useEffect, useState } from "react";
import { bookService } from "../../api/book.service";
import { BookCard } from "../../components/books/BookCard";
import { Button } from "../../components/ui/Button/Button";
import styles from "./Home.module.css";
import type { BookDTO } from "../../types/book";

const HomePage = () => {
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await bookService.getAll(currentPage, 8);

        if (data && data.content) {
          setBooks(data.content);
          setTotalPages(data.totalPages);
        } else if (Array.isArray(data)) {
          setBooks(data);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Connection Refused or API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fade-in">
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Discover Your <br /> Next Favorite Book
          </h1>
          <p className="subtitle">
            Modern bookstore experience powered by Spring & React.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="primary">Explore Now</Button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="/public/hero-image.webp"
            alt="Hero"
          />
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Featured Catalog</h2>

        <div className={styles.grid}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>

        {/* PAGINATION BAR */}
        <div className={styles.pagination}>
          <Button
            onClick={handlePrev}
            disabled={currentPage === 0 || loading}
          >
            ← Previous
          </Button>

          <span className={styles.pageInfo}>
            {loading ? "..." : `Page ${currentPage + 1} of ${totalPages}`}
          </span>

          <Button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1 || loading}
          >
            Next →
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
