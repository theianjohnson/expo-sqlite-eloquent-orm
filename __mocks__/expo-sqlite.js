const mockTransaction = jest.fn();
const mockExecuteSql = jest.fn();

// This is a simple in-memory store to simulate the database.
let mockDataStore = {
  people: [
    { id: 1, name: 'Nora', group_id: 1 },
    { id: 2, name: 'Alice', group_id: 2 },
    { id: 3, name: 'Bob', group_id: 3 }
  ],
  groups: [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friends' },
    { id: 3, name: 'Coworkers' }
  ]
};

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
  if (sql.includes('FROM people')) return 'people';
  if (sql.includes('FROM groups')) return 'groups';
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
        const newId = mockDataStore[table].length + 1;
        const newRow = { id: newId, ...params[0] }; // Assuming params[0] is an object of column values.
        mockDataStore[table].push(newRow);

        success(undefined, { insertId: newId, rowsAffected: 1 });
      } else if (upperSql.startsWith('UPDATE')) {
        const matchRow = parseWhereClause(sql, params);
        const setClauseMatch = sql.match(/SET (.+?) WHERE/i);
        if (!setClauseMatch) throw new Error('No SET clause found');
        const setClauses = setClauseMatch[1].split(',').map((clause) => clause.trim().split('='));
        
        mockDataStore[table].forEach((row) => {
          if (matchRow(row)) {
            setClauses.forEach(([column, valuePlaceholder]) => {
              const valueIndex = parseInt(valuePlaceholder.match(/\$(\d+)/)[1], 10) - 1;
              row[column] = params[valueIndex];
            });
          }
        });

        success(undefined, { rowsAffected: 1 }); // Simplified to always affect one row.
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
      reject(undefined, e);
    }
})

module.exports = SQLite;