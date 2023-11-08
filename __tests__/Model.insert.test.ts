// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('Model insert method', () => {
  it('should insert a new person record into the database', async () => {
    const newPersonData = { name: 'John', group_id: 1 };
    const expectedInsertId = mockDataStore.people.length + 1;

    const result = await MockPerson.insert(newPersonData);

    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.people).toContainEqual(expect.objectContaining(newPersonData));
  });

  it('should insert a new group record into the database', async () => {
    const newGroupData = { name: 'New Group' };
    const expectedInsertId = mockDataStore.groups.length + 1;

    const result = await MockGroup.insert(newGroupData);

    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.groups).toContainEqual(expect.objectContaining(newGroupData));
  });
});
