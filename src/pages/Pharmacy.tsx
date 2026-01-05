import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Pill,
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ShoppingCart,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  minStock: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

const medicines: Medicine[] = [
  {
    id: "MED-001",
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    category: "Antibiotics",
    manufacturer: "PharmaCorp",
    batchNo: "BC-2024-001",
    expiryDate: "2025-06-15",
    quantity: 450,
    minStock: 100,
    price: 12.50,
    status: "in-stock",
  },
  {
    id: "MED-002",
    name: "Lisinopril",
    genericName: "Lisinopril Dihydrate",
    category: "Cardiovascular",
    manufacturer: "HeartMed Inc",
    batchNo: "BC-2024-002",
    expiryDate: "2025-03-20",
    quantity: 85,
    minStock: 100,
    price: 18.75,
    status: "low-stock",
  },
  {
    id: "MED-003",
    name: "Metformin",
    genericName: "Metformin HCl",
    category: "Diabetes",
    manufacturer: "DiabetCare",
    batchNo: "BC-2024-003",
    expiryDate: "2025-09-10",
    quantity: 320,
    minStock: 150,
    price: 8.25,
    status: "in-stock",
  },
  {
    id: "MED-004",
    name: "Omeprazole",
    genericName: "Omeprazole Magnesium",
    category: "Gastrointestinal",
    manufacturer: "GastroHealth",
    batchNo: "BC-2024-004",
    expiryDate: "2024-12-01",
    quantity: 0,
    minStock: 50,
    price: 15.00,
    status: "out-of-stock",
  },
  {
    id: "MED-005",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    category: "Cardiovascular",
    manufacturer: "HeartMed Inc",
    batchNo: "BC-2024-005",
    expiryDate: "2025-08-25",
    quantity: 200,
    minStock: 75,
    price: 22.50,
    status: "in-stock",
  },
];

const statusStyles = {
  "in-stock": "bg-success/10 text-success",
  "low-stock": "bg-warning/10 text-warning",
  "out-of-stock": "bg-destructive/10 text-destructive",
};

const statusLabels = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

const Pharmacy = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = medicines.length;
  const lowStockItems = medicines.filter((m) => m.status === "low-stock").length;
  const outOfStockItems = medicines.filter((m) => m.status === "out-of-stock").length;

  return (
    <DashboardLayout
      title="Pharmacy Management"
      subtitle="Manage medicine inventory, prescriptions, and sales"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Medicines"
            value={totalItems}
            icon={<Pill className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockItems}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockItems}
            icon={<Package className="h-6 w-6" />}
            variant="default"
          />
          <StatCard
            title="Today's Sales"
            value="$2,450"
            change={18.5}
            changeLabel="vs yesterday"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Stock Alerts */}
        {(lowStockItems > 0 || outOfStockItems > 0) && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
              <div>
                <p className="font-medium text-foreground">Inventory Alert</p>
                <p className="text-sm text-muted-foreground">
                  {lowStockItems} items are running low and {outOfStockItems} items are out of stock.
                  Please reorder soon.
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto shrink-0">
                View Details
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="inventory" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="inventory" className="gap-2">
                <Package className="h-4 w-4" /> Inventory
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="gap-2">
                <Pill className="h-4 w-4" /> Prescriptions
              </TabsTrigger>
              <TabsTrigger value="sales" className="gap-2">
                <ShoppingCart className="h-4 w-4" /> Sales
              </TabsTrigger>
            </TabsList>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Medicine
            </Button>
          </div>

          <TabsContent value="inventory">
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" /> Sort
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Medicine
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Category
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Stock
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Expiry
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Price
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Status
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.map((medicine) => (
                      <tr key={medicine.id} className="table-row-hover border-b border-border last:border-0">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-foreground">{medicine.name}</p>
                            <p className="text-sm text-muted-foreground">{medicine.genericName}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{medicine.category}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{medicine.quantity}</span>
                              <span className="text-muted-foreground">/ {medicine.minStock}</span>
                            </div>
                            <Progress
                              value={(medicine.quantity / medicine.minStock) * 100}
                              className={cn(
                                "h-1.5",
                                medicine.status === "low-stock" && "[&>div]:bg-warning",
                                medicine.status === "out-of-stock" && "[&>div]:bg-destructive"
                              )}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-foreground">{medicine.expiryDate}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-medium text-foreground">${medicine.price.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("badge-status", statusStyles[medicine.status])}>
                            {statusLabels[medicine.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Package className="h-4 w-4" /> Reorder
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prescriptions">
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Prescription Fulfillment</h3>
              <p className="text-sm text-muted-foreground">
                Manage and fulfill patient prescriptions
              </p>
            </div>
          </TabsContent>

          <TabsContent value="sales">
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Sales Tracking</h3>
              <p className="text-sm text-muted-foreground">
                View and manage pharmacy sales
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Pharmacy;
