import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Model, Migration } from './local-version-of-expo-sqlite-eloquent-orm';

// Define some models
class Group extends Model {
  static tableName = 'groups';
  static withTimestamps = false;

  people() {
    return this.belongsToMany(Person);
  }
}

class Location extends Model {
  static tableName = 'locations';
  static withTimestamps = false;

  people() {
    return this.hasMany(Person);
  }
}

class Person extends Model {
  static tableName = 'people';

  location() {
    return this.belongsTo(Location);
  }

  groups() {
    return this.belongsToMany(Group);
  }
}

// Define migrations
const migrations = {
  '1699142747_init_groups': `
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT
    );
  `,
  '1699142748_init_groups_people': `
    CREATE TABLE IF NOT EXISTS groups_people (
      id INTEGER PRIMARY KEY NOT NULL,
      groupId INTEGER NOT NULL,
      personId INTEGER NOT NULL
    );
  `,
  '1699142749_init_locations': `
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT
    );
  `,
  '1699142750_init_people': `
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      locationId INTEGER NOT NULL,
      name TEXT,
      age INTEGER
    );
  `,
}

// Seed data
const seedData = {
  groups: [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Coworkers' },
  ],
  groups_people: [
    { groupId: 1, personId: 1 },
    { groupId: 1, personId: 4 },
    { groupId: 2, personId: 2 },
    { groupId: 2, personId: 3 },
  ],
  locations: [
    { id: 1, name: 'Seattle, WA' },
    { id: 2, name: 'Phoenix, AZ' },
    { id: 3, name: 'Istanbul, Turkey' },
  ],
  people: [
    { id: 1, name: 'Nora', age: 31, locationId: 1 },
    { id: 2, name: 'Alice', age: 25, locationId: 2 },
    { id: 3, name: 'Bob', age: 30, locationId: 3 },
    { id: 4, name: 'Ellie', age: 22, locationId: 1 },
  ],
}

export default function App() {

  // const [groups, setGroups] = useState([]);
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [people, setPeople] = useState([]);
  const [person, setPerson] = useState(null);

  // Run migrations and seed data
  useEffect(() => {
    (async() => {
      await Migration.runMigrations(migrations);
      await Group.seed(seedData.groups);
      await Location.seed(seedData.locations);
      await Person.seed(seedData.people);

      // You can also use the base Model class and provide the table name manually
      // await Model.table('groups_people').seed(seedData.groups_people);

      const location = await Location.with('people').find(1);
      setLocation(location);

      const locations = await Location.with('people').get();
      setLocations(locations);

      const people = await Person.with('location').get();
      setPeople(people);
      console.log(people)

      const person = await Person.where('name', 'Nora').first();
      setPerson(person);
    })();
  }, [])

  return (
    <View style={styles.container}>
      <Text>Location:</Text>
      {!!location && (
        <Text>{location.name} - {!!location?.people?.length && location.people.map(person => person.name).join(', ')}</Text>
      )}

      <View style={{ height: 10 }} />

      <Text>Locations:</Text>
      {!!locations.length && locations.map(location => (
        <Text key={location.id}>{location.name} - {!!location?.people?.length && location.people.map(person => person.name).join(', ')}</Text>
      ))}

      <View style={{ height: 10 }} />

      <Text>People:</Text>
      {!!people.length && people.map(person => (
        <Text key={person.id}>{person.name} - {person?.location?.name}</Text>
      ))}

      <View style={{ height: 10 }} />

      <Text>Person:</Text>
      {!!person && (
        <Text>{person.name}</Text>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
