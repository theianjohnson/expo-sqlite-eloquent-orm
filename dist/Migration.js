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
exports.runMigrations = exports.Migrations = void 0;
var Model_1 = require("./Model");
var Migrations = /** @class */ (function () {
    function Migrations() {
    }
    Migrations.runMigrations = function (migrations) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, version, sql, migrationApplied;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.createMigrationsTable()];
                    case 1:
                        _c.sent();
                        _i = 0, _a = Object.entries(migrations);
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        _b = _a[_i], version = _b[0], sql = _b[1];
                        return [4 /*yield*/, this.checkMigration(version)];
                    case 3:
                        migrationApplied = _c.sent();
                        if (!!migrationApplied) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.applyMigration(version, sql)];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        console.log("No migrations to apply.");
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Migrations.createMigrationsTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n      CREATE TABLE IF NOT EXISTS migrations (\n        version TEXT PRIMARY KEY NOT NULL\n      );\n    ";
                        return [4 /*yield*/, Model_1.Model.executeSql(sql)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Migrations.checkMigration = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT version FROM migrations WHERE version = ?";
                        return [4 /*yield*/, Model_1.Model.executeSql(sql, [version])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows.length > 0];
                }
            });
        });
    };
    Migrations.applyMigration = function (version, sql) {
        return __awaiter(this, void 0, void 0, function () {
            var insertSql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Model_1.Model.executeSql(sql)];
                    case 1:
                        _a.sent();
                        insertSql = "INSERT INTO migrations (version) VALUES (?)";
                        return [4 /*yield*/, Model_1.Model.executeSql(insertSql, [version])];
                    case 2:
                        _a.sent();
                        console.log("Migration ".concat(version, " applied."));
                        return [2 /*return*/];
                }
            });
        });
    };
    return Migrations;
}());
exports.Migrations = Migrations;
// Exported async function to run migrations
function runMigrations(migrations) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Migrations.runMigrations(migrations)];
                case 1:
                    _a.sent();
                    console.log('Running migrations complete.');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error running migrations:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.runMigrations = runMigrations;
//# sourceMappingURL=Migration.js.map