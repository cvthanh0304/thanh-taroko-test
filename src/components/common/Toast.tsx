import React, { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  variant: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  variant,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return <div className={`${styles.toast} ${styles[variant]}`}>{message}</div>;
};

export default Toast;
