// src/components/ui/Button/Button.tsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.css";

interface BaseProps {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

interface LinkProps
  extends
    BaseProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "href" | "onClick" | "children"
    > {
  to: string;
  onClick?: never;
  type?: never;
}

interface ButtonProps
  extends
    BaseProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "onClick" | "children"
    > {
  to?: never;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

type Props = LinkProps | ButtonProps;

export const Button: React.FC<Props> = ({
  children,
  to,
  variant = "ghost",
  className = "",
  disabled,
  style,
  ...props
}) => {
  const combinedClasses = `${styles.btn} ${styles[variant]} ${className}`;

  if (to && !disabled) {
    return (
      <Link
        to={to}
        className={combinedClasses}
        style={style}
        {...(props as any)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      style={style}
      type={(props as any).type || "button"}
      {...(props as any)}
    >
      {children}
    </button>
  );
};
