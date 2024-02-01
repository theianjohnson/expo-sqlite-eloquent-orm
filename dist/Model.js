"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const SQLite = __importStar(require("expo-sqlite"));
class Model {
    constructor(attributes = {}) {
        Object.assign(this, attributes);
        this.__private = {
            clauses: {
                select: '*',
                joins: [],
                where: [],
                orderBy: [],
                limit: null,
                withRelations: []
            }
        };
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                var _b;
                // console.log('Proxy get()', prop, target.__private.clauses?.withRelations);
                if (typeof prop === 'string') {
                    if (typeof target[prop] === 'function' &&
                        !['resetDatabase', 'openDatabase', 'table', 'select', 'join', 'where', 'orderBy', 'limit', 'with', 'get', 'insert', 'update', 'delete', 'find', 'first', 'seed', 'getSql', 'cleanObject'].includes(prop) &&
                        !((_b = target.__private.clauses) === null || _b === void 0 ? void 0 : _b.withRelations.includes(prop))) {
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
    static resetDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.closeAsync();
            yield this.db.deleteAsync();
            this.db = null;
            this.db = this.openDatabase();
        });
    }
    static openDatabase() {
        return SQLite.openDatabase('app.db');
    }
    getRelationMethods() {
        const proto = Object.getPrototypeOf(this);
        return Object.getOwnPropertyNames(proto).filter(prop => prop !== 'constructor' && typeof this[prop] === 'function');
    }
    // Static methods that proxy to instance methods  
    static table(name) {
        return new this().table(name);
    }
    static select(fields = '*') {
        return new this().select(fields);
    }
    static join(type, table, firstKey, secondKey) {
        return new this().join(type, table, firstKey, secondKey);
    }
    static where(column, operatorOrValue, value) {
        return new this().where(column, operatorOrValue, value);
    }
    static orderBy(column, direction = 'ASC') {
        return new this().orderBy(column, direction);
    }
    static limit(number) {
        return new this().limit(number);
    }
    static with(relation) {
        const instance = new this().with(relation);
        return instance;
    }
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('No ID provided');
            }
            return yield new this().find(id);
        });
    }
    static insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new this().insert(data);
        });
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = this.constructor;
            if (!this.tableName) {
                this.tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;
            }
            const now = new Date().toISOString();
            const fields = Object.keys(data).filter(key => !this.__private.clauses.withRelations.includes(key) && !['__private', 'casts', 'tableName', 'withTimestamps', 'createdAtColumn', 'updatedAtColumn'].includes(key));
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
            return yield constructor.executeSql(sql, valuesForStorage);
        });
    }
    // Static seed method
    static seed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('static seed()');
            // Forwarding to the instance method
            yield new this().seed(data);
        });
    }
    seed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('seed()');
            // if (!this.tableName) {
            //   throw new Error("Table name is not set for seeding.");
            // }
            // Check if the table already has data
            const existingData = yield this.first();
            if (!existingData) {
                for (const item of data) {
                    yield this.insert(item); // Use constructor to get the correct static context
                }
            }
        });
    }
    static executeSql(sql, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('executeSql()', sql, params);
            return yield new Promise((resolve, reject) => {
                this.db.transaction(tx => {
                    tx.executeSql(sql, params, (_, result) => {
                        resolve(result);
                        // @ts-expect-error
                    }, (transaction, error) => {
                        reject(`${error.toString()}. SQL: ${sql}. Params: ${params}`);
                    });
                });
            });
        });
    }
    // Cast an attribute to the specified type
    static castAttribute(key, value) {
        switch (key) {
            case 'number':
                return Number(value);
            case 'boolean':
                return Boolean(value);
            case 'string':
                return String(value);
            case 'date':
                return !!value ? new Date(`${value}T00:00:00`) : null;
            case 'datetime':
                return !!value ? new Date(value) : null;
            case 'json':
                try {
                    return JSON.parse(value);
                }
                catch (e) {
                    return value;
                }
            // Add other types as needed
            default:
                return value;
        }
    }
    static prepareAttributeForStorage(key, value) {
        const castType = this.casts[key];
        switch (castType) {
            case 'number':
                return isFinite(value) ? Number(value) : null;
            case 'boolean':
                return value ? 1 : 0;
            case 'string':
                return String(value);
            case 'date':
                if (!value) {
                    return null;
                }
                if (!(value instanceof Date)) {
                    value = new Date(value);
                }
                const year = value.getFullYear();
                const month = (value.getMonth() + 1).toString().padStart(2, '0');
                const day = value.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            case 'datetime':
                if (!value) {
                    return null;
                }
                return value instanceof Date ? value.toISOString() : (new Date(value)).toISOString();
            case 'json':
                try {
                    return JSON.stringify(value);
                }
                catch (e) {
                    return null;
                }
            default:
                return value;
        }
    }
    // Instance methods for query building
    table(name) {
        this.tableName = name;
        return this;
    }
    select(fields = '*') {
        this.__private.clauses.select = Array.isArray(fields) ? fields.join(', ') : fields;
        return this;
    }
    join(type, table, firstKey, secondKey) {
        this.__private.clauses.joins.push({ type, table, firstKey, secondKey });
        return this;
    }
    where(column, operatorOrValue, value) {
        if (value === undefined) {
            this.__private.clauses.where.push({ column, operator: '=', value: operatorOrValue });
        }
        else {
            this.__private.clauses.where.push({ column, operator: operatorOrValue, value });
        }
        return this;
    }
    orderBy(column, direction = 'ASC') {
        this.__private.clauses.orderBy.push({ column, direction });
        return this;
    }
    limit(number) {
        this.__private.clauses.limit = number;
        return this;
    }
    with(relation) {
        this.__private.clauses.withRelations.push(relation);
        return this;
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('No ID provided');
            }
            return yield this.where('id', '=', id).first();
        });
    }
    // Instance methods
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.id) {
                const constructor = this.constructor;
                const now = new Date().toISOString();
                const fields = Object.keys(this).filter(key => !this.__private.clauses.withRelations.includes(key) && !['__private', 'casts', 'tableName', 'withTimestamps', 'createdAtColumn', 'updatedAtColumn'].includes(key) && key !== 'id' && key !== '__private');
                let sql;
                // Cast attributes for storage
                const values = fields.map(field => {
                    // Prepare the value for storage based on its cast type
                    return constructor.prepareAttributeForStorage(field, this[field]);
                });
                if (constructor.withTimestamps && constructor.updatedAtColumn) {
                    this[constructor.updatedAtColumn] = now;
                    fields.push(constructor.updatedAtColumn);
                    values.push(now);
                }
                const tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;
                const setClause = fields.map(field => `${field} = ?`).join(', ');
                sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
                values.push(this.id);
                yield constructor.executeSql(sql, values);
                return this;
            }
            else {
                // Insert
                const result = yield this.insert(this);
                if (result.insertId) {
                    this.id = result.insertId;
                    return yield this.find(result.insertId);
                }
                return null;
            }
        });
    }
    delete() {
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = this.constructor;
            if (!this.tableName) {
                this.tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;
            }
            let sql;
            const params = [];
            // If there are WHERE clauses, use them to build the query
            if (((_c = (_b = this.__private.clauses) === null || _b === void 0 ? void 0 : _b.where) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                const whereConditions = this.__private.clauses.where.map(clause => {
                    params.push(clause.value);
                    return `${clause.column} ${clause.operator} ?`;
                });
                sql = `DELETE FROM ${this.tableName} WHERE ${whereConditions.join(' AND ')}`;
            }
            else if (this.id) {
                // If no WHERE clause but an id is present, delete by id
                sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
                params.push(this.id);
            }
            else {
                // If neither WHERE clause nor id is present, throw an error
                throw new Error('Delete operation must specify a WHERE condition or an instance with id.');
            }
            // Execute the delete SQL statement
            return yield constructor.executeSql(sql, params);
        });
    }
    getSql() {
        console.log('getSql()', this);
        if (!this.tableName) {
            const constructor = this.constructor;
            this.tableName = constructor.tableName || `${constructor.name.toLowerCase()}s`;
        }
        let query = `SELECT ${this.__private.clauses.select} FROM ${this.tableName}`;
        const params = [];
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
                params.push(clause.value);
                return `${clause.column} ${clause.operator} ?`;
            }).join(' AND ');
            query += ` WHERE ${whereClauses}`;
        }
        // Add ORDER BY clause if set
        if (this.__private.clauses.orderBy.length > 0) {
            const orderByClauses = this.__private.clauses.orderBy.map(clause => {
                return `${clause.column} ${clause.direction}`;
            }).join(', ');
            query += ` ORDER BY ${orderByClauses}`;
        }
        // Add LIMIT clause if set
        if (this.__private.clauses.limit !== null) {
            query += ` LIMIT ${this.__private.clauses.limit}`;
        }
        return { query, params };
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('static get()');
            return yield new this().get();
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('get()');
            const constructor = this.constructor;
            const { query, params } = this.getSql();
            console.log('query', query);
            // Execute the SQL query
            const result = yield constructor.executeSql(query, params);
            // Map the result rows to clean instances of the model
            console.log(`Creating instances of ${this.constructor.name} from query result.`);
            const instances = result.rows._array.map(row => {
                const instance = new constructor(row);
                instance.__private.clauses.withRelations = this.__private.clauses.withRelations;
                return this.cleanObject(instance);
            });
            // Load relationships if any are specified
            console.log(`Loading ${this.constructor.name}.${this.__private.clauses.withRelations}`);
            for (const relationName of this.__private.clauses.withRelations) {
                const relation = this[relationName];
                if (typeof relation === 'function') {
                    // Load the relation data for each instance
                    yield Promise.all(instances.map((instance) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            instance[relationName] = yield instance[relationName]();
                            // console.log(`${this.constructor.name}.${relationName}: ${instance[relationName]}`);
                        }
                        catch (error) {
                            console.error(`Failed to load relation '${relationName}' for instance with ID ${instance.id}:`, error);
                            instance[relationName] = null;
                        }
                    })));
                }
            }
            // Reset the clauses for the next query
            this.cleanObject(this);
            return instances;
        });
    }
    first() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('first()');
            this.limit(1);
            const results = yield this.get();
            return results[0] || null;
        });
    }
    update(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.assign(this, attributes);
            return yield this.save();
        });
    }
    cleanObject(object) {
        const constructor = this.constructor;
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
        return object;
    }
    // Relationship methods
    hasOne(relatedModel, foreignKey, localKey = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!foreignKey) {
                console.log('hasOne auto foreignKey', `${this.constructor.name.toLowerCase()}Id`);
                foreignKey = `${this.constructor.name.toLowerCase()}Id`; // Assuming the foreign key is named after the current model
            }
            return yield relatedModel.where(foreignKey, '=', this[localKey]).first();
        });
    }
    hasMany(relatedModel, foreignKey, localKey = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!foreignKey) {
                console.log('hasMany auto foreignKey', `${this.constructor.name.toLowerCase()}Id`);
                foreignKey = `${this.constructor.name.toLowerCase()}Id`;
            }
            return yield relatedModel.where(foreignKey, '=', this[localKey]).get();
        });
    }
    belongsTo(relatedModel, foreignKey, otherKey = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!foreignKey) {
                console.log('belongsTo foreignKey', `${relatedModel.name.toLowerCase()}Id`);
                foreignKey = `${relatedModel.name.toLowerCase()}Id`;
            }
            return yield relatedModel.where(otherKey, '=', this[foreignKey]).first();
        });
    }
    belongsToMany(relatedModel, joinTableName, // This can be optional if the default naming convention is to be used
    foreignKey, // This can be optional and inferred from the table names
    otherKey // This can be optional and inferred from the table names
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('belongsToMany()', relatedModel, joinTableName, foreignKey, otherKey);
            const relatedConstructor = (new relatedModel()).constructor;
            const currentConstructor = this.constructor;
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
            const instances = yield relatedConstructor
                .select(`${relatedTableName}.*`)
                .join('INNER', joinTableName, `${joinTableName}.${otherKey}`, `${relatedTableName}.id`)
                .where(`${joinTableName}.${foreignKey}`, '=', this.id)
                .get();
            // Instantiate the related models with the result
            return instances;
        });
    }
}
exports.Model = Model;
_a = Model;
Model.db = _a.openDatabase();
Model.tableName = '';
Model.casts = {
    createdAt: 'datetime',
    updatedAt: 'datetime',
};
Model.withTimestamps = true;
Model.createdAtColumn = 'createdAt';
Model.updatedAtColumn = 'updatedAt';
//# sourceMappingURL=Model.js.map