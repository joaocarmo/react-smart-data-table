import { Component, ReactNode } from 'react';
declare type ErrorInfo = {
    componentStack: string;
};
declare type LogErrorFN = (error: Error, errorInfo: ErrorInfo) => void;
interface ErrorBoundaryProps {
    logError?: LogErrorFN;
    fbComponent?: ReactNode;
    children: ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error;
    errorInfo: ErrorInfo;
}
declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static propTypes: unknown;
    static defaultProps: unknown;
    constructor(props: ErrorBoundaryProps);
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    renderDefaultFB(): JSX.Element;
    render(): JSX.Element | ReactNode;
}
export default ErrorBoundary;
