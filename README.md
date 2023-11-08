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

## Quick Start

To get started with `expo-sqlite-eloquent-orm`, you'll need to define your models and perform basic CRUD operations.

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
    return this.hasOne(Profile, 'user_id');
  }
}

class Profile extends Model {
  // ...
}

const user = await User.find(1);
const userProfile = await user.profile();
```

### One-to-Many Relationship

To define a one-to-many relationship, use the `hasMany` method. For instance, if each `User` can have multiple `Post` records:

```javascript
class User extends Model {
  // ...
  
  async posts() {
    return this.hasMany(Post, 'user_id');
  }
}

class Post extends Model {
  // ...
}

const user = await User.find(1);
const userPosts = await user.posts();
```

### Many-to-One Relationship

To define a many-to-one relationship, use the `belongsTo` method. For example, if each `Post` belongs to a single `User`:

```javascript
class Post extends Model {
  // ...
  
  async user() {
    return this.belongsTo(User, 'user_id');
  }
}

class User extends Model {
  // ...
}

const post = await Post.find(1);
const postUser = await post.user();
````

## Migrations

`expo-sqlite-eloquent-orm` provides a migration system to manage your database schema and versioning. You can define migrations to create and modify tables in a structured manner.

### Running Migrations

To run migrations, you need to create migration files and then execute them. You can use the `Migration` class to handle migrations. Here's an example of how to create and run migrations:

```javascript
import { Migration } from 'expo-sqlite-eloquent-orm';

// Define your migration scripts
const migrations = {
  '1.0.0': `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    );
  `,
  '1.1.0': `
    ALTER TABLE users ADD COLUMN active BOOLEAN;
  `,
};

// Run migrations
Migration.runMigrations(migrations)
  .then(() => {
    console.log('Migrations completed successfully.');
  })
  .catch((error) => {
    console.error('Error running migrations:', error);
  });
```