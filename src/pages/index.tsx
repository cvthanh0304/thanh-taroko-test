import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Contact } from '@/types/contacts/contact';
import { fetchContacts } from '@/services/contacts/fetchContacts';
import { deleteContact } from '@/services/contacts/deleteContact';
import { useContactFavorites } from '@/hooks/contacts/useContactFavorites';
import Toast from '@/components/common/Toast';
import ConfirmDeleteContactModal from '@/components/contacts/ConfirmDeleteContractModal';
import CreateContactModal from '@/components/contacts/CreateContactModal';
import { createContact } from '@/services/contacts/createContact';
import UpdateContactModal from '@/components/contacts/UpdateContactModal';
import { updateContact } from '@/services/contacts/updateContact';
import { sortContacts } from '@/utils/contacts/sortContacts';
import { Dropdown } from '@/components/common/Dropdown';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const sortOptions = [
  { value: 'firstNameAsc', label: 'First Name ASC' },
  { value: 'firstNameDesc', label: 'First Name DESC' },
  { value: 'lastNameAsc', label: 'Last Name ASC' },
  { value: 'lastNameDesc', label: 'Last Name DESC' },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, toggleFavorite] = useContactFavorites();
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

  const [toast, setToast] = useState<{
    message: string;
    variant: 'success' | 'error';
  } | null>(null);

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      try {
        const contacts = await fetchContacts();
        setContacts(contacts);
      } catch (error) {
        setToast({ message: 'Error loading contact list', variant: 'success' });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const handleDelete = async () => {
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

  const displayedContacts = showFavoritesOnly
    ? contacts.filter((contact) => favorites.includes(contact.id))
    : contacts;

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

  const sortedContacts = sortContacts(
    showFavoritesOnly
      ? contacts.filter((contact) => favorites.includes(contact.id))
      : contacts,
    selectedSort ? selectedSort.value : null,
  );

  return (
    <>
      <Head>
        <title>Taroko Contact List</title>
        <meta name="description" content="Taroko Contact List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          {toast && (
            <Toast
              message={toast.message}
              variant={toast.variant}
              onClose={hideToast}
            />
          )}

          <h1>Contact List</h1>

          <button onClick={() => setCreateModalOpen(true)}>
            Add New Contact
          </button>

          <div>
            <Dropdown
              options={sortOptions}
              selected={selectedSort}
              onSelectedChange={setSelectedSort}
              label="Sort By"
            />
          </div>

          <div>
            <input
              id="favorites-checkbox"
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={() => setShowFavoritesOnly((prev: boolean) => !prev)}
            />
            <label htmlFor="favorites-checkbox">Show Favorites Only</label>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : sortedContacts.length > 0 ? (
            <ul>
              {sortedContacts.map((contact: Contact) => (
                <li key={contact.id}>
                  <h2>
                    {contact.firstName} {contact.lastName}
                    <span
                      onClick={() => toggleFavorite(contact.id)}
                      style={{
                        cursor: 'pointer',
                        color: favorites.includes(contact.id) ? 'gold' : 'gray',
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
                  <button onClick={() => openConfirmDeleteModal(contact)}>
                    Delete
                  </button>
                  <button onClick={() => openUpdateModal(contact)}>
                    Update
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No {showFavoritesOnly ? 'favorite' : ''} contacts available.</p>
          )}
        </main>
      </div>

      {contactToDelete && confirmDeleteModalOpen && (
        <ConfirmDeleteContactModal
          isOpen={confirmDeleteModalOpen}
          onClose={closeConfirmDeleteModal}
          onConfirm={handleDelete}
          contactName={`${contactToDelete.firstName} ${contactToDelete.lastName}`}
        />
      )}

      {createModalOpen && (
        <CreateContactModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateContact}
        />
      )}

      {contactToUpdate && updateModalOpen && (
        <UpdateContactModal
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          onUpdate={handleUpdateContact}
          contact={contactToUpdate}
        />
      )}
    </>
  );
}
