import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactCard } from './ContactCard';
import { Contact } from '@/types/contacts/contact';

describe('ContactCard', () => {
  const mockContact: Contact = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    job: 'Developer',
    description: 'Writes code',
  };

  const mockOnToggleFavorite = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the contact details correctly', () => {
    render(
      <ContactCard
        contact={mockContact}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Job:')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Writes code')).toBeInTheDocument();
  });

  test('should render favorite icon in gray when not favorite', () => {
    render(
      <ContactCard
        contact={mockContact}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />,
    );

    const favoriteIcon = screen.getByText('★');
    expect(favoriteIcon).toHaveStyle('color: gray');
  });

  test('should render favorite icon in gold when favorite', () => {
    render(
      <ContactCard
        contact={mockContact}
        isFavorite={true}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />,
    );

    const favoriteIcon = screen.getByText('★');
    expect(favoriteIcon).toHaveStyle('color: gold');
  });

  test('should call onToggleFavorite when favorite icon is clicked', () => {
    render(
      <ContactCard
        contact={mockContact}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />,
    );

    const favoriteIcon = screen.getByText('★');
    fireEvent.click(favoriteIcon);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockContact.id);
  });

  test('should call onDelete when Delete button is clicked', () => {
    render(
      <ContactCard
        contact={mockContact}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />,
    );

    fireEvent.click(screen.getByText('Delete'));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockContact);
  });

  test('should call onUpdate when Update button is clicked', () => {
    render(
      <ContactCard
        contact={mockContact}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />,
    );

    fireEvent.click(screen.getByText('Update'));

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith(mockContact);
  });
});
