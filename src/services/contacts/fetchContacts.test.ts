import { fetchContacts } from './fetchContacts';
import { mapContact } from './mapContact';
import { apiUrl } from '@/constants/common/env';
import { Contact } from '@/types/contacts/contact';

global.fetch = jest.fn() as jest.Mock;

jest.mock('./mapContact', () => ({
  mapContact: jest.fn(),
}));

describe('fetchContacts', () => {
  const mockApiResponse = {
    data: [
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        job: 'Developer',
        description: 'Writes code',
      },
      {
        id: 2,
        first_name: 'Alice',
        last_name: 'Smith',
        job: 'Designer',
        description: 'Creates designs',
      },
    ],
  };

  const mappedContacts: Contact[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      job: 'Developer',
      description: 'Writes code',
    },
    {
      id: 2,
      firstName: 'Alice',
      lastName: 'Smith',
      job: 'Designer',
      description: 'Creates designs',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should send a GET request to the correct URL', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    await fetchContacts();

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}/contacts`);
  });

  test('should map API response to Contact objects using mapContact', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    (mapContact as jest.Mock).mockImplementation((data) => ({
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      job: data.job,
      description: data.description,
    }));

    const result = await fetchContacts();

    expect(mapContact).toHaveBeenCalledTimes(mockApiResponse.data.length);
    expect(result).toEqual(mappedContacts);
  });

  test('should throw an error if fetch fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchContacts()).rejects.toThrow('Failed fetch contacts');
  });
});
