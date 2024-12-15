import { Contact, ContactApiResponse } from '@/types/contacts/contact';

export const mapContact = (data: ContactApiResponse): Contact => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  job: data.job,
  description: data.description,
});
