// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('belongsToMany relationship', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve related groups for a given person', async () => {
    const person = await MockPerson.find(1); // Assuming 1 is a valid ID
    const groups = await person.belongsToMany(MockGroup, 'groups_people', 'personId', 'groupId');

    expect(groups).toHaveLength(2); // Assuming person with ID 1 belongs to 2 groups
    expect(groups[0]).toBeInstanceOf(MockGroup);
    expect(groups[1]).toBeInstanceOf(MockGroup);
  });

  it('should use the joining table correctly', async () => {
    const person = await MockPerson.find(1);
    const groups = await person.belongsToMany(MockGroup, 'groups_people', 'personId', 'groupId');

    const groupIds = groups.map(group => group.id);
    const expectedGroupIds = mockDataStore.groups_people
                           .filter(gp => gp.personId === 1)
                           .map(gp => gp.groupId);

    expect(groupIds.sort()).toEqual(expectedGroupIds.sort());
  });

  it('should handle cases with no related groups', async () => {
    const person = await MockPerson.find(4); // Assuming 4 is a valid ID with no groups
    const groups = await person.belongsToMany(MockGroup, 'groups_people', 'personId', 'groupId');

    expect(groups).toHaveLength(0);
  });
});
