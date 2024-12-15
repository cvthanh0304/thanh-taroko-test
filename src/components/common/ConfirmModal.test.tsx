import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal, { MODAL_ROOT_ID } from './ConfirmModal';

jest.mock('@/components/common/Button', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

describe('ConfirmModal', () => {
  beforeEach(() => {
    const modalRoot = document.createElement('div');
    modalRoot.id = MODAL_ROOT_ID;
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    const modalRoot = document.getElementById(MODAL_ROOT_ID);
    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  });

  test('should not render when isOpen is false', () => {
    render(
      <ConfirmModal isOpen={false} onClose={jest.fn()} onConfirm={jest.fn()} />,
    );
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  test('should render when isOpen is true', () => {
    render(
      <ConfirmModal isOpen={true} onClose={jest.fn()} onConfirm={jest.fn()}>
        Modal Content
      </ConfirmModal>,
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('should call onConfirm when Confirm button is clicked', () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmModal isOpen={true} onClose={jest.fn()} onConfirm={onConfirm}>
        Modal Content
      </ConfirmModal>,
    );
    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when Cancel button is clicked', () => {
    const onClose = jest.fn();
    render(
      <ConfirmModal isOpen={true} onClose={onClose} onConfirm={jest.fn()}>
        Modal Content
      </ConfirmModal>,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should disable buttons when loading is true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        loading={true}
      >
        Modal Content
      </ConfirmModal>,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  test('should log error if modal root is not found', () => {
    console.error = jest.fn();
    document.body.removeChild(
      document.getElementById(MODAL_ROOT_ID) as HTMLElement,
    );
    render(
      <ConfirmModal isOpen={true} onClose={jest.fn()} onConfirm={jest.fn()}>
        Modal Content
      </ConfirmModal>,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Element with id "${MODAL_ROOT_ID}" not found in the DOM.`,
    );
  });
});
