// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore } from '../__mocks__/mockDataStore';

const originalMockDataStore = {...mockDataStore};

describe('insert', () => {
  beforeEach(() => {
    mockDataStore = {...originalMockDataStore};
  });

  it('should create a new person and save', async () => {
    const newPerson = new MockPerson({ name: 'John', groupId: 1 });
    const expectedInsertId = mockDataStore.people.length + 1;

    const result = await newPerson.save();

    expect(result.insertId).toBe(expectedInsertId);
    expect(mockDataStore.people).toContainEqual(expect.objectContaining(newPerson));
  });

  it('should insert a new person record into the database statically', async () => {
    const newPersonData = { name: 'John', groupId: 1 };
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
