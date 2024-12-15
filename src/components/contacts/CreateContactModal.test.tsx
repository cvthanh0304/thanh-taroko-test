import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateContactModal } from './CreateContactModal';

describe('CreateContactModal', () => {
  const mockOnClose = jest.fn();
  const mockOnCreate = jest.fn();

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

  test('should render the modal with form fields', () => {
    render(
      <CreateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />,
    );

    expect(screen.getByText('Create New Contact')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Job')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  test('should not render the modal when closed', () => {
    render(
      <CreateContactModal
        isOpen={false}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />,
    );

    expect(screen.queryByText('Create New Contact')).not.toBeInTheDocument();
  });

  test('should update form fields when user types', () => {
    render(
      <CreateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />,
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Job'), {
      target: { value: 'Developer' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Writes code' },
    });

    expect(screen.getByLabelText('First Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
    expect(screen.getByLabelText('Job')).toHaveValue('Developer');
    expect(screen.getByLabelText('Description')).toHaveValue('Writes code');
  });

  test('should call onCreate with the correct data when form is valid', async () => {
    render(
      <CreateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />,
    );

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Job'), {
      target: { value: 'Developer' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Writes code' },
    });

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledTimes(1);
      expect(mockOnCreate).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        job: 'Developer',
        description: 'Writes code',
      });
    });
  });

  test('should show an alert if form is incomplete', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <CreateContactModal
        isOpen={true}
        onClose={mockOnClose}
        onCreate={mockOnCreate}
      />,
    );

    fireEvent.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('All fields are required.');
    });

    alertMock.mockRestore();
  });
});
