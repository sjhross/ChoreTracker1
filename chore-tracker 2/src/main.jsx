import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QuestProvider } from './context/QuestContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuestProvider>
      <App />
    </QuestProvider>
  </StrictMode>,
)
