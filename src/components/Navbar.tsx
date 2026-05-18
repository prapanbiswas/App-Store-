import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FiSun, FiMoon, FiSearch, FiHome, FiUser, FiLogOut, FiUploadCloud } from "react-icons/fi";
import { auth } from "../lib/firebase";
import { cn } from "../lib/utils";

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { to: "/", icon: FiHome, label: "Home" },
    { to: "/search", icon: FiSearch, label: "Search" },
  ];

  return (
    <nav className="sticky top-0 z-50 hidden w-full border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            AppHub
          </Link>
          
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-black dark:hover:text-white",
                    isActive ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          
          <Link
            to="/account"
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              location.pathname === "/account"
                ? "bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
                : "text-gray-500 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            )}
          >
            <FiUser size={18} />
            {user ? "Account" : "Sign In"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
