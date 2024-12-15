import React from 'react';
import { Contact } from '@/types/contacts/contact';
import { Button } from '../common/Button';
import styles from './ContactCard.module.css';

type ContactCardProps = {
  contact: Contact;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onDelete: (contact: Contact) => void;
  onUpdate: (contact: Contact) => void;
};

export const ContactCard = ({
  contact,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onUpdate,
}: ContactCardProps) => {
  return (
    <li className={styles['contact-card']}>
      <h2>
        {contact.firstName} {contact.lastName}
        <span
          onClick={() => onToggleFavorite(contact.id)}
          style={{
            color: isFavorite ? 'gold' : 'gray',
          }}
        >
          ★
        </span>
      </h2>
      <p>
        <strong>Job:</strong> {contact.job}
      </p>
      <p>
        <strong>Description:</strong> {contact.description}
      </p>
      <div className={styles['button-group']}>
        <Button variant="danger" onClick={() => onDelete(contact)}>
          Delete
        </Button>
        <Button variant="secondary" onClick={() => onUpdate(contact)}>
          Update
        </Button>
      </div>
    </li>
  );
};
