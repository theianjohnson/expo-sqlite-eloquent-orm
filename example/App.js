import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Model, runMigrations } from './local-version-of-expo-sqlite-eloquent-orm';

// Define some models
class Group extends Model {
  static tableName = 'groups';

  people() {
    return this.hasMany(Person, 'group_id');
  }
}

class Person extends Model {
  static tableName = 'people';

  group() {
    return this.belongsTo(Group, 'group_id');
  }
}

// Define migrations
const migrations = {
  '1699142747_init_groups': `
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      name TEXT
    );
  `,
  '1699142749_init_people': `
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      group_id INTEGER NOT NULL,
      name TEXT
    );
  `,
}

// Seed data
const groupSeedData = [
  { name: 'Coworkers' },
  { name: 'Family' },
  { name: 'Friends' },
];

const peopleSeedData = [
  { name: 'Nora', group_id: 1 },
  { name: 'Bob', group_id: 2 },
  { name: 'Charlie', group_id: 1 },
];

export default function App() {

  const [groups, setGroups] = useState([]);
  const [people, setPeople] = useState([]);

  // Run migrations and seed data
  useEffect(() => {
    (async() => {
      await runMigrations(migrations);
      await Group.seed(groupSeedData);
      await Person.seed(peopleSeedData);

      const groups = await Group.with('people').get();
      setGroups(groups);
      console.log('App.js groups', groups);

      const people = await Person.with('group').get();
      setPeople(people);
      console.log('People', people);
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
