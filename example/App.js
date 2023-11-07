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
    return this.hasOne(Group, 'group_id');
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
      group_id INTEGER,
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
  { name: 'Alice', group_id: 1 },
  { name: 'Bob', group_id: 2 },
  { name: 'Charlie', group_id: 1 },
];

export default function App() {

  const [people, setPeople] = useState([]);

  // Run migrations and seed data
  useEffect(() => {
    (async() => {
      await runMigrations(migrations);
      await Group.seed(groupSeedData);
      await Person.seed(peopleSeedData);

      const people = await Person.get();
      // setPeople(people);
      console.log(people);
    })();
  }, [])

  return (
    <View style={styles.container}>
      <Text>People:</Text>
      {!!people.length && people.map(person => (
        <Text key={person.id}>{person.name} - {person.group.name}</Text>
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
