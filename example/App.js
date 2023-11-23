import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Model, Migration } from './local-version-of-expo-sqlite-eloquent-orm';

// Define some models
class Group extends Model {
  static withTimestamps = false;

  people() {
    return this.belongsToMany(Person);
  }
}

class Location extends Model {
  static withTimestamps = false;

  people() {
    return this.hasMany(Person);
  }
}

class Person extends Model {
  static tableName = 'people';
  static $casts = {
    age: 'number',
  };

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
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
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
    { groupId: 3, personId: 4 },
    { groupId: 2, personId: 1 },
    { groupId: 3, personId: 2 },
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

  const [newGroupPeople, setNewGroupPeople] = useState(null);

  const [triggerRerender, setTriggerRerender] = useState(false);

  // Run the first time
  useEffect(() => {
    (async() => {
      await Migration.runMigrations(migrations);
      await seedDatabase();
    })();
  }, []);

  // Run whenever we trigger rerender so we can see what deleting and recreating the database does
  useEffect(() => {
    (async() => {
      const location = await Location.with('people').find(1);
      setLocation(location);

      const locations = await Location.with('people').get();
      setLocations(locations);

      const people = await Person.with('location').with('groups').get();
      setPeople(people);

      const person = await Person.with('groups').where('name', 'Nora').first();
      setPerson(person);

      const newGroup = new Group();
      setNewGroupPeople(newGroup.people);
    })();
  }, [triggerRerender]);

  const resetDatabase = async () => {
    await Model.resetDatabase();
    await Migration.runMigrations(migrations);
    setTriggerRerender(val => !val);
  }

  const seedDatabase = async () => {
    await Group.seed(seedData.groups);
    await Location.seed(seedData.locations);
    await Person.seed(seedData.people);

    // You can also use the base Model class and provide the table name manually
    await Model.table('groups_people').seed(seedData.groups_people);

    setTriggerRerender(val => !val);
  }

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
        <Text key={person.id}>{person.name} - {person?.location?.name} - {!!person?.groups?.length && person.groups.map(group => group.name).join(', ')}</Text>
      ))}

      <View style={{ height: 10 }} />

      <Text>Person:</Text>
      {!!person && (
        <Text>{person.name} - {JSON.stringify(person.groups?.[0])}</Text>
      )}

      <View style={{ height: 10 }} />

      <Button onPress={resetDatabase} title="Reset Database" />
      <Button onPress={seedDatabase} title="Re-seed Database" />

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
