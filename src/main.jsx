import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/kanit/thai-400.css'
import '@fontsource/kanit/thai-500.css'
import '@fontsource/kanit/thai-600.css'
import '@fontsource/kanit/latin-400.css'
import '@fontsource/kanit/latin-500.css'
import '@fontsource/kanit/latin-600.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
