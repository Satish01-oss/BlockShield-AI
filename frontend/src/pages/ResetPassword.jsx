import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import { useTheme } from '../context/ThemeContext'

const ResetPassword = () => {

  const { darkMode } = useTheme()

  const navigate = useNavigate()

  const { token } = useParams()

  const [showPassword, setShowPassword] = useState(false)

  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {

  e.preventDefault()

  if (
    formData.password !==
    formData.confirmPassword
  ) {

    alert('Passwords do not match')

    return
  }

  try {

    setLoading(true)

    const response = await axios.post(

      `${import.meta.env.VITE_API_URL}/api/resetPassword/reset-password/${token}`,

      {
        password: formData.password,
      }

    )

    console.log(response.data)

    setSuccess(true)

    setTimeout(() => {

      navigate('/login')

    }, 2500)

  } catch (err) {

    console.log(err)

    alert(
      err.response?.data?.message ||
      'Password reset failed'
    )

  } finally {

    setLoading(false)
  }
}

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-[#030712] text-white'
          : 'bg-[#f5f7fb] text-black'
      }`}
    >

      {/* Background Glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.12),_transparent_60%)]" />

      {/* Grid */}

      <div
        className={`absolute top-0 left-0 w-full h-full bg-[size:60px_60px] ${
          darkMode
            ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]'
        }`}
      />

      <Navbar />

      {/* MAIN */}

      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md rounded-[32px] border backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-300 ${
            darkMode
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

              Reset Password

            </h1>

            <p
              className={`mt-4 text-sm sm:text-base leading-relaxed max-w-sm ${
                darkMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >

              Create a new secure password for your BlockShield AI account.

            </p>

          </div>

          {/* SUCCESS */}

          {
            success ? (

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10"
              >

                <div
                  className={`rounded-3xl border p-6 text-center ${
                    darkMode
                      ? 'bg-cyan-500/10 border-cyan-500/20'
                      : 'bg-cyan-50 border-cyan-200'
                  }`}
                >

                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-5">

                    <CheckCircle2
                      size={32}
                      className="text-cyan-400"
                    />

                  </div>

                  <h2 className="text-2xl font-bold text-cyan-400">

                    Password Updated

                  </h2>

                  <p
                    className={`mt-4 leading-relaxed ${
                      darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >

                    Your password has been successfully updated. Redirecting to login...

                  </p>

                </div>

              </motion.div>

            ) : (

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* PASSWORD */}

                <div>

                  <label
                    className={`text-sm mb-2 block ${
                      darkMode
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    New Password
                  </label>

                  <div
                    className={`flex items-center gap-3 rounded-2xl border px-4 sm:px-5 h-14 transition-all ${
                      darkMode
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
                      placeholder="Enter new password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    className={`text-sm mb-2 block ${
                      darkMode
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}
                  >
                    Confirm Password
                  </label>

                  <div
                    className={`flex items-center gap-3 rounded-2xl border px-4 sm:px-5 h-14 transition-all ${
                      darkMode
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
                      placeholder="Confirm new password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-transparent outline-none w-full text-sm sm:text-base"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-cyan-400 transition-all"
                    >

                      {
                        showConfirmPassword
                          ? <EyeOff size={20} />
                          : <Eye size={20} />
                      }

                    </button>

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 font-semibold text-base sm:text-lg hover:scale-[1.01] transition-all shadow-lg shadow-cyan-500/20"
                >

                  {
                    loading
                      ? 'Updating Password...'
                      : 'Reset Password'
                  }

                </button>

              </form>

            )
          }

          {/* LOGIN */}

          <p
            className={`text-center text-sm mt-8 ${
              darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >

            Back to

            <button
            type="button"
              onClick={() => navigate('/login')}
              className="text-cyan-400 ml-2 hover:underline"
            >

              Login

            </button>

          </p>

        </motion.div>

      </section>

    </div>
  )
}

export default ResetPassword