import {
  useState,
} from 'react'

import axios from 'axios'

import toast from 'react-hot-toast'

import DashboardLayout from '../components/layout/DashboardLayout'

const FraudDetection = () => {

  const [wallet, setWallet] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [result, setResult] =
    useState(null)

  // ============================================
  // ANALYZE TRANSACTION
  // ============================================

  const handleAnalyze =
    async () => {

      if (!wallet) {

        return toast.error(
          'Please enter wallet address'
        )
      }

      try {

        setLoading(true)

        const token =
          localStorage.getItem('token')

        const response =
          await axios.post(

            `${import.meta.env.VITE_API_URL}/api/fraud/analyze`,

            {
              walletAddress: wallet
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        setResult(
          response.data.transaction
        )

        toast.success(
          'Analysis completed'
        )

      } catch (err) {

        console.log(err)

        toast.error(

          err.response?.data?.message ||

          'Analysis failed'
        )

      } finally {

        setLoading(false)
      }
    }

  return (

    <DashboardLayout>

      {/* HEADING */}

      <div>

        <h1 className="text-5xl font-black">
          Fraud Detection
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          Analyze wallets and transactions using AI fraud detection.
        </p>

      </div>

      {/* SEARCH BOX */}

      <div className="mt-12 bg-black/40 backdrop-blur-xl border border-cyan-500/10 rounded-[32px] p-10">

        <h2 className="text-3xl font-bold">
          Blockchain Analyzer
        </h2>

        <p className="text-gray-400 mt-3">
          Enter wallet address or transaction hash.
        </p>

        <div className="mt-8 flex flex-col lg:flex-row gap-5">

          <input
            type="text"
            placeholder="Paste wallet address or transaction hash..."
            value={wallet}
            onChange={(e) =>
              setWallet(e.target.value)
            }
            className="flex-1 px-6 py-5 bg-[#0f172a] border border-gray-800 rounded-2xl outline-none focus:border-cyan-500"
          />

          <button
          type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold hover:opacity-90 transition-all"
          >

            {
              loading
                ? 'Analyzing...'
                : 'Analyze'
            }

          </button>

        </div>

      </div>

      {/* RESULTS */}

      {
        result && (

          <>

            {/* RESULT CARDS */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">

              {/* PREDICTION */}

              <div className={`bg-black/40 border rounded-[32px] p-8 ${
                result.prediction === 'Fraud'
                  ? 'border-red-500/10'
                  : 'border-green-500/10'
              }`}>

                <p className="text-gray-400">
                  Fraud Prediction
                </p>

                <h2 className={`text-5xl font-black mt-6 ${
                  result.prediction === 'Fraud'
                    ? 'text-red-400'
                    : 'text-green-400'
                }`}>

                  {result.prediction}

                </h2>

                <p className="text-gray-400 mt-4 leading-relaxed">

                  {
                    result.prediction === 'Fraud'
                      ? 'Suspicious transaction patterns detected.'
                      : 'No suspicious activity detected.'
                  }

                </p>

              </div>

              {/* CONFIDENCE */}

              <div className="bg-black/40 border border-cyan-500/10 rounded-[32px] p-8">

                <p className="text-gray-400">
                  AI Confidence
                </p>

                <h2 className="text-5xl font-black text-cyan-400 mt-6">

                  {result.confidence}%

                </h2>

                <div className="w-full h-4 rounded-full bg-gray-800 mt-8 overflow-hidden">

                  <div
                    style={{
                      width:
                        `${result.confidence}%`
                    }}
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  />

                </div>

              </div>

              {/* RISK SCORE */}

              <div className="bg-black/40 border border-yellow-500/10 rounded-[32px] p-8">

                <p className="text-gray-400">
                  Risk Score
                </p>

                <h2 className="text-5xl font-black text-yellow-400 mt-6">

                  {result.riskScore}%

                </h2>

                <p className="text-gray-400 mt-4">

                  AI generated blockchain risk analysis.

                </p>

              </div>

            </div>

            {/* WALLET DETAILS */}

            <div className="mt-12 bg-black/40 border border-cyan-500/10 rounded-[32px] p-10">

              <h2 className="text-3xl font-bold">
                Wallet Insights
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-10">

                <div className="bg-[#0f172a] rounded-2xl p-6">

                  <p className="text-gray-400">
                    Wallet Address
                  </p>

                  <h3 className="text-lg font-bold mt-4 break-all">

                    {result.walletAddress}

                  </h3>

                </div>

                <div className="bg-[#0f172a] rounded-2xl p-6">

                  <p className="text-gray-400">
                    Prediction
                  </p>

                  <h3 className={`text-4xl font-black mt-4 ${
                    result.prediction === 'Fraud'
                      ? 'text-red-400'
                      : 'text-green-400'
                  }`}>

                    {result.prediction}

                  </h3>

                </div>

                <div className="bg-[#0f172a] rounded-2xl p-6">

                  <p className="text-gray-400">
                    Confidence
                  </p>

                  <h3 className="text-4xl font-black mt-4 text-cyan-400">

                    {result.confidence}%

                  </h3>

                </div>

                <div className="bg-[#0f172a] rounded-2xl p-6">

                  <p className="text-gray-400">
                    Risk Score
                  </p>

                  <h3 className="text-4xl font-black mt-4 text-yellow-400">

                    {result.riskScore}%

                  </h3>

                </div>

              </div>

            </div>

          </>
        )
      }

    </DashboardLayout>
  )
}

export default FraudDetection