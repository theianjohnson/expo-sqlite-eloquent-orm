// @ts-nocheck
import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('update', () => {
  it('should update a record with the given attributes', async () => {
    const modelInstance = await MockPerson.where('name', 'Nora').first();
    const updatedAttributes = { name: 'Eleanor' };
    await modelInstance.update(updatedAttributes);
    expect(mockDataStore.people[0].name).toBe('Eleanor');
  });

  it('should update the updatedAt timestamp', async () => {
    const modelInstance = await MockPerson.find(1);
    await modelInstance.update({ name: 'Eleanor' });
    const updatedModel = mockDataStore.people.find(p => p.id === 1);
    expect(updatedModel.updatedAt).not.toBe('2023-11-08T17:24:18.385Z');
  });
});
