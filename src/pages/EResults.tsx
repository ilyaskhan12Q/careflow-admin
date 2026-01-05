import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Share2,
  Eye,
  Clock,
  CheckCircle,
  FlaskConical,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LabResult {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  category: string;
  date: string;
  status: "available" | "pending";
  results: {
    parameter: string;
    value: string;
    unit: string;
    reference: string;
    status: "normal" | "high" | "low";
  }[];
  doctor: string;
  notes?: string;
}

const labResults: LabResult[] = [
  {
    id: "RES-001",
    patientName: "Sarah Johnson",
    patientId: "P-001",
    testName: "Complete Blood Count (CBC)",
    category: "Hematology",
    date: "2024-01-15",
    status: "available",
    doctor: "Dr. Smith",
    results: [
      { parameter: "WBC", value: "7.5", unit: "10³/µL", reference: "4.5-11.0", status: "normal" },
      { parameter: "RBC", value: "4.8", unit: "10⁶/µL", reference: "4.0-5.5", status: "normal" },
      { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", reference: "12.0-16.0", status: "normal" },
      { parameter: "Hematocrit", value: "42", unit: "%", reference: "36-46", status: "normal" },
      { parameter: "Platelets", value: "250", unit: "10³/µL", reference: "150-400", status: "normal" },
    ],
    notes: "All parameters within normal range. No further action required.",
  },
  {
    id: "RES-002",
    patientName: "Robert Williams",
    patientId: "P-004",
    testName: "Basic Metabolic Panel",
    category: "Chemistry",
    date: "2024-01-15",
    status: "available",
    doctor: "Dr. Smith",
    results: [
      { parameter: "Glucose", value: "145", unit: "mg/dL", reference: "70-100", status: "high" },
      { parameter: "BUN", value: "18", unit: "mg/dL", reference: "7-20", status: "normal" },
      { parameter: "Creatinine", value: "1.0", unit: "mg/dL", reference: "0.7-1.3", status: "normal" },
      { parameter: "Sodium", value: "140", unit: "mEq/L", reference: "136-145", status: "normal" },
      { parameter: "Potassium", value: "4.2", unit: "mEq/L", reference: "3.5-5.0", status: "normal" },
    ],
    notes: "Elevated glucose levels. Recommend diabetes screening and dietary consultation.",
  },
  {
    id: "RES-003",
    patientName: "Michael Chen",
    patientId: "P-002",
    testName: "Lipid Panel",
    category: "Chemistry",
    date: "2024-01-15",
    status: "pending",
    doctor: "Dr. Johnson",
    results: [],
  },
];

const statusStyles = {
  normal: "bg-success/10 text-success",
  high: "bg-destructive/10 text-destructive",
  low: "bg-warning/10 text-warning",
};

const EResults = () => {
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(labResults[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = labResults.filter(
    (result) =>
      result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="E-Results"
      subtitle="View and share laboratory results"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Results List */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
            {filteredResults.map((result) => (
              <button
                key={result.id}
                onClick={() => setSelectedResult(result)}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-muted/50",
                  selectedResult?.id === result.id && "bg-primary/5 border-l-4 border-l-primary"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    result.status === "available" ? "bg-success/10" : "bg-muted"
                  )}>
                    {result.status === "available" ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{result.testName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {result.patientName} • {result.id}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{result.date}</span>
                      <span className={cn(
                        "badge-status text-[10px]",
                        result.status === "available" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      )}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Result Details */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden">
          {selectedResult && selectedResult.status === "available" ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FlaskConical className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        {selectedResult.testName}
                      </h2>
                      <p className="text-muted-foreground">{selectedResult.category}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedResult.id} • {selectedResult.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Patient</p>
                    <p className="font-medium text-foreground">{selectedResult.patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patient ID</p>
                    <p className="font-medium text-foreground">{selectedResult.patientId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ordered By</p>
                    <p className="font-medium text-foreground">{selectedResult.doctor}</p>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="flex-1 p-6 overflow-y-auto">
                <h3 className="font-semibold text-foreground mb-4">Test Results</h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                          Parameter
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                          Result
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                          Unit
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                          Reference Range
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.results.map((result, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="px-4 py-3 font-medium text-foreground">
                            {result.parameter}
                          </td>
                          <td className={cn(
                            "px-4 py-3 font-bold",
                            result.status === "normal" ? "text-foreground" : "text-destructive"
                          )}>
                            {result.value}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {result.unit}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {result.reference}
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("badge-status", statusStyles[result.status])}>
                              {result.status === "normal" ? "Normal" : result.status === "high" ? "High" : "Low"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Notes */}
                {selectedResult.notes && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-foreground mb-2">Clinical Notes</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-foreground">{selectedResult.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30">
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" /> Download PDF Report
                </Button>
              </div>
            </div>
          ) : selectedResult?.status === "pending" ? (
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  Results Pending
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  The lab results for {selectedResult.testName} are still being processed.
                  Please check back later.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">No Result Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a result from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EResults;
