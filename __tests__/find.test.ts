// find.test.ts
import { Location } from '../__mocks__/Location';
import { Person } from '../__mocks__/Person';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('Model find method', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve a single location by ID', async () => {
    const locationId = 1;
    const location = await Location.find(locationId);

    expect(location).toBeDefined();
    expect(location.id).toBe(locationId);
  });

  it('should load related people for a location', async () => {
    const locationId = 1;
    const location = await Location.with('people').find(locationId);

    expect(location.people).toBeDefined();
    expect(Array.isArray(location.people)).toBe(true);

    // Check if the related people match those in the mockDataStore
    const expectedPeople = mockDataStore.people.filter(p => p.locationId === locationId);
    expect(location.people.length).toEqual(expectedPeople.length);
  });
});
