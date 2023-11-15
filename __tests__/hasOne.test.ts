// hasOne.test.ts
import { Person } from '../__mocks__/Person';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('hasOne', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve the related location for a person', async () => {
    // Retrieve a person from the data store
    const person = new Person(mockDataStore.people[0]);

    // Load the related location for the person
    const relatedLocation = await person.location();
    console.log('relatedLocation', relatedLocation)

    // Find the expected location from the data store
    const expectedLocation = mockDataStore.locations.find(location => location.id === person.locationId);

    // Check if the relatedLocation matches the expectedLocation
    expect(relatedLocation).toEqual(expectedLocation);
  });

  it('should return null if no related location is found', async () => {
    // Create a mock person with a non-existing locationId
    const person = new Person({ ...mockDataStore.people[0], locationId: 999 });

    // Access the related location for the person
    const relatedLocation = await person.location();

    // Check if relatedLocation is null
    expect(relatedLocation).toBeNull();
  });
});
