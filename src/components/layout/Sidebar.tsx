import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  DollarSign,
  MessageSquare,
  Pill,
  FlaskConical,
  Activity,
  Database,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  FileText,
  Users,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Stethoscope, label: "Doctor Portal", path: "/doctor-portal" },
  { icon: DollarSign, label: "Finance & Billing", path: "/finance" },
  { icon: MessageSquare, label: "Chat & Prescription", path: "/chat", badge: 3 },
  { icon: Pill, label: "Pharmacy", path: "/pharmacy" },
  { icon: FlaskConical, label: "Laboratory", path: "/laboratory" },
  { icon: Activity, label: "Diagnostics", path: "/diagnostics" },
  { icon: Building2, label: "Indoor/Outdoor", path: "/pharmacy-io" },
];

const systemNavItems: NavItem[] = [
  { icon: FileText, label: "E-Results", path: "/e-results" },
  { icon: Database, label: "Backup", path: "/backup" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: ShieldCheck, label: "Admin Panel", path: "/admin" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={cn(
          "sidebar-link group relative",
          isActive && "active"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
        {collapsed && item.badge && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-sidebar-foreground">MediCare</h1>
              <p className="text-xs text-sidebar-foreground/60">HMS Pro</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-4 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Main Menu
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-sidebar-border space-y-1">
          {!collapsed && (
            <p className="px-4 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              System
            </p>
          )}
          {systemNavItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* User Section */}
      <div className={cn(
        "border-t border-sidebar-border p-4",
        collapsed ? "px-3" : ""
      )}>
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-sidebar-foreground">AD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">admin@medicare.com</p>
            </div>
          )}
          {!collapsed && (
            <button className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
              <LogOut className="h-4 w-4 text-sidebar-foreground/60" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
