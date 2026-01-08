import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Medicine = Tables<"medicines">;

const statusStyles = {
  active: "bg-success/10 text-success",
  "low-stock": "bg-warning/10 text-warning",
  inactive: "bg-destructive/10 text-destructive",
};

const Pharmacy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    generic_name: "",
    category: "",
    manufacturer: "",
    batch_number: "",
    expiry_date: "",
    stock_quantity: 0,
    minimum_stock: 10,
    unit_price: 0,
    unit: "tablet",
    requires_prescription: true,
    storage_conditions: "",
  });
  const { toast } = useToast();

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .order("name");

      if (error) throw error;
      setMedicines(data || []);
    } catch (error: any) {
      console.error("Error fetching medicines:", error);
      toast({
        title: "Error",
        description: "Failed to load medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const generateMedicineCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MED-${timestamp}-${random}`;
  };

  const handleAddMedicine = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Medicine name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("medicines").insert({
        medicine_code: generateMedicineCode(),
        name: formData.name,
        generic_name: formData.generic_name || null,
        category: formData.category || null,
        manufacturer: formData.manufacturer || null,
        batch_number: formData.batch_number || null,
        expiry_date: formData.expiry_date || null,
        stock_quantity: formData.stock_quantity,
        minimum_stock: formData.minimum_stock,
        unit_price: formData.unit_price,
        unit: formData.unit,
        requires_prescription: formData.requires_prescription,
        storage_conditions: formData.storage_conditions || null,
        status: formData.stock_quantity === 0 ? "inactive" : formData.stock_quantity < formData.minimum_stock ? "low-stock" : "active",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Medicine added successfully",
      });
      setAddDialogOpen(false);
      setFormData({
        name: "",
        generic_name: "",
        category: "",
        manufacturer: "",
        batch_number: "",
        expiry_date: "",
        stock_quantity: 0,
        minimum_stock: 10,
        unit_price: 0,
        unit: "tablet",
        requires_prescription: true,
        storage_conditions: "",
      });
      fetchMedicines();
    } catch (error: any) {
      console.error("Error adding medicine:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add medicine",
        variant: "destructive",
      });
    }
  };

  const getStatus = (med: Medicine) => {
    if (med.stock_quantity === 0) return "inactive";
    if (med.stock_quantity < (med.minimum_stock || 10)) return "low-stock";
    return "active";
  };

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.generic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      med.medicine_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = medicines.length;
  const lowStockItems = medicines.filter((m) => getStatus(m) === "low-stock").length;
  const outOfStockItems = medicines.filter((m) => m.stock_quantity === 0).length;

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
            <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
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
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading medicines...</div>
                ) : (
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
                      {filteredMedicines.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                            No medicines found
                          </td>
                        </tr>
                      ) : (
                        filteredMedicines.map((medicine) => {
                          const status = getStatus(medicine);
                          return (
                            <tr key={medicine.id} className="table-row-hover border-b border-border last:border-0">
                              <td className="px-4 py-4">
                                <div>
                                  <p className="font-medium text-foreground">{medicine.name}</p>
                                  <p className="text-sm text-muted-foreground">{medicine.generic_name || "-"}</p>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-foreground">{medicine.category || "-"}</span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>{medicine.stock_quantity}</span>
                                    <span className="text-muted-foreground">/ {medicine.minimum_stock || 10}</span>
                                  </div>
                                  <Progress
                                    value={Math.min((medicine.stock_quantity / (medicine.minimum_stock || 10)) * 100, 100)}
                                    className={cn(
                                      "h-1.5",
                                      status === "low-stock" && "[&>div]:bg-warning",
                                      status === "inactive" && "[&>div]:bg-destructive"
                                    )}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-foreground">{medicine.expiry_date || "-"}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="font-medium text-foreground">${Number(medicine.unit_price).toFixed(2)}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className={cn("badge-status px-2 py-1 rounded-full text-xs font-medium", statusStyles[status])}>
                                  {status === "active" ? "In Stock" : status === "low-stock" ? "Low Stock" : "Out of Stock"}
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
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
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

      {/* Add Medicine Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Enter the details of the new medicine to add to inventory
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medicine Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Amoxicillin"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="generic_name">Generic Name</Label>
              <Input
                id="generic_name"
                placeholder="e.g., Amoxicillin Trihydrate"
                value={formData.generic_name}
                onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="Diabetes">Diabetes</SelectItem>
                  <SelectItem value="Gastrointestinal">Gastrointestinal</SelectItem>
                  <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                  <SelectItem value="Respiratory">Respiratory</SelectItem>
                  <SelectItem value="Vitamins">Vitamins</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                placeholder="e.g., PharmaCorp"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch_number">Batch Number</Label>
              <Input
                id="batch_number"
                placeholder="e.g., BC-2024-001"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimum_stock">Minimum Stock Level</Label>
              <Input
                id="minimum_stock"
                type="number"
                min="0"
                value={formData.minimum_stock}
                onChange={(e) => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) || 10 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_price">Unit Price ($)</Label>
              <Input
                id="unit_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="capsule">Capsule</SelectItem>
                  <SelectItem value="bottle">Bottle</SelectItem>
                  <SelectItem value="vial">Vial</SelectItem>
                  <SelectItem value="tube">Tube</SelectItem>
                  <SelectItem value="pack">Pack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requires_prescription">Requires Prescription</Label>
              <Select 
                value={formData.requires_prescription ? "yes" : "no"} 
                onValueChange={(v) => setFormData({ ...formData, requires_prescription: v === "yes" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage_conditions">Storage Conditions</Label>
              <Input
                id="storage_conditions"
                placeholder="e.g., Store below 25°C"
                value={formData.storage_conditions}
                onChange={(e) => setFormData({ ...formData, storage_conditions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedicine}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Pharmacy;
