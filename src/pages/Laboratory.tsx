import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FlaskConical,
  TestTube,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  MoreHorizontal,
  User,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  testCategory: string;
  sampleType: string;
  sampleId: string;
  orderedBy: string;
  orderedDate: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "normal" | "urgent" | "stat";
  result?: string;
}

const labTests: LabTest[] = [
  {
    id: "LAB-001",
    patientName: "Sarah Johnson",
    patientId: "P-001",
    testName: "Complete Blood Count (CBC)",
    testCategory: "Hematology",
    sampleType: "Blood",
    sampleId: "SMP-001",
    orderedBy: "Dr. Smith",
    orderedDate: "2024-01-15",
    status: "completed",
    priority: "normal",
    result: "Normal",
  },
  {
    id: "LAB-002",
    patientName: "Michael Chen",
    patientId: "P-002",
    testName: "Lipid Panel",
    testCategory: "Chemistry",
    sampleType: "Blood",
    sampleId: "SMP-002",
    orderedBy: "Dr. Johnson",
    orderedDate: "2024-01-15",
    status: "in-progress",
    priority: "normal",
  },
  {
    id: "LAB-003",
    patientName: "Emily Davis",
    patientId: "P-003",
    testName: "Skin Biopsy",
    testCategory: "Pathology",
    sampleType: "Tissue",
    sampleId: "SMP-003",
    orderedBy: "Dr. Williams",
    orderedDate: "2024-01-14",
    status: "pending",
    priority: "urgent",
  },
  {
    id: "LAB-004",
    patientName: "Robert Williams",
    patientId: "P-004",
    testName: "Basic Metabolic Panel",
    testCategory: "Chemistry",
    sampleType: "Blood",
    sampleId: "SMP-004",
    orderedBy: "Dr. Smith",
    orderedDate: "2024-01-15",
    status: "completed",
    priority: "stat",
    result: "Abnormal - High glucose",
  },
  {
    id: "LAB-005",
    patientName: "Lisa Anderson",
    patientId: "P-005",
    testName: "Urinalysis",
    testCategory: "Urinalysis",
    sampleType: "Urine",
    sampleId: "SMP-005",
    orderedBy: "Dr. Johnson",
    orderedDate: "2024-01-15",
    status: "in-progress",
    priority: "normal",
  },
];

const statusStyles = {
  pending: "bg-muted text-muted-foreground",
  "in-progress": "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusIcons = {
  pending: Clock,
  "in-progress": FlaskConical,
  completed: CheckCircle,
  cancelled: AlertCircle,
};

const priorityStyles = {
  normal: "bg-muted text-muted-foreground",
  urgent: "bg-warning/10 text-warning",
  stat: "bg-destructive/10 text-destructive",
};

const Laboratory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  const filteredTests = labTests.filter(
    (test) =>
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = labTests.filter((t) => t.status === "pending").length;
  const inProgressCount = labTests.filter((t) => t.status === "in-progress").length;
  const completedCount = labTests.filter((t) => t.status === "completed").length;

  return (
    <DashboardLayout
      title="Laboratory"
      subtitle="Manage lab tests, samples, and results"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Tests"
            value={pendingCount}
            icon={<Clock className="h-6 w-6" />}
            variant="warning"
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            icon={<FlaskConical className="h-6 w-6" />}
            variant="info"
          />
          <StatCard
            title="Completed Today"
            value={completedCount}
            change={12}
            changeLabel="vs yesterday"
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <StatCard
            title="Total Samples"
            value="156"
            icon={<TestTube className="h-6 w-6" />}
            variant="primary"
          />
        </div>

        <Tabs defaultValue="tests" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="tests" className="gap-2">
                <FlaskConical className="h-4 w-4" /> Tests
              </TabsTrigger>
              <TabsTrigger value="samples" className="gap-2">
                <TestTube className="h-4 w-4" /> Samples
              </TabsTrigger>
              <TabsTrigger value="results" className="gap-2">
                <CheckCircle className="h-4 w-4" /> Results
              </TabsTrigger>
            </TabsList>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Test Order
            </Button>
          </div>

          <TabsContent value="tests">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Test List */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tests..."
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
                          Test
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Patient
                        </th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Priority
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
                      {filteredTests.map((test) => {
                        const StatusIcon = statusIcons[test.status];
                        return (
                          <tr
                            key={test.id}
                            className={cn(
                              "table-row-hover border-b border-border last:border-0 cursor-pointer",
                              selectedTest?.id === test.id && "bg-primary/5"
                            )}
                            onClick={() => setSelectedTest(test)}
                          >
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-foreground">{test.testName}</p>
                                <p className="text-sm text-muted-foreground">{test.id} • {test.testCategory}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-foreground">{test.patientName}</p>
                              <p className="text-sm text-muted-foreground">{test.patientId}</p>
                            </td>
                            <td className="px-4 py-4">
                              <span className={cn("badge-status uppercase text-[10px]", priorityStyles[test.priority])}>
                                {test.priority}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={cn("badge-status", statusStyles[test.status])}>
                                <StatusIcon className="h-3 w-3" />
                                {test.status.replace("-", " ")}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="gap-2">
                                    <Eye className="h-4 w-4" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2">
                                    <FlaskConical className="h-4 w-4" /> Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2">
                                    <Download className="h-4 w-4" /> Download Report
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Test Details */}
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                {selectedTest ? (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground">
                          {selectedTest.id}
                        </h3>
                        <span className={cn("badge-status", statusStyles[selectedTest.status])}>
                          {selectedTest.status.replace("-", " ")}
                        </span>
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

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Test Name</p>
                        <p className="font-medium text-foreground">{selectedTest.testName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase mb-1">Category</p>
                          <p className="text-foreground">{selectedTest.testCategory}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase mb-1">Sample Type</p>
                          <p className="text-foreground">{selectedTest.sampleType}</p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Patient Information</span>
                        </div>
                        <p className="font-medium text-foreground">{selectedTest.patientName}</p>
                        <p className="text-sm text-muted-foreground">{selectedTest.patientId}</p>
                      </div>

                      <div className="border-t border-border pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Order Details</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ordered By</span>
                            <span className="text-foreground">{selectedTest.orderedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Date</span>
                            <span className="text-foreground">{selectedTest.orderedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sample ID</span>
                            <span className="text-foreground">{selectedTest.sampleId}</span>
                          </div>
                        </div>
                      </div>

                      {selectedTest.result && (
                        <div className="border-t border-border pt-4">
                          <p className="text-xs text-muted-foreground uppercase mb-2">Result</p>
                          <div className={cn(
                            "p-3 rounded-lg",
                            selectedTest.result.includes("Abnormal")
                              ? "bg-destructive/10 text-destructive"
                              : "bg-success/10 text-success"
                          )}>
                            <p className="font-medium">{selectedTest.result}</p>
                          </div>
                        </div>
                      )}

                      {selectedTest.status !== "completed" && (
                        <Button className="w-full mt-4">
                          Update Status
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">No Test Selected</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a test from the list to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="samples">
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Sample Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track and manage laboratory samples
              </p>
            </div>
          </TabsContent>

          <TabsContent value="results">
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Test Results</h3>
              <p className="text-sm text-muted-foreground">
                View and manage completed test results
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Laboratory;
