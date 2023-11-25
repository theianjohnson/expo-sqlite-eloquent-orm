import * as SQLite from 'expo-sqlite'

type Casts = {[key: string]: 'number' | 'boolean' | 'string' | 'date' | 'json'}

type Clauses = {
  select: string
  joins: Array<{
    type: 'INNER' | 'LEFT' | 'RIGHT',
    table: string,
    firstKey: string,
    secondKey: string
  }>
  where: Array<{ column: string, operator: string, value?: any }>
  orderBy: { column: string, direction: string } | null
  limit: number | null
  withRelations: string[]
}

type ModelAttributes = Record<string, any>

type SQLResult = {
  insertId?: number
  rowsAffected: number
  rows: {
    _array: ModelAttributes[]
    length: number
    item: (index: number) => ModelAttributes
  }
}

export class Model {
  private static db = SQLite.openDatabase('app.db')
  
  static tableName = ''

  static casts: Casts = {
    createdAt: 'date',
    updatedAt: 'date',
  }

  static withTimestamps: boolean = true;
  static createdAtColumn: string = 'createdAt';
  static updatedAtColumn: string = 'updatedAt';

  private __private: {
    clauses: Clauses;
  };

  [key: string]: any;

  constructor (attributes: ModelAttributes = {}) {
    Object.assign(this, attributes)
    this.__private = {
      clauses: {
        select: '*',
        joins: [],
        where: [],
        orderBy: null,
        limit: null,
        withRelations: []
      }
    }

    return new Proxy<Model>(this, {
      get: (target: Model, prop: string | symbol, receiver: any) => {
        // console.log('Proxy get()', prop, target.__private.clauses?.withRelations);
        if (typeof prop === 'string') {
          if (
            typeof target[prop as keyof Model] === 'function' &&
            !['resetDatabase', 'table', 'select', 'join', 'where', 'orderBy', 'limit', 'with', 'get', 'insert', 'update', 'delete', 'find', 'first', 'seed', 'getSql', 'cleanObject'].includes(prop) &&
            !target.__private.clauses?.withRelations.includes(prop)
          ) {
            const relationMethods = target.getRelationMethods();
            if (relationMethods.includes(prop)) {
              console.log('No PROP FOR YOU', prop);
              return undefined;
            }
          }
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }

  static async resetDatabase() {
    await this.db.closeAsync();
    await this.db.deleteAsync();
    this.db = null;
    this.db = SQLite.openDatabase('app.db');
  }

  getRelationMethods(): string[] {
    const proto = Object.getPrototypeOf(this);
    return Object.getOwnPropertyNames(proto).filter(prop => prop !== 'constructor' && typeof this[prop] === 'function');
  }

  // Static methods that proxy to instance methods  
  static table<T extends Model>(this: new () => T, name: string): T {
    return new this().table(name)
  }

  static select<T extends Model>(this: new () => T, fields: string | string[] = '*'): T {
    return new this().select(fields)
  }

  static join<T extends Model>(this: new () => T, type: 'INNER' | 'LEFT' | 'RIGHT', table: string, firstKey: string, secondKey: string): T {
    return new this().join(type, table, firstKey, secondKey);
  }

  static where<T extends Model>(this: new () => T, column: string, operatorOrValue: any, value?: any): T {
    return new this().where(column, operatorOrValue, value)
  }

  static orderBy<T extends Model>(this: new () => T, column: string, direction: 'ASC' | 'DESC' = 'ASC'): T {
    return new this().orderBy(column, direction)
  }

  static limit<T extends Model>(this: new () => T, number: number): T {
    return new this().limit(number)
  }

  static with<T extends Model>(this: new () => T, relation: string): T {
    const instance = new this().with(relation)
    return instance
  }

  static async find(id: number | string): Promise<Model | null> {
    if(!id) {
      throw new Error('No ID provided');
    }
    return await new this().find(id)
  }

  static async insert(data: Record<string, any>): Promise<SQLResult> {
    return await new this().insert(data);
  }

  async insert(data: Record<string, any>): Promise<SQLResult> {

    const constructor = this.constructor as typeof Model;

    if (!this.tableName) {
      this.tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;
    }

    const now = new Date().toISOString();
    const fields = Object.keys(data).filter(key => !this.__private.clauses.withRelations.includes(key) && !['__private', 'casts', 'tableName', 'withTimestamps', 'createdAtColumn', 'updatedAtColumn'].includes(key))

    // Cast attributes for storage
    const valuesForStorage = fields.map(field => {
      return constructor.prepareAttributeForStorage(field, data[field]);
    });

    // Add timestamps if applicable
    if (constructor.withTimestamps) {
      if (!data[constructor.createdAtColumn]) {
        fields.push(constructor.createdAtColumn);
        valuesForStorage.push(now);
      }
      if (!data[constructor.updatedAtColumn]) {
        fields.push(constructor.updatedAtColumn);
        valuesForStorage.push(now);
      }
    }

    const placeholders = fields.map(() => '?').join(', ');

    const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    return await constructor.executeSql(sql, valuesForStorage);
  }

  // Static seed method
  static async seed(data: Array<Record<string, any>>): Promise<void> {
    console.log('static seed()');
    // Forwarding to the instance method
    await new this().seed(data);
  }

  async seed(data: Array<Record<string, any>>) {
    console.log('seed()');
    // if (!this.tableName) {
    //   throw new Error("Table name is not set for seeding.");
    // }
    
    // Check if the table already has data
    const existingData = await this.first();
    if (!existingData) {
      for (const item of data) {
        await this.insert(item); // Use constructor to get the correct static context
      }
    }
  }

  static async executeSql (sql: string, params: any[] = []): Promise<SQLResult> {
    console.log('executeSql()', sql, params);

    return await new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(sql, params, (_, result) => {
          resolve(result)
          // @ts-expect-error
        }, (transaction, error) => {
          reject(`${error.toString()}. SQL: ${sql}. Params: ${params}`)
        })
      })
    })
  }

