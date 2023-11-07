type Migrations = {
    [version: string]: string;
};
export declare class Migration {
    static runMigrations(migrations: Migrations): Promise<void>;
    static createMigrationsTable(): Promise<void>;
    static checkMigration(version: string): Promise<boolean>;
    static applyMigration(version: string, sql: string): Promise<void>;
}
export declare function runMigrations(migrations: Migrations): Promise<void>;
export {};
