import React, { useState } from 'react';
import ConfirmModal from '../common/ConfirmModal';

type ConfirmDeleteContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  contactName: string;
};

export const ConfirmDeleteContactModal = ({
  isOpen,
  onClose,
  onConfirm,
  contactName,
}: ConfirmDeleteContactModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={loading}
    >
      <h2>Delete Contact</h2>
      <p>
        Are you sure you want to delete <strong>{contactName}</strong>? This
        action cannot be undone.
      </p>
    </ConfirmModal>
  );
};
