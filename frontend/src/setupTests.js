// src/setupTests.js
import '@testing-library/jest-dom';

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    text: jest.fn(),
    setFont: jest.fn(),
    setDrawColor: jest.fn(),
    line: jest.fn(),
    addPage: jest.fn(),
    splitTextToSize: jest.fn().mockReturnValue(['test']),
    internal: {
      pageSize: {
        height: 300
      }
    },
    save: jest.fn()
  }));
});

// Mock other dependencies
jest.mock('html2canvas', () => jest.fn());
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
}));
jest.mock('axios');

// Mock react-datepicker
jest.mock('react-datepicker', () => {
  return function MockDatePicker({ customInput, selected, onChange }) {
    const CustomInput = customInput;
    return (
      <CustomInput
        value={selected ? selected.toISOString() : ''}
        onChange={(e) => {
          if (onChange) {
            onChange(new Date(e.target.value));
          }
        }}
      />
    );
  };
});

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

// Mock sessionStorage and localStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = mockSessionStorage;

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = mockLocalStorage;

// Mock fetch
global.fetch = jest.fn();

// Mock URL methods
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();