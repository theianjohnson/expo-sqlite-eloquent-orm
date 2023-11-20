import { Model } from './Model'

type Migrations = Record<string, string>

export class Migration {
  static async runMigrations (migrations: Migrations): Promise<Record<string, string>[]> {
    await this.createMigrationsTable()
    const migrationsRun = [];
    for (const [version, sql] of Object.entries(migrations)) {
      const migrationApplied = await this.checkMigration(version)
      if (!migrationApplied) {
        await this.applyMigration(version, sql)
        migrationsRun.push({version, sql});
      } else {
        console.log('No migrations to apply.')
      }
    }

    return migrationsRun;
  }

  static async createMigrationsTable (): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        version TEXT PRIMARY KEY NOT NULL
      );
    `
    await Model.executeSql(sql)
  }

  static async checkMigration (version: string): Promise<boolean> {
    const sql = 'SELECT version FROM migrations WHERE version = ?'
    const result = await Model.executeSql(sql, [version])
    return result.rows.length > 0
  }

  static async applyMigration (version: string, sql: string): Promise<void> {
    await Model.executeSql(sql)
    const insertSql = 'INSERT INTO migrations (version) VALUES (?)'
    await Model.executeSql(insertSql, [version])
    console.log(`Migration ${version} applied.`)
  }
}
