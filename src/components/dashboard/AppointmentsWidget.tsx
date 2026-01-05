import { Clock, Video, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: "in-person" | "video";
  department: string;
  status: "upcoming" | "in-progress" | "completed";
}

const appointments: Appointment[] = [
  {
    id: "A-001",
    patientName: "Sarah Johnson",
    time: "09:00 AM",
    type: "in-person",
    department: "Cardiology",
    status: "completed",
  },
  {
    id: "A-002",
    patientName: "Michael Chen",
    time: "10:30 AM",
    type: "video",
    department: "General",
    status: "in-progress",
  },
  {
    id: "A-003",
    patientName: "Emily Davis",
    time: "11:45 AM",
    type: "in-person",
    department: "Dermatology",
    status: "upcoming",
  },
  {
    id: "A-004",
    patientName: "Robert Williams",
    time: "02:00 PM",
    type: "video",
    department: "Neurology",
    status: "upcoming",
  },
  {
    id: "A-005",
    patientName: "Lisa Anderson",
    time: "03:30 PM",
    type: "in-person",
    department: "Oncology",
    status: "upcoming",
  },
];

const statusStyles = {
  upcoming: "border-l-info",
  "in-progress": "border-l-success bg-success/5",
  completed: "border-l-muted-foreground opacity-60",
};

export const AppointmentsWidget = () => {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground">Today's Appointments</h3>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
            {appointments.length} Total
          </span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className={cn(
              "p-4 border-l-4 transition-colors hover:bg-muted/30",
              statusStyles[apt.status]
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-secondary-foreground">
                    {apt.patientName.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{apt.patientName}</p>
                  <p className="text-sm text-muted-foreground">{apt.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {apt.time}
                </div>
                {apt.type === "video" ? (
                  <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
                    <Video className="h-4 w-4 text-info" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
