import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Pill,
  FileText,
  Download,
  Check,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: "doctor" | "patient";
  timestamp: string;
  status: "sent" | "delivered" | "read";
  type: "text" | "prescription";
  prescription?: {
    medicines: { name: string; dosage: string; frequency: string; duration: string }[];
  };
}

interface Conversation {
  id: string;
  patientName: string;
  patientId: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "C-001",
    patientName: "Sarah Johnson",
    patientId: "P-001",
    lastMessage: "Thank you, Doctor. I'll follow the prescription.",
    timestamp: "2 min ago",
    unread: 0,
    online: true,
    messages: [
      {
        id: "M-001",
        content: "Good morning, Dr. Smith. I've been experiencing headaches lately.",
        sender: "patient",
        timestamp: "10:30 AM",
        status: "read",
        type: "text",
      },
      {
        id: "M-002",
        content: "Good morning, Sarah. How long have you been experiencing these headaches? Are they accompanied by any other symptoms?",
        sender: "doctor",
        timestamp: "10:32 AM",
        status: "read",
        type: "text",
      },
      {
        id: "M-003",
        content: "It's been about a week. I also feel a bit dizzy sometimes.",
        sender: "patient",
        timestamp: "10:35 AM",
        status: "read",
        type: "text",
      },
      {
        id: "M-004",
        content: "Based on your symptoms, I'm prescribing some medication. Please take them as directed.",
        sender: "doctor",
        timestamp: "10:40 AM",
        status: "read",
        type: "prescription",
        prescription: {
          medicines: [
            { name: "Ibuprofen", dosage: "400mg", frequency: "Twice daily", duration: "5 days" },
            { name: "Vitamin B12", dosage: "1000mcg", frequency: "Once daily", duration: "30 days" },
          ],
        },
      },
      {
        id: "M-005",
        content: "Thank you, Doctor. I'll follow the prescription.",
        sender: "patient",
        timestamp: "10:45 AM",
        status: "read",
        type: "text",
      },
    ],
  },
  {
    id: "C-002",
    patientName: "Michael Chen",
    patientId: "P-002",
    lastMessage: "When should I come for the follow-up?",
    timestamp: "1 hour ago",
    unread: 2,
    online: false,
    messages: [
      {
        id: "M-006",
        content: "Hi Doctor, my cast is feeling tight. Is that normal?",
        sender: "patient",
        timestamp: "9:00 AM",
        status: "read",
        type: "text",
      },
      {
        id: "M-007",
        content: "Some tightness is normal as swelling reduces. However, if you experience numbness or severe pain, please visit immediately.",
        sender: "doctor",
        timestamp: "9:15 AM",
        status: "read",
        type: "text",
      },
      {
        id: "M-008",
        content: "When should I come for the follow-up?",
        sender: "patient",
        timestamp: "9:20 AM",
        status: "delivered",
        type: "text",
      },
    ],
  },
  {
    id: "C-003",
    patientName: "Emily Davis",
    patientId: "P-003",
    lastMessage: "The rash is getting better now.",
    timestamp: "Yesterday",
    unread: 0,
    online: true,
    messages: [],
  },
];

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message
    setNewMessage("");
  };

  return (
    <DashboardLayout
      title="Chat & Prescription"
      subtitle="Communicate with patients and issue prescriptions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)] animate-fade-in">
        {/* Conversation List */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-muted/50",
                  selectedConversation.id === conv.id && "bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {conv.patientName.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-foreground truncate">{conv.patientName}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{conv.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {selectedConversation.patientName.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                {selectedConversation.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedConversation.patientName}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.online ? "Online" : "Offline"} • {selectedConversation.patientId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "doctor" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3",
                    message.sender === "doctor"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}
                >
                  {message.type === "prescription" && message.prescription ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 font-medium">
                        <Pill className="h-4 w-4" />
                        <span>Prescription</span>
                      </div>
                      <div className="space-y-2">
                        {message.prescription.medicines.map((med, i) => (
                          <div
                            key={i}
                            className={cn(
                              "p-3 rounded-lg",
                              message.sender === "doctor"
                                ? "bg-primary-foreground/10"
                                : "bg-background"
                            )}
                          >
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm opacity-80">
                              {med.dosage} • {med.frequency} • {med.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2 w-full"
                      >
                        <Download className="h-4 w-4" /> Download PDF
                      </Button>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-1 mt-1 text-xs",
                      message.sender === "doctor" ? "justify-end opacity-70" : "text-muted-foreground"
                    )}
                  >
                    <span>{message.timestamp}</span>
                    {message.sender === "doctor" && (
                      message.status === "read" ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end gap-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Pill className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                className="shrink-0"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
