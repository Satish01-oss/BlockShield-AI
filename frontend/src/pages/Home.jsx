import { motion } from 'framer-motion'

import {
  ShieldCheck,
  Brain,
  Activity,
  Database,
  ArrowRight,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import Navbar from '../components/layout/Navbar'
import { useTheme } from '../context/ThemeContext'

const features = [
  {
    icon: ShieldCheck,
    title: 'Fraud Detection',
    description:
      'Detect suspicious blockchain transactions using AI-powered analysis.',
  },
  {
    icon: Brain,
    title: 'Machine Learning',
    description:
      'Advanced RandomForestClassifier prediction system with risk scoring.',
  },
  {
    icon: Activity,
    title: 'Real-Time Monitoring',
    description:
      'Track blockchain activities and receive instant fraud alerts.',
  },
  {
    icon: Database,
    title: 'Analytics Dashboard',
    description:
      'Powerful charts, transaction insights and fraud heatmaps.',
  },
]

const Home = () => {

  const { darkMode } = useTheme()

  const scrollToSection = (id) => {

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }

  return (
    <div
      className={`min-h-screen overflow-hidden relative transition-all duration-300 ${darkMode
          ? 'bg-[#030712] text-white'
          : 'bg-[#f5f7fb] text-black'
        }`}
    >

      {/* BACKGROUND GLOW */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.12),_transparent_60%)]" />

      {/* GRID BACKGROUND */}

      <div
        className={`absolute top-0 left-0 w-full h-full bg-[size:60px_60px] ${darkMode
            ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]'
          }`}
      />

      <Navbar />

      {/* HERO SECTION */}

      <section className="relative z-10 min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-22 pb-24">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center w-full">

          {/* LEFT SIDE */}

          <div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >

              {/* BADGE */}

              <div className="w-fit inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500 text-sm mb-6 backdrop-blur-xl">

                <ShieldCheck size={18} />

                Blockchain Security Platform

              </div>

              {/* HEADING */}

              <h1
                className={`text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] ${darkMode
                    ? 'text-white'
                    : 'text-gray-900'
                  }`}
              >

                Protect Blockchain

                <span className="block mt-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">

                  Transactions with AI

                </span>

              </h1>

              {/* DESCRIPTION */}

              <p
                className={`mt-10 text-lg md:text-xl leading-[1.9] max-w-2xl ${darkMode
                    ? 'text-gray-400'
                    : 'text-gray-600'
                  }`}
              >

                BlockShield AI combines machine learning, blockchain analytics,
                and real-time monitoring to detect fraudulent crypto activities,
                suspicious wallets, and risky blockchain transactions.

              </p>

              {/* BUTTONS */}

              <div className="mt-16 flex flex-wrap items-center gap-5">

                {/* DASHBOARD BUTTON */}

                <Link
                  to="/dashboard"
                  className="h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 text-white"
                >

                  Launch Dashboard

                  <ArrowRight size={22} />

                </Link>

                {/* FEATURES BUTTON */}

                <button
                type="button"
                  onClick={() =>
                    scrollToSection('features')
                  }
                  className={`h-14 px-8 rounded-2xl border font-semibold text-lg flex items-center justify-center transition-all ${darkMode
                      ? 'border-purple-500/40 bg-purple-500/10 text-white hover:bg-purple-500/20'
                      : 'border-purple-300 bg-white text-gray-900 hover:bg-purple-50'
                    }`}
                >

                  Explore Features

                </button>

              </div>

              {/* STATS */}

              <div className="grid grid-cols-3 gap-10 mt-20">

                <div>

                  <h2 className="text-4xl md:text-5xl font-black text-cyan-500">
                    98%
                  </h2>

                  <p
                    className={`mt-4 leading-relaxed ${darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                      }`}
                  >
                    Detection Accuracy
                  </p>

                </div>

                <div>

                  <h2 className="text-4xl md:text-5xl font-black text-purple-500">
                    24/7
                  </h2>

                  <p
                    className={`mt-4 leading-relaxed ${darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                      }`}
                  >
                    Monitoring
                  </p>

                </div>

                <div>

                  <h2 className="text-4xl md:text-5xl font-black text-blue-500">
                    10K+
                  </h2>

                  <p
                    className={`mt-4 leading-relaxed ${darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                      }`}
                  >
                    Transactions Analyzed
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

          {/* RIGHT SIDE */}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >

            <div
              className={`relative backdrop-blur-2xl border rounded-[32px] p-10 md:p-12 shadow-2xl shadow-cyan-500/10 ${darkMode
                  ? 'bg-black/40 border-cyan-500/20'
                  : 'bg-white/80 border-cyan-200'
                }`}
            >

              {/* HEADER */}

              <div className="flex items-center justify-between mb-8">

                <h2
                  className={`text-3xl font-bold ${darkMode
                      ? 'text-white'
                      : 'text-gray-900'
                    }`}
                >
                  Fraud Monitoring
                </h2>

                <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />

              </div>

              <div className="space-y-6">

                {/* RISK CARD */}

                <div
                  className={`border border-red-500/20 rounded-3xl p-8 ${darkMode
                      ? 'bg-[#0f172a]'
                      : 'bg-red-50'
                    }`}
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p
                        className={`text-sm ${darkMode
                            ? 'text-gray-400'
                            : 'text-gray-600'
                          }`}
                      >
                        Wallet Risk
                      </p>

                      <h3 className="text-3xl font-bold text-red-400 mt-3">
                        High Risk
                      </h3>

                    </div>

                    <div className="text-red-400 text-5xl font-black">
                      92%
                    </div>

                  </div>

                </div>

                {/* CONFIDENCE */}

                <div
                  className={`border border-cyan-500/20 rounded-3xl p-8 ${darkMode
                      ? 'bg-[#0f172a]'
                      : 'bg-cyan-50'
                    }`}
                >

                  <p
                    className={`text-sm ${darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                      }`}
                  >
                    AI Confidence
                  </p>

                  <div
                    className={`mt-5 w-full h-4 rounded-full overflow-hidden ${darkMode
                        ? 'bg-gray-800'
                        : 'bg-gray-300'
                      }`}
                  >

                    <div className="h-full w-[88%] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />

                  </div>

                  <p className="mt-4 text-cyan-500 font-semibold">
                    88% Confidence
                  </p>

                </div>

                {/* ANALYTICS */}

                <div className="grid grid-cols-2 gap-6">

                  <div
                    className={`rounded-3xl p-8 border flex flex-col ${darkMode
                        ? 'bg-[#0f172a] border-gray-800'
                        : 'bg-purple-50 border-purple-100'
                      }`}
                  >

                    <h3 className="text-4xl font-black text-purple-500">
                      1,204
                    </h3>

                    <p
                      className={`mt-3 ${darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                        }`}
                    >
                      Analyses
                    </p>

                  </div>

                  <div
                    className={`rounded-3xl p-8 border flex flex-col ${darkMode
                        ? 'bg-[#0f172a] border-gray-800'
                        : 'bg-cyan-50 border-cyan-100'
                      }`}
                  >

                    <h3 className="text-4xl font-black text-cyan-500">
                      128
                    </h3>

                    <p
                      className={`mt-3 ${darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                        }`}
                    >
                      Threats
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* FEATURES SECTION */}

      <section
        id="features"
        className="relative z-10 py-32 px-6 md:px-12 lg:px-20"
      >

        <div className="max-w-7xl mx-auto">

          {/* HEADING */}

          <div className="text-center">

            <h2
              className={`text-5xl md:text-6xl font-black leading-tight ${darkMode
                  ? 'text-white'
                  : 'text-gray-900'
                }`}
            >

              Powerful Security Features

            </h2>

            <p
              className={`mt-8 text-lg leading-[1.9] max-w-3xl mx-auto ${darkMode
                  ? 'text-gray-400'
                  : 'text-gray-600'
                }`}
            >

              Everything required to analyze blockchain transactions,
              detect fraud and monitor suspicious crypto activities.

            </p>

          </div>

          {/* FEATURES GRID */}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">

            {
              features.map((feature, index) => {

                const Icon = feature.icon

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`backdrop-blur-xl border rounded-[32px] p-10 transition-all hover:scale-105 shadow-lg ${darkMode
                        ? 'bg-black/40 border-gray-800 hover:border-cyan-500/30 hover:shadow-cyan-500/20'
                        : 'bg-white/80 border-gray-200 hover:border-cyan-300 hover:shadow-cyan-500/20'
                      }`}
                  >

                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">

                      <Icon size={30} />

                    </div>

                    <h3
                      className={`text-2xl font-bold mt-8 ${darkMode
                          ? 'text-white'
                          : 'text-gray-900'
                        }`}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className={`mt-6 leading-[1.9] ${darkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                        }`}
                    >
                      {feature.description}
                    </p>

                  </motion.div>
                )
              })
            }

          </div>

        </div>

      </section>

    </div>
  )
}

export default Home