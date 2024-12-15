/**
 * Checks if two strings are at most one edit apart.
 * An edit can be an insertion, deletion, or replacement of a character.
 **/

export const isEditDistanceOne = (a: string, b: string): boolean => {
  const lenA = a.length;
  const lenB = b.length;

  if (Math.abs(lenA - lenB) > 1) return false;

  let i = 0;
  let j = 0;
  let edits = 0; // Number of edits found

  while (i < lenA && j < lenB) {
    if (a[i] !== b[j]) {
      // Return false if it's more than 1 edit
      if (edits === 1) return false;

      if (lenA > lenB) {
        // String a is longer, skip a character in a
        i++;
      } else if (lenA < lenB) {
        // String b is longer, skip a character in b
        j++;
      } else {
        // Strings are the same length, increase the index in both strings
        i++;
        j++;
      }
      edits++; // Increase the edit count
    } else {
      // Characters match, increase the index in both strings
      i++;
      j++;
    }
  }

  // Check for remaining characters in the longer string
  if (i < lenA || j < lenB) edits++;

  return edits <= 1; // Return true if at most one edit
};
