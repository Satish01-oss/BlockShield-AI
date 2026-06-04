import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react'

import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import { useContext } from 'react'

import {
  AuthContext
} from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'


const Navbar = () => {

  const [mobileMenu, setMobileMenu] = useState(false)

  const { user } =
    useContext(AuthContext)

  return (
    <nav className="w-full border-b border-gray-800 bg-black/40 backdrop-blur-lg fixed top-0 left-0 z-50">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <ShieldCheck className="text-cyan-400" />

          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">

            BlockShield AI

          </h1>

        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="hidden md:flex items-center gap-10">

          {/* NAV LINKS */}

          <div className="flex items-center gap-6">

            <Link
              to="/"
              className="text-gray-300 hover:text-cyan-400 transition-all"
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-cyan-400 transition-all"
            >
              Dashboard
            </Link>

            <Link
              to="/fraud-detection"
              className="text-gray-300 hover:text-cyan-400 transition-all"
            >
              Fraud Detection
            </Link>

            <Link
              to="/analytics"
              className="text-gray-300 hover:text-cyan-400 transition-all"
            >
              Analytics
            </Link>

            <Link
              to="/history"
              className="text-gray-300 hover:text-cyan-400 transition-all"
            >
              History
            </Link>

          </div>

          {/* AUTH BUTTONS */}

          {
            user ? (

              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-2xl border border-cyan-500/20 bg-white/5 hover:bg-white/10 transition-all"
                >

                {/* Avatar */}

                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">

                  {
                    user?.userName?.charAt(0).toUpperCase()
                  }

                </div>

                {/* Name */}

                <div className="hidden lg:flex flex-col">

                  <span className="text-sm font-semibold text-white">

                    {user?.userName}

                  </span>

                  <span className="text-xs text-gray-400">

                    {user?.role}

                  </span>

                </div>
              </Link>
            ) : (

              <div className="flex items-center gap-4">

                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl border border-cyan-500 hover:bg-cyan-500/20 transition-all text-white"
                >

                  Login

                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 transition-all text-white"
                >

                  Register

                </Link>

              </div>

            )
          }

        </div>

        {/* MOBILE BURGER */}

        <button
        type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-white"
        >

          {
            mobileMenu
              ? <X size={28} />
              : <Menu size={28} />
          }

        </button>

        <ThemeToggle/>

      </div>

      {/* MOBILE MENU */}

      <AnimatePresence>

        {
          mobileMenu && (

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-2xl"
            >

              <div className="px-6 py-6 flex flex-col gap-4">

                {/* NAV LINKS */}

                <Link
                  to="/"
                  onClick={() => setMobileMenu(false)}
                  className="px-5 py-3 rounded-2xl hover:bg-white/5 transition-all text-white"
                >

                  Home

                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenu(false)}
                  className="px-5 py-3 rounded-2xl hover:bg-white/5 transition-all text-white"
                >

                  Dashboard

                </Link>

                <Link
                  to="/fraud-detection"
                  onClick={() => setMobileMenu(false)}
                  className="px-5 py-3 rounded-2xl hover:bg-white/5 transition-all text-white"
                >

                  Fraud Detection

                </Link>

                <Link
                  to="/analytics"
                  onClick={() => setMobileMenu(false)}
                  className="px-5 py-3 rounded-2xl hover:bg-white/5 transition-all text-white"
                >

                  Analytics

                </Link>

                <Link
                  to="/history"
                  onClick={() => setMobileMenu(false)}
                  className="px-5 py-3 rounded-2xl hover:bg-white/5 transition-all text-white"
                >

                  History

                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenu(false)}
                  className="px-5 py-3 rounded-2xl hover:bg-white/5 transition-all text-white"
                >

                  Profile

                </Link>

                {/* BUTTONS */}

                {
                  user ? (

                    <Link
                      to="/profile"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-cyan-500/20"
                    >

                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">

                        {
                          user?.userName?.charAt(0).toUpperCase()
                        }

                      </div>

                      <div>

                        <h3 className="font-semibold text-white">

                          {user?.userName}

                        </h3>

                        <p className="text-sm text-gray-400">

                          {user?.role}

                        </p>

                      </div>

                    </Link>

                  ) : (

                    <div className="flex flex-col gap-3 pt-4">

                      <Link
                        to="/login"
                        onClick={() => setMobileMenu(false)}
                        className="w-full h-12 rounded-2xl border border-cyan-500 flex items-center justify-center hover:bg-cyan-500/20 transition-all text-white"
                      >

                        Login

                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setMobileMenu(false)}
                        className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center hover:opacity-90 transition-all text-white"
                      >

                        Register

                      </Link>

                    </div>

                  )
                }

                <ThemeToggle/>
              </div>

            </motion.div>

          )
        }


      </AnimatePresence>

    </nav>
  )
}

export default Navbar