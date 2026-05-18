import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FiLogOut, FiUploadCloud, FiMoon, FiSun, FiUser } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { auth } from "../lib/firebase";

export default function Account() {
  const { user, isAdmin, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent dark:border-white dark:border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center p-6 pt-12 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
          <FiUser size={40} className="text-gray-400 dark:text-gray-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Not Signed In
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Sign in to save apps, rate applications, and more.
        </p>
        <Link
          to="/login"
          className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Sign In / Create Account
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        Account
      </h1>
      
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-full w-full rounded-full object-cover" />
          ) : (
            <FiUser size={28} className="text-gray-400 dark:text-gray-600" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {user.displayName || "Anonymous User"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email || "No email associated"}
          </p>
        </div>
      </div>

      <div className="mb-8 space-y-3">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Settings
        </h3>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
        >
          <div className="flex items-center gap-3 font-medium text-gray-900 dark:text-white">
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            Appearance
          </div>
          <span className="text-sm text-gray-500 capitalize dark:text-gray-400">
            {theme}
          </span>
        </button>

        {isAdmin && (
          <Link
            to="/admin"
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900"
          >
            <div className="flex items-center gap-3 font-medium text-gray-900 dark:text-white">
              <FiUploadCloud size={20} />
              Admin Dashboard
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Manage Apps
            </span>
          </Link>
        )}
      </div>

      <button
        onClick={() => auth.signOut()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/40"
      >
        <FiLogOut size={20} />
        Sign Out
      </button>
    </div>
  );
}
