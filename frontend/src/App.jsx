import { Routes, Router , Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import FraudDetection from './pages/FraudDetection'
import History from './pages/History'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail'
import ProtectedRoute from './Routes/ProtectedRoutes'
import ResetPassword from './pages/ResetPassword'
import Analytics from './pages/Analytics'

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
  path="/fraud-detection"
  element={
    <ProtectedRoute>
      <FraudDetection />
    </ProtectedRoute>
  }
/>

<Route
  path="/history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<NotFound />} />

      <Route
  path="/admin"
  element={
    <ProtectedRoute>
      <Admin />
    </ProtectedRoute>
  }
/>

  <Route
  path="/forgot-password"
  element={
      <ForgotPassword />
  }
/>

  <Route
  path="/reset-password/:token"
  element={
      <ResetPassword />
  }
/>

<Route
  path="/verify-email/:token"
  element={
      <VerifyEmail />
  }
/>

<Route
  path="/dashboard"
  element={
      <Dashboard />
  }
/>

<Route
  path="/analytics"
  element={
      <Analytics />
  }
/>
    </Routes>
  )
}

export default App