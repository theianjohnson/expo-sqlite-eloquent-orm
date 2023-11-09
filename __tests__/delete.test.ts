// @ts-nocheck
import { mock } from 'node:test';
import { MockPerson } from '../__mocks__/MockPerson';
import { mockDataStore } from '../__mocks__/mockDataStore';

const originalMockDataStore = {...mockDataStore};

describe('delete', () => {
  beforeEach(() => {
    // Reset the mockDataStore to a known state before each test
    mockDataStore = {...originalMockDataStore};
  });

  it('should delete a record with the given id', async () => {
    const person = await MockPerson.find(1);
    const deleteResult = await person.delete();
    expect(deleteResult.rowsAffected).toBe(1);
    expect(mockDataStore.people.find(p => p.id === 1)).toBeUndefined();
  });

  it('should remove the record from the mockDataStore', async () => {
    const person = await MockPerson.find(1);
    await person.delete();
    expect(mockDataStore.people.some(p => p.id === 1)).toBe(false);
  });

  it('should delete a record with the given condition', async () => {
    const deleteResult = await MockPerson.where('age', '=', 30).delete();
    expect(deleteResult.rowsAffected).toBe(1);
    expect(mockDataStore.people.some(p => p.age === 30)).toBe(false);
  });

  it('should not delete any records if the condition does not match', async () => {
    const initialCount = mockDataStore.people.length;
    const deleteResult = await MockPerson.where('age', '=', 100).delete();
    expect(deleteResult.rowsAffected).toBe(0);
    expect(mockDataStore.people.length).toBe(initialCount);
  });
});
