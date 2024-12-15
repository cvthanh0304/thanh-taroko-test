import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  test('should render with label and placeholder', () => {
    render(
      <Dropdown
        options={options}
        selected={null}
        onSelectedChange={jest.fn()}
        label="Dropdown Label"
        placeholder="Select an option"
      />,
    );

    expect(screen.getByText('Dropdown Label')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('should display the selected option', () => {
    render(
      <Dropdown
        options={options}
        selected={options[1]}
        onSelectedChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('should call onSelectedChange and close dropdown when an option is clicked', () => {
    const onSelectedChange = jest.fn();

    render(
      <Dropdown
        options={options}
        selected={null}
        onSelectedChange={onSelectedChange}
        placeholder="Select..."
      />,
    );

    fireEvent.click(screen.getByText('Select...'));
    fireEvent.click(screen.getByText('Option 1'));

    expect(onSelectedChange).toHaveBeenCalledWith(options[0]);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('should close dropdown when clicking outside', () => {
    render(
      <Dropdown
        options={options}
        selected={null}
        onSelectedChange={jest.fn()}
        placeholder="Select..."
      />,
    );

    const dropdownSelected = screen.getByText('Select...');
    fireEvent.click(dropdownSelected);
    expect(screen.getByRole('list')).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  test('should render all options when open', () => {
    render(
      <Dropdown
        options={options}
        selected={null}
        onSelectedChange={jest.fn()}
        placeholder="Select..."
      />,
    );

    fireEvent.click(screen.getByText('Select...'));

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test('should apply correct styles for open dropdown', () => {
    render(
      <Dropdown
        options={options}
        selected={null}
        onSelectedChange={jest.fn()}
        placeholder="Select..."
      />,
    );

    const dropdownSelected = screen.getByText('Select...');

    expect(dropdownSelected).not.toHaveClass('open');

    fireEvent.click(dropdownSelected);

    expect(dropdownSelected).toHaveClass('open');
  });
});
