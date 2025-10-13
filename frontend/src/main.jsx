import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css';
import App from './App'
import { AppProviders } from './context/AppProviders';

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  // <React.StrictMode>
  <AppProviders>
    <App />
  </AppProviders>
  //  </React.StrictMode> 
)
