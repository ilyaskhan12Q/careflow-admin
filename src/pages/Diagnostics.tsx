import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  MoreHorizontal,
  Image,
  Heart,
  Brain,
  Bone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DiagnosticReport {
  id: string;
  patientName: string;
  patientId: string;
  type: "x-ray" | "mri" | "ct-scan" | "ultrasound" | "ecg" | "eeg";
  description: string;
  orderedBy: string;
  orderedDate: string;
  status: "pending" | "in-progress" | "completed";
  findings?: string;
  imageCount?: number;
}

const reports: DiagnosticReport[] = [
  {
    id: "DX-001",
    patientName: "Sarah Johnson",
    patientId: "P-001",
    type: "ecg",
    description: "12-Lead ECG",
    orderedBy: "Dr. Smith",
    orderedDate: "2024-01-15",
    status: "completed",
    findings: "Normal sinus rhythm. No ST-T changes. Normal QTc interval.",
    imageCount: 1,
  },
  {
    id: "DX-002",
    patientName: "Michael Chen",
    patientId: "P-002",
    type: "x-ray",
    description: "Right Arm X-Ray",
    orderedBy: "Dr. Johnson",
    orderedDate: "2024-01-15",
    status: "completed",
    findings: "Distal radius fracture. Proper alignment observed. No additional fractures detected.",
    imageCount: 3,
  },
  {
    id: "DX-003",
    patientName: "Robert Williams",
    patientId: "P-004",
    type: "mri",
    description: "Brain MRI",
    orderedBy: "Dr. Williams",
    orderedDate: "2024-01-15",
    status: "in-progress",
    imageCount: 24,
  },
  {
    id: "DX-004",
    patientName: "Lisa Anderson",
    patientId: "P-005",
    type: "ct-scan",
    description: "Abdominal CT Scan",
    orderedBy: "Dr. Smith",
    orderedDate: "2024-01-14",
    status: "pending",
  },
  {
    id: "DX-005",
    patientName: "Emily Davis",
    patientId: "P-003",
    type: "ultrasound",
    description: "Abdominal Ultrasound",
    orderedBy: "Dr. Johnson",
    orderedDate: "2024-01-15",
    status: "completed",
    findings: "Liver, gallbladder, and kidneys appear normal. No abnormalities detected.",
    imageCount: 8,
  },
];

const typeIcons = {
  "x-ray": Bone,
  "mri": Brain,
  "ct-scan": Activity,
  "ultrasound": Activity,
  "ecg": Heart,
  "eeg": Brain,
};

const typeLabels = {
  "x-ray": "X-Ray",
  "mri": "MRI",
  "ct-scan": "CT Scan",
  "ultrasound": "Ultrasound",
  "ecg": "ECG",
  "eeg": "EEG",
};

const statusStyles = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
};

const Diagnostics = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<DiagnosticReport | null>(reports[0]);

  const filteredReports = reports.filter(
    (report) =>
      report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = reports.filter((r) => r.status === "completed").length;
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <DashboardLayout
      title="Diagnostics"
      subtitle="Manage diagnostic reports and imaging"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Reports"
            value={reports.length}
            icon={<FileText className="h-6 w-6" />}
            variant="primary"
          />
          <StatCard
            title="Completed"
            value={completedCount}
            change={15}
            changeLabel="today"
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="Images Stored"
            value="1.2K"
            icon={<Image className="h-6 w-6" />}
            variant="info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report List */}
          <div className="lg:col-span-1 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" /> New Diagnostic Order
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
              {filteredReports.map((report) => {
                const TypeIcon = typeIcons[report.type];
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={cn(
                      "w-full p-4 text-left transition-colors hover:bg-muted/50",
                      selectedReport?.id === report.id && "bg-primary/5 border-l-4 border-l-primary"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <TypeIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-foreground truncate">{report.description}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {report.patientName} • {report.id}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {typeLabels[report.type]}
                          </span>
                          <span className={cn("badge-status text-[10px]", statusStyles[report.status])}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Details */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden">
            {selectedReport ? (
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-display font-bold text-foreground">
                          {selectedReport.description}
                        </h2>
                        <span className={cn("badge-status", statusStyles[selectedReport.status])}>
                          {selectedReport.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {selectedReport.id} • {typeLabels[selectedReport.type]}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" /> View Full Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <FileText className="h-4 w-4" /> Export as PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Patient</p>
                      <p className="font-medium text-foreground">{selectedReport.patientName}</p>
                      <p className="text-sm text-muted-foreground">{selectedReport.patientId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Ordered By</p>
                      <p className="font-medium text-foreground">{selectedReport.orderedBy}</p>
                      <p className="text-sm text-muted-foreground">{selectedReport.orderedDate}</p>
                    </div>
                  </div>

                  {/* Image Preview Area */}
                  {selectedReport.imageCount && (
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground uppercase mb-3">
                        Images ({selectedReport.imageCount})
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: Math.min(selectedReport.imageCount, 4) }).map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                          >
                            <Image className="h-8 w-8 text-muted-foreground" />
                          </div>
                        ))}
                        {selectedReport.imageCount > 4 && (
                          <div className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                            <span className="text-sm font-medium text-primary">
                              +{selectedReport.imageCount - 4} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Findings */}
                  {selectedReport.findings ? (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-3">Findings</p>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-foreground leading-relaxed">{selectedReport.findings}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-6 text-center">
                      <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Report findings pending. Check back later.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {selectedReport.status === "completed" && (
                  <div className="p-4 border-t border-border bg-muted/30">
                    <Button className="w-full gap-2">
                      <Download className="h-4 w-4" /> Download Full Report
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No Report Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a report from the list to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Diagnostics;
