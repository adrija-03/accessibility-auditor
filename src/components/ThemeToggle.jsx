import { useTheme } from '../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:focus:ring-offset-gray-900"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
      <span
        className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
      >
        {/* Optional: Add icons inside the thumb if you like */}
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${isDark ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
            }`}
          aria-hidden="true"
        >
          <Sun className="h-3 w-3 text-amber-500" />
        </span>
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${isDark ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
            }`}
          aria-hidden="true"
        >
          <Moon className="h-3 w-3 text-blue-600" />
        </span>
      </span>
    </button>
  )
}

export default ThemeToggle