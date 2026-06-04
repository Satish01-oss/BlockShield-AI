import {
  Home,
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  History,
  User,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react'

import {
  useContext
} from 'react'

import {
  useNavigate,
  NavLink
} from 'react-router-dom'

import {
  AuthContext
} from '../../context/AuthContext'

import {
  useTheme
} from '../../context/ThemeContext'

const navItems = [
  {
    title: 'Home',
    icon: Home,
    path: '/',
  },
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Fraud Detection',
    icon: ShieldAlert,
    path: '/fraud-detection',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
  },
  {
    title: 'History',
    icon: History,
    path: '/history',
  },
  {
    title: 'Profile',
    icon: User,
    path: '/profile',
  },
  {
    title: 'Admin',
    icon: ShieldAlert,
    path: '/admin',
  },
]

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen
}) => {

  const { darkMode } =
    useTheme()

  const { logout, user } =
    useContext(AuthContext)

  const navigate =
    useNavigate()

  const handleLogout = () => {

    logout()

    navigate('/login')

    setSidebarOpen(false)
  }

  return (

    <>

      {/* OVERLAY */}

      {
        sidebarOpen && (

          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

        )
      }

      <aside
        className={`fixed lg:relative top-0 left-0 min-h-screen w-[290px] z-50 flex flex-col justify-between p-6 border-r backdrop-blur-2xl transition-all duration-300 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        } ${
          darkMode
            ? 'bg-black/90 border-cyan-500/10'
            : 'bg-white/90 border-gray-200'
        }`}
      >

        {/* TOP */}

        <div>

          {/* MOBILE CLOSE */}

          <div className="flex items-center justify-between lg:hidden mb-8">

            <h2 className="text-xl font-bold text-cyan-400">

              Menu

            </h2>

            <button
            type="button"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400"
            >

              <X size={20} />

            </button>

          </div>

          {/* LOGO */}

          <div className="mb-14">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                <ShieldCheck
                  size={28}
                  className="text-cyan-400"
                />

              </div>

              <div>

                <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">

                  BlockShield AI

                </h1>

                <p
                  className={`text-sm mt-1 ${
                    darkMode
                      ? 'text-gray-500'
                      : 'text-gray-600'
                  }`}
                >

                  Fraud Detection Platform

                </p>

              </div>

            </div>

          </div>

          {/* NAVIGATION */}

          <div className="space-y-3">

            {
              navItems.map((item, index) => {

                const Icon = item.icon

                return (

                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className={({ isActive }) =>
                      `group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 border ${
                        isActive
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10'
                          : darkMode
                            ? 'border-transparent hover:bg-white/5 text-gray-300'
                            : 'border-transparent hover:bg-gray-100 text-gray-700'
                      }`
                    }
                  >

                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-cyan-500/10 transition-all">

                      <Icon size={22} />

                    </div>

                    <span className="font-medium text-[16px]">

                      {item.title}

                    </span>

                  </NavLink>
                )
              })
            }

          </div>

        </div>

        {/* BOTTOM */}

        <div className="space-y-5">

          {/* USER CARD */}

          <div
            className={`rounded-3xl p-5 border ${
              darkMode
                ? 'bg-[#0f172a] border-gray-800'
                : 'bg-gray-100 border-gray-200'
            }`}
          >

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">

                {
                  user?.userName
                    ?.charAt(0)
                    .toUpperCase()
                }

              </div>

              <div>

                <h3
                  className={`font-semibold ${
                    darkMode
                      ? 'text-white'
                      : 'text-gray-900'
                  }`}
                >

                  {user?.userName || 'John Doe'}

                </h3>

                <p
                  className={`text-sm ${
                    darkMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >

                  {user?.role || 'Security Analyst'}

                </p>

              </div>

            </div>

          </div>

          {/* LOGOUT */}

          <button
          type="button"
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl border border-red-500/20 hover:bg-red-500/10 transition-all text-red-400 font-medium"
            onClick={handleLogout}
          >

            <LogOut size={20} />

            Logout

          </button>

        </div>

      </aside>

    </>
  )
}

export default Sidebar