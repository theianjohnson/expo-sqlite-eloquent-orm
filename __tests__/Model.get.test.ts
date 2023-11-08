import { Model } from '../src/Model';

// Assuming that Model is a generic class that can be extended by specific models
class Person extends Model {
  static tableName = 'people';
}

class Group extends Model {
  static tableName = 'groups';
}

describe('Model get method', () => {
  test('should retrieve all instances of a model', async () => {
    const people = await Person.get();
    expect(people.length).toBe(3);
    expect(people[0].name).toBeDefined();
    expect(people[1].name).toBeDefined();
    expect(people[2].name).toBeDefined();
  });

  test('should retrieve all instances of another model', async () => {
    const groups = await Group.get();
    expect(groups.length).toBe(3);
    expect(groups[0].name).toBeDefined();
    expect(groups[1].name).toBeDefined();
    expect(groups[2].name).toBeDefined();
  });

  test('should apply where clause when provided', async () => {
    const person = await Person.where('name', '=', 'Nora').first();
    expect(person).toBeDefined();
    expect(person!.name).toBe('Nora');
  });

  test('should return null when no matching records are found', async () => {
    const person = await Person.where('name', '=', 'Nonexistent').first();
    expect(person).toBeNull();
  });

  test('should handle complex queries with multiple where clauses', async () => {
    // This assumes your mock and Model class can handle multiple where clauses
    const person = await Person.where('name', '=', 'Nora').where('group_id', '=', 1).first();
    expect(person).toBeDefined();
    expect(person!.name).toBe('Nora');
    expect(person!.group_id).toBe(1);
  });

  // Add more tests as needed to cover the functionality you want to ensure works correctly
});
