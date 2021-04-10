/// <reference types="react" />
import PropTypes from 'prop-types';
import { PageChangeFn } from './PaginatorItem';
import '../css/paginator.css';
interface PaginatorProps {
    activePage: number;
    totalPages: number;
    onPageChange: PageChangeFn;
}
declare const _default: import("react").MemoExoticComponent<{
    ({ activePage, totalPages, onPageChange, }: PaginatorProps): JSX.Element;
    propTypes: {
        activePage: PropTypes.Validator<number>;
        totalPages: PropTypes.Validator<number>;
        onPageChange: PropTypes.Validator<(...args: any[]) => any>;
    };
}>;
export default _default;
