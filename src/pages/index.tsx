import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import { useEffect, useState } from 'react';
import { Contact } from '@/types/contacts/contact';
import { fetchContacts } from '@/services/contacts/fetchContacts';
import { deleteContact } from '@/services/contacts/deleteContact';
import { useContactFavorites } from '@/hooks/contacts/useContactFavorites';
import Toast from '@/components/common/Toast';

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

  const handleDelete = async (id: number) => {
    try {
      await deleteContact(id);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== id),
      );
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
    }
  };

  const displayedContacts = showFavoritesOnly
    ? contacts.filter((contact) => favorites.includes(contact.id))
    : contacts;

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
                  <button onClick={() => handleDelete(contact.id)}>
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
    </>
  );
}
