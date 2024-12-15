import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  test('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('should update the debounced value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'initial' },
      },
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  test('should reset the debounce timer if value changes quickly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'initial' },
      },
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'first-update' });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: 'second-update' });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('second-update');
  });
});
