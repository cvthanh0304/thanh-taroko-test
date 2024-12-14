import { apiUrl } from "@/constants/common/env";
import { Contact, ContactApiResponse } from "@/types/contacts/contact";

export const fetchContacts = async (): Promise<Contact[]> => {
    const response = await fetch(`${apiUrl}/contacts`);
    const result = await response.json();
    return result.data.map(mapContact);
};

const mapContact = (data: ContactApiResponse): Contact => ({
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    job: data.job,
    description: data.description,
});
