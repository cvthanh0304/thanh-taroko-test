import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UpdateContactModal } from './UpdateContactModal';
import { Contact } from '@/types/contacts/contact';

describe('UpdateContactModal', () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockContact: Contact = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    job: 'Developer',
    description: 'Writes code',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  test('should render the modal with the correct initial contact details', () => {
    render(
      <UpdateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        contact={mockContact}
      />,
    );

    expect(screen.getByText(`Update Contact: John $Doe`)).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
    expect(screen.getByLabelText('Job')).toHaveValue('Developer');
    expect(screen.getByLabelText('Description')).toHaveValue('Writes code');
  });

  test('should update form fields when user types', () => {
    render(
      <UpdateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        contact={mockContact}
      />,
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText('Job'), {
      target: { value: 'Designer' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Creates designs' },
    });

    expect(screen.getByLabelText('First Name')).toHaveValue('Jane');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Smith');
    expect(screen.getByLabelText('Job')).toHaveValue('Designer');
    expect(screen.getByLabelText('Description')).toHaveValue('Creates designs');
  });

  test('should call onUpdate with updated contact details when form is submitted', async () => {
    render(
      <UpdateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        contact={mockContact}
      />,
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText('Job'), {
      target: { value: 'Designer' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Creates designs' },
    });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      expect(mockOnUpdate).toHaveBeenCalledWith({
        id: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        job: 'Designer',
        description: 'Creates designs',
      });
    });
  });

  test('should show an alert if form fields are incomplete', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <UpdateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        contact={mockContact}
      />,
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('All fields are required.');
    });

    alertMock.mockRestore();
  });

  test('should not render the modal when closed', () => {
    render(
      <UpdateContactModal
        isOpen={false}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        contact={mockContact}
      />,
    );

    expect(screen.queryByText('Update Contact')).not.toBeInTheDocument();
  });
});
