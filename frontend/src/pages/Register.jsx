import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'

const Register = () => {

  const { darkMode } = useTheme()

  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {

    e.preventDefault()

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      toast.error('Passwords do not match')

      return
    }

    try {

      setLoading(true)

      const response = await axios.post(

        `${import.meta.env.VITE_API_URL}/api/register/register`,

        {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        }

      )

      toast.success(response.data.message)

      navigate('/login')

    } catch (err) {

      console.log(err)

      toast.error(
        err.response?.data?.message ||
        'Registration failed'
      )

    } finally {

      setLoading(false)
    }
  }
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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

      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md rounded-[32px] border backdrop-blur-2xl p-10 shadow-2xl ${darkMode
            ? 'bg-black/40 border-cyan-500/10'
            : 'bg-white/80 border-gray-200'
            }`}
        >

          {/* Logo */}

          <div className="flex flex-col items-center text-center">

            <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">

              <ShieldCheck
                size={40}
                className="text-cyan-400"
              />

            </div>

            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">

              Create Account

            </h1>

            <p
              className={`mt-4 leading-relaxed ${darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
                }`}
            >

              Join BlockShield AI and start monitoring blockchain fraud activities.

            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleRegister}
            className="mt-10 space-y-6"
          >

            {/* Full Name */}

            <div>

              <label
                className={`text-sm mb-3 block ${darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}
              >
                Full Name
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border px-5 h-14 ${darkMode
                  ? 'border-gray-800 bg-[#0f172a]'
                  : 'border-gray-300 bg-white'
                  }`}
              >

                <User
                  size={20}
                  className="text-cyan-400"
                />

                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="bg-transparent outline-none w-full"
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label
                className={`text-sm mb-3 block ${darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}
              >
                Email Address
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border px-5 h-14 ${darkMode
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
                  className="bg-transparent outline-none w-full"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label
                className={`text-sm mb-3 block ${darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}
              >
                Password
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border px-5 h-14 ${darkMode
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
                  placeholder="Create password"
                  className="bg-transparent outline-none w-full"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >

                  {
                    showPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }

                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label
                className={`text-sm mb-3 block ${darkMode
                  ? 'text-gray-300'
                  : 'text-gray-700'
                  }`}
              >
                Confirm Password
              </label>

              <div
                className={`flex items-center gap-3 rounded-2xl border px-5 h-14 ${darkMode
                  ? 'border-gray-800 bg-[#0f172a]'
                  : 'border-gray-300 bg-white'
                  }`}
              >

                <Lock
                  size={20}
                  className="text-cyan-400"
                />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="bg-transparent outline-none w-full"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >

                  {
                    showConfirmPassword
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                  }

                </button>

              </div>

            </div>

            {/* Terms */}

            <label className="flex items-start gap-3 text-sm">

              <input
                type="checkbox"
                className="mt-1"
              />

              <span
                className={
                  darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }
              >

                I agree to the Terms & Conditions and Privacy Policy.

              </span>

            </label>

            {/* Register Button */}

            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20"
            >

              {
                loading
                  ? 'Creating Account...'
                  : 'Create Account'
              }

            </button>

            {/* Divider */}

            <div className="flex items-center gap-4">

              <div className="flex-1 h-px bg-gray-700" />

              <span className="text-sm text-gray-500">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-700" />

            </div>

            {/* Google Signup */}

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

            {/* Login */}

            <p
              className={`text-center text-sm ${darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
                }`}
            >

              Already have an account?

              <button
                onClick={() => navigate('/login')}
                className="text-cyan-400 ml-2 hover:underline"
              >

                Login

              </button>

            </p>

          </form>

        </motion.div>

      </section>

    </div>
  )
}

export default Register