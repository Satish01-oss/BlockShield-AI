import {
  useContext,
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import DashboardLayout from '../components/layout/DashboardLayout'

import {
  AuthContext,
} from '../context/AuthContext'

const Admin = () => {

  const {
    user,
  } = useContext(AuthContext)

  const [users, setUsers] = useState([])

  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(true)

  // =====================================================
  // FETCH ADMIN DATA
  // =====================================================

  useEffect(() => {
    const fetchAdminData = async () => {

      try {

        const token = localStorage.getItem('token')

        const usersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const statsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setUsers(usersResponse.data.users)

        setStats(statsResponse.data)

      } catch (err) {

        console.log(err)

      } finally {

        setLoading(false)
      }
    }

    if (user?.role === 'admin') {
      fetchAdminData()
    } else {
      setLoading(false)
    }
  }, [user])

  // =====================================================
  // BLOCK USER
  // =====================================================

  const handleBlockUser = async (id) => {


    try {

      const token = localStorage.getItem('token')

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )


      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? {
              ...u,
              isBlocked: !u.isBlocked,
            }
            : u
        )
      )

    } catch (err) {

      console.log(err)
    }


  }

  // =====================================================
  // USER VIEW
  // =====================================================

  if (user?.role !== 'admin') {


    return (

      <DashboardLayout>

        <div>

          <h1 className="text-5xl font-black">
            Platform Administrators
          </h1>

          <p className="text-gray-400 mt-4 text-lg max-w-3xl">
            Contact BlockShield AI administrators for platform issues,
            account recovery, fraud reporting or technical support.
          </p>

        </div>

        {/* ADMIN CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">

          {/* CARD 1 */}

          <div className="bg-black/40 border border-cyan-500/10 rounded-[32px] p-8">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-5xl shadow-lg shadow-cyan-500/20 mb-6"> S </div>

            <h2 className="text-3xl font-bold">
              Satish Kumar
            </h2>

            <p className="text-cyan-400 mt-2">
              Website Developer
            </p>

            <p className="text-gray-400 mt-5 leading-relaxed">
              Full Stack Developer focused on AI integration,
              secure authentication systems and blockchain fraud analysis.
            </p>

            <a
              href="mailto:support@blockshield.ai"
              className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold"
            >
              Contact Admin
            </a>

          </div>

          {/* CARD 2 */}

          <div className="bg-black/40 border border-cyan-500/10 rounded-[32px] p-8">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-5xl shadow-lg shadow-pink-500/20 mb-6"> R </div>

            <h2 className="text-3xl font-bold">
              Rahul Sharma
            </h2>

            <p className="text-purple-400 mt-2">
              Technical Administrator
            </p>

            <p className="text-gray-400 mt-5 leading-relaxed">
              Handles account recovery, technical support,
              backend monitoring and user related issues.
            </p>

            <a
              href="mailto:technical@blockshield.ai"
              className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold"
            >
              Contact Admin
            </a>

          </div>

        </div>

      </DashboardLayout>
    )


  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {


    return (

      <DashboardLayout>

        <div className="text-3xl font-bold">
          Loading Admin Dashboard...
        </div>

      </DashboardLayout>
    )

  }

  // =====================================================
  // ADMIN VIEW
  // =====================================================

  return (
    <DashboardLayout>

      {/* HEADING */}

      <div>

        <h1 className="text-5xl font-black">
          Admin Dashboard
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          Manage users, fraud alerts and system activity.
        </p>

      </div>

      {/* OVERVIEW */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-12">

        <div className="bg-black/40 border border-cyan-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">
            Total Users
          </p>

          <h2 className="text-5xl font-black mt-5 text-cyan-400">
            {stats?.totalUsers || 0}
          </h2>

        </div>

        <div className="bg-black/40 border border-red-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">
            Fraud Alerts
          </p>

          <h2 className="text-5xl font-black mt-5 text-red-400">
            {stats?.fraudTransactions || 0}
          </h2>

        </div>

        <div className="bg-black/40 border border-yellow-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">
            High Risk Transactions
          </p>

          <h2 className="text-5xl font-black mt-5 text-yellow-400">
            {stats?.highRiskTransactions || 0}
          </h2>

        </div>

        <div className="bg-black/40 border border-green-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">
            System Status
          </p>

          <h2 className="text-5xl font-black mt-5 text-green-400">
            Live
          </h2>

        </div>

      </div>

      {/* USER TABLE */}

      <div className="mt-12 bg-black/40 border border-cyan-500/10 rounded-[32px] p-8 overflow-x-auto">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold">
            User Management
          </h2>

        </div>

        <table className="w-full">

          <thead>

            <tr className="border-b border-gray-800 text-left">

              <th className="pb-5 text-gray-400">
                Name
              </th>

              <th className="pb-5 text-gray-400">
                Email
              </th>

              <th className="pb-5 text-gray-400">
                Role
              </th>

              <th className="pb-5 text-gray-400">
                Status
              </th>

              <th className="pb-5 text-gray-400">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              users.map((userData) => (

                <tr
                  key={userData._id || userData.id}
                  className="border-b border-gray-900"
                >

                  <td className="py-6">
                    {userData.userName}
                  </td>

                  <td className="py-6 text-gray-400">
                    {userData.email}
                  </td>

                  <td className="py-6">
                    {userData.role}
                  </td>

                  <td className="py-6">

                    <span
                      className={`px-4 py-2 rounded-full text-sm ${userData.isBlocked
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-green-500/10 text-green-400'
                        }`}
                    >

                      {
                        userData.isBlocked
                          ? 'Blocked'
                          : 'Active'
                      }

                    </span>

                  </td>

                  <td className="py-6">

                    <button
                    type="button"
                      onClick={() => {

                        handleBlockUser(
                          userData._id
                        )

                      }}

                      className={`px-5 py-2 rounded-xl transition-all ${userData.isBlocked
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                        }`}
                    >

                      {
                        userData.isBlocked
                          ? 'Unblock'
                          : 'Block'
                      }

                    </button>

                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
};
export default Admin;
