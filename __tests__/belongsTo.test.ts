// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('belongsTo', () => {
  it('should retrieve related group using belongsTo relationship', async () => {
    // Retrieve a person from the data store
    const mockPerson = new MockPerson(mockDataStore.people[0]);

    // Retrieve the related group using belongsTo
    const relatedGroup = await mockPerson.belongsTo(MockGroup, 'groupId');

    // Find the expected group from the data store
    const expectedGroup = mockDataStore.groups.find(group => group.id === mockPerson.groupId);

    // Check if the relatedGroup matches the expectedGroup
    expect(relatedGroup).toEqual(expectedGroup);
  });

  it('should return null if no related group found', async () => {
    // Create a mock person without a related group
    const mockPerson = new MockPerson(mockDataStore.people[0]);
    mockPerson.groupId = 999;

    // Retrieve the related group using belongsTo
    const relatedGroup = await mockPerson.belongsTo(MockGroup, 'groupId');

    // Check if relatedGroup is null
    expect(relatedGroup).toBeNull();
  });
});