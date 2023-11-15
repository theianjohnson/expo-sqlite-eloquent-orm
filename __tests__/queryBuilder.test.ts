// @ts-nocheck
import { Model } from '../src/Model';
import { Person } from '../__mocks__/Person';
import { Group } from '../__mocks__/Group';

describe('Query Building Methods', () => {

  describe('table', () => {
    it('should create a new instance with the table clause', () => {
      const model = Model.table('person');
      expect(model.tableName).toBe('person');
    });
  });

  describe('select', () => {
    it('should create a new instance with the select clause', () => {
      const person = Person.select('name, age');
      expect(person.__private.clauses.select).toBe('name, age');
    });
  });

  describe('where', () => {
    it('should append a where clause', () => {
      const person = Person.where('age', '>', 30);
      expect(person.__private.clauses.where).toEqual([{ column: 'age', operator: '>', value: 30 }]);
    });

    it('should handle a where clause with only two parameters', () => {
      const person = Person.where('age', 30);
      expect(person.__private.clauses.where).toEqual([{ column: 'age', operator: '=', value: 30 }]);
    });

    it('should handle multiple where clauses', () => {
      const person = Person.where('age', '>', 30).where('name', 'LIKE', 'John%');
      expect(person.__private.clauses.where).toEqual([
        { column: 'age', operator: '>', value: 30 },
        { column: 'name', operator: 'LIKE', value: 'John%' },
      ]);
    });
  });

  describe('orderBy', () => {
    it('should set the orderBy clause', () => {
      const person = Person.orderBy('age', 'DESC');
      expect(person.__private.clauses.orderBy).toEqual({ column: 'age', direction: 'DESC' });
    });
  });

  describe('limit', () => {
    it('should set the limit clause', () => {
      const person = Person.limit(10);
      expect(person.__private.clauses.limit).toBe(10);
    });
  });

  describe('with', () => {
    it('should append a relation to withRelations', () => {
      const group = Group.with('people');
      expect(group.__private.clauses.withRelations).toContain('people');
    });
  });
});
