"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var SQLite = require("expo-sqlite");
var Model = /** @class */ (function () {
    function Model(attributes) {
        if (attributes === void 0) { attributes = {}; }
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
    Model.prototype.select = function (fields) {
        if (fields === void 0) { fields = '*'; }
        this.clauses.select = Array.isArray(fields) ? fields.join(', ') : fields;
        return this;
    };
    Model.prototype.where = function (column, operator, value) {
        if (value === undefined) {
            value = operator;
            operator = '=';
        }
        this.clauses.where.push({ column: column, operator: operator, value: value });
        return this;
    };
    Model.prototype.orderBy = function (column, direction) {
        if (direction === void 0) { direction = 'ASC'; }
        this.clauses.orderBy = { column: column, direction: direction };
        return this;
    };
    Model.prototype.limit = function (number) {
        this.clauses.limit = number;
        return this;
    };
    Model.prototype.with = function (relation) {
        this.clauses.withRelations.push(relation);
        return this;
    };
    // Static methods that proxy to instance methods
    Model.select = function (fields) {
        if (fields === void 0) { fields = '*'; }
        return new this().select(fields);
    };
    Model.where = function (column, operator, value) {
        return new this().where(column, operator, value);
    };
    Model.orderBy = function (column, direction) {
        if (direction === void 0) { direction = 'ASC'; }
        return new this().orderBy(column, direction);
    };
    Model.limit = function (number) {
        return new this().limit(number);
    };
    Model.with = function (relation) {
        var instance = new this().with(relation);
        console.log(instance.constructor.name, 'with', relation); // Check what the instance looks like
        return instance;
    };
    // Cast an attribute to the specified type
    Model.prototype.castAttribute = function (key, value) {
        // @ts-ignore
        if (this.constructor.casts[key]) {
            // @ts-ignore
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
    };
    Model.prototype.prepareAttributeForStorage = function (key, value) {
        // @ts-ignore
        if (this.constructor.casts[key]) {
            // @ts-ignore
            switch (this.constructor.casts[key]) {
                case 'json':
                    return JSON.stringify(value);
                // Add other types as needed
                default:
                    return value;
            }
        }
        return value;
    };
    // Instance method to get a clean object for output
    Model.prototype.cleanObject = function (object) {
        delete object.clauses;
        return object;
    };
    // Instance methods
    Model.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, fields, values, sql, valuesForStorage, setClause, placeholders, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date().toISOString();
                        fields = Object.keys(this).filter(function (key) { return key !== 'id' && key !== 'createdAt' && key !== 'updatedAt'; });
                        values = fields.map(function (field) { return _this[field]; });
                        valuesForStorage = values.map(function (value, index) {
                            return _this.prepareAttributeForStorage(fields[index], value);
                        });
                        // @ts-ignore
                        if (this.id) {
                            // Update
                            fields.push('updatedAt');
                            valuesForStorage.push(now);
                            setClause = fields.map(function (field) { return "".concat(field, " = ?"); }).join(', ');
                            // @ts-ignore
                            sql = "UPDATE ".concat(this.constructor.tableName, " SET ").concat(setClause, " WHERE id = ?");
                            // @ts-ignore
                            valuesForStorage.push(this.id);
                        }
                        else {
                            // Insert
                            fields.push('createdAt', 'updatedAt');
                            valuesForStorage.push(now, now);
                            placeholders = fields.map(function () { return '?'; }).join(', ');
                            // @ts-ignore
                            sql = "INSERT INTO ".concat(this.constructor.tableName, " (").concat(fields.join(', '), ") VALUES (").concat(placeholders, ")");
                        }
                        return [4 /*yield*/, this.constructor.executeSql(sql, valuesForStorage)];
                    case 1:
                        result = _a.sent();
                        // @ts-ignore
                        if (!this.id && result.insertId) {
                            // @ts-ignore
                            this.id = result.insertId;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Model.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // @ts-ignore
                        if (!this.id) {
                            throw new Error('Cannot delete a model without an id.');
                        }
                        sql = "DELETE FROM ".concat(this.constructor.tableName, " WHERE id = ?");
                        return [4 /*yield*/, this.constructor.executeSql(sql, [this.id])];
                    case 1: 
                    // @ts-ignore
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Model.executeSql = function (sql, params) {
        if (params === void 0) { params = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.transaction(function (tx) {
                            tx.executeSql(sql, params, function (_, result) {
                                resolve(result);
                                // @ts-ignore
                            }, function (transaction, error) {
                                reject(error);
                            });
                        });
                    })];
            });
        });
    };
    Model.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, whereClauses, result, instances, _loop_1, this_1, _i, _a, relationName;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = "SELECT ".concat(this.clauses.select, " FROM ").concat(this.constructor.tableName);
                        params = [];
                        // Add WHERE clauses if any
                        if (this.clauses.where.length) {
                            whereClauses = this.clauses.where.map(function (clause) {
                                params.push(clause.value);
                                return "".concat(clause.column, " ").concat(clause.operator, " ?");
                            }).join(' AND ');
                            query += " WHERE ".concat(whereClauses);
                        }
                        // Add ORDER BY clause if set
                        if (this.clauses.orderBy) {
                            query += " ORDER BY ".concat(this.clauses.orderBy.column, " ").concat(this.clauses.orderBy.direction);
                        }
                        // Add LIMIT clause if set
                        if (this.clauses.limit !== null) {
                            query += " LIMIT ".concat(this.clauses.limit);
                        }
                        return [4 /*yield*/, this.constructor.executeSql(query, params)];
                    case 1:
                        result = _b.sent();
                        instances = result.rows._array.map(function (row) {
                            // @ts-ignore
                            var instance = new _this.constructor(row);
                            // return instance.toCleanObject(); // Use the new method here
                            return _this.cleanObject(instance); // Use the new method here
                        });
                        _loop_1 = function (relationName) {
                            var relation;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        relation = this_1[relationName];
                                        if (!(typeof relation === 'function')) return [3 /*break*/, 2];
                                        // Load the relation data for each instance
                                        return [4 /*yield*/, Promise.all(instances.map(function (instance) { return __awaiter(_this, void 0, void 0, function () {
                                                var _a, _b, error_1;
                                                return __generator(this, function (_c) {
                                                    switch (_c.label) {
                                                        case 0:
                                                            _c.trys.push([0, 2, , 3]);
                                                            _a = instance;
                                                            _b = relationName;
                                                            return [4 /*yield*/, instance[relationName]()];
                                                        case 1:
                                                            _a[_b] = _c.sent();
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            error_1 = _c.sent();
                                                            console.error("Failed to load relation '".concat(relationName, "' for instance with ID ").concat(instance.id, ":"), error_1);
                                                            instance[relationName] = null;
                                                            return [3 /*break*/, 3];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); }))];
                                    case 1:
                                        // Load the relation data for each instance
                                        _c.sent();
                                        _c.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this.clauses.withRelations;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        relationName = _a[_i];
                        return [5 /*yield**/, _loop_1(relationName)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        // Reset the clauses for the next query
                        this.cleanObject(this);
                        return [2 /*return*/, instances];
                }
            });
        });
    };
    Model.prototype.first = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // console.log('first', this.constructor.name);
                        this.limit(1);
                        return [4 /*yield*/, this.get()];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results[0] || null];
                }
            });
        });
    };
    Model.prototype.update = function (attributes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Object.assign(this, attributes);
                return [2 /*return*/, this.save()];
            });
        });
    };
    Model.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new this().where('id', '=', id).first()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Model.insert = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var now, fields, placeholders, values, valuesForStorage, sql;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date().toISOString();
                        // Add createdAt and updatedAt to the data if not provided
                        data.createdAt = data.createdAt || now;
                        data.updatedAt = data.updatedAt || now;
                        fields = Object.keys(data).join(', ');
                        placeholders = Object.keys(data).map(function () { return '?'; }).join(', ');
                        values = Object.values(data);
                        valuesForStorage = values.map(function (value, index) {
                            return _this.prototype.prepareAttributeForStorage(Object.keys(data)[index], value);
                        });
                        sql = "INSERT INTO ".concat(this.tableName, " (").concat(fields, ") VALUES (").concat(placeholders, ")");
                        return [4 /*yield*/, this.executeSql(sql, valuesForStorage)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Model.seed = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingData, _i, data_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new this().first()];
                    case 1:
                        existingData = _a.sent();
                        if (!!existingData) return [3 /*break*/, 5];
                        _i = 0, data_1 = data;
                        _a.label = 2;
                    case 2:
                        if (!(_i < data_1.length)) return [3 /*break*/, 5];
                        item = data_1[_i];
                        return [4 /*yield*/, this.insert(item)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Relationship methods
    Model.prototype.hasOne = function (relatedModel, foreignKey, localKey) {
        if (localKey === void 0) { localKey = 'id'; }
        return relatedModel.where(foreignKey, '=', this[localKey]).first();
    };
    Model.prototype.hasMany = function (relatedModel, foreignKey, localKey) {
        if (localKey === void 0) { localKey = 'id'; }
        return relatedModel.where(foreignKey, '=', this[localKey]).get();
    };
    Model.prototype.belongsTo = function (relatedModel, foreignKey, otherKey) {
        if (otherKey === void 0) { otherKey = 'id'; }
        return relatedModel.where(otherKey, '=', this[foreignKey]).first();
    };
    Model.db = SQLite.openDatabase('app.db');
    Model.tableName = '';
    Model.casts = {};
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=Model.js.map