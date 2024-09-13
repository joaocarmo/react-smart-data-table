import { Component } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import * as constants from '../helpers/constants'

interface ErrorInfo {
  componentStack: string
}

interface ErrorBoundaryProps {
  logError?: (error: Error, errorInfo: ErrorInfo) => void
  fbComponent?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error
  errorInfo: ErrorInfo
}

class ErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  static defaultProps: ErrorBoundaryProps = {
    logError: () => null,
    fbComponent: null,
  }

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { logError } = this.props

    // Display fallback UI
    this.setState({
      hasError: true,
      error,
      errorInfo,
    })

    // Log the error to an error handling function
    if (typeof logError === 'function') {
      logError(error, errorInfo)
    }
  }

  renderDefaultFB(): ReactNode {
    const { error, errorInfo } = this.state

    return (
      <div>
        <h2>{constants.GENERIC_ERROR_MESSAGE}</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          <summary>{error && error.toString()}</summary>
          <p>{errorInfo.componentStack}</p>
        </details>
      </div>
    )
  }

  render(): ReactNode {
    const { hasError } = this.state
    const { children, fbComponent } = this.props

    if (hasError) {
      // Render the fallback UI
      if (fbComponent) {
        return fbComponent
      }

      return this.renderDefaultFB()
    }

    return children
  }
}

export default ErrorBoundary
