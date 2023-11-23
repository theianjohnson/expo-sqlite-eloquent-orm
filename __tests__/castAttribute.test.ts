// @ts-nocheck
import { Model } from '../src/Model';

describe('castAttribute', () => {
  it('should cast attributes to the correct types', () => {
    expect(Model.castAttribute('number', '123')).toBe(123);
    expect(Model.castAttribute('boolean', 'true')).toBe(true);
    expect(Model.castAttribute('boolean', '')).toBe(false);
    expect(Model.castAttribute('string', 123)).toBe('123');
    expect(Model.castAttribute('json', '{"key":"value"}')).toEqual({ key: 'value' });
  });

  it('should handle invalid JSON when casting', () => {
    expect(Model.castAttribute('json', 'not a json string')).toEqual('not a json string');
  });

  it('should cast date strings to Date objects', () => {
    const isoDateString = '2020-01-01T00:00:00.000Z';
    const dateObject = Model.castAttribute('date', isoDateString);
    expect(dateObject).toBeInstanceOf(Date);
    expect(dateObject.toISOString()).toBe(isoDateString);
  });

  it('should handle invalid date strings when casting', () => {
    const invalidDateString = 'not a valid date';
    const result = Model.castAttribute('date', invalidDateString);
    // Depending on how you want to handle invalid dates, 
    // you can expect either a null, an invalid Date object, or the original string
    // For example, expecting an invalid Date object:
    expect(result).toBeInstanceOf(Date);
    expect(isNaN(result.getTime())).toBe(true); // Invalid Date object check
  });
});
