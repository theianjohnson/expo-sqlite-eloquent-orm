// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('hasMany', () => {
  it('should retrieve related people using hasMany relationship', async () => {
    // Retrieve a group from the data store
    const mockGroup = new MockGroup(mockDataStore.groups[0]);

    // Retrieve the related people using hasMany
    const relatedPeople = await mockGroup.hasMany(MockPerson, 'groupId');

    // Find the expected people from the data store
    const expectedPeople = mockDataStore.people.filter(person => person.groupId === mockGroup.id);

    // Check if the relatedPeople array matches the expectedPeople array
    expect(relatedPeople).toEqual(expectedPeople);
  });

  it('should return an empty array if no related people found', async () => {
    // Create a mock group without related people
    const mockGroup = new MockGroup(mockDataStore.groups[0]);
    mockGroup.id = 999; // Set an invalid ID to ensure no related people are found

    // Retrieve the related people using hasMany
    const relatedPeople = await mockGroup.hasMany(MockPerson, 'groupId');

    // Check if relatedPeople is an empty array
    expect(relatedPeople).toEqual([]);
  });
});
