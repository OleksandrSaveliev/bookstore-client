import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>© 2026 BookStore Project</p>
      <div className={styles.links}>
        <a
          href="https://github.com"
          className={styles.link}
        >
          GitHub
        </a>
        <a
          href="/api/v1/books"
          className={styles.link}
        >
          API Docs
        </a>
        <span className={styles.link}>EPAM Final Project</span>
      </div>
    </footer>
  );
};
