import {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import DashboardLayout from '../components/layout/DashboardLayout'

import FraudLineChart from '../components/dashboard/FraudLineChart'

import RiskPieChart from '../components/dashboard/RiskPieChart'

import ActivityBarChart from '../components/dashboard/ActivityBarChart'

const Dashboard = () => {

  const [stats, setStats] =
    useState(null)

  const [history, setHistory] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================

  useEffect(() => {

    const fetchDashboardData =
      async () => {

        try {

          const token =
            localStorage.getItem('token')

          // ====================================
          // FETCH STATS
          // ====================================

          const statsResponse =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/admin/stats`,

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          // ====================================
          // FETCH HISTORY
          // ====================================

          const historyResponse =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/transaction/history`,

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

          setHistory(
            historyResponse.data.history
          )

        } catch (err) {

          console.log(err)

        } finally {

          setLoading(false)
        }
      }

    fetchDashboardData()

  }, [])

  if (loading) {

    return (

      <DashboardLayout>

        <div className="text-3xl font-bold">

          Loading Dashboard...

        </div>

      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout>

      {/* HEADING */}

      <div>

        <h1 className="text-5xl font-black">

          Security Dashboard

        </h1>

        <p className="text-gray-400 mt-4 text-lg">

          Monitor blockchain fraud activities and AI predictions.

        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-12">

        {/* TOTAL ANALYSES */}

        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">

            Total Analyses

          </p>

          <h2 className="text-5xl font-black mt-5 text-cyan-400">

            {stats?.totalTransactions || 0}

          </h2>

        </div>

        {/* FRAUD DETECTED */}

        <div className="bg-black/40 backdrop-blur-xl border border-red-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">

            Fraud Detected

          </p>

          <h2 className="text-5xl font-black mt-5 text-red-400">

            {stats?.fraudTransactions || 0}

          </h2>

        </div>

        {/* SAFE TRANSACTIONS */}

        <div className="bg-black/40 backdrop-blur-xl border border-green-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">

            Safe Transactions

          </p>

          <h2 className="text-5xl font-black mt-5 text-green-400">

            {stats?.safeTransactions || 0}

          </h2>

        </div>

        {/* HIGH RISK */}

        <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/10 rounded-[32px] p-8">

          <p className="text-gray-400">

            High Risk Alerts

          </p>

          <h2 className="text-5xl font-black mt-5 text-yellow-400">

            {stats?.highRiskTransactions || 0}

          </h2>

        </div>

      </div>

      {/* ANALYTICS SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">

        {/* MAIN CHART */}

        <div className="xl:col-span-2 bg-black/40 backdrop-blur-xl border border-cyan-500/10 rounded-[32px] p-8">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">

              Fraud Analytics

            </h2>

            <p className="text-gray-400 mt-2">

              Weekly fraud monitoring overview

            </p>

          </div>

          <FraudLineChart />

        </div>

        {/* PIE CHART */}

        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/10 rounded-[32px] p-8">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">

              Risk Distribution

            </h2>

            <p className="text-gray-400 mt-2">

              Fraud risk analysis

            </p>

          </div>

          <RiskPieChart />

        </div>

      </div>

      {/* BOTTOM SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">

        {/* BAR CHART */}

        <div className="xl:col-span-2 bg-black/40 backdrop-blur-xl border border-cyan-500/10 rounded-[32px] p-8">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">

              Blockchain Activity

            </h2>

            <p className="text-gray-400 mt-2">

              Transactions across networks

            </p>

          </div>

          <ActivityBarChart />

        </div>

        {/* RECENT ACTIVITY */}

        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/10 rounded-[32px] p-8">

          <h2 className="text-3xl font-bold">

            Recent Activity

          </h2>

          <div className="space-y-6 mt-8">

            {
              history.length === 0 ? (

                <p className="text-gray-400">

                  No recent activity found.

                </p>

              ) : (

                history.slice(0, 3).map((item) => (

                  <div
                    key={item._id}
                    className={`border rounded-2xl p-5 ${
                      item.prediction === 'Fraud'
                        ? 'border-red-500/10 bg-red-500/5'
                        : 'border-green-500/10 bg-green-500/5'
                    }`}
                  >

                    <p className={`font-semibold ${
                      item.prediction === 'Fraud'
                        ? 'text-red-400'
                        : 'text-green-400'
                    }`}>

                      {item.prediction} Transaction

                    </p>

                    <p className="text-gray-400 mt-2 text-sm">

                      Wallet:
                      {' '}
                      {item.walletAddress}

                    </p>

                    <p className="text-gray-400 mt-1 text-sm">

                      Confidence:
                      {' '}
                      {item.confidence}%

                    </p>

                    <p className="text-gray-500 mt-1 text-xs">

                      {
                        new Date(
                          item.createdAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>
                ))
              )
            }

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default Dashboard