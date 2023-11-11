// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('belongsToMany relationship', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve related groups for a given person', async () => {
    const person = await MockPerson.with('groups').find(1);
    console.log(person);

    expect(person.groups).toHaveLength(1);
    expect(person.groups[0]).toBeInstanceOf(MockGroup);
  });

  it('should use the joining table correctly', async () => {
    const person = await MockPerson.with('groups').find(1);

    const groupIds = person.groups.map(group => group.id);
    const expectedGroupIds = mockDataStore.groups_people
                           .filter(gp => gp.personId === 1)
                           .map(gp => gp.groupId);

    expect(groupIds.sort()).toEqual(expectedGroupIds.sort());
  });

  it('should handle cases with no related groups', async () => {
    const person = await MockPerson.find(4);

    expect(person.groups).toHaveLength(0);
  });
});
