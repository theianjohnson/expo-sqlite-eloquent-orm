import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Model, Migration } from './local-version-of-expo-sqlite-eloquent-orm';

// Define some models
class Group extends Model {
  static tableName = 'groups';
  static withTimestamps = false;

  people() {
    return this.hasMany(Person, 'groupId');
  }
}

class Person extends Model {
  static tableName = 'people';

  group() {
    return this.belongsTo(Group, 'groupId');
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
  '1699142749_init_people': `
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      groupId INTEGER NOT NULL,
      name TEXT
    );
  `,
}

// Seed data
const groupSeedData = [
  { id: 1, name: 'Family' },
  { id: 2, name: 'Friends' },
  { id: 3, name: 'Coworkers' }
];

const peopleSeedData = [
  { id: 1, name: 'Nora', groupId: 1 },
  { id: 2, name: 'Alice', groupId: 2 },
  { id: 3, name: 'Bob', groupId: 2 },
  { id: 4, name: 'Ellie', groupId: 1 }
];

export default function App() {

  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState([]);
  const [person, setPerson] = useState(null);

  // Run migrations and seed data
  useEffect(() => {
    (async() => {
      await Migration.runMigrations(migrations);
      await Group.seed(groupSeedData);
      await Person.seed(peopleSeedData);

      const groups = await Group.with('people').get();
      setGroups(groups);
      console.log('App.js groups', groups);
      console.log('App.js groups[0].people()', groups[0].people);

      const people = await Person.with('group').get();
      setPeople(people);
      console.log('People', people);

      const person = await Person.find(1);
      // await person.update({name: 'Nora II'});
      setPerson(person);
      console.log('Person', person);
    })();
  }, [])

  return (
    <View style={styles.container}>

      <Text>Groups:</Text>
      {!!groups.length && groups.map(group => (
        <Text key={group.id}>{group.name} - {!!group?.people?.length && group.people.map(person => person.name).join(', ')}</Text>
      ))}

      <View style={{ height: 10 }} />

      <Text>People:</Text>
      {!!people.length && people.map(person => (
        <Text key={person.id}>{person.name} - {person?.group?.name}</Text>
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
