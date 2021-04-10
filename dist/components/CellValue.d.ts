import { ReactNode } from 'react';
import { ParseBool, ParseImg } from '../helpers/functions';
interface CellValueProps {
    children: ReactNode;
    content?: ReactNode;
    filterable: boolean;
    filterValue: string;
    isImg: boolean;
    parseBool: boolean | ParseBool;
    parseImg: boolean | ParseImg;
    withLinks: boolean;
}
declare const _default: import("react").NamedExoticComponent<CellValueProps>;
export default _default;
