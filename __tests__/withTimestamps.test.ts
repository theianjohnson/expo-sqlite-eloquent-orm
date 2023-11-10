// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('withTimestamps', () => {
  beforeEach(() => {
    resetMockDataStore()
  });

  it('should set createdAt and updatedAt on insert when withTimestamps is true', async () => {
    MockPerson.withTimestamps = true;
    const person = new MockPerson({ name: 'Test', age: 30 });
    await person.save();

    expect(person.createdAt).toBeDefined();
    expect(person.updatedAt).toBeDefined();
  });

  it('should update updatedAt on save when withTimestamps is true', async () => {
    MockPerson.withTimestamps = true;
    const person = new MockPerson({ id: 1, name: 'Updated Name' });
    await person.save();

    expect(person.updatedAt).toBeDefined();
    // This would be more meaningful if you could actually compare the updated time to the original
  });

  it('should not set createdAt and updatedAt on insert when withTimestamps is false', async () => {
    MockPerson.withTimestamps = false;
    const person = new MockPerson({ name: 'Test', age: 30 });
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
    MockPerson.withTimestamps = true;
    MockPerson.createdAtColumn = 'created_at';
    MockPerson.updatedAtColumn = 'updated_at';

    const person = new MockPerson({ name: 'Test', age: 30 });
    await person.save();

    expect(person[MockPerson.createdAtColumn]).toBeDefined();
    expect(person[MockPerson.updatedAtColumn]).toBeDefined();
  });

  it('should update custom updatedAt on save when withTimestamps is true', async () => {
    MockPerson.withTimestamps = true;
    MockPerson.createdAtColumn = 'created_at';
    MockPerson.updatedAtColumn = 'updated_at';

    const person = new MockPerson({ id: 1, name: 'Updated Name' });
    const originalUpdatedAt = person[MockPerson.updatedAtColumn];
    await person.save();

    expect(person[MockPerson.updatedAtColumn]).toBeDefined();
    expect(person[MockPerson.updatedAtColumn]).not.toBe(originalUpdatedAt);
  });

  it('should not set custom createdAt and updatedAt on insert when withTimestamps is false', async () => {
    MockGroup.withTimestamps = false;
    MockGroup.createdAtColumn = 'creation_date';
    MockGroup.updatedAtColumn = 'modification_date';
    
    const group = new MockGroup({ name: 'New Group' });
    await group.save();

    expect(group[MockGroup.createdAtColumn]).toBeUndefined();
    expect(group[MockGroup.updatedAtColumn]).toBeUndefined();
  });
});

describe('withoutTimestamps', () => {
  beforeEach(() => {
    resetMockDataStore()
  });

  it('should not set timestamps on insert when withTimestamps is false', async () => {
    const group = new MockGroup({ name: 'New Group' });
    await group.save();

    expect(group.createdAt).toBeUndefined();
    expect(group.updatedAt).toBeUndefined();
  });
});