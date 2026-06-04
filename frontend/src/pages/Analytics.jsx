import {
  useEffect,
  useState,
} from 'react'

import { motion } from 'framer-motion'

import {
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'

import axios from 'axios'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import { useTheme } from '../context/ThemeContext'

const Analytics = () => {

  const { darkMode } = useTheme()

  const [stats, setStats] =
    useState(null)

  const [monthlyData, setMonthlyData] =
    useState([])

  const [riskData, setRiskData] =
    useState([])

  // ============================================
  // FETCH ANALYTICS
  // ============================================

  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          const token =
            localStorage.getItem('token')

          const statsResponse =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/dashboard/stats`,

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          const monthlyResponse =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/dashboard/monthly-analytics`,

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          const riskResponse =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/dashboard/risk-distribution`,

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          setStats(
            statsResponse.data
          )

          setMonthlyData(
            monthlyResponse.data.monthlyData
          )

          setRiskData([
            {
              name: 'Low Risk',
              value:
                riskResponse.data.lowRisk
            },
            {
              name: 'Medium Risk',
              value:
                riskResponse.data.mediumRisk
            },
            {
              name: 'High Risk',
              value:
                riskResponse.data.highRisk
            },
          ])

        } catch (err) {

          console.log(err)
        }
      }

    fetchAnalytics()

  }, [])

  const analyticsCards = [
    {
      title: 'Transactions Analyzed',
      value:
        stats?.totalScans || 0,
      icon: BarChart3,
      color: 'text-cyan-400',
    },
    {
      title: 'Fraud Alerts',
      value:
        stats?.fraudDetected || 0,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
    {
      title: 'Detection Accuracy',
      value:
        `${stats?.averageConfidence || 0}%`,
      icon: ShieldCheck,
      color: 'text-green-400',
    },
    {
      title: 'Live Monitoring',
      value: '24/7',
      icon: Activity,
      color: 'text-purple-400',
    },
  ]

  return (

    <div
      className={`min-h-screen overflow-hidden relative transition-all duration-300 ${
        darkMode
          ? 'bg-[#030712] text-white'
          : 'bg-[#f5f7fb] text-black'
      }`}
    >

      {/* Background Glow */}

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.12),_transparent_60%)]" />

      {/* Grid */}

      <div
        className={`absolute top-0 left-0 w-full h-full pointer-events-none bg-[size:60px_60px] ${
          darkMode
            ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]'
        }`}
      />

      <Navbar />

      <div className="flex relative z-10 pt-16">

        <Sidebar />

        <main className="flex-1 p-6 md:p-10">

          {/* HEADER */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">

                  Analytics Dashboard

                </h1>

                <p
                  className={`mt-4 text-base md:text-lg ${
                    darkMode
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >

                  Real-time blockchain fraud analytics and monitoring insights.

                </p>

              </div>

              <div
                className={`px-6 py-4 rounded-3xl border backdrop-blur-xl ${
                  darkMode
                    ? 'bg-black/40 border-cyan-500/10'
                    : 'bg-white/80 border-gray-200'
                }`}
              >

                <div className="flex items-center gap-3">

                  <TrendingUp className="text-cyan-400" />

                  <div>

                    <p className="text-sm text-gray-400">
                      System Status
                    </p>

                    <h3 className="font-semibold text-green-400">
                      Monitoring Active
                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

          {/* CARDS */}

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">

            {
              analyticsCards.map((card, index) => {

                const Icon = card.icon

                return (

                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 30
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: index * 0.1
                    }}
                    className={`rounded-[30px] border p-8 backdrop-blur-2xl transition-all hover:scale-[1.02] ${
                      darkMode
                        ? 'bg-black/40 border-cyan-500/10'
                        : 'bg-white/80 border-gray-200'
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p
                          className={
                            darkMode
                              ? 'text-gray-400'
                              : 'text-gray-600'
                          }
                        >
                          {card.title}
                        </p>

                        <h2 className={`mt-4 text-4xl font-black ${card.color}`}>
                          {card.value}
                        </h2>

                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">

                        <Icon
                          size={30}
                          className={card.color}
                        />

                      </div>

                    </div>

                  </motion.div>
                )
              })
            }

          </div>

          {/* CHARTS */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

            {/* BAR CHART */}

            <div
              className={`rounded-[28px] border p-6 ${
                darkMode
                  ? 'bg-black/40 border-cyan-500/10'
                  : 'bg-white/80 border-gray-200'
              }`}
            >

              <h3 className="text-2xl font-bold mb-6">
                Monthly Fraud Analytics
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart data={monthlyData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="_id.month" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="fraudTransactions"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* PIE CHART */}

            <div
              className={`rounded-[28px] border p-6 ${
                darkMode
                  ? 'bg-black/40 border-cyan-500/10'
                  : 'bg-white/80 border-gray-200'
              }`}
            >

              <h3 className="text-2xl font-bold mb-6">
                Risk Distribution
              </h3>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={riskData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >

                    <Cell fill="#22c55e" />

                    <Cell fill="#eab308" />

                    <Cell fill="#ef4444" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default Analytics