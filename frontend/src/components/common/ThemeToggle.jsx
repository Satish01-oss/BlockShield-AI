import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ThemeToggle = () => {

  const {
    darkMode,
    setDarkMode,
  } = useTheme()

  return (
    <button
    type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-gray-800 flex items-center justify-center hover:border-cyan-500/30 transition-all"
    >

      {
        darkMode
          ? <Sun size={22} />
          : <Moon size={22} />
      }

    </button>
  )
}

export default ThemeToggle