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

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, toggleFavorite] = useContactFavorites();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] =
    useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

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
          ) : displayedContacts.length > 0 ? (
            <ul>
              {displayedContacts.map((contact: Contact) => (
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
    </>
  );
}
