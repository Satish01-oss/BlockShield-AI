import DashboardLayout from '../components/layout/DashboardLayout'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const Profile = () => {
  const { user } = useContext(AuthContext)

  return (
    <DashboardLayout>

      <div>

        <h1 className="text-5xl font-black">
          Profile
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          Manage your account information.
        </p>

      </div>

      <div className="mt-12 grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* User Card */}

        {/* CYBER ID CARD */}

        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-[#0f172a] to-purple-500/10 border border-cyan-500/20 rounded-[32px] p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-500/10">

          {/* Glow */}

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />

          {/* Header */}

          <div className="relative z-10 flex items-center justify-between">

            <div>

              <p className="text-cyan-400 font-semibold tracking-[0.3em] text-xs">

                BLOCKSHIELD AI

              </p>

              <h2 className="text-2xl font-black mt-3">

                Security Identity Card

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

              <span className="text-cyan-400 font-black text-xl">

                AI

              </span>

            </div>

          </div>

          {/* Avatar */}

          <div className="relative z-10 mt-10 flex flex-col items-center">

            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black text-6xl shadow-lg shadow-cyan-500/30 border-4 border-white/10">

              {
                user?.userName
                  ?.charAt(0)
                  .toUpperCase()
              }

            </div>

            <h2 className="text-3xl font-black mt-6 text-center">

              {user?.userName || 'Satish Kumar'}

            </h2>

            <p className="text-cyan-400 mt-2 font-medium">

              {user?.role || 'Security Analyst'}

            </p>

          </div>

          {/* Info */}

          <div className="relative z-10 mt-10 space-y-5">

            <div className="flex items-center justify-between border-b border-white/5 pb-3">

              <span className="text-gray-400">

                Email

              </span>

              <span className="font-medium text-right break-all">

                {user?.email}

              </span>

            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">

              <span className="text-gray-400">

                Status

              </span>

              <span className="text-green-400 font-semibold">

                Active

              </span>

            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">

              <span className="text-gray-400">

                Access Level

              </span>

              <span className="font-semibold">

                {user?.role}

              </span>

            </div>

          </div>

          {/* Footer */}

          <div className="relative z-10 mt-10 flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-xs">

                MEMBER SINCE

              </p>

              <p className="font-semibold mt-1">

                2026

              </p>

            </div>

            <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">

              VERIFIED

            </div>

          </div>

        </div>

        {/* Details */}

        <div className="xl:col-span-2 bg-black/40 border border-cyan-500/10 rounded-[32px] p-10">

          <h2 className="text-3xl font-bold">
            Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

            <div>

              <p className="text-gray-400 mb-3">
                Full Name
              </p>

              <input
                type="text"
                value={user?.userName || 'Satish Kumar'}
                className="w-full px-5 py-4 bg-[#0f172a] border border-gray-800 rounded-2xl outline-none"
                readOnly
              />

            </div>

            <div>

              <p className="text-gray-400 mb-3">
                Email Address
              </p>

              <input
                type="email"
                value={user?.email || 'satish@gmail.com'}
                className="w-full px-5 py-4 bg-[#0f172a] border border-gray-800 rounded-2xl outline-none"
                readOnly
              />

            </div>

            <div>

              <p className="text-gray-400 mb-3">
                Role
              </p>

              <input
                type="text"
                value={user?.role || 'Security Analyst'}
                className="w-full px-5 py-4 bg-[#0f172a] border border-gray-800 rounded-2xl outline-none"
                readOnly
              />

            </div>

            <div>

              <p className="text-gray-400 mb-3">
                Joined
              </p>

              <input
                type="text"
                value={user?.joined || 'May 2026'}
                className="w-full px-5 py-4 bg-[#0f172a] border border-gray-800 rounded-2xl outline-none"
                readOnly
              />

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default Profile