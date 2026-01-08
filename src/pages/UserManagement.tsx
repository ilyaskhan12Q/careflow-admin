import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Edit, Trash2, Shield } from "lucide-react";
import type { AppRole } from "@/hooks/useAuth";

interface UserWithRole {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: AppRole;
  created_at: string;
}

const roleColors: Record<AppRole, string> = {
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  doctor: "bg-primary/10 text-primary border-primary/20",
  pharmacist: "bg-warning/10 text-warning border-warning/20",
  lab_technician: "bg-info/10 text-info border-info/20",
  receptionist: "bg-success/10 text-success border-success/20",
  patient: "bg-muted text-muted-foreground border-muted",
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [editUser, setEditUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<AppRole>("patient");
  const [deleteUser, setDeleteUser] = useState<UserWithRole | null>(null);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [addRoleUserId, setAddRoleUserId] = useState("");
  const [addRoleRole, setAddRoleRole] = useState<AppRole>("patient");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Get all user roles with profile info
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role, created_at");

      if (rolesError) throw rolesError;

      // Get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email");

      if (profilesError) throw profilesError;

      // Merge the data
      const mergedUsers: UserWithRole[] = (rolesData || []).map((role) => {
        const profile = profilesData?.find((p) => p.user_id === role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          email: profile?.email || "N/A",
          full_name: profile?.full_name || "Unknown",
          role: role.role as AppRole,
          created_at: role.created_at,
        };
      });

      setUsers(mergedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Set up real-time subscription
    const channel = supabase
      .channel("user-roles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_roles" },
        () => {
          fetchUsers();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateRole = async () => {
    if (!editUser) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("id", editUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role updated to ${newRole}`,
      });
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", deleteUser.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role removed",
      });
      setDeleteUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to remove user role",
        variant: "destructive",
      });
    }
  };

  const handleAddRole = async () => {
    if (!addRoleUserId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: addRoleUserId, role: addRoleRole });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Role ${addRoleRole} assigned successfully`,
      });
      setAddRoleDialogOpen(false);
      setAddRoleUserId("");
      setAddRoleRole("patient");
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage user accounts and roles"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="pharmacist">Pharmacist</SelectItem>
              <SelectItem value="lab_technician">Lab Technician</SelectItem>
              <SelectItem value="receptionist">Receptionist</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setAddRoleDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={roleColors[user.role]}
                      >
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditUser(user);
                            setNewRole(user.role);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(["admin", "doctor", "pharmacist", "lab_technician", "receptionist", "patient"] as AppRole[]).map(
            (role) => (
              <div
                key={role}
                className="bg-card rounded-xl border border-border/50 p-4 text-center"
              >
                <p className="text-2xl font-bold text-foreground">
                  {users.filter((u) => u.role === role).length}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role.replace("_", " ")}s
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {editUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="pharmacist">Pharmacist</SelectItem>
                <SelectItem value="lab_technician">Lab Technician</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the role for {deleteUser?.full_name}?
              This will revoke their access to the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Remove Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={addRoleDialogOpen} onOpenChange={setAddRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User Role</DialogTitle>
            <DialogDescription>
              Assign a role to a user by entering their user ID
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User ID</label>
              <Input
                placeholder="Enter user ID (UUID)"
                value={addRoleUserId}
                onChange={(e) => setAddRoleUserId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={addRoleRole} onValueChange={(v) => setAddRoleRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="lab_technician">Lab Technician</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>
              <Shield className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
