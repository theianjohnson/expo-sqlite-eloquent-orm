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

  it('should not cast null fields to Date objects', () => {
    const dateObject = Model.castAttribute('date', null);
    expect(dateObject).toBeNull();
  });

  it('should handle invalid date strings when casting', () => {
    const invalidDateString = 'not a valid date';
    const result = Model.castAttribute('date', invalidDateString);
    expect(result).toBeInstanceOf(Date);
    expect(isNaN(result.getTime())).toBe(true); // Invalid Date object check
  });

  it('should cast datetime strings to Date objects', () => {
    const isoDateTimeString = '2020-01-01T12:30:45.000Z';
    const dateTimeObject = Model.castAttribute('datetime', isoDateTimeString);
    expect(dateTimeObject).toBeInstanceOf(Date);
    expect(dateTimeObject.toISOString()).toBe(isoDateTimeString);
  });

  it('should not cast null fields to datetime objects', () => {
    const dateTimeObject = Model.castAttribute('datetime', null);
    expect(dateTimeObject).toBeNull();
  });

  it('should handle invalid datetime strings when casting', () => {
    const invalidDateTimeString = 'not a valid datetime';
    const result = Model.castAttribute('datetime', invalidDateTimeString);
    expect(result).toBeInstanceOf(Date);
    expect(isNaN(result.getTime())).toBe(true); // Invalid Date object check
  });
});
