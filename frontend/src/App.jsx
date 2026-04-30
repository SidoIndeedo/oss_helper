import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#00f3ff',
            border: '1px solid #00f3ff',    
            fontFamily: 'monospace',
          },
        }}
      />
      <HomePage />
    </div>
  )
}

export default App