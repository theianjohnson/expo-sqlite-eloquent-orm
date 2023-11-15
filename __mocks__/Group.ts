// @ts-nocheck
import { Model } from '../src/Model';
import { Person } from './Person';

export class Group extends Model {
  static tableName = 'groups';
  static withTimestamps = false;

  people() {
    return this.belongsToMany(Person);
  }
}