import { Component, ReactNode } from 'react'
import PropTypes from 'prop-types'
import { GENERIC_ERROR_MESSAGE } from '../helpers/constants'

type ErrorInfo = {
  componentStack: string
}

type LogErrorFN = (error: Error, errorInfo: ErrorInfo) => void

interface ErrorBoundaryProps {
  logError?: LogErrorFN
  fbComponent?: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error
  errorInfo: ErrorInfo
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static propTypes: unknown

  static defaultProps: unknown

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

  renderDefaultFB(): JSX.Element {
    const { error, errorInfo } = this.state

    return (
      <div>
        <h2>{GENERIC_ERROR_MESSAGE}</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          <summary>{error && error.toString()}</summary>
          <p>{errorInfo.componentStack}</p>
        </details>
      </div>
    )
  }

  render(): JSX.Element | ReactNode {
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

// Defines the type of data expected in each passed prop
ErrorBoundary.propTypes = {
  logError: PropTypes.func,
  fbComponent: PropTypes.node,
  children: PropTypes.node.isRequired,
}

// Defines the default values for not passing a certain prop
ErrorBoundary.defaultProps = {
  logError: () => null,
  fbComponent: null,
}

export default ErrorBoundary
