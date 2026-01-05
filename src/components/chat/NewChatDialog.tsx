import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { ChannelType } from "@/hooks/useChat";
import { Loader2 } from "lucide-react";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChannel: (
    name: string,
    type: ChannelType,
    participantIds: string[]
  ) => Promise<unknown>;
}

interface UserOption {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export const NewChatDialog = ({
  open,
  onOpenChange,
  onCreateChannel,
}: NewChatDialogProps) => {
  const { user } = useAuth();
  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState<ChannelType>("patient");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        // Fetch users based on channel type
        type RoleType = "admin" | "doctor" | "pharmacist" | "lab_technician" | "receptionist" | "patient";
        let roleFilter: RoleType[] = [];
        
        switch (channelType) {
          case "patient":
            roleFilter = ["patient"];
            break;
          case "pharmacy":
            roleFilter = ["pharmacist"];
            break;
          case "laboratory":
            roleFilter = ["lab_technician"];
            break;
          case "internal":
            roleFilter = ["doctor", "admin", "pharmacist", "lab_technician", "receptionist"];
            break;
        }

        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("role", roleFilter)
          .neq("user_id", user?.id);

        if (rolesData && rolesData.length > 0) {
          const userIds = rolesData.map((r) => r.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, full_name, email")
            .in("user_id", userIds);

          const usersWithRoles = rolesData.map((r) => {
            const profile = profiles?.find((p) => p.user_id === r.user_id);
            return {
              id: r.user_id,
              full_name: profile?.full_name || "Unknown",
              email: profile?.email || "",
              role: r.role,
            };
          });

          setUsers(usersWithRoles);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open, channelType, user?.id]);

  const handleCreate = async () => {
    if (!channelName.trim() || !selectedUser) return;

    setCreating(true);
    await onCreateChannel(channelName, channelType, [selectedUser]);
    setCreating(false);
    setChannelName("");
    setSelectedUser("");
    onOpenChange(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "patient":
        return "Patient Chat";
      case "pharmacy":
        return "Pharmacy";
      case "laboratory":
        return "Laboratory";
      case "internal":
        return "Internal Team";
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Start a new chat with a patient, pharmacy, or laboratory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Chat Type</Label>
            <Select
              value={channelType}
              onValueChange={(v) => {
                setChannelType(v as typeof channelType);
                setSelectedUser("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient Chat</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
                <SelectItem value="internal">Internal Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Chat Name</Label>
            <Input
              placeholder="Enter chat name..."
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select {getTypeLabel(channelType).replace(" Chat", "")}</Label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No users found for this category
              </p>
            ) : (
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.full_name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!channelName.trim() || !selectedUser || creating}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Chat"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
