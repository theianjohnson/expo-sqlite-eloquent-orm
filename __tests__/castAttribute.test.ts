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
});
