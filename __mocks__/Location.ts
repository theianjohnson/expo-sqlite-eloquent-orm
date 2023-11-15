// @ts-nocheck
import { Model } from '../src/Model';
import { Person } from './Person';

export class Location extends Model {
  static tableName = 'locations';
  static withTimestamps = false;

  people() {
    return this.hasMany(Person);
  }
}