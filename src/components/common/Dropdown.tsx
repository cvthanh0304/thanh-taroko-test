import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  options: Option[];
  selected: Option | null;
  onSelectedChange: (option: Option) => void;
  label?: string;
  placeholder?: string;
};

export const Dropdown = ({
  options,
  selected,
  onSelectedChange,
  label,
  placeholder,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className={styles['dropdown']} ref={dropdownRef}>
      {label && <label className={styles['dropdown-label']}>{label}</label>}
      <div
        className={`${styles['dropdown-selected']} ${isOpen ? styles['open'] : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected ? selected.label : placeholder || 'Select...'}
      </div>
      {isOpen && (
        <div className={styles['dropdown-menu']}>
          {options.map((option) => (
            <div
              key={option.value}
              className={styles['dropdown-item']}
              onClick={() => {
                onSelectedChange(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
