// @ts-nocheck
import { Model } from '../src/Model';
import { MockPerson } from './MockPerson';

export class MockGroup extends Model {
  static tableName = 'groups';
  static withTimestamps = false;

  people() {
    // const MockPersonInstance = new MockPerson() as Model;
    return this.belongsToMany(MockPerson, 'groups_people', 'groupId', 'personId');
  }
}