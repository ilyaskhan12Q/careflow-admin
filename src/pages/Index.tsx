import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { AppointmentsWidget } from "@/components/dashboard/AppointmentsWidget";
import {
  Users,
  Calendar,
  DollarSign,
  Bed,
  Pill,
  FlaskConical,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Welcome back, Admin. Here's what's happening today."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Patients"
            value="2,847"
            change={12.5}
            changeLabel="vs last month"
            icon={<Users className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Appointments"
            value="156"
            change={8.2}
            changeLabel="today"
            icon={<Calendar className="h-6 w-6" />}
            variant="info"
          />
          <StatCard
            title="Revenue"
            value="$48.5K"
            change={23.1}
            changeLabel="this week"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
          />
          <StatCard
            title="Bed Occupancy"
            value="78%"
            change={-5.3}
            changeLabel="capacity"
            icon={<Bed className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Pharmacy"
            value="1,245"
            change={15.8}
            changeLabel="items sold"
            icon={<Pill className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Lab Tests"
            value="328"
            change={18.4}
            changeLabel="completed"
            icon={<FlaskConical className="h-6 w-6" />}
            variant="info"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">
            Quick Actions
          </h2>
          <QuickActions />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Patients - Takes 2 columns */}
          <div className="xl:col-span-2">
            <RecentPatients />
          </div>

          {/* Appointments Widget */}
          <div>
            <AppointmentsWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
