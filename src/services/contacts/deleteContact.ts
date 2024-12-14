import { apiUrl } from "@/constants/common/env";

export const deleteContact = async (id: number): Promise<void> => {
  const response = await fetch(`${apiUrl}/contacts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete contact with ID: ${id}`);
  }
};
