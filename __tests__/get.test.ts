// @ts-nocheck
import { Model } from '../src/Model';
import { Person } from '../__mocks__/Person';
import { Group } from '../__mocks__/Group';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('get', () => {
  it('should query all rows with the table clause', async() => {
    const people = await Model.table('people').get();
    expect(people.length).toBe(mockDataStore.people.length);
  });

  it('should retrieve all instances of a model with relationships', async () => {
    const people = await Person.with('location').get();
    expect(people.length).toBe(mockDataStore.people.length);
    expect(people[0].location).toBeDefined();
  });

  it('should retrieve all instances of a model', async () => {
    const people = await Person.get();
    expect(people.length).toBe(mockDataStore.people.length);
    expect(people[0].name).toBeDefined();
    expect(people[1].name).toBeDefined();
    expect(people[2].name).toBeDefined();
  });

  it('should retrieve all instances of another model', async () => {
    const groups = await Group.get();
    expect(groups.length).toBe(mockDataStore.groups.length);
    expect(groups[0].name).toBeDefined();
    expect(groups[1].name).toBeDefined();
    expect(groups[2].name).toBeDefined();
  });

  it('should apply where clause when provided', async () => {
    const person = await Person.where('name', '=', 'Nora').first();
    expect(person).toBeDefined();
    expect(person!.name).toBe('Nora');
  });

  it('should return null when no matching records are found', async () => {
    const person = await Person.where('name', '=', 'Nonexistent').first();
    expect(person).toBeNull();
  });

  it('should handle complex queries with multiple where clauses', async () => {
    const person = await Person.where('name', '=', 'Nora').where('locationId', '=', 1).first();
    expect(person).toBeDefined();
    expect(person!.name).toBe('Nora');
    expect(person!.locationId).toBe(1);
  });
});
