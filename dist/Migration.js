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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = exports.Migration = void 0;
const Model_1 = require("./Model");
class Migration {
    static runMigrations(migrations) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createMigrationsTable();
            for (const [version, sql] of Object.entries(migrations)) {
                const migrationApplied = yield this.checkMigration(version);
                if (!migrationApplied) {
                    yield this.applyMigration(version, sql);
                }
                else {
                    console.log('No migrations to apply.');
                }
            }
        });
    }
    static createMigrationsTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        version TEXT PRIMARY KEY NOT NULL
      );
    `;
            yield Model_1.Model.executeSql(sql);
        });
    }
    static checkMigration(version) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = 'SELECT version FROM migrations WHERE version = ?';
            const result = yield Model_1.Model.executeSql(sql, [version]);
            return result.rows.length > 0;
        });
    }
    static applyMigration(version, sql) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Model_1.Model.executeSql(sql);
            const insertSql = 'INSERT INTO migrations (version) VALUES (?)';
            yield Model_1.Model.executeSql(insertSql, [version]);
            console.log(`Migration ${version} applied.`);
        });
    }
}
exports.Migration = Migration;
// Exported async function to run migrations
function runMigrations(migrations) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Migration.runMigrations(migrations);
            console.log('Running migrations complete.');
        }
        catch (error) {
            console.error('Error running migrations:', error);
        }
    });
}
exports.runMigrations = runMigrations;
//# sourceMappingURL=Migration.js.map