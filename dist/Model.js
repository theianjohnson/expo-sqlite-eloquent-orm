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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const SQLite = __importStar(require("expo-sqlite"));
class Model {
    constructor(attributes = {}) {
        Object.assign(this, attributes);
        this.clauses = {
            select: '*',
            where: [],
            orderBy: null,
            limit: null,
            withRelations: []
        };
    }
    // Instance methods for query building
    select(fields = '*') {
        this.clauses.select = Array.isArray(fields) ? fields.join(', ') : fields;
        return this;
    }
    where(column, operatorOrValue, value) {
        if (value === undefined) {
            this.clauses.where.push({ column, operator: '=', value: operatorOrValue });
        }
        else {
            this.clauses.where.push({ column, operator: operatorOrValue, value });
        }
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
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new this().get();
        });
    }
    static select(fields = '*') {
        return new this().select(fields);
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
    // Cast an attribute to the specified type
    castAttribute(key, value) {
        const castType = this.constructor.casts[key];
        if (castType) {
            switch (castType) {
                case 'number':
                    return Number(value);
                case 'boolean':
                    return Boolean(value);
                case 'string':
                    return String(value);
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
        return value;
    }
    prepareAttributeForStorage(key, value) {
        const castType = this.constructor.casts[key];
        if (castType) {
            switch (castType) {
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
        // @ts-expect-error
        delete object.clauses;
        return object;
    }
    // Instance methods
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().toISOString();
            const fields = Object.keys(this).filter(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
            const values = fields.map(field => this[field]);
            let sql;
            // Cast attributes for storage
            const valuesForStorage = values.map((value, index) => {
                return this.prepareAttributeForStorage(fields[index], value);
            });
            const constructor = this.constructor;
            if (this.id) {
                // Update
                fields.push('updatedAt');
                valuesForStorage.push(now);
                const setClause = fields.map(field => `${field} = ?`).join(', ');
                sql = `UPDATE ${constructor.tableName} SET ${setClause} WHERE id = ?`;
                valuesForStorage.push(this.id);
            }
            else {
                // Insert
                fields.push('createdAt', 'updatedAt');
                valuesForStorage.push(now, now);
                const placeholders = fields.map(() => '?').join(', ');
                sql = `INSERT INTO ${constructor.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
            }
            const result = yield constructor.executeSql(sql, valuesForStorage);
            if (!this.id && result.insertId) {
                this.id = result.insertId;
            }
            return result;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = this.constructor;
            if (!this.id) {
                throw new Error('Cannot delete a model without an id.');
            }
            const sql = `DELETE FROM ${constructor.tableName} WHERE id = ?`;
            return yield constructor.executeSql(sql, [this.id]);
        });
    }
    static executeSql(sql, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.db.transaction(tx => {
                    tx.executeSql(sql, params, (_, result) => {
                        resolve(result);
                        // @ts-expect-error
                    }, (transaction, error) => {
                        reject(error);
                    });
                });
            });
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const constructor = this.constructor;
            let query = `SELECT ${this.clauses.select} FROM ${constructor.tableName}`;
            const params = [];
            // Add WHERE clauses if any
            if (this.clauses.where.length > 0) {
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
            const result = yield constructor.executeSql(query, params);
            // Map the result rows to clean instances of the model
            console.log(`Creating instances of ${this.constructor.name} from query result.`);
            const instances = result.rows._array.map(row => {
                const instance = new constructor(row);
                return this.cleanObject(instance); // Use the new method here
            });
            // Load relationships if any are specified
            console.log(`Loading ${this.constructor.name}.${this.clauses.withRelations}`);
            for (const relationName of this.clauses.withRelations) {
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
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new this().where('id', '=', id).first();
        });
    }
    static insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return yield this.executeSql(sql, valuesForStorage);
        });
    }
    static seed(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the table already has data
            const existingData = yield new this().first();
            if (!existingData) {
                for (const item of data) {
                    yield this.insert(item);
                }
            }
        });
    }
    // Relationship methods
    hasOne(relatedModel, foreignKey, localKey = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield relatedModel.where(foreignKey, '=', this[localKey]).first();
        });
    }
    hasMany(relatedModel, foreignKey, localKey = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield relatedModel.where(foreignKey, '=', this[localKey]).get();
        });
    }
    belongsTo(relatedModel, foreignKey, otherKey = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            return yield relatedModel.where(otherKey, '=', this[foreignKey]).first();
        });
    }
}
exports.Model = Model;
Model.db = SQLite.openDatabase('app.db');
Model.tableName = '';
Model.casts = {};
//# sourceMappingURL=Model.js.map