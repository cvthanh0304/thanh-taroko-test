import { createContact } from './createContact';
import { mapContact } from './mapContact';
import { apiUrl } from '@/constants/common/env';
import { Contact } from '@/types/contacts/contact';

global.fetch = jest.fn() as jest.Mock;

jest.mock('./mapContact', () => ({
  mapContact: jest.fn(),
}));

describe('createContact', () => {
  const mockContact = {
    firstName: 'John',
    lastName: 'Doe',
    job: 'Developer',
    description: 'Writes code',
  };

  const mockApiResponse = {
    data: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      job: 'Developer',
      description: 'Writes code',
    },
  };

  const expectedMappedContact: Contact = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    job: 'Developer',
    description: 'Writes code',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should send a POST request with the correct payload', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    (mapContact as jest.Mock).mockReturnValueOnce(expectedMappedContact);

    await createContact(mockContact);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact: {
          first_name: 'John',
          last_name: 'Doe',
          job: 'Developer',
          description: 'Writes code',
        },
      }),
    });
  });

  test('should return the mapped contact when the request succeeds', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    (mapContact as jest.Mock).mockReturnValueOnce(expectedMappedContact);

    const result = await createContact(mockContact);

    expect(mapContact).toHaveBeenCalledWith(mockApiResponse.data);
    expect(result).toEqual(expectedMappedContact);
  });

  test('should throw an error if the request fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(createContact(mockContact)).rejects.toThrow(
      'Failed to create contact',
    );
  });
});
