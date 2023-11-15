// @ts-nocheck
import { Model } from '../src/Model';
import { Group } from './Group';
import { Location } from './Location';

export class Person extends Model {
  static tableName = 'people';
  static casts = {
    age: 'number',
    isAdult: 'boolean',
  };

  location() {
    return this.belongsTo(Location);
  }

  groups() {
    return this.belongsToMany(Group);
  }
}