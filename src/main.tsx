import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import { QueryProvider } from './lib/react-query/QueryProvider'
import App2 from './App2'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>

        {/* <App /> */}
        <App2 />

      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
)