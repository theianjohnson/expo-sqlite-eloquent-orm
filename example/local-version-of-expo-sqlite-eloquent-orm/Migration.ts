import { Model } from './Model';

type Migrations = {
  [version: string]: string;
};

export class Migration {
  static async runMigrations(migrations: Migrations): Promise<void> {
    await this.createMigrationsTable();
    for (const [version, sql] of Object.entries(migrations)) {
      const migrationApplied = await this.checkMigration(version);
      if (!migrationApplied) {
        await this.applyMigration(version, sql);
      } else {
        console.log(`No migrations to apply.`);
      }
    }
  }

  static async createMigrationsTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        version TEXT PRIMARY KEY NOT NULL
      );
    `;
    await Model.executeSql(sql);
  }

  static async checkMigration(version: string): Promise<boolean> {
    const sql = `SELECT version FROM migrations WHERE version = ?`;
    const result = await Model.executeSql(sql, [version]);
    return result.rows.length > 0;
  }

  static async applyMigration(version: string, sql: string): Promise<void> {
    await Model.executeSql(sql);
    const insertSql = `INSERT INTO migrations (version) VALUES (?)`;
    await Model.executeSql(insertSql, [version]);
    console.log(`Migration ${version} applied.`);
  }
}

// Exported async function to run migrations
export async function runMigrations(migrations: Migrations): Promise<void> {
  try {
    await Migration.runMigrations(migrations);
    console.log('Running migrations complete.');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}