// @ts-nocheck
import { Model } from '../src/Model';
import { MockGroup } from './MockGroup';

export class MockPerson extends Model {
  static tableName = 'people';
  static casts = {
    age: 'number',
    isAdult: 'boolean',
  };

  group() {
    const MockGroupInstance = new MockGroup() as unknown as Model;
    return this.belongsTo(MockGroupInstance, 'groupId');
  }
}