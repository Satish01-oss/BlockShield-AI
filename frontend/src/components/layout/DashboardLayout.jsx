import {
  useState
} from 'react'

import {
  Menu
} from 'lucide-react'

import Sidebar from './Sidebar'

import Topbar from './Topbar'

import {
  useTheme
} from '../../context/ThemeContext'

const DashboardLayout = ({
  children
}) => {

  const { darkMode } =
    useTheme()

  const [sidebarOpen,
    setSidebarOpen] =
      useState(false)

  return (

    <div
      className={`min-h-screen flex overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-[#030712] text-white'
          : 'bg-[#f5f7fb] text-black'
      }`}
    >

      {/* BACKGROUND GLOW */}

      <div
        className={`absolute inset-0 ${
          darkMode
            ? 'bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.08),_transparent_60%)]'
            : 'bg-[radial-gradient(circle_at_center,_rgba(0,150,255,0.08),_transparent_60%)]'
        }`}
      />

      {/* GRID */}

      <div
        className={`absolute top-0 left-0 w-full h-full bg-[size:60px_60px] ${
          darkMode
            ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]'
        }`}
      />

      <div className="relative z-10 flex w-full">

        {/* SIDEBAR */}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* MAIN */}

        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">

          {/* MOBILE MENU */}

          <button
          type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="lg:hidden mb-6 w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
          >

            <Menu className="text-cyan-400" />

          </button>

          <Topbar />

          <div className="mt-10">

            {children}

          </div>

        </main>

      </div>

    </div>
  )
}

export default DashboardLayout