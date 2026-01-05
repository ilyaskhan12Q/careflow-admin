import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Filter,
  Eye,
  FileText,
  MessageSquare,
  Pill,
  FlaskConical,
  Calendar,
  Clock,
  User,
  Heart,
  Thermometer,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  condition: string;
  lastVisit: string;
  status: "stable" | "monitoring" | "critical";
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenLevel: number;
  };
}

const patients: Patient[] = [
  {
    id: "P-001",
    name: "Sarah Johnson",
    age: 45,
    gender: "Female",
    bloodType: "A+",
    phone: "+1 234-567-8901",
    email: "sarah.j@email.com",
    condition: "Hypertension",
    lastVisit: "2024-01-15",
    status: "stable",
    vitals: { heartRate: 72, bloodPressure: "120/80", temperature: 98.6, oxygenLevel: 98 },
  },
  {
    id: "P-002",
    name: "Michael Chen",
    age: 32,
    gender: "Male",
    bloodType: "O+",
    phone: "+1 234-567-8902",
    email: "m.chen@email.com",
    condition: "Fracture Recovery",
    lastVisit: "2024-01-14",
    status: "monitoring",
    vitals: { heartRate: 78, bloodPressure: "118/75", temperature: 98.4, oxygenLevel: 99 },
  },
  {
    id: "P-003",
    name: "Emily Davis",
    age: 28,
    gender: "Female",
    bloodType: "B-",
    phone: "+1 234-567-8903",
    email: "e.davis@email.com",
    condition: "Skin Allergy",
    lastVisit: "2024-01-13",
    status: "stable",
    vitals: { heartRate: 68, bloodPressure: "115/72", temperature: 98.2, oxygenLevel: 99 },
  },
  {
    id: "P-004",
    name: "Robert Williams",
    age: 67,
    gender: "Male",
    bloodType: "AB+",
    phone: "+1 234-567-8904",
    email: "r.williams@email.com",
    condition: "Post-Surgery",
    lastVisit: "2024-01-15",
    status: "critical",
    vitals: { heartRate: 88, bloodPressure: "145/95", temperature: 99.1, oxygenLevel: 94 },
  },
];

const statusStyles = {
  stable: "bg-success/10 text-success",
  monitoring: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

const DoctorPortal = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Doctor Portal"
      subtitle="Manage patients, view histories, and prescriptions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        {/* Patient List */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
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
              <Plus className="h-4 w-4" /> Add New Patient
            </Button>
          </div>

          <div className="divide-y divide-border max-h-[600px] overflow-y-auto scrollbar-thin">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-muted/50",
                  selectedPatient?.id === patient.id && "bg-primary/5 border-l-4 border-l-primary"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {patient.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground truncate">{patient.name}</p>
                      <span className={cn("badge-status text-[10px]", statusStyles[patient.status])}>
                        {patient.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {patient.id} • {patient.age}y • {patient.gender}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{patient.condition}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Header */}
              <div className="bg-card rounded-xl border border-border/50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">
                        {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-foreground">
                        {selectedPatient.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedPatient.id} • Blood Type: {selectedPatient.bloodType}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          {selectedPatient.age} years • {selectedPatient.gender}
                        </span>
                        <span className={cn("badge-status", statusStyles[selectedPatient.status])}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {selectedPatient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" /> Message
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Pill className="h-4 w-4" /> Prescribe
                    </Button>
                  </div>
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Heart className="h-4 w-4 text-destructive" />
                      <span className="text-xs">Heart Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedPatient.vitals.heartRate}
                      <span className="text-sm font-normal text-muted-foreground ml-1">bpm</span>
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Activity className="h-4 w-4 text-info" />
                      <span className="text-xs">Blood Pressure</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedPatient.vitals.bloodPressure}
                      <span className="text-sm font-normal text-muted-foreground ml-1">mmHg</span>
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Thermometer className="h-4 w-4 text-warning" />
                      <span className="text-xs">Temperature</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedPatient.vitals.temperature}
                      <span className="text-sm font-normal text-muted-foreground ml-1">°F</span>
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Activity className="h-4 w-4 text-success" />
                      <span className="text-xs">Oxygen Level</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedPatient.vitals.oxygenLevel}
                      <span className="text-sm font-normal text-muted-foreground ml-1">%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="w-full bg-muted/50">
                  <TabsTrigger value="history" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" /> History
                  </TabsTrigger>
                  <TabsTrigger value="prescriptions" className="flex-1 gap-2">
                    <Pill className="h-4 w-4" /> Prescriptions
                  </TabsTrigger>
                  <TabsTrigger value="lab" className="flex-1 gap-2">
                    <FlaskConical className="h-4 w-4" /> Lab Results
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="flex-1 gap-2">
                    <Calendar className="h-4 w-4" /> Appointments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-4">
                  <div className="bg-card rounded-xl border border-border/50 divide-y divide-border">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">Regular Checkup</p>
                            <p className="text-sm text-muted-foreground">Dr. Smith • Cardiology</p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Patient presented with {selectedPatient.condition}. Vitals stable. Continued current medication.
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="prescriptions" className="mt-4">
                  <div className="bg-card rounded-xl border border-border/50 divide-y divide-border">
                    {["Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg"].map((med, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Pill className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{med}</p>
                            <p className="text-sm text-muted-foreground">Once daily • 30 days</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Refill</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="lab" className="mt-4">
                  <div className="bg-card rounded-xl border border-border/50 divide-y divide-border">
                    {["Complete Blood Count", "Lipid Panel", "Metabolic Panel"].map((test, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                            <FlaskConical className="h-5 w-5 text-info" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{test}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(Date.now() - i * 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="badge-status bg-success/10 text-success">Normal</span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="appointments" className="mt-4">
                  <div className="bg-card rounded-xl border border-border/50 divide-y divide-border">
                    {[0, 7, 14].map((days, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Follow-up Appointment</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString()} at 10:00 AM
                            </div>
                          </div>
                        </div>
                        <span className={cn(
                          "badge-status",
                          i === 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        )}>
                          {i === 0 ? "Today" : "Scheduled"}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No Patient Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a patient from the list to view their details
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPortal;
