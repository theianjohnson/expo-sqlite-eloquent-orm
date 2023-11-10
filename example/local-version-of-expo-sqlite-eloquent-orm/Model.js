"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function get() {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = void 0 && (void 0).__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = void 0 && (void 0).__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;
var SQLite = __importStar(require("expo-sqlite"));
var Model = /*#__PURE__*/function () {
  function Model() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Model);
    Object.assign(this, attributes);
    this.clauses = {
      select: '*',
      joins: [],
      where: [],
      orderBy: null,
      limit: null,
      withRelations: []
    };
  }
  // Static methods that proxy to instance methods
  _createClass(Model, [{
    key: "select",
    value:
    // Instance methods for query building
    function select() {
      var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
      this.clauses.select = Array.isArray(fields) ? fields.join(', ') : fields;
      return this;
    }
  }, {
    key: "join",
    value: function join(type, table, firstKey, secondKey) {
      this.clauses.joins.push({
        type: type,
        table: table,
        firstKey: firstKey,
        secondKey: secondKey
      });
      return this;
    }
  }, {
    key: "where",
    value: function where(column, operatorOrValue, value) {
      if (value === undefined) {
        this.clauses.where.push({
          column: column,
          operator: '=',
          value: operatorOrValue
        });
      } else {
        this.clauses.where.push({
          column: column,
          operator: operatorOrValue,
          value: value
        });
      }
      return this;
    }
  }, {
    key: "orderBy",
    value: function orderBy(column) {
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ASC';
      this.clauses.orderBy = {
        column: column,
        direction: direction
      };
      return this;
    }
  }, {
    key: "limit",
    value: function limit(number) {
      this.clauses.limit = number;
      return this;
    }
  }, {
    key: "with",
    value: function _with(relation) {
      this.clauses.withRelations.push(relation);
      return this;
    }
    // Instance methods
  }, {
    key: "save",
    value: function save() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _this = this;
        var constructor, now, fields, sql, values, setClause, placeholders, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              constructor = this.constructor;
              now = new Date().toISOString();
              fields = Object.keys(this).filter(function (key) {
                return key !== 'id';
              });
              // Cast attributes for storage
              values = fields.map(function (field) {
                // Prepare the value for storage based on its cast type
                return constructor.prepareAttributeForStorage(field, _this[field]);
              });
              if (this.id) {
                if (constructor.withTimestamps && constructor.updatedAtColumn) {
                  this[constructor.updatedAtColumn] = now;
                  fields.push(constructor.updatedAtColumn);
                  values.push(now);
                }
                setClause = fields.map(function (field) {
                  return "".concat(field, " = ?");
                }).join(', ');
                sql = "UPDATE ".concat(constructor.tableName, " SET ").concat(setClause, " WHERE id = ?");
                values.push(this.id);
              } else {
                // Insert
                if (constructor.withTimestamps) {
                  if (constructor.createdAtColumn) {
                    this[constructor.createdAtColumn] = now;
                    fields.push(constructor.createdAtColumn);
                    values.push(now);
                  }
                  if (constructor.updatedAtColumn) {
                    this[constructor.updatedAtColumn] = now;
                    fields.push(constructor.updatedAtColumn);
                    values.push(now);
                  }
                }
                placeholders = fields.map(function () {
                  return '?';
                }).join(', ');
                sql = "INSERT INTO ".concat(constructor.tableName, " (").concat(fields.join(', '), ") VALUES (").concat(placeholders, ")");
              }
              _context.next = 7;
              return constructor.executeSql(sql, values);
            case 7:
              result = _context.sent;
              if (!this.id && result.insertId) {
                this.id = result.insertId;
              }
              return _context.abrupt("return", result);
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "delete",
    value: function _delete() {
      var _a, _b;
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var constructor, sql, params, whereConditions;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              constructor = this.constructor;
              params = []; // If there are WHERE clauses, use them to build the query
              if (!(((_b = (_a = this.clauses) === null || _a === void 0 ? void 0 : _a.where) === null || _b === void 0 ? void 0 : _b.length) > 0)) {
                _context2.next = 7;
                break;
              }
              whereConditions = this.clauses.where.map(function (clause) {
                params.push(clause.value);
                return "".concat(clause.column, " ").concat(clause.operator, " ?");
              });
              sql = "DELETE FROM ".concat(constructor.tableName, " WHERE ").concat(whereConditions.join(' AND '));
              _context2.next = 13;
              break;
            case 7:
              if (!this.id) {
                _context2.next = 12;
                break;
              }
              // If no WHERE clause but an id is present, delete by id
              sql = "DELETE FROM ".concat(constructor.tableName, " WHERE id = ?");
              params.push(this.id);
              _context2.next = 13;
              break;
            case 12:
              throw new Error('Delete operation must specify a WHERE condition or an instance with id.');
            case 13:
              _context2.next = 15;
              return constructor.executeSql(sql, params);
            case 15:
              return _context2.abrupt("return", _context2.sent);
            case 16:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
    }
  }, {
    key: "getSql",
    value: function getSql() {
      var constructor = this.constructor;
      var query = "SELECT ".concat(this.clauses.select, " FROM ").concat(constructor.tableName);
      var params = [];
      // Add JOIN clauses if any
      if (this.clauses.joins.length > 0) {
        var joinClauses = this.clauses.joins.map(function (joinClause) {
          return "".concat(joinClause.type, " JOIN ").concat(joinClause.table, " ON ").concat(joinClause.firstKey, " = ").concat(joinClause.secondKey);
        }).join(' ');
        query += " ".concat(joinClauses);
      }
      // Add WHERE clauses if any
      if (this.clauses.where.length > 0) {
        var whereClauses = this.clauses.where.map(function (clause) {
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
      return {
        query: query,
        params: params
      };
    }
  }, {
    key: "get",
    value: function get() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var _this2 = this;
        var constructor, _this$getSql, query, params, result, instances, _iterator, _step, _loop;
        return _regeneratorRuntime().wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              constructor = this.constructor;
              _this$getSql = this.getSql(), query = _this$getSql.query, params = _this$getSql.params; // Execute the SQL query
              _context5.next = 4;
              return constructor.executeSql(query, params);
            case 4:
              result = _context5.sent;
              instances = result.rows._array.map(function (row) {
                var instance = new constructor(row);
                return _this2.cleanObject(instance); // Use the new method here
              }); // Load relationships if any are specified
              _iterator = _createForOfIteratorHelper(this.clauses.withRelations);
              _context5.prev = 7;
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var relationName, relation;
                return _regeneratorRuntime().wrap(function _loop$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      relationName = _step.value;
                      relation = _this2[relationName];
                      if (!(typeof relation === 'function')) {
                        _context4.next = 5;
                        break;
                      }
                      _context4.next = 5;
                      return Promise.all(instances.map(function (instance) {
                        return __awaiter(_this2, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
                          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                            while (1) switch (_context3.prev = _context3.next) {
                              case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return instance[relationName]();
                              case 3:
                                instance[relationName] = _context3.sent;
                                _context3.next = 9;
                                break;
                              case 6:
                                _context3.prev = 6;
                                _context3.t0 = _context3["catch"](0);
                                instance[relationName] = null;
                              case 9:
                              case "end":
                                return _context3.stop();
                            }
                          }, _callee3, null, [[0, 6]]);
                        }));
                      }));
                    case 5:
                    case "end":
                      return _context4.stop();
                  }
                }, _loop);
              });
              _iterator.s();
            case 10:
              if ((_step = _iterator.n()).done) {
                _context5.next = 14;
                break;
              }
              return _context5.delegateYield(_loop(), "t0", 12);
            case 12:
              _context5.next = 10;
              break;
            case 14:
              _context5.next = 19;
              break;
            case 16:
              _context5.prev = 16;
              _context5.t1 = _context5["catch"](7);
              _iterator.e(_context5.t1);
            case 19:
              _context5.prev = 19;
              _iterator.f();
              return _context5.finish(19);
            case 22:
              // Reset the clauses for the next query
              this.cleanObject(this);
              return _context5.abrupt("return", instances);
            case 24:
            case "end":
              return _context5.stop();
          }
        }, _callee4, this, [[7, 16, 19, 22]]);
      }));
    }
  }, {
    key: "first",
    value: function first() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        var results;
        return _regeneratorRuntime().wrap(function _callee5$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              this.limit(1);
              _context6.next = 3;
              return this.get();
            case 3:
              results = _context6.sent;
              return _context6.abrupt("return", results[0] || null);
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee5, this);
      }));
    }
  }, {
    key: "update",
    value: function update(attributes) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        return _regeneratorRuntime().wrap(function _callee6$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              Object.assign(this, attributes);
              _context7.next = 3;
              return this.save();
            case 3:
              return _context7.abrupt("return", _context7.sent);
            case 4:
            case "end":
              return _context7.stop();
          }
        }, _callee6, this);
      }));
    }
  }, {
    key: "cleanObject",
    value: function cleanObject(object) {
      var constructor = this.constructor;
      for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          // Get the type of cast from the casts object using the key
          var castType = constructor.casts[key];
          if (castType) {
            // Apply casting to the attribute value
            object[key] = constructor.castAttribute(castType, object[key]);
          } // No else needed as we copy as-is only if there's a cast rule
        }
      }
      // @ts-expect-error
      delete object.clauses;
      return object;
    }
    // Relationship methods
  }, {
    key: "hasOne",
    value: function hasOne(relatedModel, foreignKey) {
      var localKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        return _regeneratorRuntime().wrap(function _callee7$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return relatedModel.where(foreignKey, '=', this[localKey]).first();
            case 2:
              return _context8.abrupt("return", _context8.sent);
            case 3:
            case "end":
              return _context8.stop();
          }
        }, _callee7, this);
      }));
    }
  }, {
    key: "hasMany",
    value: function hasMany(relatedModel, foreignKey) {
      var localKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
        return _regeneratorRuntime().wrap(function _callee8$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return relatedModel.where(foreignKey, '=', this[localKey]).get();
            case 2:
              return _context9.abrupt("return", _context9.sent);
            case 3:
            case "end":
              return _context9.stop();
          }
        }, _callee8, this);
      }));
    }
  }, {
    key: "belongsTo",
    value: function belongsTo(relatedModel, foreignKey) {
      var otherKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'id';
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
        return _regeneratorRuntime().wrap(function _callee9$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return relatedModel.where(otherKey, '=', this[foreignKey]).first();
            case 2:
              return _context10.abrupt("return", _context10.sent);
            case 3:
            case "end":
              return _context10.stop();
          }
        }, _callee9, this);
      }));
    }
  }, {
    key: "belongsToMany",
    value: function belongsToMany(relatedModel, joinTableName,
    // This can be optional if the default naming convention is to be used
    foreignKey,
    // This can be optional and inferred from the table names
    otherKey // This can be optional and inferred from the table names
    ) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
        var constructor, relatedTableName, currentTableName, _sort$join, _sort$join2, instances;
        return _regeneratorRuntime().wrap(function _callee10$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              constructor = this.constructor; // Determine the table names
              relatedTableName = relatedModel.tableName;
              currentTableName = constructor.tableName; // If joinTableName is not provided, determine it based on the table names
              if (!joinTableName) {
                _sort$join = [relatedTableName, currentTableName].sort().join('_');
                _sort$join2 = _slicedToArray(_sort$join, 1);
                joinTableName = _sort$join2[0];
              }
              // Determine foreign keys if not provided
              if (!foreignKey) {
                foreignKey = "".concat(currentTableName.slice(0, -1), "Id"); // Assuming the singular form of the table name plus 'Id'
              }

              if (!otherKey) {
                otherKey = "".concat(relatedTableName.slice(0, -1), "Id"); // Assuming the singular form of the table name plus 'Id'
              }
              // Use the ORM's methods to construct the query
              _context11.next = 8;
              return constructor.join('INNER', joinTableName, "".concat(currentTableName, ".id"), "".concat(joinTableName, ".").concat(foreignKey)).join('INNER', relatedTableName, "".concat(joinTableName, ".").concat(otherKey), "".concat(relatedTableName, ".id")).where("".concat(currentTableName, ".id"), '=', this.id) // Add a where clause to filter by the current model's id
              .get();
            case 8:
              instances = _context11.sent;
              return _context11.abrupt("return", instances);
            case 10:
            case "end":
              return _context11.stop();
          }
        }, _callee10, this);
      }));
    }
  }], [{
    key: "get",
    value: function get() {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        return _regeneratorRuntime().wrap(function _callee11$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return new this().get();
            case 2:
              return _context12.abrupt("return", _context12.sent);
            case 3:
            case "end":
              return _context12.stop();
          }
        }, _callee11, this);
      }));
    }
  }, {
    key: "select",
    value: function select() {
      var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
      return new this().select(fields);
    }
  }, {
    key: "join",
    value: function join(type, table, firstKey, secondKey) {
      return new this().join(type, table, firstKey, secondKey);
    }
  }, {
    key: "where",
    value: function where(column, operatorOrValue, value) {
      return new this().where(column, operatorOrValue, value);
    }
  }, {
    key: "orderBy",
    value: function orderBy(column) {
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ASC';
      return new this().orderBy(column, direction);
    }
  }, {
    key: "limit",
    value: function limit(number) {
      return new this().limit(number);
    }
  }, {
    key: "with",
    value: function _with(relation) {
      var instance = new this()["with"](relation);
      return instance;
    }
  }, {
    key: "find",
    value: function find(id) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
        return _regeneratorRuntime().wrap(function _callee12$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return new this().where('id', '=', id).first();
            case 2:
              return _context13.abrupt("return", _context13.sent);
            case 3:
            case "end":
              return _context13.stop();
          }
        }, _callee12, this);
      }));
    }
  }, {
    key: "insert",
    value: function insert(data) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
        var _this3 = this;
        var now, constructor, fields, placeholders, values, valuesForStorage, sql;
        return _regeneratorRuntime().wrap(function _callee13$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              now = new Date().toISOString();
              constructor = this; // Add createdAt and updatedAt to the data if not provided
              if (constructor.withTimestamps) {
                data[constructor.createdAtColumn] = data[constructor.createdAtColumn] || now;
                data[constructor.updatedAtColumn] = data[constructor.updatedAtColumn] || now;
              }
              fields = Object.keys(data);
              placeholders = fields.map(function () {
                return '?';
              }).join(', ');
              values = fields.map(function (field) {
                return data[field];
              }); // Cast attributes for storage
              valuesForStorage = fields.map(function (field) {
                return _this3.prepareAttributeForStorage(field, data[field]);
              });
              sql = "INSERT INTO ".concat(constructor.tableName, " (").concat(fields.join(', '), ") VALUES (").concat(placeholders, ")");
              _context14.next = 10;
              return this.executeSql(sql, valuesForStorage);
            case 10:
              return _context14.abrupt("return", _context14.sent);
            case 11:
            case "end":
              return _context14.stop();
          }
        }, _callee13, this);
      }));
    }
  }, {
    key: "seed",
    value: function seed(data) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
        var existingData, _iterator2, _step2, item;
        return _regeneratorRuntime().wrap(function _callee14$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return new this().first();
            case 2:
              existingData = _context15.sent;
              if (existingData) {
                _context15.next = 21;
                break;
              }
              _iterator2 = _createForOfIteratorHelper(data);
              _context15.prev = 5;
              _iterator2.s();
            case 7:
              if ((_step2 = _iterator2.n()).done) {
                _context15.next = 13;
                break;
              }
              item = _step2.value;
              _context15.next = 11;
              return this.insert(item);
            case 11:
              _context15.next = 7;
              break;
            case 13:
              _context15.next = 18;
              break;
            case 15:
              _context15.prev = 15;
              _context15.t0 = _context15["catch"](5);
              _iterator2.e(_context15.t0);
            case 18:
              _context15.prev = 18;
              _iterator2.f();
              return _context15.finish(18);
            case 21:
            case "end":
              return _context15.stop();
          }
        }, _callee14, this, [[5, 15, 18, 21]]);
      }));
    }
  }, {
    key: "executeSql",
    value: function executeSql(sql) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return __awaiter(this, void 0, void 0, /*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
        var _this4 = this;
        return _regeneratorRuntime().wrap(function _callee15$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return new Promise(function (resolve, reject) {
                _this4.db.transaction(function (tx) {
                  tx.executeSql(sql, params, function (_, result) {
                    resolve(result);
                    // @ts-expect-error
                  }, function (transaction, error) {
                    reject(error);
                  });
                });
              });
            case 2:
              return _context16.abrupt("return", _context16.sent);
            case 3:
            case "end":
              return _context16.stop();
          }
        }, _callee15);
      }));
    }
    // Cast an attribute to the specified type
  }, {
    key: "castAttribute",
    value: function castAttribute(key, value) {
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
  }, {
    key: "prepareAttributeForStorage",
    value: function prepareAttributeForStorage(key, value) {
      var castType = this.casts[key];
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
  }]);
  return Model;
}();
exports.Model = Model;
Model.db = SQLite.openDatabase('app.db');
Model.tableName = '';
Model.casts = {};
Model.withTimestamps = true;
Model.createdAtColumn = 'createdAt';
Model.updatedAtColumn = 'updatedAt';