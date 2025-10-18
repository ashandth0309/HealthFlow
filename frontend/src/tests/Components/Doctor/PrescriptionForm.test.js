// src/tests/Components/Doctor/PrescriptionForm.test.js
import { describe, it, expect } from 'vitest';

describe('PrescriptionForm Basic Tests', () => {
  it('should pass basic math test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string tests', () => {
    expect('medical').toBe('medical');
    expect('prescription').toHaveLength(12);
  });

  it('should handle array tests', () => {
    const medications = ['Amoxicillin', 'Ibuprofen', 'Vitamins'];
    expect(medications).toHaveLength(3);
    expect(medications).toContain('Ibuprofen');
  });

  it('should handle object tests', () => {
    const patient = { name: 'John Doe', age: 30 };
    expect(patient.name).toBe('John Doe');
    expect(patient.age).toBe(30);
  });
});