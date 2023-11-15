// @ts-nocheck
import { Person } from '../__mocks__/Person';
import { Group } from '../__mocks__/Group';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('withTimestamps', () => {
  beforeEach(() => {
    resetMockDataStore()
  });

  it('should set createdAt and updatedAt on insert when withTimestamps is true', async () => {
    Person.withTimestamps = true;
    const person = new Person({ name: 'Test', age: 30 });
    await person.save();

    expect(person.createdAt).toBeDefined();
    expect(person.updatedAt).toBeDefined();
  });

  it('should update updatedAt on save when withTimestamps is true', async () => {
    Person.withTimestamps = true;
    const person = new Person({ id: 1, name: 'Updated Name' });
    await person.save();

    expect(person.updatedAt).toBeDefined();
    // This would be more meaningful if you could actually compare the updated time to the original
  });

  it('should not set createdAt and updatedAt on insert when withTimestamps is false', async () => {
    Person.withTimestamps = false;
    const person = new Person({ name: 'Test', age: 30 });
    await person.save();

    expect(person.createdAt).toBeUndefined();
    expect(person.updatedAt).toBeUndefined();
  });
});


describe('withTimestamps custom columns', () => {
  beforeEach(() => {
    resetMockDataStore()
  });

  it('should set custom createdAt and updatedAt on insert when withTimestamps is true', async () => {
    Person.withTimestamps = true;
    Person.createdAtColumn = 'created_at';
    Person.updatedAtColumn = 'updated_at';

    const person = new Person({ name: 'Test', age: 30 });
    await person.save();

    expect(person[Person.createdAtColumn]).toBeDefined();
    expect(person[Person.updatedAtColumn]).toBeDefined();
  });

  it('should update custom updatedAt on save when withTimestamps is true', async () => {
    Person.withTimestamps = true;
    Person.createdAtColumn = 'created_at';
    Person.updatedAtColumn = 'updated_at';

    const person = new Person({ id: 1, name: 'Updated Name' });
    const originalUpdatedAt = person[Person.updatedAtColumn];
    await person.save();

    expect(person[Person.updatedAtColumn]).toBeDefined();
    expect(person[Person.updatedAtColumn]).not.toBe(originalUpdatedAt);
  });

  it('should not set custom createdAt and updatedAt on insert when withTimestamps is false', async () => {
    Group.withTimestamps = false;
    Group.createdAtColumn = 'creation_date';
    Group.updatedAtColumn = 'modification_date';
    
    const group = new Group({ name: 'New Group' });
    await group.save();

    expect(group[Group.createdAtColumn]).toBeUndefined();
    expect(group[Group.updatedAtColumn]).toBeUndefined();
  });
});

describe('withoutTimestamps', () => {
  beforeEach(() => {
    resetMockDataStore()
  });

  it('should not set timestamps on insert when withTimestamps is false', async () => {
    const group = new Group({ name: 'New Group' });
    await group.save();

    expect(group.createdAt).toBeUndefined();
    expect(group.updatedAt).toBeUndefined();
  });
});