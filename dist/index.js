"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = exports.Migration = exports.Model = void 0;
const Model_1 = require("./Model");
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return Model_1.Model; } });
const Migration_1 = require("./Migration");
Object.defineProperty(exports, "Migration", { enumerable: true, get: function () { return Migration_1.Migration; } });
Object.defineProperty(exports, "runMigrations", { enumerable: true, get: function () { return Migration_1.runMigrations; } });
