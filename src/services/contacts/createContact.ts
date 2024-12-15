import { apiUrl } from '@/constants/common/env';
import { Contact } from '@/types/contacts/contact';
import { mapContact } from './mapContact';

export const createContact = async (
  contact: Omit<Contact, 'id'>,
): Promise<Contact> => {
  const response = await fetch(`${apiUrl}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contact: {
        first_name: contact.firstName,
        last_name: contact.lastName,
        job: contact.job,
        description: contact.description,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create contact');
  }
  const result = await response.json();

  return mapContact(result.data);
};
