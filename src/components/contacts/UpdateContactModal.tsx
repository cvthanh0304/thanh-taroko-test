import React, { useState } from 'react';
import ConfirmModal from '../common/ConfirmModal';
import { Contact } from '@/types/contacts/contact';
import styles from './UpdateContactModal.module.css';

type UpdateContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedContact: Contact) => Promise<void>;
  contact: Contact;
};

export const UpdateContactModal = ({
  isOpen,
  onClose,
  onUpdate,
  contact,
}: UpdateContactModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Contact>(contact);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.job &&
      formData.description
    ) {
      setLoading(true);
      try {
        await onUpdate(formData);
      } catch (error) {
        console.error('Failed to update contact:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('All fields are required.');
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      loading={loading}
    >
      <h2 className={styles['modal-title']}>
        Update Contact: {contact.firstName} ${contact.lastName}
      </h2>
      <form className={styles['modal-form']}>
        <div className={styles['form-group']}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="job">Job</label>
          <input
            id="job"
            name="job"
            type="text"
            value={formData.job}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
      </form>
    </ConfirmModal>
  );
};
