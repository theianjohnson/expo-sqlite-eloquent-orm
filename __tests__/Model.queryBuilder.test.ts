import { MockPerson } from '../__mocks__/MockPerson';
import { MockGroup } from '../__mocks__/MockGroup';

describe('Query Building Methods', () => {
  describe('select', () => {
    it('should create a new instance with the select clause', () => {
      const person = MockPerson.select('name, age');
      expect(person.clauses.select).toBe('name, age');
    });
  });

  describe('where', () => {
    it('should append a where clause', () => {
      const person = MockPerson.where('age', '>', 30);
      expect(person.clauses.where).toEqual([{ column: 'age', operator: '>', value: 30 }]);
    });

    it('should handle a where clause with only two parameters', () => {
      const person = MockPerson.where('age', 30);
      expect(person.clauses.where).toEqual([{ column: 'age', operator: '=', value: 30 }]);
    });

    it('should handle multiple where clauses', () => {
      const person = MockPerson.where('age', '>', 30).where('name', 'LIKE', 'John%');
      expect(person.clauses.where).toEqual([
        { column: 'age', operator: '>', value: 30 },
        { column: 'name', operator: 'LIKE', value: 'John%' },
      ]);
    });
  });

  describe('orderBy', () => {
    it('should set the orderBy clause', () => {
      const person = MockPerson.orderBy('age', 'DESC');
      expect(person.clauses.orderBy).toEqual({ column: 'age', direction: 'DESC' });
    });
  });

  describe('limit', () => {
    it('should set the limit clause', () => {
      const person = MockPerson.limit(10);
      expect(person.clauses.limit).toBe(10);
    });
  });

  describe('with', () => {
    it('should append a relation to withRelations', () => {
      const group = MockGroup.with('people');
      expect(group.clauses.withRelations).toContain('people');
    });
  });
});
