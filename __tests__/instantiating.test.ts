// @ts-nocheck
import { Person } from '../__mocks__/Person';

describe('instantiating', () => {
  test('should not have unloaded relationships on newly instantiated Person', async () => {
    const person = new Person();
    expect(person.location).toBe(undefined);
  });

  test('should not have unloaded relationships on found Person', async () => {
    const person = await Person.find(1);
    expect(person.location).toBe(undefined);
  });

  test('should have loaded relationships', async () => {
    const person = await Person.with('location').find(1);
    expect(person.location).not.toBe(undefined);
  });
});
