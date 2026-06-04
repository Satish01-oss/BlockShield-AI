import {
  useEffect,
  useState
} from 'react'

import {
  motion
} from 'framer-motion'

import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import {
  useParams,
  useNavigate,
} from 'react-router-dom'

import axios from 'axios'

import Navbar from '../components/layout/Navbar'

import {
  useTheme
} from '../context/ThemeContext'

const VerifyEmail = () => {

  const { darkMode } =
    useTheme()

  const { token } =
    useParams()

  const navigate =
    useNavigate()

  const [loading,
    setLoading] =
      useState(true)

  const [success,
    setSuccess] =
      useState(false)

  const [showResend,
    setShowResend] =
      useState(false)

  const [resendLoading,
    setResendLoading] =
      useState(false)

  // ============================================
  // VERIFY EMAIL
  // ============================================

  useEffect(() => {

    const verifyEmail =
      async () => {

        try {

          const response =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/emailVerification/verify-email/${token}`

            )

          console.log(
            response.data
          )

          setSuccess(true)

        } catch (error) {

          console.log(error)

          setSuccess(false)

          if (error.response?.data?.showResend) {
            setShowResend(true)
          }

        } finally {

          setLoading(false)
        }
      }

    if (token) {

      verifyEmail()
    }

  }, [token])

  // ============================================
  // RESEND VERIFICATION EMAIL
  // ============================================

  const handleResendVerification =
    async () => {

      try {

        setResendLoading(true)

        const response =
          await axios.post(

            `${import.meta.env.VITE_API_URL}/api/auth/resend-verification`,

            {
              email:
                localStorage.getItem(
                  'verificationEmail'
                )
            }
          )

        alert(response.data.message)

      } catch (err) {

        console.log(err)

        alert(
          err.response?.data?.message ||
          'Failed to resend email'
        )

      } finally {

        setResendLoading(false)
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

      {/* BACKGROUND GLOW */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.12),_transparent_60%)]" />

      {/* GRID */}

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
          initial={{
            opacity: 0,
            y: 40
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6
          }}
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

              Verify Email

            </h1>

            <p
              className={`mt-4 text-sm sm:text-base leading-relaxed max-w-sm ${
                darkMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >

              Securely verifying your BlockShield AI account.

            </p>

          </div>

          {/* CONTENT */}

          <div className="mt-10">

            {
              loading ? (

                <motion.div
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  className="flex flex-col items-center text-center"
                >

                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">

                    <Loader2
                      size={40}
                      className="text-cyan-400 animate-spin"
                    />

                  </div>

                  <h2 className="text-2xl font-bold text-cyan-400">

                    Verifying Account

                  </h2>

                  <p
                    className={`mt-4 leading-relaxed ${
                      darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >

                    Please wait while we securely verify your email address.

                  </p>

                </motion.div>

              ) : success ? (

                <motion.div
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  className="flex flex-col items-center text-center"
                >

                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">

                    <CheckCircle2
                      size={42}
                      className="text-green-400"
                    />

                  </div>

                  <h2 className="text-2xl font-bold text-green-400">

                    Email Verified

                  </h2>

                  <p
                    className={`mt-4 leading-relaxed ${
                      darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >

                    Your account has been successfully verified.

                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/login')
                    }
                    className="mt-8 w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center font-semibold text-lg shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all"
                  >

                    Continue to Login

                  </button>

                </motion.div>

              ) : (

                <motion.div
                  initial={{
                    opacity: 0
                  }}
                  animate={{
                    opacity: 1
                  }}
                  className="flex flex-col items-center text-center"
                >

                  <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">

                    <XCircle
                      size={42}
                      className="text-red-400"
                    />

                  </div>

                  <h2 className="text-2xl font-bold text-red-400">

                    Verification Failed

                  </h2>

                  <p
                    className={`mt-4 leading-relaxed ${
                      darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}
                  >

                    This verification link is invalid or has expired.

                  </p>

                  {
                    showResend && (

                      <button
                        type="button"
                        onClick={
                          handleResendVerification
                        }
                        className="mt-8 w-full h-14 rounded-2xl border border-blue-500/20 flex items-center justify-center font-semibold text-lg text-blue-400 hover:bg-blue-500/10 transition-all"
                      >

                        {
                          resendLoading
                            ? 'Sending...'
                            : 'Resend Verification Link'
                        }

                      </button>

                    )
                  }

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/register')
                    }
                    className="mt-5 w-full h-14 rounded-2xl border border-red-500/20 flex items-center justify-center font-semibold text-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >

                    Create New Account

                  </button>

                </motion.div>

              )
            }

          </div>

        </motion.div>

      </section>

    </div>
  )
}

export default VerifyEmail