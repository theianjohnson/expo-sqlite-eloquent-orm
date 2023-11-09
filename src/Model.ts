import * as SQLite from 'expo-sqlite'

type Casts = Record<string, 'number' | 'boolean' | 'string' | 'json'>

interface Clauses {
  select: string
  where: Array<{ column: string, operator: string, value?: any }>
  orderBy: { column: string, direction: string } | null
  limit: number | null
  withRelations: string[]
}

type ModelAttributes = Record<string, any>

interface SQLResult {
  insertId?: number
  rowsAffected: number
  rows: {
    _array: ModelAttributes[]
    length: number
    item: (index: number) => ModelAttributes
  }
}

export class Model {
  static db = SQLite.openDatabase('app.db')
  static tableName = ''
  static casts: Casts = {}

  clauses: Clauses;

  [key: string]: any;

  constructor (attributes: ModelAttributes = {}) {
    Object.assign(this, attributes)
    this.clauses = {
      select: '*',
      where: [],
      orderBy: null,
      limit: null,
      withRelations: []
    }
  }

    // Static methods that proxy to instance methods
    static async get (): Promise<Model[]> {
      return await new this().get()
    }
  
    static select<T extends Model>(this: new () => T, fields: string | string[] = '*'): T {
      return new this().select(fields)
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

    static async find (id: number | string): Promise<Model | null> {
      return await new this().where('id', '=', id).first()
    }
  
    static async insert (data: Record<string, any>): Promise<SQLResult> {
      const now = new Date().toISOString()
      // Add createdAt and updatedAt to the data if not provided
      data.createdAt = data.createdAt || now
      data.updatedAt = data.updatedAt || now
  
      const fields = Object.keys(data);
      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map(field => data[field]);
  
      // Cast attributes for storage
      const valuesForStorage = fields.map(field => {
        return this.prepareAttributeForStorage(field as keyof Casts, data[field]);
      });
  
      const sql = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
      return await this.executeSql(sql, valuesForStorage);
    }
  
    static async seed (data: Array<Record<string, any>>) {
      // Check if the table already has data
      const existingData = await new this().first()
      if (!existingData) {
        for (const item of data) {
          await this.insert(item)
        }
      }
    }
  
    static async executeSql (sql: string, params: any[] = []): Promise<SQLResult> {
      return await new Promise((resolve, reject) => {
        this.db.transaction(tx => {
          tx.executeSql(sql, params, (_, result) => {
            resolve(result)
            // @ts-expect-error
          }, (transaction, error) => {
            reject(error)
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
          // Ensure that numbers are finite before storing, otherwise store as null
          return isFinite(value) ? Number(value) : null;
        case 'boolean':
          // Convert boolean to a format that SQLite understands (1 for true, 0 for false)
          return value ? 1 : 0;
        case 'string':
          // Ensure that the value is a string
          return String(value);
        case 'json':
          // Stringify JSON objects
          try {
            return JSON.stringify(value);
          } catch (e) {
            // In case of an error (e.g., circular reference), store a null or a placeholder string
            // console.error('Error stringifying JSON:', e);
            return null; // Or a placeholder string like '{}' or '[]'
          }
        default:
          // For any type not explicitly handled, return the value as is
          return value;
      }
    }

  // Instance methods for query building
  select (fields: string | string[] = '*'): this {
    this.clauses.select = Array.isArray(fields) ? fields.join(', ') : fields
    return this
  }

  where (column: string, operatorOrValue: any, value?: any): this {
    if (value === undefined) {
      this.clauses.where.push({ column, operator: '=', value: operatorOrValue })
    } else {
      this.clauses.where.push({ column, operator: operatorOrValue, value })
    }
    return this
  }

  orderBy (column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.clauses.orderBy = { column, direction }
    return this
  }

  limit (number: number): this {
    this.clauses.limit = number
    return this
  }

  with (relation: string): this {
    this.clauses.withRelations.push(relation)
    return this
  }

  // Instance methods
  async save (): Promise<SQLResult> {
    const now = new Date().toISOString()
    const fields = Object.keys(this).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
    const values = fields.map(field => this[field])
    let sql

    const constructor = this.constructor as typeof Model

    // Cast attributes for storage
    const valuesForStorage = fields.map(field => {
      // Retrieve the type of cast for the field from the casts object
      const castType = constructor.casts[field as keyof Casts];
      // Prepare the value for storage based on its cast type
      return constructor.prepareAttributeForStorage(field as keyof Casts, this[field]);
    });


    if (this.id) {
      // Update
      fields.push('updatedAt')
      valuesForStorage.push(now)

      const setClause = fields.map(field => `${field} = ?`).join(', ')
      sql = `UPDATE ${constructor.tableName} SET ${setClause} WHERE id = ?`
      valuesForStorage.push(this.id)
    } else {
      // Insert
      fields.push('createdAt', 'updatedAt')
      valuesForStorage.push(now, now)

      const placeholders = fields.map(() => '?').join(', ')
      sql = `INSERT INTO ${constructor.tableName} (${fields.join(', ')}) VALUES (${placeholders})`
    }
    const result = await constructor.executeSql(sql, valuesForStorage)
    if (!this.id && result.insertId) {
      this.id = result.insertId
    }
    return result
  }

  async delete(): Promise<SQLResult> {
    const constructor = this.constructor as typeof Model;
  
    let sql;
    const params: any[] = [];
  
    // If there are WHERE clauses, use them to build the query
    if (this.clauses?.where?.length > 0) {
      const whereConditions = this.clauses.where.map(clause => {
        params.push(clause.value);
        return `${clause.column} ${clause.operator} ?`;
      });
      sql = `DELETE FROM ${constructor.tableName} WHERE ${whereConditions.join(' AND ')}`;
    } else if (this.id) {
      // If no WHERE clause but an id is present, delete by id
      sql = `DELETE FROM ${constructor.tableName} WHERE id = ?`;
      params.push(this.id);
    } else {
      // If neither WHERE clause nor id is present, throw an error
      throw new Error('Delete operation must specify a WHERE condition or an instance with id.');
    }
  
    // Execute the delete SQL statement
    return await constructor.executeSql(sql, params);
  }

  async get (): Promise<Model[]> {
    const constructor = this.constructor as typeof Model

    let query = `SELECT ${this.clauses.select} FROM ${constructor.tableName}`
    const params: Array<string | number | boolean | null> = []

    // Add WHERE clauses if any
    if (this.clauses.where.length > 0) {
      const whereClauses = this.clauses.where.map(clause => {
        params.push(clause.value)
        return `${clause.column} ${clause.operator} ?`
      }).join(' AND ')
      query += ` WHERE ${whereClauses}`
    }

    // Add ORDER BY clause if set
    if (this.clauses.orderBy) {
      query += ` ORDER BY ${this.clauses.orderBy.column} ${this.clauses.orderBy.direction}`
    }

    // Add LIMIT clause if set
    if (this.clauses.limit !== null) {
      query += ` LIMIT ${this.clauses.limit}`
    }

    // Execute the SQL query
    const result = await constructor.executeSql(query, params)

    // Map the result rows to clean instances of the model
    console.log(`Creating instances of ${this.constructor.name} from query result.`);
    const instances = result.rows._array.map(row => {
      const instance = new constructor(row)
      return this.cleanObject(instance) // Use the new method here
    })

    // Load relationships if any are specified
    console.log(`Loading ${this.constructor.name}.${this.clauses.withRelations}`);
    for (const relationName of this.clauses.withRelations) {
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

  async first (): Promise<Model | null> {
    this.limit(1)
    const results = await this.get()
    return results[0] || null
  }

  async update (attributes: Partial<ModelAttributes>): Promise<SQLResult> {
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

    // @ts-expect-error
    delete object.clauses
    return object
  }

  // Relationship methods
  async hasOne<T extends Model>(relatedModel: T, foreignKey: string, localKey: string = 'id'): Promise<Model | null> {
    return await relatedModel.where(foreignKey, '=', this[localKey]).first()
  }

  async hasMany<T extends Model>(relatedModel: T, foreignKey: string, localKey: string = 'id'): Promise<Model[]> {
    return await relatedModel.where(foreignKey, '=', this[localKey]).get()
  }

  async belongsTo<T extends Model>(relatedModel: T, foreignKey: string, otherKey: string = 'id'): Promise<Model | null> {
    return await relatedModel.where(otherKey, '=', this[foreignKey]).first()
  }
}
