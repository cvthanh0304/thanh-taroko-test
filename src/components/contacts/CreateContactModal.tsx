import React, { useState } from 'react';
import ConfirmModal from '../common/ConfirmModal';
import { Contact } from '@/types/contacts/contact';

type CreateContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newContact: Omit<Contact, 'id'>) => Promise<void>;
};

export const CreateContactModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateContactModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    firstName: '',
    lastName: '',
    job: '',
    description: '',
  });

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
        await onCreate(formData);
      } catch (error) {
        console.error('Failed to create contact:', error);
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
      <h2>Create New Contact</h2>
      <form>
        <div>
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
        <div>
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
        <div>
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
        <div>
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
