// @ts-nocheck
import { Model } from '../src/Model';
import { MockGroup } from './MockGroup';

export class MockPerson extends Model {
  static tableName = 'people';
  static casts = {
    age: 'number',
    isAdult: 'boolean',
  };

  location() {
    const MockLocationInstance = new MockLocation() as unknown as Model;
    return this.hasOne(MockLocationInstance, 'locationId');
  }

  groups() {
    const MockGroupInstance = new MockGroup() as unknown as Model;
    return this.belongsToMany(MockGroupInstance, 'groupId');
  }
}