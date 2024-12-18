import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/common/Button';
import styles from './ConfirmModal.module.css';

export const MODAL_ROOT_ID = 'modal-root';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: ReactNode;
  loading?: boolean;
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  children,
  loading = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const modalRoot = document.getElementById(MODAL_ROOT_ID);
  if (!modalRoot) {
    console.error(`Element with id "${MODAL_ROOT_ID}" not found in the DOM.`);
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-body']}>{children}</div>
        <div className={styles['modal-actions']}>
          <Button variant="primary" onClick={onConfirm} disabled={loading}>
            {loading ? 'Loading...' : 'Confirm'}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

export default ConfirmModal;
