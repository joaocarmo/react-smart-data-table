/// <reference types="react" />
import PropTypes from 'prop-types';
import { Column, Headers } from '../helpers/functions';
import '../css/toggles.css';
declare type ColumnToggleFn = (key: string) => void;
interface TogglesProps {
    columns: Column[];
    colProperties: Headers;
    handleColumnToggle: ColumnToggleFn;
}
declare const Toggles: {
    ({ columns, colProperties, handleColumnToggle: onColumnToggle, }: TogglesProps): JSX.Element;
    propTypes: {
        columns: PropTypes.Validator<object[]>;
        colProperties: PropTypes.Validator<{
            [x: string]: PropTypes.InferProps<{
                key: PropTypes.Requireable<string>;
                text: PropTypes.Requireable<string>;
                invisible: PropTypes.Requireable<boolean>;
                sortable: PropTypes.Requireable<boolean>;
                filterable: PropTypes.Requireable<boolean>;
            }>;
        }>;
        handleColumnToggle: PropTypes.Validator<(...args: any[]) => any>;
    };
};
export default Toggles;
