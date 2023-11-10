import * as SQLite from 'expo-sqlite';
type Casts = Record<string, 'number' | 'boolean' | 'string' | 'json'>;
interface Clauses {
    select: string;
    joins: Array<{
        type: 'INNER' | 'LEFT' | 'RIGHT';
        table: string;
        firstKey: string;
        secondKey: string;
    }>;
    where: Array<{
        column: string;
        operator: string;
        value?: any;
    }>;
    orderBy: {
        column: string;
        direction: string;
    } | null;
    limit: number | null;
    withRelations: string[];
}
type ModelAttributes = Record<string, any>;
interface SQLResult {
    insertId?: number;
    rowsAffected: number;
    rows: {
        _array: ModelAttributes[];
        length: number;
        item: (index: number) => ModelAttributes;
    };
}
export declare class Model {
    static db: SQLite.SQLiteDatabase;
    static tableName: string;
    static casts: Casts;
    static withTimestamps: boolean;
    static createdAtColumn: string;
    static updatedAtColumn: string;
    clauses: Clauses;
    [key: string]: any;
    constructor(attributes?: ModelAttributes);
    static get(): Promise<Model[]>;
    static select<T extends Model>(this: new () => T, fields?: string | string[]): T;
    static join<T extends Model>(this: new () => T, type: 'INNER' | 'LEFT' | 'RIGHT', table: string, firstKey: string, secondKey: string): T;
    static where<T extends Model>(this: new () => T, column: string, operatorOrValue: any, value?: any): T;
    static orderBy<T extends Model>(this: new () => T, column: string, direction?: 'ASC' | 'DESC'): T;
    static limit<T extends Model>(this: new () => T, number: number): T;
    static with<T extends Model>(this: new () => T, relation: string): T;
    static find(id: number | string): Promise<Model | null>;
    static insert(data: Record<string, any>): Promise<SQLResult>;
    static seed(data: Array<Record<string, any>>): Promise<void>;
    static executeSql(sql: string, params?: any[]): Promise<SQLResult>;
    static castAttribute(key: keyof Casts, value: any): any;
    static prepareAttributeForStorage(key: keyof Casts, value: any): any;
    select(fields?: string | string[]): this;
    join(type: 'INNER' | 'LEFT' | 'RIGHT', table: string, firstKey: string, secondKey: string): this;
    where(column: string, operatorOrValue: any, value?: any): this;
    orderBy(column: string, direction?: 'ASC' | 'DESC'): this;
    limit(number: number): this;
    with(relation: string): this;
    save(): Promise<SQLResult>;
    delete(): Promise<SQLResult>;
    getSql(): {
        query: string;
        params: Array<string | number | boolean | null>;
    };
    get(): Promise<Model[]>;
    first(): Promise<Model | null>;
    update(attributes: Partial<ModelAttributes>): Promise<SQLResult>;
    cleanObject<T extends Model>(object: T): T;
    hasOne<T extends Model>(relatedModel: T, foreignKey: string, localKey?: string): Promise<Model | null>;
    hasMany<T extends Model>(relatedModel: T, foreignKey: string, localKey?: string): Promise<Model[]>;
    belongsTo<T extends Model>(relatedModel: T, foreignKey: string, otherKey?: string): Promise<Model | null>;
    belongsToMany<T extends Model>(this: T, relatedModel: T, joinTableName?: string, // This can be optional if the default naming convention is to be used
    foreignKey?: string, // This can be optional and inferred from the table names
    otherKey?: string): Promise<Model[]>;
}
export {};
