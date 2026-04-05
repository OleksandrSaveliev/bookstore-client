import { useEffect, useState } from "react";
import { bookService } from "../../api/book.service";
import { BookCard } from "../../components/books/BookCard";
import { Button } from "../../components/ui/Button/Button";
import styles from "./Home.module.css";
import type { BookDTO } from "../../types/book";
import { useTranslation } from "react-i18next"; // Added

const HomePage = () => {
  const { t } = useTranslation(); // Added
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
            {/* Using Trans component or splitting for the <br /> */}
            {t("home.hero.titlePart1")} <br /> {t("home.hero.titlePart2")}
          </h1>
          <p className="subtitle">{t("home.hero.subtitle")}</p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="primary">{t("home.hero.cta")}</Button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="/hero-image.webp" // Removed /public/ as Vite serves from root
            alt={t("home.hero.imageAlt")}
          />
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>{t("home.catalogTitle")}</h2>

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
            {t("home.pagination.prev")}
          </Button>

          <span className={styles.pageInfo}>
            {loading
              ? "..."
              : t("home.pagination.info", {
                  current: currentPage + 1,
                  total: totalPages,
                })}
          </span>

          <Button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1 || loading}
          >
            {t("home.pagination.next")}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
