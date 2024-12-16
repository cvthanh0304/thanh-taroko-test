import { editDistanceOne } from './editDistanceOne';

describe('isEditDistanceOne', () => {
  test('should return true for one replacement', () => {
    expect(editDistanceOne('test', 'tent')).toBe(true);
    expect(editDistanceOne('apple', 'appls')).toBe(true);
  });

  test('should return true for one insertion', () => {
    expect(editDistanceOne('test', 'tests')).toBe(true);
    expect(editDistanceOne('abc', 'abcd')).toBe(true);
    expect(editDistanceOne('a', 'ab')).toBe(true);
  });

  test('should return true for one deletion', () => {
    expect(editDistanceOne('tests', 'test')).toBe(true);
    expect(editDistanceOne('abcd', 'abc')).toBe(true);
    expect(editDistanceOne('ab', 'a')).toBe(true);
  });

  test('should return false for more than one edit', () => {
    expect(editDistanceOne('test', 'toast')).toBe(false);
    expect(editDistanceOne('abcd', 'abef')).toBe(false);
    expect(editDistanceOne('apple', 'applesauce')).toBe(false);
  });
});
