import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FlaskConical, Loader2 } from "lucide-react";

interface LabTest {
  id: string;
  name: string;
  category: string;
}

const availableTests: LabTest[] = [
  { id: "cbc", name: "Complete Blood Count (CBC)", category: "Hematology" },
  { id: "bmp", name: "Basic Metabolic Panel", category: "Chemistry" },
  { id: "lipid", name: "Lipid Panel", category: "Chemistry" },
  { id: "liver", name: "Liver Function Tests", category: "Chemistry" },
  { id: "thyroid", name: "Thyroid Panel (TSH, T3, T4)", category: "Endocrine" },
  { id: "urinalysis", name: "Urinalysis", category: "Urinalysis" },
  { id: "hba1c", name: "HbA1c (Glycated Hemoglobin)", category: "Diabetes" },
  { id: "vitamin_d", name: "Vitamin D Level", category: "Vitamins" },
  { id: "vitamin_b12", name: "Vitamin B12 Level", category: "Vitamins" },
  { id: "iron", name: "Iron Studies", category: "Hematology" },
  { id: "crp", name: "C-Reactive Protein", category: "Inflammation" },
  { id: "esr", name: "ESR (Erythrocyte Sedimentation Rate)", category: "Inflammation" },
];

interface LabRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendLabRequest: (tests: LabTest[], priority: string, notes: string) => Promise<void>;
}

export const LabRequestDialog = ({
  open,
  onOpenChange,
  onSendLabRequest,
}: LabRequestDialogProps) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [notes, setNotes] = useState("");
  const [customTest, setCustomTest] = useState("");
  const [sending, setSending] = useState(false);

  const toggleTest = (testId: string) => {
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSend = async () => {
    const tests = availableTests.filter((t) => selectedTests.includes(t.id));
    if (customTest.trim()) {
      tests.push({ id: "custom", name: customTest, category: "Custom" });
    }
    
    if (tests.length === 0) return;

    setSending(true);
    await onSendLabRequest(tests, priority, notes);
    setSending(false);
    setSelectedTests([]);
    setCustomTest("");
    setNotes("");
    onOpenChange(false);
  };

  const isValid = selectedTests.length > 0 || customTest.trim();

  // Group tests by category
  const testsByCategory = availableTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, LabTest[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Request Lab Tests
          </DialogTitle>
          <DialogDescription>
            Select tests to request from the laboratory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Priority Selection */}
          <div className="flex gap-4">
            <Button
              variant={priority === "normal" ? "default" : "outline"}
              onClick={() => setPriority("normal")}
              className="flex-1"
            >
              Normal Priority
            </Button>
            <Button
              variant={priority === "urgent" ? "destructive" : "outline"}
              onClick={() => setPriority("urgent")}
              className="flex-1"
            >
              Urgent
            </Button>
          </div>

          {/* Test Categories */}
          {Object.entries(testsByCategory).map(([category, tests]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                {category}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {tests.map((test) => (
                  <label
                    key={test.id}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedTests.includes(test.id)}
                      onCheckedChange={() => toggleTest(test.id)}
                    />
                    <span className="text-sm">{test.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Custom Test */}
          <div className="space-y-2">
            <Label>Custom Test (Optional)</Label>
            <Input
              placeholder="Enter custom test name..."
              value={customTest}
              onChange={(e) => setCustomTest(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Clinical Notes</Label>
            <Textarea
              placeholder="Any relevant clinical information for the lab..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!isValid || sending}>
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              `Request ${selectedTests.length + (customTest.trim() ? 1 : 0)} Test(s)`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
