import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
};

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
