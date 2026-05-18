import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FiSun, FiMoon, FiSearch, FiHome, FiUser } from "react-icons/fi";
import { cn } from "../lib/utils";

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { to: "/", icon: FiHome, label: "Home" },
    { to: "/search", icon: FiSearch, label: "Search" },
  ];

  return (
    <nav className="sticky top-4 z-50 hidden w-full px-4 md:block">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-white/20 bg-background/70 px-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-background/60">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
            AppHub
          </Link>
          
          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive 
                      ? "bg-foreground/10 text-foreground" 
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  <link.icon size={16} className={cn(isActive && "stroke-[2.5px]")} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>
          
          <Link
            to="/account"
            className={cn(
              "flex h-10 items-center gap-2 rounded-full px-5 text-sm font-bold transition-all",
              location.pathname === "/account"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-foreground/5 text-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <FiUser size={16} />
            {user ? "Account" : "Sign In"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
