// @ts-nocheck
import { Model } from '../src/Model';

describe('prepareAttributeForStorage', () => {
  // Set up the casts for the test
  beforeAll(() => {
    Model.casts = {
      age: 'number',
      active: 'boolean',
      bio: 'string',
      settings: 'json',
    };
  });

  it('converts numeric values to numbers', () => {
    const value = '42';
    const castedValue = Model.prepareAttributeForStorage('age', value);
    expect(castedValue).toBe(42);
  });

  it('converts truthy and falsy values to 1 and 0 for booleans', () => {
    const trueValue = 'true';
    const falseValue = '';
    expect(Model.prepareAttributeForStorage('active', trueValue)).toBe(1);
    expect(Model.prepareAttributeForStorage('active', falseValue)).toBe(0);
  });

  it('converts values to strings', () => {
    const value = 1234;
    const castedValue = Model.prepareAttributeForStorage('bio', value);
    expect(castedValue).toBe('1234');
  });

  it('stringifies JSON objects', () => {
    const value = { key: 'value' };
    const castedValue = Model.prepareAttributeForStorage('settings', value);
    expect(castedValue).toBe(JSON.stringify(value));
  });

  it('handles invalid JSON objects by returning null', () => {
    const value = { key: 'value', circularReference: null };
    value.circularReference = value; // Create a circular reference which can't be stringified
    const castedValue = Model.prepareAttributeForStorage('settings', value);
    expect(castedValue).toBeNull();
  });
});
