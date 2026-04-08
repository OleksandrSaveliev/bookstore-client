import { useEffect, useState } from "react";
import { bookService } from "../../api/book.service";
import { BookCard } from "../../components/books/BookCard";
import { Button } from "../../components/ui/Button/Button";
import styles from "./Home.module.css";
import type { BookDTO } from "../../types/book";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await bookService.getAll(currentPage, 9);

        /**
         * HATEOAS Extraction for VIA_DTO mode
         */
        const content =
          data._embedded?.bookResponseDTOList || data.content || [];
        const total = data.page?.totalPages ?? data.totalPages ?? 0;

        setBooks(content);
        setTotalPages(total);
      } catch (err) {
        console.error("Connection Refused or API Error:", err);
        setBooks([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="fade-in">
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            {t("home.hero.titlePart1")} <br /> {t("home.hero.titlePart2")}
          </h1>
          <p className={styles.subtitle}>{t("home.hero.subtitle")}</p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              variant="primary"
              to="/catalog"
            >
              {t("home.hero.cta")}
            </Button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="/hero-image.webp"
            alt={t("home.hero.imageAlt")}
          />
        </div>
      </section>

      <section className={styles.catalogSection}>
        <h2 className={styles.sectionTitle}>{t("home.catalogTitle")}</h2>

        <div className={styles.contentArea}>
          <div
            className={`${styles.grid} ${loading ? styles.gridLoading : ""}`}
          >
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                showAction={false}
              />
            ))}
          </div>

          {loading && (
            <div className={styles.loaderOverlay}>
              <div className={styles.spinner}></div>
            </div>
          )}

          {/* PAGINATION BAR */}
          {totalPages > 1 && (
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
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
