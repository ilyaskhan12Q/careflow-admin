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
import { Plus, Trash2, Pill, Loader2 } from "lucide-react";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendPrescription: (medicines: Medicine[], notes: string) => Promise<void>;
}

export const PrescriptionDialog = ({
  open,
  onOpenChange,
  onSendPrescription,
}: PrescriptionDialogProps) => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSend = async () => {
    const validMedicines = medicines.filter((m) => m.name.trim());
    if (validMedicines.length === 0) return;

    setSending(true);
    await onSendPrescription(validMedicines, notes);
    setSending(false);
    setMedicines([{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
    setNotes("");
    onOpenChange(false);
  };

  const isValid = medicines.some((m) => m.name.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Create Prescription
          </DialogTitle>
          <DialogDescription>
            Add medicines and send prescription to the patient
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {medicines.map((medicine, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-muted/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Medicine {index + 1}</h4>
                {medicines.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeMedicine(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Medicine Name</Label>
                  <Input
                    placeholder="e.g., Paracetamol"
                    value={medicine.name}
                    onChange={(e) => updateMedicine(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Dosage</Label>
                  <Input
                    placeholder="e.g., 500mg"
                    value={medicine.dosage}
                    onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Frequency</Label>
                  <Input
                    placeholder="e.g., Twice daily"
                    value={medicine.frequency}
                    onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Duration</Label>
                  <Input
                    placeholder="e.g., 5 days"
                    value={medicine.duration}
                    onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Instructions</Label>
                  <Input
                    placeholder="e.g., After meals"
                    value={medicine.instructions}
                    onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={addMedicine}
          >
            <Plus className="h-4 w-4" /> Add Medicine
          </Button>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Any additional instructions for the patient..."
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
              "Send Prescription"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
