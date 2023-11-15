// @ts-nocheck
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

function parseJoinClauses(sql) {
  console.log('parseJoinClauses()', sql);
  const joins = [];
  const joinRegex = /JOIN (\w+) ON (\w+\.\w+) = (\w+\.\w+)/gi;
  let match;
  while ((match = joinRegex.exec(sql)) !== null) {
    joins.push({
      joinedTable: match[1],
      firstTableColumn: match[2],
      secondTableColumn: match[3],
    });
  }

  console.log('joins', joins)

  return joins;
}

function applyJoins(rows, joins) {
  // This function will merge data from joined tables into the main table's rows
  return rows.map(row => {
    let joinedData = {};
    joins.forEach(join => {
      const [firstTable, firstColumn] = join.firstTableColumn.split('.');
      const [secondTable, secondColumn] = join.secondTableColumn.split('.');

      // Find matching rows in the joined table
      const matchingRows = mockDataStore[join.joinedTable].filter(relatedRow => {
        console.log(`Comparing ${row[secondColumn]} with ${relatedRow[firstColumn]}`, row, relatedRow)
        return String(row[secondColumn]) === String(relatedRow[firstColumn]);
      });

      console.log('matchingRows', matchingRows);

      // Merge all matching rows data
      matchingRows.forEach(match => {
        joinedData = { ...joinedData, ...match };
      });
    });
    return { ...row, ...joinedData };
  });
}

mockExecuteSql.mockImplementation((sql, params, success, failure) => {
  try {
    const upperSql = sql.trim().toUpperCase();
    const table = findTableInSql(sql);
    let rows;

    const joins = parseJoinClauses(sql);

    if (upperSql.startsWith('SELECT')) {
      rows = mockDataStore[table];

      // Apply the JOIN logic if joins are present
      if (joins.length > 0) {
        rows = applyJoins(rows, joins);
      }

      console.log('rows', rows);

      // Implementing WHERE clause parsing to filter the result set
      const whereMatch = sql.match(/WHERE (\w+\.\w+|\w+) = \?/i);
      let whereColumn, whereValue;
      if (whereMatch) {
        whereColumn = whereMatch[1].includes('.') ? whereMatch[1].split('.')[1] : whereMatch[1];
        whereValue = params[0]; // Assuming there's only one parameter for the WHERE clause
      }

      rows = rows.filter(row => {
        // If a WHERE clause is present, filter the rows based on the condition
        return whereColumn ? String(row[whereColumn]) === String(whereValue) : true;
      });

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
      // Extract the WHERE clause
      const whereMatch = sql.match(/WHERE (\w+) = \?/i);
      let whereColumn, whereValue;
      if (whereMatch) {
        whereColumn = whereMatch[1];
        whereValue = params[params.length - 1]; // Assuming there's only one parameter for the WHERE clause and removing it from params.
      }

      // Extract the SET clause
      const setClauseMatch = sql.match(/SET (.+?) WHERE/i);
      if (!setClauseMatch) throw new Error('No SET clause found');
      const setClauseString = setClauseMatch[1];
      const setClauses = setClauseString.split(',').map((clause) => {
        const [column, valuePlaceholder] = clause.trim().split('=');
        const placeholderIndex = sql.substring(0, sql.indexOf(clause)).match(/\?/g)?.length || 0;
        const value = params[placeholderIndex]; // Adjust for zero-based index.
        return { column: column.trim(), value: value };
      });

      // Update the rows
      let rowsAffected = 0;
      mockDataStore[table].forEach((row) => {
        if (!whereColumn || String(row[whereColumn]) === String(whereValue)) {
          setClauses.forEach(({ column, value }) => {
            row[column] = value;
          });
          rowsAffected++;
        }
      });

      success(undefined, { rowsAffected });
    } else if (upperSql.startsWith('DELETE')) {
      // Extract the condition from the WHERE clause
      const wherePart = sql.match(/WHERE\s+(.+)/i);
      if (!wherePart) throw new Error('DELETE statement must include a WHERE clause');
    
      const condition = wherePart[1].trim();
      // Assume only one condition for simplicity
      const [column, placeholder] = condition.split('=').map(c => c.trim());
      // Find the index of the placeholder in the params array
      const placeholderIndex = sql.substring(0, sql.indexOf(placeholder)).split('?').length - 1;
      const value = params[placeholderIndex];
    
      // Calculate rows affected before deletion
      const initialLength = mockDataStore[table].length;
    
      // Filter out the rows that match the condition
      mockDataStore[table] = mockDataStore[table].filter(row => {
        // Ensure the comparison is done with the correct type
        const rowValue = (typeof row[column] === 'number') ? parseInt(value, 10) : value;
        return row[column] !== rowValue;
      });
    
      const rowsAffected = initialLength - mockDataStore[table].length;
    
      success(undefined, { rowsAffected });
    } else {
      throw new Error('Unhandled SQL statement');
    }    
  } catch (e) {
    console.error(e);
    failure(undefined, e);
  }
})

module.exports = SQLite;