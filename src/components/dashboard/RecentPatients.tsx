import { MoreHorizontal, Eye, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  status: "admitted" | "outpatient" | "discharged" | "critical";
  lastVisit: string;
  avatar?: string;
}

const patients: Patient[] = [
  {
    id: "P-001",
    name: "Sarah Johnson",
    age: 45,
    gender: "Female",
    department: "Cardiology",
    status: "admitted",
    lastVisit: "Today",
  },
  {
    id: "P-002",
    name: "Michael Chen",
    age: 32,
    gender: "Male",
    department: "Orthopedics",
    status: "outpatient",
    lastVisit: "Yesterday",
  },
  {
    id: "P-003",
    name: "Emily Davis",
    age: 28,
    gender: "Female",
    department: "Dermatology",
    status: "discharged",
    lastVisit: "2 days ago",
  },
  {
    id: "P-004",
    name: "Robert Williams",
    age: 67,
    gender: "Male",
    department: "Neurology",
    status: "critical",
    lastVisit: "Today",
  },
  {
    id: "P-005",
    name: "Lisa Anderson",
    age: 52,
    gender: "Female",
    department: "Oncology",
    status: "admitted",
    lastVisit: "Today",
  },
];

const statusStyles = {
  admitted: "bg-info/10 text-info",
  outpatient: "bg-success/10 text-success",
  discharged: "bg-muted text-muted-foreground",
  critical: "bg-destructive/10 text-destructive",
};

const statusLabels = {
  admitted: "Admitted",
  outpatient: "Outpatient",
  discharged: "Discharged",
  critical: "Critical",
};

export const RecentPatients = () => {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground">Recent Patients</h3>
            <p className="text-sm text-muted-foreground">Latest patient activities</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Patient
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Department
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Last Visit
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="table-row-hover border-b border-border last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {patient.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.id} • {patient.age}y • {patient.gender}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{patient.department}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("badge-status", statusStyles[patient.status])}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {statusLabels[patient.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{patient.lastVisit}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <FileText className="h-4 w-4" /> View Records
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <MessageSquare className="h-4 w-4" /> Send Message
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
  );
};
