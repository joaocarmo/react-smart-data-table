import { DetailedHTMLProps, TableHTMLAttributes } from 'react';
import PropTypes from 'prop-types';
declare type TableProps = DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
declare const Table: {
    ({ children, ...props }: TableProps): JSX.Element;
    propTypes: {
        children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    };
    defaultProps: {
        children: any;
    };
    Body: {
        ({ children, ...props }: {
            [x: string]: any;
            children: any;
        }): JSX.Element;
        propTypes: {
            children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        };
        defaultProps: {
            children: any;
        };
    };
    Cell: {
        ({ children, ...props }: {
            [x: string]: any;
            children: any;
        }): JSX.Element;
        propTypes: {
            children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        };
        defaultProps: {
            children: any;
        };
    };
    Footer: {
        ({ children, ...props }: {
            [x: string]: any;
            children: any;
        }): JSX.Element;
        propTypes: {
            children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        };
        defaultProps: {
            children: any;
        };
    };
    Header: {
        ({ children, ...props }: {
            [x: string]: any;
            children: any;
        }): JSX.Element;
        propTypes: {
            children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        };
        defaultProps: {
            children: any;
        };
    };
    HeaderCell: {
        ({ children, ...props }: {
            [x: string]: any;
            children: any;
        }): JSX.Element;
        propTypes: {
            children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        };
        defaultProps: {
            children: any;
        };
    };
    Row: {
        ({ children, ...props }: {
            [x: string]: any;
            children: any;
        }): JSX.Element;
        propTypes: {
            children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        };
        defaultProps: {
            children: any;
        };
    };
};
export default Table;
