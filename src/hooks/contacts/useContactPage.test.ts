import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import { useContactPage } from './useContactPage';
import { fetchContacts } from '@/services/contacts/fetchContacts';
import { createContact } from '@/services/contacts/createContact';
import { updateContact } from '@/services/contacts/updateContact';
import { deleteContact } from '@/services/contacts/deleteContact';
import { useContactFavorites } from '@/hooks/contacts/useContactFavorites';
import { sortContacts } from '@/utils/contacts/sortContacts';

jest.mock('@/services/contacts/fetchContacts');
jest.mock('@/services/contacts/createContact');
jest.mock('@/services/contacts/updateContact');
jest.mock('@/services/contacts/deleteContact');
jest.mock('@/hooks/contacts/useContactFavorites');
jest.mock('@/utils/contacts/sortContacts');

describe('useContactPage', () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  const mockContacts = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      job: 'Engineer',
      description: 'Works in tech',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      job: 'Designer',
      description: 'Creates designs',
    },
  ];

  const mockFavorites = [1];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchContacts as jest.Mock).mockResolvedValue(mockContacts);
    (useContactFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
      toggleFavorite: jest.fn(),
    });
    (sortContacts as jest.Mock).mockImplementation((contacts) => contacts);
  });

  test('should fetch contacts on mount and set loading state', async () => {
    const { result } = renderHook(() => useContactPage());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.contacts).toEqual(mockContacts);
    });

    expect(result.current.loading).toBe(false);
  });

  test('should handle creating a contact', async () => {
    const newContact = {
      firstName: 'Alice',
      lastName: 'Brown',
      job: 'Writer',
      description: 'Writes books',
    };
    const createdContact = { id: 3, ...newContact };

    (createContact as jest.Mock).mockResolvedValue(createdContact);

    const { result } = renderHook(() => useContactPage());

    await act(async () => {
      await result.current.handleCreateContact(newContact);
    });

    expect(result.current.contacts).toContainEqual(createdContact);
    expect(result.current.toast).toEqual({
      message: 'The contact has been successfully created',
      variant: 'success',
    });
  });

  test('should handle updating a contact', async () => {
    const updatedContact = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      job: 'Manager',
      description: 'Leads teams',
    };

    (updateContact as jest.Mock).mockResolvedValue(updatedContact);

    const { result } = renderHook(() => useContactPage());

    await act(async () => {
      await result.current.handleUpdateContact(updatedContact);
    });

    expect(result.current.contacts).toContainEqual(updatedContact);
    expect(result.current.toast).toEqual({
      message: 'The contact has been successfully updated',
      variant: 'success',
    });
  });

  test('should handle deleting a contact', async () => {
    (deleteContact as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useContactPage());

    await act(() => {
      result.current.openConfirmDeleteModal(mockContacts[0]);
    });

    await act(async () => {
      await result.current.handleDeleteContact();
    });

    expect(result.current.contacts).not.toContainEqual(mockContacts[0]);
    expect(result.current.toast).toEqual({
      message: 'The contact has been successfully deleted',
      variant: 'success',
    });
    expect(result.current.confirmDeleteModalOpen).toBe(false);
  });

  test('should filter contacts by search term', async () => {
    const { result } = renderHook(() => useContactPage());

    await act(() => {
      result.current.setSearchTerm('Jane');
    });

    await waitFor(() => {
      expect(result.current.contacts).toEqual([mockContacts[1]]);
    });
  });

  test('should sort contacts when sort option is set', () => {
    const sortedContacts = [mockContacts[1], mockContacts[0]];
    (sortContacts as jest.Mock).mockReturnValue(sortedContacts);

    const { result } = renderHook(() => useContactPage());

    act(() => {
      result.current.setSelectedSort({
        value: 'lastNameAsc',
        label: 'Last Name (A-Z)',
      });
    });

    expect(result.current.contacts).toEqual(sortedContacts);
  });

  test('should filter contacts by favorites', async () => {
    const { result } = renderHook(() => useContactPage());

    await act(() => {
      result.current.setShowFavoritesOnly(true);
    });

    await waitFor(() => {
      expect(result.current.contacts).toEqual([mockContacts[0]]);
    });
  });
});
