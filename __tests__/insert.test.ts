// @ts-nocheck
import { Model } from '../src/Model';
import { Person } from '../__mocks__/Person';
import { Group } from '../__mocks__/Group';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('insert', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should create a new person and save', async () => {
    const newPerson = new Person({ name: 'John', groupId: 1 });
    const expectedInsertId = mockDataStore.people.length + 1;

    const result = await newPerson.save();

    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.people).toContainEqual(expect.objectContaining(newPerson));
  });

  it('should insert a new person record into the database statically', async () => {
    const newPersonData = { name: 'John', groupId: 1 };
    const expectedInsertId = mockDataStore.people.length + 1;

    const result = await Person.insert(newPersonData);

    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.people).toContainEqual(expect.objectContaining(newPersonData));
  });

  it('should insert a new group record into the database', async () => {
    const newGroupData = { name: 'New Group' };
    const expectedInsertId = mockDataStore.groups.length + 1;

    const result = await Group.insert(newGroupData);

    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.groups).toContainEqual(expect.objectContaining(newGroupData));
  });

  it('should insert a new record into a specified table', async () => {
    // Example data for inserting into the 'groups_people' table
    const newGroupPersonData = { groupId: 1, personId: 2 };
    const expectedInsertId = mockDataStore.groups_people.length + 1;

    // Insert using Model.table().insert()
    const result = await Model.table('groups_people').insert(newGroupPersonData);

    // Check the insertId and if the data is correctly inserted
    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.groups_people).toContainEqual(expect.objectContaining(newGroupPersonData));
  });

  it('should insert another new record into a different specified table', async () => {
    // Additional test data for a different table, e.g., 'locations'
    const newLocationData = { name: 'New Location', address: '123 Main St' };
    const expectedInsertId = mockDataStore.locations.length + 1;

    // Insert using Model.table().insert()
    const result = await Model.table('locations').insert(newLocationData);

    // Check the insertId and if the data is correctly inserted
    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.locations).toContainEqual(expect.objectContaining(newLocationData));
  });
});
