import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainLayout from './MainLayout/MainLayout'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainLayout />
  </StrictMode>,
)
