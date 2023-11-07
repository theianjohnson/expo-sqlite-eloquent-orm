export declare class Migrations {
    static runMigrations(migrations: any): Promise<void>;
    static createMigrationsTable(): Promise<void>;
    static checkMigration(version: any): Promise<boolean>;
    static applyMigration(version: any, sql: any): Promise<void>;
}
export declare function runMigrations(migrations: any): Promise<void>;
