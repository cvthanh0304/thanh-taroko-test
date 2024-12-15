import { apiUrl } from '@/constants/common/env';
import { Contact } from '@/types/contacts/contact';
import { mapContact } from './mapContact';

export const updateContact = async (contact: Contact): Promise<Contact> => {
  const response = await fetch(`${apiUrl}/contacts/${contact.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        first_name: contact.firstName,
        last_name: contact.lastName,
        job: contact.job,
        description: contact.description,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update contact');
  }
  const result = await response.json();

  return mapContact(result.data);
};
