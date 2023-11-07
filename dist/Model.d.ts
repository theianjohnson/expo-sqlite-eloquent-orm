import * as SQLite from 'expo-sqlite';
type Casts = {
    [key: string]: 'number' | 'boolean' | 'string' | 'json';
};
type Clauses = {
    select: string;
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
};
type ModelAttributes = {
    [key: string]: any;
};
type SQLResult = {
    insertId?: number;
    rowsAffected: number;
    rows: {
        _array: ModelAttributes[];
        length: number;
        item(index: number): ModelAttributes;
    };
};
export declare class Model {
    static db: SQLite.SQLiteDatabase;
    static tableName: string;
    static casts: Casts;
    clauses: Clauses;
    constructor(attributes?: ModelAttributes);
    select(fields?: string | string[]): this;
    where(column: string, operator: string, value?: any): this;
    orderBy(column: string, direction?: 'ASC' | 'DESC'): this;
    limit(number: number): this;
    with(relation: string): this;
    static select<T extends Model>(this: new () => T, fields?: string | string[]): T;
    static where<T extends Model>(this: new () => T, column: string, operator: string, value?: any): T;
    static orderBy<T extends Model>(this: new () => T, column: string, direction?: 'ASC' | 'DESC'): T;
    static limit<T extends Model>(this: new () => T, number: number): T;
    static with<T extends Model>(this: new () => T, relation: string): T;
    castAttribute(key: keyof Casts, value: any): any;
    prepareAttributeForStorage(key: keyof Casts, value: any): any;
    cleanObject(object: any): any;
    save(): Promise<any>;
    delete(): Promise<any>;
    static executeSql(sql: string, params?: any[]): Promise<SQLResult>;
    get(): Promise<any>;
    first(): Promise<any>;
    update(attributes: Partial<ModelAttributes>): Promise<SQLResult>;
    static find(id: any): Promise<any>;
    static insert(data: any): Promise<SQLResult>;
    static seed(data: any): Promise<void>;
    hasOne<T extends Model>(relatedModel: T, foreignKey: string, localKey?: string): Promise<T | null>;
    hasMany<T extends Model>(relatedModel: T, foreignKey: string, localKey?: string): Promise<T | null>;
    belongsTo<T extends Model>(relatedModel: T, foreignKey: string, otherKey?: string): Promise<T | null>;
}
export {};
