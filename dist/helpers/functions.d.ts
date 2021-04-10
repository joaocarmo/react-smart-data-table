import { CSSProperties, MouseEvent, ReactNode } from 'react';
export declare type UnknownObject<T = unknown> = Record<string, T>;
export declare type ParseBool = {
    noWord: string;
    yesWord: string;
};
export declare type ParseImg = {
    style: CSSProperties;
    className: string;
};
export declare type TransformFN = (value: unknown, index: number, row: UnknownObject) => ReactNode;
export declare type RowClickFN = (event: MouseEvent<HTMLElement>, { rowData, rowIndex, tableData, }: {
    rowData: UnknownObject;
    rowIndex: number;
    tableData: UnknownObject[];
}) => void;
export interface Column {
    key: string;
    text: string;
    invisible: boolean;
    sortable: boolean;
    filterable: boolean;
    isImg: boolean;
    transform?: TransformFN;
}
export declare type Headers = Record<string, Column>;
export declare type Sorting = {
    key: string;
    dir: string;
};
export interface Highlight {
    first: string | undefined;
    highlight: string | undefined;
    last: string | undefined;
    value: string;
}
export interface RenderOptions {
    children?: ReactNode;
    content?: ReactNode;
    parseBool?: boolean | ParseBool;
}
export declare type KeyResolverFN = (args: UnknownObject) => UnknownObject[];
export declare const head: <T>([first]: T[]) => T;
export declare const tail: <T>(arr: T[]) => T;
export declare const isString: (str: unknown) => boolean;
export declare const isArray: (obj: unknown) => boolean;
export declare const isObject: (obj: unknown) => boolean;
export declare const isEmpty: (obj: unknown[] | UnknownObject) => boolean;
export declare const isFunction: (fn: (...args: unknown[]) => unknown) => boolean;
export declare const isNumber: (num: unknown) => boolean;
export declare const isUndefined: (undef: unknown) => boolean;
export declare const capitalize: (str: string) => string;
export declare const sortBy: (arr: UnknownObject[], key: string) => UnknownObject[];
export declare const cleanLonelyInt: (val: unknown) => boolean;
export declare const debugPrint: (...args: unknown[]) => void;
export declare const errorPrint: (...args: unknown[]) => void;
export declare function generatePagination(activePage?: number, totalPages?: number, margin?: number): {
    active: boolean;
    value: number | undefined;
    text: string;
}[];
export declare function getNestedObject(nestedObj: UnknownObject, pathArr: string[]): unknown;
export declare function fetchData(data: string | unknown[], { dataKey, dataKeyResolver, options, }?: {
    dataKey?: string;
    dataKeyResolver?: KeyResolverFN;
    options?: RequestInit;
}): Promise<UnknownObject[]>;
export declare function capitalizeAll(arr: string[]): string;
export declare function parseHeader(val: string): string;
export declare function valueOrDefault<T = unknown>(value: unknown, defaultValue: T): T;
export declare function columnObject(key: string, headers?: Headers): Column;
export declare function parseDataForColumns(data?: UnknownObject[], headers?: Headers, orderedHeaders?: string[], hideUnordered?: boolean): Column[];
export declare function parseDataForRows(data?: UnknownObject[]): UnknownObject[];
export declare function filterRowsByValue(value: string, rows: UnknownObject[], colProperties: Headers): UnknownObject[];
export declare function filterRows(value: string, rows: UnknownObject[], colProperties: Headers): UnknownObject[];
export declare function sliceRowsPerPage(rows: UnknownObject[], currentPage: number, perPage: number): UnknownObject[];
export declare function sortData(filterValue: string, colProperties: Headers, sorting: Sorting, data: UnknownObject[]): UnknownObject[];
export declare function isDataURL(url: unknown): boolean;
export declare function isImage(url: string): boolean;
export declare function highlightValueParts(value: string, filterValue: string): Highlight;
export declare function getRenderValue({ children, content, parseBool, }?: RenderOptions): string;
