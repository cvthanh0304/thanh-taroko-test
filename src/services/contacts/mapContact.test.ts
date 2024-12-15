import { mapContact } from './mapContact';
import { Contact, ContactApiResponse } from '@/types/contacts/contact';

describe('mapContact', () => {
  test('should correctly map ContactApiResponse to Contact', () => {
    const apiResponse: ContactApiResponse = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      job: 'Developer',
      description: 'Writes code',
    };

    const expectedContact: Contact = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      job: 'Developer',
      description: 'Writes code',
    };

    expect(mapContact(apiResponse)).toEqual(expectedContact);
  });

  test('should handle empty strings in the API response', () => {
    const apiResponse: ContactApiResponse = {
      id: 2,
      first_name: '',
      last_name: '',
      job: '',
      description: '',
    };

    const expectedContact: Contact = {
      id: 2,
      firstName: '',
      lastName: '',
      job: '',
      description: '',
    };

    expect(mapContact(apiResponse)).toEqual(expectedContact);
  });
});
