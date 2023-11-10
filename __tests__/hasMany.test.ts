// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockLocation } from '../__mocks__/MockLocation';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('hasMany', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve all people associated with a given location', async () => {
    // Assuming location with id 1 exists
    const location = MockLocation.with('people').find(1);
console.log('location', location)
    // Expected people from mockDataStore
    const expectedPeople = mockDataStore.people.filter(person => person.locationId === location.id);
console.log('expectedPeople', expectedPeople)
    // Comparing the retrieved people with expected people
    expect(location.people).toEqual(expectedPeople);
  });

  it('should return an empty array if no people are associated with the location', async () => {
    // Create a mock location with an id that doesn't have associated people
    const location = MockLocation.find(999);

    // Expecting an empty array
    expect(location.people).toEqual(undefined);
  });
});
