import React from 'react';
import ConfirmModal from '../common/ConfirmModal';

type ConfirmDeleteContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contactName: string;
};

export const ConfirmDeleteContactModal = ({
  isOpen,
  onClose,
  onConfirm,
  contactName,
}: ConfirmDeleteContactModalProps) => {
  return (
    <ConfirmModal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm}>
      <h2>Delete Contact</h2>
      <p>
        Are you sure you want to delete <strong>{contactName}</strong>? This
        action cannot be undone.
      </p>
    </ConfirmModal>
  );
};
