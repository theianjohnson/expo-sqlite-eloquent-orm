// @ts-nocheck
let initialData = {
  people: [
    { id: 1, name: 'Nora', age: 31, locationId: 1 },
    { id: 2, name: 'Alice', age: 25, locationId: 2 },
    { id: 3, name: 'Bob', age: 30, locationId: 3 },
    { id: 4, name: 'Ellie', age: 22, locationId: 1 },
  ],
  groups: [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Coworkers' },
  ],
  locations: [
    { id: 1, name: 'Seattle, WA' },
    { id: 2, name: 'Phoenix, AZ' },
    { id: 3, name: 'Istanbul, Turkey' },
  ],
  groups_people: [
    { groupId: 1, personId: 1 },
    { groupId: 1, personId: 4 },
    { groupId: 2, personId: 2 },
    { groupId: 2, personId: 3 },
  ],
};

export let mockDataStore = { ...initialData };

export function resetMockDataStore() {
  mockDataStore = JSON.parse(JSON.stringify(initialData));
}

export function clearMockDataStore(table: string) {
  mockDataStore = JSON.parse(JSON.stringify(initialData));
}