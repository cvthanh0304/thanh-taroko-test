import { sortContacts } from './sortContacts';
import { Contact } from '@/types/contacts/contact';

describe('sortContacts', () => {
  const contacts: Contact[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      job: 'Developer',
      description: 'Software engineer',
    },
    {
      id: 2,
      firstName: 'Alice',
      lastName: 'Smith',
      job: 'Designer',
      description: 'Graphic designer',
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      job: 'Manager',
      description: 'Project manager',
    },
  ];

  test('should return contacts unchanged if no sort option is provided', () => {
    const result = sortContacts(contacts, null);
    expect(result).toEqual(contacts);
  });

  test('should sort by first name ascending', () => {
    const result = sortContacts(contacts, 'firstNameAsc');
    expect(result).toEqual([
      {
        id: 2,
        firstName: 'Alice',
        lastName: 'Smith',
        job: 'Designer',
        description: 'Graphic designer',
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        job: 'Manager',
        description: 'Project manager',
      },
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        job: 'Developer',
        description: 'Software engineer',
      },
    ]);
  });

  test('should sort by first name descending', () => {
    const result = sortContacts(contacts, 'firstNameDesc');
    expect(result).toEqual([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        job: 'Developer',
        description: 'Software engineer',
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        job: 'Manager',
        description: 'Project manager',
      },
      {
        id: 2,
        firstName: 'Alice',
        lastName: 'Smith',
        job: 'Designer',
        description: 'Graphic designer',
      },
    ]);
  });

  test('should sort by last name ascending', () => {
    const result = sortContacts(contacts, 'lastNameAsc');
    expect(result).toEqual([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        job: 'Developer',
        description: 'Software engineer',
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        job: 'Manager',
        description: 'Project manager',
      },
      {
        id: 2,
        firstName: 'Alice',
        lastName: 'Smith',
        job: 'Designer',
        description: 'Graphic designer',
      },
    ]);
  });

  test('should sort by last name descending', () => {
    const result = sortContacts(contacts, 'lastNameDesc');
    expect(result).toEqual([
      {
        id: 2,
        firstName: 'Alice',
        lastName: 'Smith',
        job: 'Designer',
        description: 'Graphic designer',
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        job: 'Manager',
        description: 'Project manager',
      },
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        job: 'Developer',
        description: 'Software engineer',
      },
    ]);
  });

  test('should return contacts unchanged for invalid sort option', () => {
    const result = sortContacts(contacts, 'invalidOption');
    expect(result).toEqual(contacts);
  });

  test('should handle an empty contacts array', () => {
    const result = sortContacts([], 'firstNameAsc');
    expect(result).toEqual([]);
  });
});
