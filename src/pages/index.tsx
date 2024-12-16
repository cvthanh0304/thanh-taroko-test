import Head from 'next/head';
import { Geist, Geist_Mono } from 'next/font/google';
import Toast from '@/components/common/Toast';
import { ConfirmDeleteContactModal } from '@/components/contacts/ConfirmDeleteContactModal';
import { CreateContactModal } from '@/components/contacts/CreateContactModal';
import { UpdateContactModal } from '@/components/contacts/UpdateContactModal';
import { Dropdown } from '@/components/common/Dropdown';

import styles from '@/styles/ContactsPage.module.css';
import { ContactCard } from '@/components/contacts/ContactCard';
import { Button } from '@/components/common/Button';
import { useContactPage } from '@/hooks/contacts/useContactPage';

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
  const {
    contacts: sortedContacts,
    loading,
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
    searchTerm,
    setCreateModalOpen,
    selectedSort,
    showFavoritesOnly,
    contactToDelete,
    closeUpdateModal,
    favorites,
    handleToggleFavorite,
  } = useContactPage();

  return (
    <>
      <Head>
        <title>Taroko Contact List</title>
        <meta name="description" content="Taroko Contact List" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${geistSans.variable} ${geistMono.variable}`}>
        {toast && (
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={hideToast}
          />
        )}
        <div className={styles['page-container']}>
          <h1 className={styles['page-header']}>Contact List</h1>

          <div className={styles['actions']}>
            <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
              Add New Contact
            </Button>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className={styles['search-input']}
            />

            <div className={styles['dropdown-container']}>
              <Dropdown
                options={sortOptions}
                selected={selectedSort}
                onSelectedChange={setSelectedSort}
                placeholder="Sort by"
              />
            </div>

            <div className={styles['favorites-container']}>
              <input
                id="favorites-checkbox"
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={() => setShowFavoritesOnly((prev: boolean) => !prev)}
              />
              <label htmlFor="favorites-checkbox">Show Favorites Only</label>
            </div>
          </div>

          {loading ? (
            <p className={styles['loading-text']}>Loading...</p>
          ) : sortedContacts.length > 0 ? (
            <ul className={styles['contact-list']}>
              {sortedContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isFavorite={favorites.includes(contact.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={openConfirmDeleteModal}
                  onUpdate={openUpdateModal}
                />
              ))}
            </ul>
          ) : (
            <p className={styles['loading-text']}>
              No {showFavoritesOnly ? 'favorite' : ''} contacts available.
            </p>
          )}
        </div>
      </main>

      {contactToDelete && confirmDeleteModalOpen && (
        <ConfirmDeleteContactModal
          isOpen={confirmDeleteModalOpen}
          onClose={closeConfirmDeleteModal}
          onConfirm={handleDeleteContact}
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
          onClose={closeUpdateModal}
          onUpdate={handleUpdateContact}
          contact={contactToUpdate}
        />
      )}
    </>
  );
}
