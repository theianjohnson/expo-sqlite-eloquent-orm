type Migrations = Record<string, string>;
export declare class Migration {
    static runMigrations(migrations: Migrations): Promise<Record<string, string>[]>;
    static createMigrationsTable(): Promise<void>;
    static checkMigration(version: string): Promise<boolean>;
    static applyMigration(version: string, sql: string): Promise<void>;
}
export {};
