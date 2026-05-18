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
      <div className="mx-4 mb-4 rounded-3xl border border-white/20 bg-background/70 px-6 py-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-background/60">
        <ul className="flex items-center justify-between">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 min-w-[64px] p-2 transition-all",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon
                    size={22}
                    className={cn(
                      isActive ? "stroke-[2.5px]" : "stroke-2"
                    )}
                  />
                  <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
