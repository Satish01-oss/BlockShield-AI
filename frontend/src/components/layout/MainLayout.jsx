import Navbar from './Navbar'
import { useTheme } from '../../context/ThemeContext'

const MainLayout = ({ children }) => {

  const { darkMode } = useTheme()

  return (
    <div
      className={`min-h-screen overflow-hidden relative transition-all duration-300 ${
        darkMode
          ? 'bg-[#030712] text-white'
          : 'bg-gray-100 text-black'
      }`}
    >

      {/* Glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.08),_transparent_60%)]" />

      {/* Grid */}

      <div
        className={`absolute top-0 left-0 w-full h-full bg-[size:60px_60px] ${
          darkMode
            ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
            : 'bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)]'
        }`}
      />

      <Navbar />

      <main className="relative z-10 pt-24">

        {children}

      </main>

    </div>
  )
}

export default MainLayout