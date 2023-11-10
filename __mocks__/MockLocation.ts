// @ts-nocheck
import { Model } from '../src/Model';
import { MockPerson } from './MockPerson';

export class MockLocation extends Model {
  static tableName = 'locations';
  static withTimestamps = false;

  people() {
    const MockPersonInstance = new MockPerson() as unknown as Model;
    return this.hasMany(MockPersonInstance);
  }
}