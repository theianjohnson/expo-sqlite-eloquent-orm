import * as SQLite from 'expo-sqlite';

export class Model {
  static db = SQLite.openDatabase('app.db');
  static tableName = '';
  static casts = {};

  constructor(attributes = {}) {
    Object.assign(this, attributes);
    this.clauses = {
      select: '*',
      where: [],
      orderBy: null,
      limit: null,
      withRelations: [],
    };
  }

  // Instance methods for query building
  select(fields = '*') {
    this.clauses.select = Array.isArray(fields) ? fields.join(', ') : fields;
    return this;
  }

  where(column, operator, value) {
    if (value === undefined) {
      value = operator;
      operator = '=';
    }
    this.clauses.where.push({ column, operator, value });
    return this;
  }

  orderBy(column, direction = 'ASC') {
    this.clauses.orderBy = { column, direction };
    return this;
  }

  limit(number) {
    this.clauses.limit = number;
    return this;
  }

  with(relation) {
    this.clauses.withRelations.push(relation);
    return this;
  }

  // Static methods that proxy to instance methods
  static select(fields = '*') {
    return new this().select(fields);
  }

  static where(column, operator, value) {
    return new this().where(column, operator, value);
  }

  static orderBy(column, direction = 'ASC') {
    return new this().orderBy(column, direction);
  }

  static limit(number) {
    return new this().limit(number);
  }

  static with(relation) {
    const instance = new this().with(relation);
    console.log(instance.constructor.name, 'with', relation); // Check what the instance looks like
    return instance;
  }

  // Cast an attribute to the specified type
  castAttribute(key, value) {
    if (this.constructor.casts[key]) {
      switch (this.constructor.casts[key]) {
        case 'number':
          return Number(value);
        case 'boolean':
          return Boolean(value);
        case 'string':
          return String(value);
        case 'json':
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        // Add other types as needed
        default:
          return value;
      }
    }
    return value;
  }

  prepareAttributeForStorage(key, value) {
    if (this.constructor.casts[key]) {
      switch (this.constructor.casts[key]) {
        case 'json':
          return JSON.stringify(value);
        // Add other types as needed
        default:
          return value;
      }
    }
    return value;
  }

  // Instance method to get a clean object for output
  cleanObject(object) {
    delete object.clauses;
    return object;
  }

  // Instance methods
  async save() {
    const now = new Date().toISOString();
    const fields = Object.keys(this).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    const values = fields.map(field => this[field]);
    let sql;

    // Cast attributes for storage
    const valuesForStorage = values.map((value, index) => {
      return this.prepareAttributeForStorage(fields[index], value);
    });

    if (this.id) {
      // Update
      fields.push('updatedAt');
      valuesForStorage.push(now);

      const setClause = fields.map(field => `${field} = ?`).join(', ');
      sql = `UPDATE ${this.constructor.tableName} SET ${setClause} WHERE id = ?`;
      valuesForStorage.push(this.id);
    } else {
      // Insert
      fields.push('createdAt', 'updatedAt');
      valuesForStorage.push(now, now);

      const placeholders = fields.map(() => '?').join(', ');
      sql = `INSERT INTO ${this.constructor.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    }

    const result = await this.constructor.executeSql(sql, valuesForStorage);
    if (!this.id && result.insertId) {
      this.id = result.insertId;
    }
    return result;
  }

  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete a model without an id.');
    }
    const sql = `DELETE FROM ${this.constructor.tableName} WHERE id = ?`;
    return await this.constructor.executeSql(sql, [this.id]);
  }

  static async executeSql(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(sql, params, (_, result) => {
          resolve(result);
        }, (transaction, error) => {
          reject(error);
        });
      });
    });
  }

  async get() {
    let query = `SELECT ${this.clauses.select} FROM ${this.constructor.tableName}`;
    const params = [];
  
    // Add WHERE clauses if any
    if (this.clauses.where.length) {
      const whereClauses = this.clauses.where.map(clause => {
        params.push(clause.value);
        return `${clause.column} ${clause.operator} ?`;
      }).join(' AND ');
      query += ` WHERE ${whereClauses}`;
    }
  
    // Add ORDER BY clause if set
    if (this.clauses.orderBy) {
      query += ` ORDER BY ${this.clauses.orderBy.column} ${this.clauses.orderBy.direction}`;
    }
  
    // Add LIMIT clause if set
    if (this.clauses.limit !== null) {
      query += ` LIMIT ${this.clauses.limit}`;
    }
  
    // Execute the SQL query
    const result = await this.constructor.executeSql(query, params);
  
    // Map the result rows to clean instances of the model
    const instances = result.rows._array.map(row => {
      const instance = new this.constructor(row);
      // return instance.toCleanObject(); // Use the new method here
      return this.cleanObject(instance); // Use the new method here
    });
  
    // Load relationships if any are specified
    // console.log(`Loading ${this.constructor.name}.${this.clauses.withRelations}`);
    for (const relationName of this.clauses.withRelations) {
      const relation = this[relationName];
      if (typeof relation === 'function') {
        // Load the relation data for each instance
        await Promise.all(instances.map(async (instance) => {
          try {
            instance[relationName] = await instance[relationName]();
            // console.log(`${this.constructor.name}.${relationName}: ${instance[relationName]}`);
          } catch (error) {
            console.error(`Failed to load relation '${relationName}' for instance with ID ${instance.id}:`, error);
            instance[relationName] = null;
          }
        }));
      }
    }

    // Reset the clauses for the next query
    this.cleanObject(this);
  
    return instances;
  }

  async first() {
    // console.log('first', this.constructor.name);
    this.limit(1);
    const results = await this.get();
    return results[0] || null;
  }

  static async find(id) {
    return await new this().where('id', '=', id).first();
  }

  static async insert(data) {
    const now = new Date().toISOString();
    // Add createdAt and updatedAt to the data if not provided
    data.createdAt = data.createdAt || now;
    data.updatedAt = data.updatedAt || now;

    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    // Cast attributes for storage
    const valuesForStorage = values.map((value, index) => {
      return this.prototype.prepareAttributeForStorage(Object.keys(data)[index], value);
    });

    const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
    return await this.executeSql(sql, valuesForStorage);
  }

  static async seed(data) {
    // Check if the table already has data
    const existingData = await new this().first();
    if (!existingData) {
      for (const item of data) {
        await this.insert(item);
      }
    }
  }

  // Relationship methods
  hasOne(relatedModel, foreignKey, localKey = 'id') {
    return relatedModel.where(foreignKey, '=', this[localKey]).first();
  }

  hasMany(relatedModel, foreignKey, localKey = 'id') {
    return relatedModel.where(foreignKey, '=', this[localKey]).get();
  }

  belongsTo(relatedModel, foreignKey, otherKey = 'id') {
    return relatedModel.where(otherKey, '=', this[foreignKey]).first();
  }
}