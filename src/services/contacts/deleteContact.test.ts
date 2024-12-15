import { deleteContact } from './deleteContact';
import { apiUrl } from '@/constants/common/env';

global.fetch = jest.fn() as jest.Mock;

describe('deleteContact', () => {
  const contactId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should send a DELETE request with the correct URL', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await deleteContact(contactId);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/contacts/${contactId}`, {
      method: 'DELETE',
    });
  });

  test('should throw an error if the DELETE request fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(deleteContact(contactId)).rejects.toThrow(
      `Failed to delete contact with ID: ${contactId}`,
    );
  });
});
