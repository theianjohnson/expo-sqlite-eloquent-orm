# Expo SQLite Eloquent ORM

Expo SQLite Eloquent ORM is a lightweight Object-Relational Mapping (ORM) wrapper for the `expo-sqlite` module, designed to provide a fluent and intuitive API for handling database operations in React Native applications. Inspired by Laravel's Eloquent, this library simplifies the process of interacting with SQLite databases by abstracting complex SQL queries into easy-to-understand JavaScript methods.

## Features

- Fluent query builder for SQLite databases
- Easy-to-use API for defining models and performing CRUD operations
- Automatic casting of attributes to specified data types
- Support for relationships and eager loading
- Migration system for database versioning and setup

## Installation

To install Expo SQLite Eloquent ORM, you need to have an Expo or React Native project set up. Then run:

```sh
npm install expo-sqlite-eloquent-orm
# or
yarn add expo-sqlite-eloquent-orm
```

## Run the Example App

* git clone expo-sqlite-eloquent-orm
* cd expo-sqlite-eloquent-orm/example
* npm run start
* Example code is all in the App.js file, https://github.com/theianjohnson/expo-sqlite-eloquent-orm/blob/main/example/App.js

## Model Class API

### Static Methods

| Method | Description | Return Type | Parameters |
| ------ | ----------- | ----------- | ---------- |
| `table` | Sets the table name for queries. | `Model` | `name: string` |
| `select` | Specifies the fields to select in a query. | `Model` | `fields: string \| string[]` |
| `join` | Adds a join clause to the query. | `Model` | `type: 'INNER' \| 'LEFT' \| 'RIGHT', table: string, firstKey: string, secondKey: string` |
| `where` | Adds a where clause to the query. | `Model` | `column: string, operatorOrValue: any, value?: any` |
| `orderBy` | Adds an order by clause to the query. | `Model` | `column: string, direction: 'ASC' \| 'DESC'` |
| `limit` | Sets a limit on the number of records returned. | `Model` | `number: number` |
| `with` | Specifies relations to include in the query results. | `Model` | `relation: string` |
| `find` | Finds a record by its ID. | `Promise<Model \| null>` | `id: number \| string` |
| `insert` | Inserts a new record into the database. | `Promise<SQLResult>` | `data: Record<string, any>` |
| `seed` | Seeds data into the database if the table is empty. | `Promise<void>` | `data: Array<Record<string, any>>` |
| `executeSql` | Executes a custom SQL query. | `Promise<SQLResult>` | `sql: string, params: any[]` |

### Instance Methods

| Method | Description | Return Type | Parameters |
| ------ | ----------- | ----------- | ---------- |
| `insert` | Instance method to insert a new record. | `Promise<SQLResult>` | `data: Record<string, any>` |
| `save` | Saves the current instance to the database. | `Promise<SQLResult>` | - |
| `delete` | Deletes the current instance from the database. | `Promise<SQLResult>` | - |
| `get` | Retrieves records based on the current query. | `Promise<Model[]>` | - |
| `first` | Retrieves the first record based on the current query. | `Promise<Model \| null>` | - |
| `update` | Updates the current instance in the database. | `Promise<SQLResult>` | `attributes: Partial<ModelAttributes>` |
| `hasOne` | Defines a has-one relationship. | `Promise<Model \| null>` | `relatedModel: Model, foreignKey?: string, localKey: string = 'id'` |
| `hasMany` | Defines a has-many relationship. | `Promise<Model[]>` | `relatedModel: Model, foreignKey?: string, localKey: string = 'id'` |
| `belongsTo` | Defines a belongs-to relationship. | `Promise<Model \| null>` | `relatedModel: Model, foreignKey: string, otherKey: string = 'id'` |
| `belongsToMany` | Defines a belongs-to-many relationship. | `Promise<Model[]>` | `relatedModel: typeof Model, joinTableName?: string, foreignKey?: string, otherKey?: string` |

### Types and Interfaces

- `Casts`: Record of attribute types (`'number' \| 'boolean' \| 'string' \| 'json'`).
- `Clauses`: Object representing different clauses in a query.
- `ModelAttributes`: Record of any type representing model attributes.
- `SQLResult`: Interface representing the result of an SQL query.

> Note: Some methods are simplified for brevity. Consult the source code for detailed implementation.

