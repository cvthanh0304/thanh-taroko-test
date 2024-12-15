import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConfirmDeleteContactModal } from './ConfirmDeleteContactModal';

describe('ConfirmDeleteContactModal', () => {
  beforeEach(() => {
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

  test('should render the modal with the correct contact name when open', () => {
    render(
      <ConfirmDeleteContactModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        contactName="John Doe"
      />,
    );

    expect(screen.getByText('Delete Contact')).toBeInTheDocument();

    expect(
      screen.getByText(/Are you sure you want to delete/i), // Using regex for broken texts
    ).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(
      screen.getByText(/This action cannot be undone./i),
    ).toBeInTheDocument();

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('should not render the modal when not open', () => {
    render(
      <ConfirmDeleteContactModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        contactName="John Doe"
      />,
    );

    expect(screen.queryByText('Delete Contact')).not.toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
