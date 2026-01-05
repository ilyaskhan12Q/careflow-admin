import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Home,
  Pill,
  Users,
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PharmacyOrder {
  id: string;
  patientName: string;
  patientId: string;
  type: "indoor" | "outdoor";
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "completed";
  timestamp: string;
  room?: string;
}

const orders: PharmacyOrder[] = [
  {
    id: "ORD-001",
    patientName: "Sarah Johnson",
    patientId: "P-001",
    type: "indoor",
    items: [
      { name: "Amoxicillin 500mg", quantity: 14, price: 8.50 },
      { name: "Ibuprofen 400mg", quantity: 10, price: 5.25 },
    ],
    total: 13.75,
    status: "completed",
    timestamp: "10:30 AM",
    room: "Room 204",
  },
  {
    id: "ORD-002",
    patientName: "Michael Chen",
    patientId: "P-002",
    type: "outdoor",
    items: [
      { name: "Cast Padding", quantity: 2, price: 15.00 },
      { name: "Pain Relief Spray", quantity: 1, price: 12.50 },
    ],
    total: 27.50,
    status: "processing",
    timestamp: "11:15 AM",
  },
  {
    id: "ORD-003",
    patientName: "Robert Williams",
    patientId: "P-004",
    type: "indoor",
    items: [
      { name: "IV Solution", quantity: 3, price: 25.00 },
      { name: "Morphine 10mg", quantity: 5, price: 45.00 },
      { name: "Antibiotic Injection", quantity: 7, price: 35.00 },
    ],
    total: 105.00,
    status: "pending",
    timestamp: "11:45 AM",
    room: "ICU-3",
  },
  {
    id: "ORD-004",
    patientName: "Emily Davis",
    patientId: "P-003",
    type: "outdoor",
    items: [
      { name: "Hydrocortisone Cream", quantity: 1, price: 18.50 },
      { name: "Antihistamine", quantity: 20, price: 12.00 },
    ],
    total: 30.50,
    status: "completed",
    timestamp: "09:00 AM",
  },
];

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
};

const statusIcons = {
  pending: Clock,
  processing: ShoppingCart,
  completed: CheckCircle,
};

const PharmacyIO = () => {
  const [activeTab, setActiveTab] = useState<"indoor" | "outdoor">("indoor");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.type === activeTab &&
      (order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indoorOrders = orders.filter((o) => o.type === "indoor");
  const outdoorOrders = orders.filter((o) => o.type === "outdoor");
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <DashboardLayout
      title="Indoor & Outdoor Pharmacy"
      subtitle="Manage pharmacy orders for admitted and walk-in patients"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Indoor Orders"
            value={indoorOrders.length}
            icon={<Building className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Outdoor Orders"
            value={outdoorOrders.length}
            icon={<Home className="h-6 w-6" />}
            variant="info"
          />
          <StatCard
            title="Pending Fulfillment"
            value={pendingCount}
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Today's Revenue"
            value="$1,856"
            change={12.5}
            changeLabel="vs yesterday"
            icon={<Pill className="h-6 w-6" />}
            variant="success"
          />
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "indoor" | "outdoor")}>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="indoor" className="gap-2">
                <Building className="h-4 w-4" /> Indoor Patients
              </TabsTrigger>
              <TabsTrigger value="outdoor" className="gap-2">
                <Users className="h-4 w-4" /> Outdoor Patients
              </TabsTrigger>
            </TabsList>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Order
            </Button>
          </div>

          <TabsContent value="indoor">
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Indoor Pharmacy</p>
                    <p className="text-sm text-muted-foreground">
                      Medication dispensing for admitted patients. Charges are added to patient's room bill.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order List */}
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="divide-y divide-border">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status];
                    return (
                      <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Pill className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">{order.id}</p>
                                <span className={cn("badge-status", statusStyles[order.status])}>
                                  <StatusIcon className="h-3 w-3" />
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.patientName} • {order.patientId}
                                {order.room && ` • ${order.room}`}
                              </p>
                              <div className="mt-2 space-y-1">
                                {order.items.map((item, i) => (
                                  <p key={i} className="text-sm text-muted-foreground">
                                    {item.name} × {item.quantity}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-foreground">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{order.timestamp}</p>
                            {order.status !== "completed" && (
                              <Button size="sm" className="mt-2">
                                Process
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
          </TabsContent>

          <TabsContent value="outdoor">
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="bg-info/5 border border-info/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-info shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Outdoor Pharmacy</p>
                    <p className="text-sm text-muted-foreground">
                      Counter sales for walk-in and outpatients. Payment collected at point of sale.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order List */}
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="divide-y divide-border">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status];
                    return (
                      <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                              <Pill className="h-6 w-6 text-info" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">{order.id}</p>
                                <span className={cn("badge-status", statusStyles[order.status])}>
                                  <StatusIcon className="h-3 w-3" />
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.patientName} • {order.patientId}
                              </p>
                              <div className="mt-2 space-y-1">
                                {order.items.map((item, i) => (
                                  <p key={i} className="text-sm text-muted-foreground">
                                    {item.name} × {item.quantity}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-foreground">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{order.timestamp}</p>
                            {order.status !== "completed" && (
                              <Button size="sm" className="mt-2">
                                Complete Sale
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PharmacyIO;
