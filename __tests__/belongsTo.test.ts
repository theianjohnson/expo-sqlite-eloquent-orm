// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockLocation } from '../__mocks__/MockLocation';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('belongsTo', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve related location using belongsTo relationship', async () => {
    // Retrieve a person from the data store
    const mockPerson = new MockPerson(mockDataStore.people[0]);

    // Retrieve the related location using belongsTo
    const relatedLocation = await mockPerson.belongsTo(MockLocation, 'locationId');

    // Find the expected location from the data store
    const expectedLocation = mockDataStore.locations.find(location => location.id === mockPerson.locationId);

    // Check if the relatedLocation matches the expectedLocation
    expect(relatedLocation).toEqual(expectedLocation);
  });

  it('should return null if no related location found', async () => {
    // Create a mock person without a related location
    const mockPerson = new MockPerson(mockDataStore.people[0]);
    mockPerson.locationId = 999;

    // Retrieve the related location using belongsTo
    const relatedLocation = await mockPerson.belongsTo(MockLocation, 'locationId');

    // Check if relatedLocation is null
    expect(relatedLocation).toBeNull();
  });

  it('should load related location for a person using find', async () => {
    const personId = 1; // Assuming this ID exists in your mockDataStore
    const person = await MockPerson.with('location').find(personId);

    expect(person).toBeDefined();
    expect(person.location).toBeDefined();
    const expectedLocation = mockDataStore.locations.find(location => location.id === person.locationId);
    expect(person.location).toEqual(expectedLocation);
  });

  it('should load related locations for people using get', async () => {
    const people = await MockPerson.with('location').get();

    expect(Array.isArray(people)).toBe(true);
    people.forEach(person => {
      const expectedLocation = mockDataStore.locations.find(location => location.id === person.locationId);
      expect(person.location).toEqual(expectedLocation);
    });
  });
  
});