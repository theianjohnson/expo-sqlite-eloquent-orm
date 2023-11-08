import { Model } from '../src/Model';
import { MockPerson } from './MockPerson';

export class MockGroup extends Model {
  static tableName = 'groups';

  people() {
    const MockPersonInstance = new MockPerson() as unknown as Model;
    return this.belongsTo(MockPersonInstance, 'groupId');
  }
}