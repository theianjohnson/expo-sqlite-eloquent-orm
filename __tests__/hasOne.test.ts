// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockLocation } from '../__mocks__/MockLocation';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('hasOne', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve related person using hasOne relationship', async () => {
    // Retrieve a group from the data store
    const mockLocation = new MockLocation(mockDataStore.locations[0]);

    // Retrieve the related person using hasOne
    const relatedPerson = await mockLocation.hasOne(MockPerson, 'locationId');

    // Expect only one relatedPerson to be returned
    expect(Array.isArray(relatedPerson)).toBe(false);
    
    // Find the expected person from the data store
    const expectedPerson = mockDataStore.people.find(person => person.locationId === mockLocation.id);

    // Check if the relatedPerson matches the expectedPerson
    expect(relatedPerson).toEqual(expectedPerson);
  });

  it('should return null if no related person found', async () => {
    // Create a mock group without a related person
    const mockLocation = new MockLocation(mockDataStore.locations[0]);
    mockLocation.id = 999; // Set an invalid ID to ensure no related person is found

    // Retrieve the related person using hasOne
    const relatedPerson = await mockLocation.hasOne(MockPerson, 'locationId');

    // Check if relatedPerson is null
    expect(relatedPerson).toBeNull();
  });
});
