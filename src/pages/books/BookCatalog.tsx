import { useEffect, useState, useCallback } from "react";
import { bookService } from "../../api/book.service";
import { BookCard } from "../../components/books/BookCard";
import Pagination from "../../components/ui/Pagination/Pagination";
import styles from "./BookCatalog.module.css";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  "ENGLISH",
  "SPANISH",
  "FRENCH",
  "GERMAN",
  "JAPANESE",
  "UKRAINIAN",
  "OTHER",
];

const BookCatalog = () => {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [language, setLanguage] = useState("");

  // 1. Debounce Search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Optimized Fetch logic
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks(
        page,
        9,
        sortBy,
        sortDir,
        debouncedSearch,
        undefined,
        undefined,
        language,
      );

      const content = data._embedded?.bookResponseDTOList || data.content || [];
      const total = data.page?.totalPages ?? data.totalPages ?? 0;

      setBooks(content);
      setTotalPages(total);
    } catch (err) {
      console.error("Catalog fetch error", err);
      setBooks([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDir, debouncedSearch, language]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handler for page change that prevents the default jump
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Optional: Smoothly scroll to the TOP of the header, not the whole page
    // document.getElementById('catalog-header')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <header
        className={styles.header}
        id="catalog-header"
      >
        <h1>{t("home.catalogTitle")}</h1>
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder={t("catalog.searchPlaceholder")}
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.filters}>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(0);
              }}
            >
              <option value="name">{t("catalog.sort.name")}</option>
              <option value="price">{t("catalog.sort.price")}</option>
              <option value="author">{t("catalog.sort.author")}</option>
            </select>
            <select
              value={sortDir}
              onChange={(e) => {
                setSortDir(e.target.value);
                setPage(0);
              }}
            >
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(0);
              }}
            >
              <option value="">{t("catalog.languages.all")}</option>
              {LANGUAGES.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                >
                  {t(`catalog.languages.${lang}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className={styles.contentArea}>
        {/* We keep the grid in the DOM even during loading to maintain height */}
        <div className={`${styles.grid} ${loading ? styles.gridLoading : ""}`}>
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))
          ) : !loading ? (
            <div className={styles.emptyState}>
              No books matches your criteria.
            </div>
          ) : null}
        </div>

        {/* Overlay loader so height doesn't change */}
        {loading && (
          <div className={styles.loaderOverlay}>
            <div className={styles.spinner}></div>
            <p>{t("account.loading")}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCatalog;
