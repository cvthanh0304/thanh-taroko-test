import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Toast from './Toast';

jest.useFakeTimers();

describe('Toast', () => {
  test('should render with correct message and variant', () => {
    render(
      <Toast
        message="This is a success message"
        variant="success"
        onClose={jest.fn()}
      />,
    );

    const toast = screen.getByText('This is a success message');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('toast');
    expect(toast).toHaveClass('success');
  });

  test('should render with error variant', () => {
    render(
      <Toast
        message="This is an error message"
        variant="error"
        onClose={jest.fn()}
      />,
    );

    const toast = screen.getByText('This is an error message');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass('toast');
    expect(toast).toHaveClass('error');
  });

  test('should call onClose after the default duration', () => {
    const onClose = jest.fn();

    render(
      <Toast message="This is a toast" variant="success" onClose={onClose} />,
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.runAllTimers();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose after a custom duration', () => {
    const onClose = jest.fn();

    render(
      <Toast
        message="This is a toast"
        variant="success"
        onClose={onClose}
        duration={5000}
      />,
    );

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('should clear the timer on unmount', () => {
    const onClose = jest.fn();

    const { unmount } = render(
      <Toast
        message="This is a toast"
        variant="success"
        onClose={onClose}
        duration={5000}
      />,
    );

    unmount();

    act(() => {
      jest.runAllTimers();
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
