import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'

import Navbar from '../components/layout/Navbar'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

import {
  useGoogleLogin
} from '@react-oauth/google'


const Login = () => {

  const { darkMode } = useTheme()

  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const { login } =
    useContext(AuthContext)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleChange = (e) => {

    const { name, value, checked, type } = e.target

    setFormData({
      ...formData,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    })
  }

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      const response = await axios.post(

        `${import.meta.env.VITE_API_URL}/api/login/login`,

        {
          email: formData.email,
          password: formData.password,
        }

      )

      login(response.data)

      toast.success(response.data.message)

      navigate('/dashboard')

    } catch (err) {

      console.log(err)

      toast.error(
        err.response?.data?.message ||
        'Login failed'
      )

    } finally {

      setLoading(false)
    }
  }

  const googleLogin = useGoogleLogin({

    flow: 'implicit',

    onSuccess: async (tokenResponse) => {

      try {

        const response = await axios.post(

          `${import.meta.env.VITE_API_URL}/api/login/google`,

          {

            access_token:
              tokenResponse.access_token

          }

        )

        login(response.data)
        toast.success(response.data.message)

        navigate('/dashboard')

      } catch (err) {

        console.log(err)
        toast.error(
          err.response?.data?.message ||
          'Google login failed'
        )

      }
    },

    onError: () => {

      console.log(
        'Google Login Failed'
      )

    }

  })

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-300 ${darkMode
        ? 'bg-[#030712] text-white'
        : 'bg-[#f5f7fb] text-black'
        }`}
    >

      {/* Background Glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.12),_transparent_60%)]" />

      {/* Grid */}

      <div
        className={`absolute top-0 left-0 w-full h-full bg-[size:60px_60px] ${darkMode
          ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
          : 'bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]'
          }`}
      />

      <Navbar />

      {/* MAIN SECTION */}

      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-25 pb-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md rounded-[32px] border backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-300 ${darkMode
            ? 'bg-black/40 border-cyan-500/10'
            : 'bg-white/80 border-gray-200'
            }`}
        >

          {/* TOP */}

          <div className="flex flex-col items-center text-center">

            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">

              <ShieldCheck
                size={36}
                className="text-cyan-400"
              />

            </div>

            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">

              Welcome Back

            </h1>

            <p
              className={`mt-4 text-sm sm:text-base leading-relaxed max-w-sm ${darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
                }`}
            >

              Login to continue monitoring blockchain fraud activities.

            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                className={`text-sm mb-2 block ${darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}
              >
                Email Address
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border px-4 sm:px-5 h-14 transition-all ${darkMode
                  ? 'border-gray-800 bg-[#0f172a]'
                  : 'border-gray-300 bg-white'
                  }`}
              >

                <Mail
                  size={20}
                  className="text-cyan-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="bg-transparent outline-none w-full text-sm sm:text-base"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                className={`text-sm mb-2 block ${darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}
              >
                Password
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border px-4 sm:px-5 h-14 transition-all ${darkMode
                  ? 'border-gray-800 bg-[#0f172a]'
                  : 'border-gray-300 bg-white'
                  }`}
              >

                <Lock
                  size={20}
                  className="text-cyan-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-transparent outline-none w-full text-sm sm:text-base"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-cyan-400 transition-all"
                >

                  {
                    showPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }

                </button>

              </div>

            </div>

            {/* REMEMBER */}

            <div className="flex items-center justify-between gap-4 flex-wrap">

              <label className="flex items-center gap-3 text-sm">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                Remember me

              </label>

              <button
              type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-cyan-400 hover:underline text-sm"
              >

                Forgot Password?

              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-base sm:text-lg hover:scale-[1.01] transition-all shadow-lg shadow-cyan-500/20"
            >

              {
                loading
                  ? 'Authenticating...'
                  : 'Login'
              }

            </button>

            {/* DIVIDER */}

            <div className="flex items-center gap-4 py-1">

              <div className="flex-1 h-px bg-gray-700" />

              <span className="text-sm text-gray-500">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-700" />

            </div>

            {/* GOOGLE */}

            <button
              type="button"

              onClick={() => googleLogin()}

              className={`w-full h-14 rounded-2xl border flex items-center justify-center gap-4 font-medium transition-all ${darkMode
                ? 'border-gray-800 bg-[#0f172a] hover:bg-[#111827]'
                : 'border-gray-300 bg-white hover:bg-gray-100'
                }`}
            >

              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />

              Continue with Google

            </button>

            {/* REGISTER */}

            <p
              className={`text-center text-sm pt-2 ${darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
                }`}
            >

              Don&apos;t have an account?

              <button
              type="button"
                onClick={() => navigate('/register')}
                className="text-cyan-400 ml-2 hover:underline"
              >

                Create Account

              </button>

            </p>

          </form>

        </motion.div>

      </section>

    </div>
  )
}

export default Login