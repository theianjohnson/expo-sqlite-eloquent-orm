// @ts-nocheck
import { Person } from '../__mocks__/Person';
import { Group } from '../__mocks__/Group';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('get', () => {
  test('should retrieve all instances of a model', async () => {
    const people = await Person.get();
    expect(people.length).toBe(mockDataStore.people.length);
    expect(people[0].name).toBeDefined();
    expect(people[1].name).toBeDefined();
    expect(people[2].name).toBeDefined();
  });

  test('should retrieve all instances of another model', async () => {
    const groups = await Group.get();
    expect(groups.length).toBe(mockDataStore.groups.length);
    expect(groups[0].name).toBeDefined();
    expect(groups[1].name).toBeDefined();
    expect(groups[2].name).toBeDefined();
  });

  test('should apply where clause when provided', async () => {
    const person = await Person.where('name', '=', 'Nora').first();
    expect(person).toBeDefined();
    expect(person!.name).toBe('Nora');
  });

  test('should return null when no matching records are found', async () => {
    const person = await Person.where('name', '=', 'Nonexistent').first();
    expect(person).toBeNull();
  });

  test('should handle complex queries with multiple where clauses', async () => {
    const person = await Person.where('name', '=', 'Nora').where('locationId', '=', 1).first();
    expect(person).toBeDefined();
    expect(person!.name).toBe('Nora');
    expect(person!.locationId).toBe(1);
  });
});
