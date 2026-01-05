import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Cloud,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
  RefreshCw,
  Calendar,
  Shield,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Backup {
  id: string;
  name: string;
  date: string;
  time: string;
  size: string;
  type: "automatic" | "manual";
  status: "completed" | "in-progress" | "failed";
  location: "cloud" | "local";
}

const backups: Backup[] = [
  {
    id: "BKP-001",
    name: "Full System Backup",
    date: "2024-01-15",
    time: "02:00 AM",
    size: "4.2 GB",
    type: "automatic",
    status: "completed",
    location: "cloud",
  },
  {
    id: "BKP-002",
    name: "Full System Backup",
    date: "2024-01-14",
    time: "02:00 AM",
    size: "4.1 GB",
    type: "automatic",
    status: "completed",
    location: "cloud",
  },
  {
    id: "BKP-003",
    name: "Database Backup",
    date: "2024-01-14",
    time: "11:30 AM",
    size: "2.8 GB",
    type: "manual",
    status: "completed",
    location: "local",
  },
  {
    id: "BKP-004",
    name: "Full System Backup",
    date: "2024-01-13",
    time: "02:00 AM",
    size: "4.0 GB",
    type: "automatic",
    status: "completed",
    location: "cloud",
  },
  {
    id: "BKP-005",
    name: "Full System Backup",
    date: "2024-01-12",
    time: "02:00 AM",
    size: "3.9 GB",
    type: "automatic",
    status: "failed",
    location: "cloud",
  },
];

const statusStyles = {
  completed: "bg-success/10 text-success",
  "in-progress": "bg-info/10 text-info",
  failed: "bg-destructive/10 text-destructive",
};

const statusIcons = {
  completed: CheckCircle,
  "in-progress": RefreshCw,
  failed: AlertCircle,
};

const Backup = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const handleStartBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const successfulBackups = backups.filter((b) => b.status === "completed").length;
  const totalStorage = "24.5 GB";
  const usedStorage = "15.8 GB";
  const storagePercent = 64;

  return (
    <DashboardLayout
      title="Backup Management"
      subtitle="Automated backups and secure cloud storage"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Backup Status</p>
                <p className="text-lg font-bold text-success">Protected</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="text-lg font-bold text-foreground">Today, 2:00 AM</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Backups</p>
                <p className="text-lg font-bold text-foreground">{successfulBackups}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <HardDrive className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-lg font-bold text-foreground">{usedStorage} / {totalStorage}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Quick Actions</h3>
              
              {isBackingUp ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                    <span className="font-medium text-foreground">Backup in progress...</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    {backupProgress}% complete
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full gap-2" onClick={handleStartBackup}>
                    <Upload className="h-4 w-4" /> Start Backup Now
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" /> Restore from Backup
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Settings className="h-4 w-4" /> Backup Settings
                  </Button>
                </div>
              )}
            </div>

            {/* Storage */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Cloud Storage</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Used Space</span>
                  <span className="font-medium text-foreground">{usedStorage}</span>
                </div>
                <Progress value={storagePercent} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium text-foreground">8.7 GB</span>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Backup Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Daily at 2:00 AM</p>
                    <p className="text-sm text-muted-foreground">Full system backup</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Cloud className="h-5 w-5 text-info" />
                  <div>
                    <p className="font-medium text-foreground">Cloud Sync Enabled</p>
                    <p className="text-sm text-muted-foreground">Automatic upload</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Backup History */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">Backup History</h3>
              <p className="text-sm text-muted-foreground">Recent backup operations</p>
            </div>
            <div className="divide-y divide-border">
              {backups.map((backup) => {
                const StatusIcon = statusIcons[backup.status];
                return (
                  <div key={backup.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          backup.location === "cloud" ? "bg-info/10" : "bg-muted"
                        )}>
                          {backup.location === "cloud" ? (
                            <Cloud className="h-5 w-5 text-info" />
                          ) : (
                            <HardDrive className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{backup.name}</p>
                            <span className={cn("badge-status", statusStyles[backup.status])}>
                              <StatusIcon className={cn(
                                "h-3 w-3",
                                backup.status === "in-progress" && "animate-spin"
                              )} />
                              {backup.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {backup.date} at {backup.time} • {backup.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded",
                          backup.type === "automatic" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {backup.type}
                        </span>
                        {backup.status === "completed" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Backup;
