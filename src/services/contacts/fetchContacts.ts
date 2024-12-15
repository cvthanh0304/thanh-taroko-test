import { apiUrl } from '@/constants/common/env';
import { Contact } from '@/types/contacts/contact';
import { mapContact } from './mapContact';

export const fetchContacts = async (): Promise<Contact[]> => {
  const response = await fetch(`${apiUrl}/contacts`);

  if (!response.ok) {
    throw new Error(`Failed fetch contacts`);
  }

  const result = await response.json();
  return result.data.map(mapContact);
};
