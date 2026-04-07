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

  // UI State for the input field
  const [search, setSearch] = useState("");
  // State that actually triggers the API call
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

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
      setBooks(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Catalog fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDir, debouncedSearch, language]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{t("home.catalogTitle")}</h1>

        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder={t("catalog.searchPlaceholder")}
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Updates UI state immediately
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

      {loading ? (
        <div className={styles.loader}>{t("account.loading")}</div>
      ) : (
        <>
          <div className={styles.grid}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default BookCatalog;
