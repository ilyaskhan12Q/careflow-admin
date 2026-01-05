import { Link } from "react-router-dom";
import {
  UserPlus,
  FileText,
  Pill,
  FlaskConical,
  Calendar,
  CreditCard,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  path: string;
  color: string;
}

const actions: QuickAction[] = [
  {
    icon: UserPlus,
    label: "New Patient",
    description: "Register patient",
    path: "/doctor-portal",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    icon: Calendar,
    label: "Appointments",
    description: "View schedule",
    path: "/doctor-portal",
    color: "bg-info/10 text-info hover:bg-info/20",
  },
  {
    icon: FileText,
    label: "Create Invoice",
    description: "Generate bill",
    path: "/finance",
    color: "bg-success/10 text-success hover:bg-success/20",
  },
  {
    icon: Pill,
    label: "Pharmacy",
    description: "Manage stock",
    path: "/pharmacy",
    color: "bg-warning/10 text-warning hover:bg-warning/20",
  },
  {
    icon: FlaskConical,
    label: "Lab Test",
    description: "Order tests",
    path: "/laboratory",
    color: "bg-accent/10 text-accent hover:bg-accent/20",
  },
  {
    icon: CreditCard,
    label: "Payments",
    description: "Process payment",
    path: "/finance",
    color: "bg-success/10 text-success hover:bg-success/20",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    description: "Patient chat",
    path: "/chat",
    color: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  {
    icon: ClipboardList,
    label: "Reports",
    description: "View analytics",
    path: "/diagnostics",
    color: "bg-info/10 text-info hover:bg-info/20",
  },
];

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            to={action.path}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                action.color
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
