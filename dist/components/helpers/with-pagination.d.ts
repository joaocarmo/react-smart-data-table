import { ComponentType } from 'react';
import { PageChangeFn } from '../PaginatorItem';
import { UnknownObject } from '../../helpers/functions';
export interface WrappedComponentProps {
    activePage: number;
    onPageChange: PageChangeFn;
    totalPages: number;
}
interface PaginationWrapperProps {
    rows: UnknownObject[];
    perPage: number;
    activePage: number;
    onPageChange: PageChangeFn;
}
declare const withPagination: (WrappedComponent: ComponentType<WrappedComponentProps>) => ComponentType<PaginationWrapperProps>;
export default withPagination;
