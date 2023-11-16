// save.test.ts
import { Model } from '../src/Model';
import { Person } from '../__mocks__/Person';
import { mockDataStore } from '../__mocks__/mockDataStore';

describe('save', () => {
  it('should save a new model instance', async () => {
    const newPerson = new Person({ name: 'New Person', age: 30 });
    await newPerson.save();
    expect(newPerson).toEqual(expect.objectContaining({ name: 'New Person', age: 30 }));
  });

  it('should update an existing model instance', async () => {
    const person = await Person.find(1);
    person.name = 'Updated Name';
    await person.save();
    expect(person.name).toBe('Updated Name');
  });

  it('should save a model with loaded relations', async () => {
    const person = await Person.with('location').find(1);
    person.name = 'Updated Name With Relation';
    await person.save();

    expect(person.name).toBe('Updated Name With Relation');
    expect(person.location).toBeDefined();
  });

  it('should save a model with unloaded relations', async () => {
    const person = new Person({ name: 'Person With Unloaded Relation', age: 25 });
    await person.save();
    const savedPerson = await Person.find(person.id);
    expect(savedPerson.name).toBe('Person With Unloaded Relation');
  });
});
