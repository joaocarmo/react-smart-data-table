import { Component, ComponentType, MouseEvent, ReactNode } from 'react';
import { WrappedComponentProps } from './components/helpers/with-pagination';
import { Column, Headers, KeyResolverFN, ParseBool, ParseImg, RowClickFN, Sorting, UnknownObject } from './helpers/functions';
import './css/basic.css';
interface SmartDataTableProps {
    className: string;
    data: string | UnknownObject[];
    dataKey: string;
    dataKeyResolver: KeyResolverFN;
    dataRequestOptions: RequestInit;
    dynamic: boolean;
    emptyTable: ReactNode;
    filterValue: string;
    headers: Headers;
    hideUnordered: boolean;
    loader: ReactNode;
    name: string;
    onRowClick: RowClickFN;
    orderedHeaders: string[];
    paginator: ComponentType<WrappedComponentProps>;
    parseBool: boolean | ParseBool;
    parseImg: boolean | ParseImg;
    perPage: number;
    sortable: boolean;
    withFooter: boolean;
    withHeader: boolean;
    withLinks: boolean;
    withToggles: boolean;
}
interface SmartDataTableState {
    activePage: number;
    asyncData: UnknownObject[];
    colProperties: Headers;
    columns: Column[];
    isLoading: boolean;
    prevFilterValue: string;
    sorting: Sorting;
}
declare class SmartDataTable extends Component<SmartDataTableProps, SmartDataTableState> {
    static propTypes: unknown;
    static defaultProps: unknown;
    constructor(props: SmartDataTableProps);
    static getDerivedStateFromProps(props: SmartDataTableProps, state: SmartDataTableState): SmartDataTableState | null;
    componentDidMount(): void;
    componentDidUpdate(prevProps: SmartDataTableProps): void;
    handleRowClick: (event: MouseEvent<HTMLElement>, rowData: UnknownObject, rowIndex: number, tableData: UnknownObject[]) => void;
    handleColumnToggle: (key: string) => void;
    handleOnPageChange: (event: MouseEvent<HTMLElement>, { activePage }: {
        activePage: number;
    }) => void;
    handleSortChange(column: Column): void;
    getColumns(force?: boolean): Column[];
    getRows(): UnknownObject[];
    fetchData(): Promise<void>;
    renderSorting(column: Column): ReactNode;
    renderHeader(columns: Column[]): ReactNode;
    renderRow(columns: Column[], row: UnknownObject, i: number): ReactNode;
    renderBody(columns: Column[], rows: UnknownObject[]): ReactNode;
    renderToggles(columns: Column[]): ReactNode;
    renderPagination(rows: UnknownObject[]): ReactNode;
    render(): ReactNode;
}
export default SmartDataTable;
