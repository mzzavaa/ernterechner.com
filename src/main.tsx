import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UnitProvider } from './units.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnitProvider>
      <App />
    </UnitProvider>
  </StrictMode>,
)
