import { MouseEvent } from 'react';
import PropTypes from 'prop-types';
import '../css/paginator.css';
export declare type PageChangeFn = (event: MouseEvent<HTMLElement>, { activePage: number }: {
    activePage: any;
}) => void;
interface PaginatorItemProps {
    active: boolean;
    value: number;
    text: string;
    onPageChange: PageChangeFn;
}
declare const _default: import("react").MemoExoticComponent<{
    ({ active, value, text, onPageChange, }: PaginatorItemProps): JSX.Element;
    propTypes: {
        active: PropTypes.Validator<boolean>;
        value: PropTypes.Requireable<number>;
        text: PropTypes.Validator<string>;
        onPageChange: PropTypes.Validator<(...args: any[]) => any>;
    };
    defaultProps: {
        value: any;
    };
}>;
export default _default;
