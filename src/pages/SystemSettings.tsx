import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Lock,
  Clock,
  Server,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    maintenanceMode: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout
      title="System Settings"
      subtitle="Configure system-wide settings and preferences"
    >
      <div className="space-y-6 animate-fade-in max-w-3xl">
        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Notifications
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive system alerts via email
                </p>
              </div>
              <Switch
                id="email-notif"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive critical alerts via SMS
                </p>
              </div>
              <Switch
                id="sms-notif"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsNotifications: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Security
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all admin users
                </p>
              </div>
              <Switch
                id="2fa"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, twoFactorAuth: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session">Session Timeout (minutes)</Label>
                <p className="text-sm text-muted-foreground">
                  Auto-logout after inactivity
                </p>
              </div>
              <Input
                id="session"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeout: e.target.value })
                }
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Database & Backup */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Database & Backup
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-backup">Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">
                  Daily automated database backups
                </p>
              </div>
              <Switch
                id="auto-backup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoBackup: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Maintenance
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable access for non-admin users
                </p>
              </div>
              <Switch
                id="maintenance"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenanceMode: checked })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
