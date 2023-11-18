// @ts-nocheck
import { Model } from '../src/Model';
import { Person } from '../__mocks__/Person';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('delete', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  // it('should delete a record with the given id', async () => {
  //   const person = await Person.find(1);
  //   const deleteResult = await person.delete();
  //   expect(deleteResult.rowsAffected).toBe(1);
  //   expect(mockDataStore.people.find(p => p.id === 1)).toBeUndefined();
  // });

  // it('should remove the record from the mockDataStore', async () => {
  //   const person = await Person.find(1);
  //   await person.delete();
  //   expect(mockDataStore.people.some(p => p.id === 1)).toBe(false);
  // });

  // it('should delete a record with the given condition', async () => {
  //   const deleteResult = await Person.where('age', '=', 30).delete();
  //   expect(deleteResult.rowsAffected).toBe(1);
  //   expect(mockDataStore.people.some(p => p.age === 30)).toBe(false);
  // });

  // it('should not delete any records if the condition does not match', async () => {
  //   const initialCount = mockDataStore.people.length;
  //   const deleteResult = await Person.where('age', '=', 100).delete();
  //   expect(deleteResult.rowsAffected).toBe(0);
  //   expect(mockDataStore.people.length).toBe(initialCount);
  // });

  it('should delete a join table record from a static table', async () => {
    const result = await Model.table('groups_people').where('personId', 1).where('groupId', 1).delete();
    expect(result.rowsAffected).toBe(1);
    expect(mockDataStore.groups_people.some(gp => gp.personId === 1 && gp.groupId === 1)).toBe(false);
  });
});
