import {
  Bell,
  Search,
  Menu,
} from 'lucide-react'

import ThemeToggle from '../common/ThemeToggle'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const Topbar = () => {

  const { user } =
  useContext(AuthContext)
  return (
    <div className="w-full bg-black/30 backdrop-blur-xl border border-cyan-500/10 rounded-3xl px-8 py-5 flex items-center justify-between gap-5">

      {/* Left */}

      <div className="flex items-center gap-5 flex-1">

        {/* Mobile Menu */}

        <button
        type="button"
        className="lg:hidden w-14 h-14 rounded-2xl bg-[#0f172a] border border-gray-800 flex items-center justify-center">

          <Menu size={24} />

        </button>

        {/* Search */}

        <div className="flex items-center gap-4 bg-[#0f172a] border border-gray-800 rounded-2xl px-5 py-3 w-full max-w-xl">

          <Search
            size={20}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search wallet or transaction..."
            className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Theme Toggle */}

        <ThemeToggle />

        {/* Profile */}

        <div className="hidden md:flex items-center gap-4 bg-[#0f172a] border border-gray-800 rounded-2xl px-5 py-3">

          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">

                  {
                    user?.userName?.charAt(0).toUpperCase()
                  }

                </div>

          <div>

            <h3 className="font-semibold text-white">
              {user?.userName || 'John Doe'}
            </h3>

            <p className="text-sm text-gray-400">
              {user?.role || 'Security Analyst'}
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Topbar