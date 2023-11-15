// @ts-nocheck
import { Person } from '../__mocks__/Person';
import { Group } from '../__mocks__/Group';
import { mockDataStore, resetMockDataStore } from '../__mocks__/mockDataStore';

describe('belongsToMany relationship', () => {
  beforeEach(() => {
    resetMockDataStore();
  });

  it('should retrieve related groups for a given person', async () => {
    const person = await Person.with('groups').find(1);

    console.log('person', person);

    expect(person.groups).toHaveLength(1);
    expect(person.groups[0]).toBeInstanceOf(Group);
  });

  // it('should use the joining table correctly', async () => {
  //   const person = await Person.with('groups').find(1);

  //   const groupIds = person.groups.map(group => group.id);
  //   const expectedGroupIds = mockDataStore.groups_people
  //                          .filter(gp => gp.personId === 1)
  //                          .map(gp => gp.groupId);

  //   expect(groupIds.sort()).toEqual(expectedGroupIds.sort());
  // });

  // it('should handle cases with no related groups', async () => {
  //   const person = await Person.find(4);

  //   expect(person.groups).toHaveLength(0);
  // });

  // it('should retrieve related groups for a given person using get()', async () => {
  //   const people = await Person.with('groups').get();
  //   const person = people.find(p => p.id === 1);

  //   expect(person.groups).toHaveLength(1);
  //   expect(person.groups[0]).toBeInstanceOf(Group);
  // });

  // it('should return all people with their related groups', async () => {
  //   const people = await Person.with('groups').get();

  //   for (const person of people) {
  //     const expectedGroups = mockDataStore.groups_people
  //       .filter(gp => gp.personId === person.id)
  //       .map(gp => mockDataStore.groups.find(group => group.id === gp.groupId));

  //       console.log('person', person);
  //       console.log('expectedGroups', expectedGroups);

  //     // for(let i = 0; i < person.groups.length; i++) {
  //     //   expect(expectedGroups[i]).toContainEqual(expect.objectContaining(person.groups[i]));
  //     // }

  //     expect(person.groups.length).toEqual(expectedGroups.length);
  //   }
  // });

  // it('should handle cases with no related groups using get()', async () => {
  //   const people = await Person.with('groups').get();
  //   const personWithoutGroups = people.find(p => p.groups.length === 0);

  //   expect(personWithoutGroups).toBeDefined();
  //   expect(personWithoutGroups.groups).toHaveLength(0);
  // });
});
