// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('Model hasOne', () => {
  it('should retrieve related person using hasOne relationship', async () => {
    // Retrieve a group from the data store
    const mockGroup = new MockGroup(mockDataStore.groups[0]);

    // Retrieve the related person using hasOne
    const relatedPerson = await mockGroup.hasOne(MockPerson, 'groupId');

    // Expect only one relatedPerson to be returned
    expect(Array.isArray(relatedPerson)).toBe(false);
    
    // Find the expected person from the data store
    const expectedPerson = mockDataStore.people.find(person => person.groupId === mockGroup.id);

    // Check if the relatedPerson matches the expectedPerson
    expect(relatedPerson).toEqual(expectedPerson);
  });

  it('should return null if no related person found', async () => {
    // Create a mock group without a related person
    const mockGroup = new MockGroup(mockDataStore.groups[0]);
    mockGroup.id = 999; // Set an invalid ID to ensure no related person is found

    // Retrieve the related person using hasOne
    const relatedPerson = await mockGroup.hasOne(MockPerson, 'groupId');

    // Check if relatedPerson is null
    expect(relatedPerson).toBeNull();
  });
});
