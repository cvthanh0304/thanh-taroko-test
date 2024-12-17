import { useState } from 'react';
import { Contact } from '@/types/contacts/contact';
import { createContact } from '@/services/contacts/createContact';
import { updateContact } from '@/services/contacts/updateContact';
import { deleteContact } from '@/services/contacts/deleteContact';
import { useContactFavorites } from '@/hooks/contacts/useContactFavorites';
import { sortContacts } from '@/utils/contacts/sortContacts';
import { useDebounce } from '../common/useDebounce';
import { editDistanceOne } from '@/utils/common/editDistanceOne';

type ToastType = {
  message: string;
  variant: 'success' | 'error';
} | null;

type SortOption = {
  value: string;
  label: string;
} | null;

type UseContactsReturn = {
  contacts: Contact[];
  toast: ToastType;
  handleCreateContact: (newContact: Omit<Contact, 'id'>) => Promise<void>;
  handleUpdateContact: (updatedContact: Contact) => Promise<void>;
  handleDeleteContact: () => Promise<void>;
  handleToggleFavorite: (contactId: number) => void;
  setSearchTerm: (term: string) => void;
  setSelectedSort: (option: SortOption) => void;
  setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateModalOpen: (value: boolean) => void;
  openConfirmDeleteModal: (contact: Contact) => void;
  closeConfirmDeleteModal: () => void;
  openUpdateModal: (contact: Contact) => void;
  hideToast: () => void;
  contactToUpdate: Contact | null;
  contactToDelete: Contact | null;
  confirmDeleteModalOpen: boolean;
  createModalOpen: boolean;
  updateModalOpen: boolean;
  searchTerm: string;
  selectedSort: SortOption;
  showFavoritesOnly: boolean;
  closeUpdateModal: () => void;
  favorites: number[];
};

export const useContactPage = (
  initialContacts: Contact[],
): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const { favorites, toggleFavorite } = useContactFavorites();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] =
    useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [contactToUpdate, setContactToUpdate] = useState<Contact | null>(null);
  const [selectedSort, setSelectedSort] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [toast, setToast] = useState<{
    message: string;
    variant: 'success' | 'error';
  } | null>(null);

  const hideToast = () => {
    setToast(null);
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;

    try {
      await deleteContact(contactToDelete.id);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== contactToDelete.id),
      );
      if (favorites.includes(contactToDelete.id)) {
        toggleFavorite(contactToDelete.id);
      }
      setToast({
        message: 'The contact has been successfully deleted',
        variant: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to delete the contact',
        variant: 'error',
      });
      console.error(error);
    } finally {
      setConfirmDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  const handleCreateContact = async (newContact: Omit<Contact, 'id'>) => {
    try {
      const createdContact = await createContact(newContact);
      setContacts((prev) => [...prev, createdContact]);
      setToast({
        message: 'The contact has been successfully created',
        variant: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to create the contact',
        variant: 'error',
      });
      console.error('Failed to create contact:', error);
    } finally {
      setCreateModalOpen(false);
    }
  };

  const handleUpdateContact = async (updatedContact: Contact) => {
    try {
      const updatedData = await updateContact(updatedContact);
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === updatedData.id ? updatedData : contact,
        ),
      );
      setToast({
        message: 'The contact has been successfully updated',
        variant: 'success',
      });
    } catch (error) {
      setToast({
        message: 'Failed to update the contact',
        variant: 'error',
      });
      console.error('Failed to update contact:', error);
    } finally {
      setUpdateModalOpen(false);
      setContactToUpdate(null);
    }
  };

  const openConfirmDeleteModal = (contact: Contact) => {
    setContactToDelete(contact);
    setConfirmDeleteModalOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setContactToDelete(null);
    setConfirmDeleteModalOpen(false);
  };

  const openUpdateModal = (contact: Contact) => {
    setContactToUpdate(contact);
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
    setContactToUpdate(null);
  };

  const filteredContacts = contacts.filter((contact) => {
    const firstName = contact.firstName.toLowerCase();
    const lastName = contact.lastName.toLowerCase();
    const fullName = `${firstName} ${lastName}`;
    const term = debouncedSearchTerm.toLowerCase();

    const matchesSearch =
      !term ||
      fullName.includes(term) ||
      editDistanceOne(firstName, term) ||
      editDistanceOne(lastName, term);

    const matchesFavorite =
      !showFavoritesOnly || favorites.includes(contact.id);

    return matchesSearch && matchesFavorite;
  });

  const sortedContacts = sortContacts(
    filteredContacts,
    selectedSort ? selectedSort.value : null,
  );

  const handleToggleFavorite = (id: number) => {
    const isFavorite = favorites.includes(id);
    toggleFavorite(id);
    setToast({
      message: isFavorite
        ? `Removed contact ${id} from favorites`
        : `Added contact ${id} to favorites`,
      variant: 'success',
    });
  };

  return {
    contacts: sortedContacts,
    toast,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact,
    setSearchTerm,
    setSelectedSort,
    closeConfirmDeleteModal,
    setShowFavoritesOnly,
    openConfirmDeleteModal,
    openUpdateModal,
    hideToast,
    contactToUpdate,
    confirmDeleteModalOpen,
    createModalOpen,
    updateModalOpen,
    closeUpdateModal,
    searchTerm,
    setCreateModalOpen,
    selectedSort,
    showFavoritesOnly,
    contactToDelete,
    favorites,
    handleToggleFavorite,
  };
};
