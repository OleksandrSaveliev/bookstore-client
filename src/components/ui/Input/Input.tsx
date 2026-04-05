// src/components/ui/Input/Input.tsx
import React, { forwardRef } from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputClasses = `${styles.input} ${error ? styles.errorInput : ""} ${className}`;

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}

        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
