import { Link, useLocation } from "react-router-dom";
import { FiHome, FiSearch, FiUser } from "react-icons/fi";
import { cn } from "../lib/utils";

export default function BottomNav() {
  const location = useLocation();

  const links = [
    { to: "/", icon: FiHome, label: "Home" },
    { to: "/search", icon: FiSearch, label: "Search" },
    { to: "/account", icon: FiUser, label: "Account" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full md:hidden">
      {/* Floating glassmorphic container */}
      <div className="mx-4 mb-4 rounded-2xl border border-gray-200/50 bg-white/70 px-6 py-3 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/70 dark:shadow-black/50">
        <ul className="flex items-center justify-between">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 transition-all",
                    isActive
                      ? "text-black dark:text-white"
                      : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  )}
                >
                  <Icon
                    size={24}
                    className={cn(
                      "transition-transform",
                      isActive ? "scale-110" : "scale-100"
                    )}
                  />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
