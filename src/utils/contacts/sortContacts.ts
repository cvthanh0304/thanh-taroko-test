import { Contact } from '@/types/contacts/contact';

export const sortContacts = (
  contacts: Contact[],
  sortOption: string | null,
): Contact[] => {
  if (!sortOption) return contacts;

  switch (sortOption) {
    case 'firstNameAsc':
      return [...contacts].sort((a, b) =>
        a.firstName.localeCompare(b.firstName),
      );
    case 'firstNameDesc':
      return [...contacts].sort((a, b) =>
        b.firstName.localeCompare(a.firstName),
      );
    case 'lastNameAsc':
      return [...contacts].sort((a, b) => a.lastName.localeCompare(b.lastName));
    case 'lastNameDesc':
      return [...contacts].sort((a, b) => b.lastName.localeCompare(a.lastName));
    default:
      return contacts;
  }
};
