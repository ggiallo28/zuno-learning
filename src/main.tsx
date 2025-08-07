import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import App from './app/app-with-mock-data.tsx'
import './app/globals.css'

// Import Amplify configuration
import amplifyconfig from './amplifyconfiguration.json'

// Configure Amplify
Amplify.configure(amplifyconfig)

import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)