  // Cast an attribute to the specified type
  static castAttribute(key: keyof Casts, value: any): any {
    switch (key) {
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      case 'string':
        return String(value);
      case 'date':
        return !!value ? new Date(value) : null;
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

  static prepareAttributeForStorage(key: keyof Casts, value: any): any {
    const castType = this.casts[key];
    
    switch (castType) {
      case 'number':
        return isFinite(value) ? Number(value) : null;
      case 'boolean':
        return value ? 1 : 0;
      case 'string':
        return String(value);
      case 'date':
        return value instanceof Date ? value.toISOString() : value;
      case 'json':
        try {
          return JSON.stringify(value);
        } catch (e) {
          return null;
        }
      default:
        return value;
    }
  }

  // Instance methods for query building
  table(name: string): this {
    this.tableName = name;
    return this
  }

  select(fields: string | string[] = '*'): this {
    this.__private.clauses.select = Array.isArray(fields) ? fields.join(', ') : fields
    return this
  }

  join(type: 'INNER' | 'LEFT' | 'RIGHT', table: string, firstKey: string, secondKey: string): this {
    this.__private.clauses.joins.push({ type, table, firstKey, secondKey });
    return this;
  }

  where (column: string, operatorOrValue: any, value?: any): this {
    if (value === undefined) {
      this.__private.clauses.where.push({ column, operator: '=', value: operatorOrValue })
    } else {
      this.__private.clauses.where.push({ column, operator: operatorOrValue, value })
    }
    return this
  }

  orderBy (column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.__private.clauses.orderBy = { column, direction }
    return this
  }

  limit (number: number): this {
    this.__private.clauses.limit = number
    return this
  }

  with (relation: string): this {
    this.__private.clauses.withRelations.push(relation)
    return this
  }

  async find(id: number | string): Promise<Model | null> {
    if(!id) {
      throw new Error('No ID provided');
    }
    return await this.where('id', '=', id).first();
  }

  // Instance methods
  async save(): Promise<Model | null> {
    if (this.id) {
      const constructor = this.constructor as typeof Model;

      const now = new Date().toISOString()
      const fields = Object.keys(this).filter(key => !this.__private.clauses.withRelations.includes(key) && !['__private', 'casts', 'tableName', 'withTimestamps', 'createdAtColumn', 'updatedAtColumn'].includes(key) && key !== 'id' && key !== '__private')      
      let sql
  
      // Cast attributes for storage
      const values = fields.map(field => {
        // Prepare the value for storage based on its cast type
        return constructor.prepareAttributeForStorage(field as keyof Casts, this[field]);
      });

      if (constructor.withTimestamps && constructor.updatedAtColumn) {
        this[constructor.updatedAtColumn] = now;
        fields.push(constructor.updatedAtColumn);
        values.push(now);
      }

      const tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;

      const setClause = fields.map(field => `${field} = ?`).join(', ')
      sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`
      values.push(this.id)

      await constructor.executeSql(sql, values)
      return this;
    } else {
      // Insert
      const result = await this.insert(this)
      
      if(result.insertId) {
        this.id = result.insertId;
        return await this.find(result.insertId);
      }

      return null;
    }
  }

  async delete(): Promise<SQLResult> {
    const constructor = this.constructor as typeof Model;
  
    if (!this.tableName) {
      this.tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;
    }

    let sql;
    const params: any[] = [];
  
    // If there are WHERE clauses, use them to build the query
    if (this.__private.clauses?.where?.length > 0) {
      const whereConditions = this.__private.clauses.where.map(clause => {
        params.push(clause.value);
        return `${clause.column} ${clause.operator} ?`;
      });
      sql = `DELETE FROM ${this.tableName} WHERE ${whereConditions.join(' AND ')}`;
    } else if (this.id) {
      // If no WHERE clause but an id is present, delete by id
      sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
      params.push(this.id);
    } else {
      // If neither WHERE clause nor id is present, throw an error
      throw new Error('Delete operation must specify a WHERE condition or an instance with id.');
    }
  
    // Execute the delete SQL statement
    return await constructor.executeSql(sql, params);
  }

  getSql(): { query: string, params: Array<string | number | boolean | null> } {
    console.log('getSql()', this);

    if (!this.tableName) {
      const constructor = this.constructor as typeof Model
      this.tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;
    }

    let query = `SELECT ${this.__private.clauses.select} FROM ${this.tableName}`
    const params: Array<string | number | boolean | null> = []

    // Add JOIN clauses if any
    if (this.__private.clauses.joins.length > 0) {
      const joinClauses = this.__private.clauses.joins.map(joinClause => {
        return `${joinClause.type} JOIN ${joinClause.table} ON ${joinClause.firstKey} = ${joinClause.secondKey}`;
      }).join(' ');
      query += ` ${joinClauses}`;
    }

    // Add WHERE clauses if any
    if (this.__private.clauses.where.length > 0) {
      const whereClauses = this.__private.clauses.where.map(clause => {
        params.push(clause.value)
        return `${clause.column} ${clause.operator} ?`
      }).join(' AND ')
      query += ` WHERE ${whereClauses}`
    }

    // Add ORDER BY clause if set
    if (this.__private.clauses.orderBy) {
      query += ` ORDER BY ${this.clauses.orderBy.column} ${this.clauses.orderBy.direction}`
    }

    // Add LIMIT clause if set
    if (this.__private.clauses.limit !== null) {
      query += ` LIMIT ${this.__private.clauses.limit}`
    }

    return { query, params };
  }

  static async get (): Promise<Model[]> {
    console.log('static get()');
    return await new this().get()
  }

  async get(): Promise<Model[]> {
    console.log('get()');

    const constructor = this.constructor as typeof Model

    const { query, params } = this.getSql();

    console.log('query', query);

    // Execute the SQL query
    const result = await constructor.executeSql(query, params)

    // Map the result rows to clean instances of the model
    console.log(`Creating instances of ${this.constructor.name} from query result.`);
    const instances = result.rows._array.map(row => {
      const instance = new constructor(row)
      instance.__private.clauses.withRelations = this.__private.clauses.withRelations;
      return this.cleanObject(instance)
    })

    // Load relationships if any are specified
    console.log(`Loading ${this.constructor.name}.${this.__private.clauses.withRelations}`);
    for (const relationName of this.__private.clauses.withRelations) {
      const relation = this[relationName]
      if (typeof relation === 'function') {
        // Load the relation data for each instance
        await Promise.all(instances.map(async (instance) => {
          try {
            instance[relationName] = await instance[relationName]()
            // console.log(`${this.constructor.name}.${relationName}: ${instance[relationName]}`);
          } catch (error) {
            console.error(`Failed to load relation '${relationName}' for instance with ID ${instance.id}:`, error)
            instance[relationName] = null
          }
        }))
      }
    }

    // Reset the clauses for the next query
    this.cleanObject(this)

    return instances
  }

  async first(): Promise<Model | null> {
    console.log('first()');
    this.limit(1)
    const results = await this.get()
    return results[0] || null
  }

  async update (attributes: Partial<ModelAttributes>): Promise<Model | null> {
    Object.assign(this, attributes)
    return await this.save()
  }

  cleanObject<T extends Model>(object: T): T {
    const constructor = this.constructor as typeof Model;
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        // Get the type of cast from the casts object using the key
        const castType = constructor.casts[key];
        if (castType) {
          // Apply casting to the attribute value
          object[key] = constructor.castAttribute(castType, object[key]);
        } // No else needed as we copy as-is only if there's a cast rule
      }
    }

    return object
  }

  // Relationship methods
  async hasOne<T extends Model>(relatedModel: typeof Model, foreignKey?: string, localKey: string = 'id'): Promise<Model | null> {
    if (!foreignKey) {
      console.log('hasOne auto foreignKey', `${this.constructor.name.toLowerCase()}Id`);
      foreignKey = `${this.constructor.name.toLowerCase()}Id`; // Assuming the foreign key is named after the current model
    }
    return await relatedModel.where(foreignKey, '=', this[localKey]).first();
  }

  async hasMany<T extends Model>(relatedModel: typeof Model, foreignKey?: string, localKey: string = 'id'): Promise<Model[]> {
    if (!foreignKey) {
      console.log('hasMany auto foreignKey', `${this.constructor.name.toLowerCase()}Id`);
      foreignKey = `${this.constructor.name.toLowerCase()}Id`;
    }
    return await relatedModel.where(foreignKey, '=', this[localKey]).get();
  }

  async belongsTo<T extends Model>(relatedModel: typeof Model, foreignKey?: string, otherKey: string = 'id'): Promise<Model | null> {
    if (!foreignKey) {
      console.log('belongsTo foreignKey', `${relatedModel.name.toLowerCase()}Id`);
      foreignKey = `${relatedModel.name.toLowerCase()}Id`;
    }
    return await relatedModel.where(otherKey, '=', this[foreignKey]).first();
  }

  async belongsToMany<T extends Model>(
    this: T,
    relatedModel: typeof Model,
    joinTableName?: string, // This can be optional if the default naming convention is to be used
    foreignKey?: string,   // This can be optional and inferred from the table names
    otherKey?: string      // This can be optional and inferred from the table names
  ): Promise<Model[] | null> {

    console.log('belongsToMany()', relatedModel, joinTableName, foreignKey, otherKey);

    const relatedConstructor = (new relatedModel()).constructor as typeof Model;
    const currentConstructor = this.constructor as typeof Model;

    console.log('relatedConstructor', relatedConstructor);
    console.log('currentConstructor', currentConstructor);

    // Determine the names
    const relatedName = relatedConstructor.name.toLowerCase();
    const currentName = currentConstructor.name.toLowerCase();

    console.log('relatedName', relatedName);
    console.log('currentName', currentName);
  
    const relatedTableName = relatedConstructor.tableName || `${relatedConstructor.name.toLowerCase()}s`;
    const currentTableName = currentConstructor.tableName || `${currentConstructor.name.toLowerCase()}s`;

    console.log('relatedTableName', relatedTableName);
    console.log('currentTableName', currentTableName);

    // If joinTableName is not provided, determine it based on the table names
    if (!joinTableName) {
      joinTableName = [relatedTableName, currentTableName].sort().join('_');
    }

    console.log('joinTableName', joinTableName);
  
    // Determine foreign keys if not provided
    if (!foreignKey) {
      foreignKey = `${currentName}Id`; // Assuming the singular form of the table name plus 'Id'
    }
    if (!otherKey) {
      otherKey = `${relatedName}Id`; // Assuming the singular form of the table name plus 'Id'
    }
  
    // Use the ORM's methods to construct the query
    const instances = await relatedConstructor
      .select(`${relatedTableName}.*`)
      .join('INNER', joinTableName, `${joinTableName}.${otherKey}`, `${relatedTableName}.id`)
      .where(`${joinTableName}.${foreignKey}`, '=', this.id)
      .get();
      
    // Instantiate the related models with the result
    return instances;
  }
}
