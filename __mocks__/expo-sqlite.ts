// @ts-nocheck
import { mock } from 'node:test';
import { mockDataStore } from './mockDataStore';

const mockTransaction = jest.fn();
const mockExecuteSql = jest.fn();

const SQLite = {
  openDatabase: jest.fn().mockReturnValue({
    transaction: mockTransaction.mockImplementation((callback) => {
      callback({
        executeSql: mockExecuteSql,
      });
    }),
  }),
};

function findTableInSql(sql) {
  const selectMatch = sql.match(/FROM (\w+)/i);
  if (selectMatch) return selectMatch[1];

  const insertMatch = sql.match(/INTO (\w+)/i);
  if (insertMatch) return insertMatch[1];

  const updateMatch = sql.match(/UPDATE (\w+)/i);
  if (updateMatch) return updateMatch[1];

  const deleteMatch = sql.match(/FROM (\w+)/i); // DELETE queries also use FROM
  if (deleteMatch) return deleteMatch[1];

  return null;
}


function parseWhereClause(sql, params) {
  // This is a very naive implementation of WHERE clause parsing.
  // It assumes the clause is always in the form "WHERE column = ?"
  // and that there's only one condition.
  const whereMatch = sql.match(/WHERE (\w+) = \?/i);
  if (!whereMatch) return () => true; // No WHERE clause, match all rows.

  const [, column] = whereMatch;
  const value = params[0];
  return (row) => String(row[column]) === String(value);
}

mockExecuteSql.mockImplementation((sql, params, success, failure) => {
    try {
      const upperSql = sql.trim().toUpperCase();
      const table = findTableInSql(sql);
      let rows;

      if (upperSql.startsWith('SELECT')) {
        const matchRow = parseWhereClause(sql, params);
        rows = mockDataStore[table].filter(matchRow);
        success(undefined, {
          rows: {
            _array: rows,
            length: rows.length,
            item: (index) => rows[index],
          },
          rowsAffected: 0,
        });
      } else if (upperSql.startsWith('INSERT')) {
        const columnsMatch = sql.match(/\((.*?)\)/);
        if (!columnsMatch) throw new Error('No columns found for INSERT');
        const columns = columnsMatch[1].split(',').map(column => column.trim());
  
        const newId = mockDataStore[table].length + 1;
        const newRow = { id: newId };
        columns.forEach((column, index) => {
          newRow[column] = params[index];
        });
  
        mockDataStore[table].push(newRow);
        success(undefined, { insertId: newId, rowsAffected: 1 });
      } else if (upperSql.startsWith('UPDATE')) {
        const matchRow = parseWhereClause(sql, params);
        const setClauseMatch = sql.match(/SET (.+?) WHERE/i);
        if (!setClauseMatch) throw new Error('No SET clause found');
        const setClauses = setClauseMatch[1].split(',').map(clause => {
          const [column, valuePlaceholder] = clause.trim().split('=');
          const valueIndex = parseInt(valuePlaceholder.replace('?', '').trim()) - 1;
          return { column: column.trim(), value: params[valueIndex] };
        });
  
        let rowsAffected = 0;
        mockDataStore[table].forEach((row) => {
          if (matchRow(row)) {
            setClauses.forEach(({ column, value }) => {
              row[column] = value;
            });
            rowsAffected++;
          }
        });
  
        success(undefined, { rowsAffected });
      } else if (upperSql.startsWith('DELETE')) {
        const matchRow = parseWhereClause(sql, params);
        const initialLength = mockDataStore[table].length;
        mockDataStore[table] = mockDataStore[table].filter((row) => !matchRow(row));
        const rowsAffected = initialLength - mockDataStore[table].length;
  
        success(undefined, { rowsAffected });
      } else {
        throw new Error('Unhandled SQL statement');
      }
    } catch (e) {
      console.error(e);
      reject(undefined, e);
    }
})

module.exports = SQLite;