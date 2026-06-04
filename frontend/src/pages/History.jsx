import {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import toast from 'react-hot-toast'

import DashboardLayout from '../components/layout/DashboardLayout'

const History = () => {

  const [historyData, setHistoryData] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  // ============================================
  // FETCH HISTORY
  // ============================================

  useEffect(() => {

    const fetchHistory =
      async () => {

        try {

          const token =
            localStorage.getItem('token')

          const response =
            await axios.get(

              `${import.meta.env.VITE_API_URL}/api/transaction/history`,

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          setHistoryData(
            response.data.history
          )

        } catch (err) {

          console.log(err)

          toast.error(
            'Failed to load history'
          )

        } finally {

          setLoading(false)
        }
      }

    fetchHistory()

  }, [])

  // ============================================
  // DELETE HISTORY
  // ============================================

  const handleDelete =
    async (id) => {

      try {

        const token =
          localStorage.getItem('token')

        await axios.delete(

          `${import.meta.env.VITE_API_URL}/api/transaction/delete/${id}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )

        setHistoryData((prev) =>

          prev.filter(
            (item) => item._id !== id
          )
        )

        toast.success(
          'Transaction deleted'
        )

      } catch (err) {

        console.log(err)

        toast.error(
          'Delete failed'
        )
      }
    }

  return (

    <DashboardLayout>

      {/* HEADING */}

      <div>

        <h1 className="text-5xl font-black">
          Search History
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          Previously analyzed wallets and transactions.
        </p>

      </div>

      {/* TABLE */}

      <div className="mt-12 bg-black/40 border border-cyan-500/10 rounded-[32px] p-8 overflow-x-auto">

        {
          loading ? (

            <div className="text-center py-10 text-gray-400">

              Loading history...

            </div>

          ) : historyData.length === 0 ? (

            <div className="text-center py-10 text-gray-400">

              No transaction history found.

            </div>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="text-left border-b border-gray-800">

                  <th className="pb-5 text-gray-400">
                    Wallet
                  </th>

                  <th className="pb-5 text-gray-400">
                    Prediction
                  </th>

                  <th className="pb-5 text-gray-400">
                    Confidence
                  </th>

                  <th className="pb-5 text-gray-400">
                    Risk Score
                  </th>

                  <th className="pb-5 text-gray-400">
                    Date
                  </th>

                  <th className="pb-5 text-gray-400">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  historyData.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b border-gray-900"
                    >

                      <td className="py-6">

                        {item.walletAddress}

                      </td>

                      <td className="py-6">

                        <span className={`px-4 py-2 rounded-full text-sm ${
                          item.prediction === 'Fraud'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}>

                          {item.prediction}

                        </span>

                      </td>

                      <td className="py-6">

                        {item.confidence}%

                      </td>

                      <td className="py-6">

                        {item.riskScore}%

                      </td>

                      <td className="py-6 text-gray-400">

                        {
                          new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        }

                      </td>

                      <td className="py-6">

                        <button
                        type="button"
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >

                          Delete

                        </button>

                      </td>

                    </tr>
                  ))
                }

              </tbody>

            </table>

          )
        }

      </div>

    </DashboardLayout>
  )
}

export default History