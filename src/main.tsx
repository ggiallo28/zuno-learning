import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/app.tsx'
import './app/globals.css'

// Import and configure Amplify
import { configureAmplify } from './lib/authConfig'
// Import error handling
import { setupGlobalErrorHandling } from './lib/errorHandling'
import ErrorBoundary from './components/ErrorBoundary'

// Set up global error handling
setupGlobalErrorHandling()

// Configure Amplify with Cognito authentication
configureAmplify()

// Only log in development
if (!import.meta.env.PROD) {
  console.log('🚀 Starting Zuno with Cognito authentication')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)