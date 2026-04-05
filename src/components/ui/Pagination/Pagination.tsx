// Pagination.tsx
import styles from "./Pagination.module.css";

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
  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className={styles.pageBtn}
      >
        &larr; Previous
      </button>
      <span className={styles.pageInfo}>
        Page <strong>{currentPage + 1}</strong> of {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={styles.pageBtn}
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;
