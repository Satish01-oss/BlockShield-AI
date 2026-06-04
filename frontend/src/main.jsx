import React from 'react'
import ReactDOM from 'react-dom/client'

import {
  BrowserRouter
} from 'react-router-dom'

import {
  Toaster
} from 'react-hot-toast'

import {
  GoogleOAuthProvider
} from '@react-oauth/google'

import App from './App'
import './index.css'

import AuthProvider from './context/AuthContext'

import {
  ThemeProvider
} from './context/ThemeContext'

ReactDOM.createRoot(
  document.getElementById('root')
).render(

    <GoogleOAuthProvider
      clientId={
        import.meta.env
          .VITE_GOOGLE_CLIENT_ID
      }
    >

      <BrowserRouter>

        <ThemeProvider>

          <AuthProvider>

            <Toaster
              position="top-right"
              reverseOrder={false}
            />

            <App />

          </AuthProvider>

        </ThemeProvider>

      </BrowserRouter>

    </GoogleOAuthProvider>
)