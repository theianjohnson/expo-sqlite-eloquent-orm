// @ts-nocheck
import { Model } from '../src/Model';
import { MockPerson } from '../__mocks__/MockPerson';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('ORM Model Tests', () => {
  beforeEach(() => {
    resetMockDataStore();

    // Empty the people table since seed only runs if the table is empty
    mockDataStore.people = [];
    mockDataStore.groups_people = [];
  });

  describe('MockPerson Model', () => {
    it('should seed data correctly when called statically', async () => {
      
      const seedData = [
        { name: 'John Doe', age: 30 },
        { name: 'Jane Doe', age: 25 }
      ];

      await MockPerson.seed(seedData);

      // Verify that the data is seeded correctly
      expect(mockDataStore.people.length).toBe(2);
      expect(mockDataStore.people).toEqual(expect.arrayContaining([expect.objectContaining(seedData[0]), expect.objectContaining(seedData[1])]));
    });
  });

  describe('Model with specified table', () => {
    it('should seed data correctly when table name is set', async () => {
      const seedData = [
        { groupId: 1, personId: 1 },
        { groupId: 2, personId: 2 }
      ];

      await Model.table('groups_people').seed(seedData);

      // Verify that the data is seeded correctly
      expect(mockDataStore.groups_people.length).toBe(2);
      expect(mockDataStore.groups_people).toEqual(expect.arrayContaining([expect.objectContaining(seedData[0]), expect.objectContaining(seedData[1])]));
    });
  });
});
