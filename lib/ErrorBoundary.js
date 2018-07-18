// Import modules
import React from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error, errorInfo) {
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

  renderDefaultFB() {
    const { error, errorInfo } = this.state
    return (
      <div>
        <h2>
          Something went wrong !
        </h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          <summary>
            {error && error.toString()}
          </summary>
          <p>
            {errorInfo.componentStack}
          </p>
        </details>
      </div>
    )
  }

  render() {
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
  children: PropTypes.node,
}

// Defines the default values for not passing a certain prop
ErrorBoundary.defaultProps = {
  logError: null,
  fbComponent: null,
  children: null,
}

export default ErrorBoundary
