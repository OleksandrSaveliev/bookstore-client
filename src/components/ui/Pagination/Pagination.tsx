import styles from "./Pagination.module.css";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className={styles.pageBtn}
      >
        {t("home.pagination.prev")}
      </button>
      <span className={styles.pageInfo}>
        {t("home.pagination.info", {
          current: currentPage + 1,
          total: totalPages,
        })}
      </span>
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={styles.pageBtn}
      >
        {t("home.pagination.next")}
      </button>
    </div>
  );
};

export default Pagination;
