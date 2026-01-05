import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  items: { description: string; quantity: number; rate: number; total: number }[];
}

const invoices: Invoice[] = [
  {
    id: "INV-001",
    patientName: "Sarah Johnson",
    patientId: "P-001",
    date: "2024-01-15",
    dueDate: "2024-01-30",
    amount: 1250.00,
    status: "paid",
    items: [
      { description: "Consultation Fee", quantity: 1, rate: 150, total: 150 },
      { description: "ECG Test", quantity: 1, rate: 200, total: 200 },
      { description: "Blood Test Panel", quantity: 1, rate: 350, total: 350 },
      { description: "Medication", quantity: 1, rate: 550, total: 550 },
    ],
  },
  {
    id: "INV-002",
    patientName: "Michael Chen",
    patientId: "P-002",
    date: "2024-01-14",
    dueDate: "2024-01-29",
    amount: 875.50,
    status: "pending",
    items: [
      { description: "X-Ray", quantity: 2, rate: 175, total: 350 },
      { description: "Cast Application", quantity: 1, rate: 425.50, total: 425.50 },
      { description: "Pain Medication", quantity: 1, rate: 100, total: 100 },
    ],
  },
  {
    id: "INV-003",
    patientName: "Emily Davis",
    patientId: "P-003",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    amount: 450.00,
    status: "overdue",
    items: [
      { description: "Dermatology Consultation", quantity: 1, rate: 200, total: 200 },
      { description: "Skin Biopsy", quantity: 1, rate: 250, total: 250 },
    ],
  },
  {
    id: "INV-004",
    patientName: "Robert Williams",
    patientId: "P-004",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    amount: 12500.00,
    status: "pending",
    items: [
      { description: "Surgery - Appendectomy", quantity: 1, rate: 8000, total: 8000 },
      { description: "Anesthesia", quantity: 1, rate: 1500, total: 1500 },
      { description: "Hospital Stay (3 days)", quantity: 3, rate: 800, total: 2400 },
      { description: "Post-Op Medication", quantity: 1, rate: 600, total: 600 },
    ],
  },
];

const statusStyles = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
};

const statusIcons = {
  paid: CheckCircle,
  pending: Clock,
  overdue: AlertCircle,
};

const Finance = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === "paid" ? inv.amount : 0), 0);
  const pendingAmount = invoices.reduce((sum, inv) => sum + (inv.status === "pending" ? inv.amount : 0), 0);
  const overdueAmount = invoices.reduce((sum, inv) => sum + (inv.status === "overdue" ? inv.amount : 0), 0);

  return (
    <DashboardLayout
      title="Finance & Billing"
      subtitle="Manage invoices, payments, and revenue tracking"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`PKR ${totalRevenue.toLocaleString()}`}
            change={23.1}
            changeLabel="this month"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
          />
          <StatCard
            title="Pending Payments"
            value={`PKR ${pendingAmount.toLocaleString()}`}
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Overdue"
            value={`PKR ${overdueAmount.toLocaleString()}`}
            icon={<AlertCircle className="h-6 w-6" />}
            variant="default"
          />
          <StatCard
            title="Invoices"
            value={invoices.length}
            change={12}
            changeLabel="new this week"
            icon={<Receipt className="h-6 w-6" />}
            variant="primary"
          />
        </div>

        <Tabs defaultValue="invoices" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="invoices" className="gap-2">
                <Receipt className="h-4 w-4" /> Invoices
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="h-4 w-4" /> Payments
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <TrendingUp className="h-4 w-4" /> Reports
              </TabsTrigger>
            </TabsList>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Invoice
            </Button>
          </div>

          <TabsContent value="invoices">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Invoice List */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Invoice
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Patient
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Amount
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
                      {filteredInvoices.map((invoice) => {
                        const StatusIcon = statusIcons[invoice.status];
                        return (
                          <tr
                            key={invoice.id}
                            className={cn(
                              "table-row-hover border-b border-border last:border-0 cursor-pointer",
                              selectedInvoice?.id === invoice.id && "bg-primary/5"
                            )}
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-foreground">{invoice.id}</p>
                                <p className="text-sm text-muted-foreground">{invoice.date}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-foreground">{invoice.patientName}</p>
                              <p className="text-sm text-muted-foreground">{invoice.patientId}</p>
                            </td>
                            <td className="px-4 py-4">
                              <p className="font-medium text-foreground">
                                PKR {invoice.amount.toLocaleString()}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span className={cn("badge-status", statusStyles[invoice.status])}>
                                <StatusIcon className="h-3 w-3" />
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Preview */}
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                {selectedInvoice ? (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground">
                          {selectedInvoice.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Due: {selectedInvoice.dueDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Bill To</p>
                        <p className="font-medium text-foreground">{selectedInvoice.patientName}</p>
                        <p className="text-sm text-muted-foreground">{selectedInvoice.patientId}</p>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden mb-6">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left px-3 py-2 font-medium">Item</th>
                            <th className="text-right px-3 py-2 font-medium">Qty</th>
                            <th className="text-right px-3 py-2 font-medium">Rate</th>
                            <th className="text-right px-3 py-2 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="px-3 py-2">{item.description}</td>
                              <td className="text-right px-3 py-2">{item.quantity}</td>
                              <td className="text-right px-3 py-2">PKR {item.rate}</td>
                              <td className="text-right px-3 py-2">PKR {item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>PKR {selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (0%)</span>
                        <span>PKR 0</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">PKR {selectedInvoice.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {selectedInvoice.status !== "paid" && (
                      <Button className="w-full mt-6 gap-2">
                        <CreditCard className="h-4 w-4" /> Process Payment
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No Invoice Selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select an invoice from the list to preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Payment History</h3>
              <p className="text-sm text-muted-foreground">
                View all payment transactions and history
              </p>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Financial Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate and download financial reports
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Finance;
