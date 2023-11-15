// @ts-nocheck
import { Person } from '../__mocks__/Person';
import { Location } from '../__mocks__/Location';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('belongsTo', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve related location using belongsTo relationship', async () => {
    // Retrieve a person from the data store
    const person = new Person(mockDataStore.people[0]);

    // Retrieve the related location using belongsTo
    const relatedLocation = await person.belongsTo(Location, 'locationId');

    // Find the expected location from the data store
    const expectedLocation = mockDataStore.locations.find(location => location.id === person.locationId);

    // Check if the relatedLocation matches the expectedLocation
    expect(relatedLocation).toEqual(expectedLocation);
  });

  it('should return null if no related location found', async () => {
    // Create a mock person without a related location
    const person = new Person(mockDataStore.people[0]);
    person.locationId = 999;

    // Retrieve the related location using belongsTo
    const relatedLocation = await person.belongsTo(Location, 'locationId');

    // Check if relatedLocation is null
    expect(relatedLocation).toBeNull();
  });

  it('should load related location for a person using find', async () => {
    const personId = 1; // Assuming this ID exists in your mockDataStore
    const person = await Person.with('location').find(personId);

    expect(person).toBeDefined();
    expect(person.location).toBeDefined();
    const expectedLocation = mockDataStore.locations.find(location => location.id === person.locationId);
    expect(person.location.length).toEqual(expectedLocation.length);
  });

  it('should load related locations for people using get', async () => {
    const people = await Person.with('location').get();

    expect(Array.isArray(people)).toBe(true);
    people.forEach(person => {
      const expectedLocation = mockDataStore.locations.find(location => location.id === person.locationId);
      expect(person.location.length).toEqual(expectedLocation.length);
    });
  });
  
});