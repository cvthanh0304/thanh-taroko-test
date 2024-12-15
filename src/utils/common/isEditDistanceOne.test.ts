import { isEditDistanceOne } from './isEditDistanceOne';

describe('isEditDistanceOne', () => {
  test('should return true for one replacement', () => {
    expect(isEditDistanceOne('test', 'tent')).toBe(true);
    expect(isEditDistanceOne('apple', 'appls')).toBe(true);
  });

  test('should return true for one insertion', () => {
    expect(isEditDistanceOne('test', 'tests')).toBe(true);
    expect(isEditDistanceOne('abc', 'abcd')).toBe(true);
    expect(isEditDistanceOne('a', 'ab')).toBe(true);
  });

  test('should return true for one deletion', () => {
    expect(isEditDistanceOne('tests', 'test')).toBe(true);
    expect(isEditDistanceOne('abcd', 'abc')).toBe(true);
    expect(isEditDistanceOne('ab', 'a')).toBe(true);
  });

  test('should return false for more than one edit', () => {
    expect(isEditDistanceOne('test', 'toast')).toBe(false);
    expect(isEditDistanceOne('abcd', 'abef')).toBe(false);
    expect(isEditDistanceOne('apple', 'applesauce')).toBe(false);
  });
});
