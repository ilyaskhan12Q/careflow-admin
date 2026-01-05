import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Settings,
  Activity,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  DollarSign,
  Pill,
  FlaskConical,
  MessageSquare,
  Building,
  FileText,
  HardDrive,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemModule {
  name: string;
  description: string;
  icon: React.ElementType;
  path: string;
  status: "active" | "warning" | "error";
  stats: { label: string; value: string }[];
}

const modules: SystemModule[] = [
  {
    name: "Doctor Portal",
    description: "Patient management & prescriptions",
    icon: Stethoscope,
    path: "/doctor-portal",
    status: "active",
    stats: [
      { label: "Active Doctors", value: "24" },
      { label: "Patients Today", value: "156" },
    ],
  },
  {
    name: "Finance & Billing",
    description: "Invoices & payment tracking",
    icon: DollarSign,
    path: "/finance",
    status: "active",
    stats: [
      { label: "Revenue Today", value: "$12.5K" },
      { label: "Pending", value: "23" },
    ],
  },
  {
    name: "Chat & Prescription",
    description: "Doctor-patient communication",
    icon: MessageSquare,
    path: "/chat",
    status: "active",
    stats: [
      { label: "Active Chats", value: "18" },
      { label: "Prescriptions", value: "42" },
    ],
  },
  {
    name: "Pharmacy",
    description: "Medicine inventory management",
    icon: Pill,
    path: "/pharmacy",
    status: "warning",
    stats: [
      { label: "Items", value: "1,245" },
      { label: "Low Stock", value: "12" },
    ],
  },
  {
    name: "Laboratory",
    description: "Test management & results",
    icon: FlaskConical,
    path: "/laboratory",
    status: "active",
    stats: [
      { label: "Tests Today", value: "89" },
      { label: "Pending", value: "15" },
    ],
  },
  {
    name: "Diagnostics",
    description: "Imaging & diagnostic reports",
    icon: Activity,
    path: "/diagnostics",
    status: "active",
    stats: [
      { label: "Reports", value: "45" },
      { label: "Completed", value: "38" },
    ],
  },
  {
    name: "Indoor/Outdoor Pharmacy",
    description: "Patient-specific dispensing",
    icon: Building,
    path: "/pharmacy-io",
    status: "active",
    stats: [
      { label: "Orders", value: "67" },
      { label: "Fulfilled", value: "52" },
    ],
  },
  {
    name: "E-Results",
    description: "Digital lab results",
    icon: FileText,
    path: "/e-results",
    status: "active",
    stats: [
      { label: "Available", value: "234" },
      { label: "Downloaded", value: "189" },
    ],
  },
  {
    name: "Backup System",
    description: "Automated data protection",
    icon: HardDrive,
    path: "/backup",
    status: "active",
    stats: [
      { label: "Last Backup", value: "2h ago" },
      { label: "Storage", value: "64%" },
    ],
  },
];

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons = {
  active: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const Admin = () => {
  const activeModules = modules.filter((m) => m.status === "active").length;
  const warningModules = modules.filter((m) => m.status === "warning").length;

  return (
    <DashboardLayout
      title="Admin Panel"
      subtitle="System overview and module management"
    >
      <div className="space-y-6 animate-fade-in">
        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="System Status"
            value="Operational"
            icon={<Server className="h-6 w-6" />}
            variant="success"
          />
          <StatCard
            title="Active Modules"
            value={`${activeModules}/${modules.length}`}
            icon={<Zap className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Active Users"
            value="128"
            change={15}
            changeLabel="online now"
            icon={<Users className="h-6 w-6" />}
            variant="info"
          />
          <StatCard
            title="Alerts"
            value={warningModules}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        {/* System Health */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">System Health</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Server</span>
              </div>
              <p className="text-2xl font-bold text-success">99.9%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Database className="h-5 w-5 text-info" />
                <span className="text-sm font-medium text-muted-foreground">Database</span>
              </div>
              <p className="text-2xl font-bold text-info">45ms</p>
              <p className="text-xs text-muted-foreground">Response Time</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">API</span>
              </div>
              <p className="text-2xl font-bold text-primary">2.5K</p>
              <p className="text-xs text-muted-foreground">Requests/min</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Security</span>
              </div>
              <p className="text-2xl font-bold text-success">Secure</p>
              <p className="text-xs text-muted-foreground">All Systems</p>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">System Modules</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" /> Configure
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              const StatusIcon = statusIcons[module.status];
              return (
                <Link
                  key={module.name}
                  to={module.path}
                  className={cn(
                    "bg-card rounded-xl border p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group",
                    statusStyles[module.status]
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <StatusIcon className={cn(
                      "h-5 w-5",
                      module.status === "active" && "text-success",
                      module.status === "warning" && "text-warning",
                      module.status === "error" && "text-destructive"
                    )} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{module.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    {module.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="text-lg font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: "User login", user: "Dr. Smith", time: "2 min ago", icon: Users },
                { action: "Backup completed", user: "System", time: "2 hours ago", icon: HardDrive },
                { action: "New patient registered", user: "Reception", time: "3 hours ago", icon: Users },
                { action: "Invoice generated", user: "Billing Dept", time: "4 hours ago", icon: DollarSign },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Database className="h-5 w-5" />
                <span>Database</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