## Quick Start

To get started with `expo-sqlite-eloquent-orm`, you'll need to setup your initial migrations and define your models.

### Running Migrations

`expo-sqlite-eloquent-orm` provides a migration system to manage your database schema and versioning. You can define migrations to create and modify tables in a structured manner.

To run migrations, you need to create migration files and then execute them. You can use the `Migration` class to handle migrations. Here's an example of how to create and run migrations:

```javascript
import { Migration } from 'expo-sqlite-eloquent-orm';

// Define your migration scripts
const migrations = {
  '1699486848_init': `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    );
  `,
  '1699486885_updating_users_table': `
    ALTER TABLE users ADD COLUMN active BOOLEAN;
  `,
};

// Run migrations
try { 
  await Migration.runMigrations(migrations);
} catch(error) {
  console.error('Error running migrations:', error);
}
```

### Defining Models

Create models by extending the `Model` class. Specify your table name and any casts for attributes:

```javascript
import { Model } from 'expo-sqlite-eloquent-orm';

class User extends Model {
  static tableName = 'users';
  static casts = {
    id: 'number',
    active: 'boolean',
    // other attributes...
  };
  // Define relationships, custom methods, etc.
}
```

### Querying

Utilize model methods to perform queries:

```javascript
// Retrieve a user by ID
const user = await User.find(1);

// Get all users with a specific attribute
const activeUsers = await User.where('active', '=', true).get();

// Chain query methods for more complex queries
const specificUsers = await User.select(['id', 'name'])
                                .where('active', '=', true)
                                .orderBy('name', 'DESC')
                                .limit(10)
                                .get();


```

### Inserting Records

To insert new records into the database, create a new instance of your model with the desired attributes, and then call the `save` method:

```javascript
// Create a new user instance
const newUser = new User({
  name: 'John Doe',
  email: 'john@example.com',
  active: true
});

// Insert the new user into the database
await newUser.save();
```

### Updating Records

To update an existing record, retrieve the model instance, set the new attribute values, and then call the `save` method:

```javascript
// Retrieve a user by ID
const user = await User.find(1);

// Update attributes
user.name = 'Jane Doe';
user.email = 'jane.doe@example.com';

// Save the changes to the database
await user.save();
```

### Deleting Records

To delete a record from the database, retrieve the model instance and then call the `delete` method:

```javascript
// Retrieve a user by ID
const user = await User.find(1);

// Delete the user from the database
await user.delete();

// Delete all inactive users
await User.where('active', '=', false).delete();
```

## Relationships

`expo-sqlite-eloquent-orm` supports defining and using relationships between models, making it easy to work with related data.

### One-to-One Relationship

To define a one-to-one relationship between two models, you can use the `hasOne` method on the model that declares the relationship. For example, if you have a `User` model and a `Profile` model where each user has one profile:

```javascript
class User extends Model {
  // ...
  
  async profile() {
    return this.hasOne(Profile, 'userId');
  }
}

class Profile extends Model {
  // ...
}

const user = await User.find(1);

// Automatically loaded
const userProfile = user.profile;
```

### One-to-Many Relationship

To define a one-to-many relationship, use the `hasMany` method. For instance, if each `User` can have multiple `Post` records:

```javascript
class User extends Model {
  // ...
  
  async posts() {
    return this.hasMany(Post, 'userId');
  }
}

class Post extends Model {
  // ...
}

const user = await User.find(1);

// Automatically loaded
const userPosts = user.posts;
```

### Many-to-One Relationship

To define a many-to-one relationship, use the `belongsTo` method. For example, if each `Post` belongs to a single `User`:

```javascript
class Post extends Model {
  // ...
  
  async user() {
    return this.belongsTo(User, 'userId');
  }
}

class User extends Model {
  // ...
}

const post = await Post.find(1);

// Automatically loaded
const postUser = await post.user;
````

## To Do
[] Fix Typescript errors when defining models, ie "Class static side 'typeof Person' incorrectly extends base class static side 'typeof Model'."
[] Many to many attach/detach methods
[] Update .with() to accept an array of relationships
[] Add .create() that returns the created model (https://laravel.com/docs/10.x/eloquent#inserts)
[] whereRaw
[] Bulk eager loading, currently eager loading is n+1
[] Reactivity? Caching with automatic invalidation?