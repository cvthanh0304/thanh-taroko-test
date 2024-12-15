import { renderHook, act } from '@testing-library/react';
import {
  useContactFavorites,
  FAVORITE_CONTACTS_KEY,
} from './useContactFavorites';

describe('useContactFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize with an empty array if no favorites are in localStorage', () => {
    const { result } = renderHook(() => useContactFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  test('should initialize with stored favorites from localStorage', () => {
    localStorage.setItem(FAVORITE_CONTACTS_KEY, JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useContactFavorites());
    expect(result.current.favorites).toEqual([1, 2, 3]);
  });

  test('should add a contact to favorites', () => {
    const { result } = renderHook(() => useContactFavorites());
    act(() => {
      result.current.toggleFavorite(1);
    });
    expect(result.current.favorites).toEqual([1]);
    expect(localStorage.getItem(FAVORITE_CONTACTS_KEY)).toBe('[1]');
  });

  test('should remove a contact from favorites', () => {
    localStorage.setItem(FAVORITE_CONTACTS_KEY, JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useContactFavorites());
    act(() => {
      result.current.toggleFavorite(2);
    });
    expect(result.current.favorites).toEqual([1, 3]);
    expect(localStorage.getItem(FAVORITE_CONTACTS_KEY)).toBe('[1,3]');
  });

  test('should toggle a contact in and out of favorites', () => {
    const { result } = renderHook(() => useContactFavorites());
    act(() => {
      result.current.toggleFavorite(1);
    });
    expect(result.current.favorites).toEqual([1]);
    expect(localStorage.getItem(FAVORITE_CONTACTS_KEY)).toBe('[1]');

    act(() => {
      result.current.toggleFavorite(1);
    });
    expect(result.current.favorites).toEqual([]);
    expect(localStorage.getItem(FAVORITE_CONTACTS_KEY)).toBe('[]');
  });

  test('should update localStorage whenever favorites change', () => {
    const { result } = renderHook(() => useContactFavorites());
    act(() => {
      result.current.toggleFavorite(1);
    });
    expect(localStorage.getItem(FAVORITE_CONTACTS_KEY)).toBe('[1]');

    act(() => {
      result.current.toggleFavorite(2);
    });
    expect(localStorage.getItem(FAVORITE_CONTACTS_KEY)).toBe('[1,2]');
  });
});
