import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/app.tsx'
import './app/globals.css'

// Import and configure Amplify with auth mode support
import { configureAmplify } from './lib/authConfig'

// Configure Amplify with appropriate auth mode
const authConfig = configureAmplify()
console.log(`🚀 Starting Zuno with ${authConfig.mode.toUpperCase()} authentication`)

import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)