import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  FiLogOut,
  FiUploadCloud,
  FiMoon,
  FiSun,
  FiUser,
  FiShield,
  FiFileText,
  FiChevronRight,
  FiBell,
  FiInfo,
  FiMail,
} from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import { auth } from "../lib/firebase";

export default function Account() {
  const { user, isAdmin, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 pb-12 pt-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <FiUser size={40} className="text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
          Not Signed In
        </h1>
        <p className="mb-8 text-muted-foreground">
          Sign in to save apps, rate applications, and sync preferences.
        </p>
        <Link
          to="/login"
          className="flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-3 font-semibold text-background transition-colors hover:opacity-90"
        >
          Sign In / Create Account
        </Link>
        <div className="mt-8 flex gap-6 text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground hover:underline">Terms &amp; Conditions</Link>
        </div>
      </div>
    );
  }

  const initials = user.displayName
    ? user.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-4 md:px-6">
      <h1 className="mb-6 text-3xl font-black tracking-tight text-foreground">
        Account &amp; Settings
      </h1>

      {/* Profile Card */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-sm">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold tracking-tight text-foreground">
            {user.displayName || "Anonymous User"}
          </h2>
          <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <FiMail size={13} />
            {user.email || "No email associated"}
          </p>
          {isAdmin && (
            <span className="mt-1.5 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Appearance */}
      <SettingGroup label="Appearance">
        <SettingRow
          icon={theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
          label="Theme"
          description={theme === "light" ? "Light mode" : "Dark mode"}
          onClick={toggleTheme}
          trailing={
            <div className="flex h-6 w-11 items-center rounded-full bg-muted p-0.5 transition-colors">
              <div
                className={`h-5 w-5 transform rounded-full bg-foreground shadow-sm transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          }
        />
      </SettingGroup>

      {/* Notifications */}
      <SettingGroup label="Notifications">
        <SettingRow
          icon={<FiBell size={18} />}
          label="Push Notifications"
          description="New apps &amp; announcements"
          trailing={
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Manage in browser
            </span>
          }
        />
      </SettingGroup>

      {/* Admin */}
      {isAdmin && (
        <SettingGroup label="Administration">
          <Link to="/admin">
            <SettingRow
              icon={<FiUploadCloud size={18} />}
              label="Admin Dashboard"
              description="Upload and manage apps"
              trailing={<FiChevronRight size={16} className="text-muted-foreground" />}
            />
          </Link>
        </SettingGroup>
      )}

      {/* Legal */}
      <SettingGroup label="Legal">
        <Link to="/privacy">
          <SettingRow
            icon={<FiShield size={18} />}
            label="Privacy Policy"
            description="How we collect and use your data"
            trailing={<FiChevronRight size={16} className="text-muted-foreground" />}
          />
        </Link>
        <Link to="/terms">
          <SettingRow
            icon={<FiFileText size={18} />}
            label="Terms &amp; Conditions"
            description="Rules for using AppHub"
            trailing={<FiChevronRight size={16} className="text-muted-foreground" />}
            isLast
          />
        </Link>
      </SettingGroup>

      {/* About */}
      <SettingGroup label="About">
        <SettingRow
          icon={<FiInfo size={18} />}
          label="AppHub"
          description="The cleanest open hub for Android apps"
          trailing={
            <span className="text-xs text-muted-foreground">v1.0.0</span>
          }
          isLast
        />
      </SettingGroup>

      {/* Sign Out */}
      <button
        onClick={() => auth.signOut()}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/40"
      >
        <FiLogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}

function SettingGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  description,
  trailing,
  onClick,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  isLast?: boolean;
}) {
  const content = (
    <div
      className={`flex items-center gap-4 px-4 py-3.5 transition-colors ${
        onClick ? "cursor-pointer hover:bg-muted/50" : ""
      } ${!isLast ? "border-b border-border" : ""}`}
      onClick={onClick}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );

  return content;
}
