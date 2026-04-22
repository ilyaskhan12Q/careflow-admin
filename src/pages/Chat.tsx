import { useState, useRef, useEffect } from "react";
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
  Plus,
  FlaskConical,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat, ChatMessage, ChatChannel } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { NewChatDialog } from "@/components/chat/NewChatDialog";
import { PrescriptionDialog } from "@/components/chat/PrescriptionDialog";
import { LabRequestDialog } from "@/components/chat/LabRequestDialog";
import { Badge } from "@/components/ui/badge";

const Chat = () => {
  const { user } = useAuth();
  const {
    channels,
    selectedChannel,
    setSelectedChannel,
    messages,
    loading,
    sendingMessage,
    sendMessage,
    createChannel,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [showLabRequest, setShowLabRequest] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage.trim());
    setNewMessage("");
  };

  const handleSendPrescription = async (
    medicines: { name: string; dosage: string; frequency: string; duration: string; instructions: string }[],
    notes: string
  ) => {
    const content = `Prescription issued with ${medicines.length} medicine(s)`;
    await sendMessage(content, "prescription", { medicines, notes });
  };

  const handleSendLabRequest = async (
    tests: { id: string; name: string; category: string }[],
    priority: string,
    notes: string
  ) => {
    const content = `Lab tests requested: ${tests.map((t) => t.name).join(", ")}`;
    await sendMessage(content, "lab_request", { tests, priority, notes });
  };

  const getChannelIcon = (type: ChatChannel["type"]) => {
    switch (type) {
      case "pharmacy":
        return <Pill className="h-4 w-4" />;
      case "laboratory":
        return <FlaskConical className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getChannelBadge = (type: ChatChannel["type"]) => {
    const styles = {
      patient: "bg-primary/10 text-primary",
      pharmacy: "bg-warning/10 text-warning",
      laboratory: "bg-info/10 text-info",
      internal: "bg-muted text-muted-foreground",
    };
    return styles[type] || styles.patient;
  };

  const getParticipantName = (channel: ChatChannel) => {
    const otherParticipant = channel.participants?.find(
      (p) => p.user_id !== user?.id
    );
    return otherParticipant?.profile?.full_name || channel.name;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (hours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.sender_id === user?.id;
    const metadata = message.metadata as Record<string, unknown>;

    return (
      <div
        key={message.id}
        className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}
      >
        <div
          className={cn(
            "max-w-[70%] rounded-2xl px-4 py-3",
            isOwnMessage
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          {message.message_type === "prescription" && metadata?.medicines ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-medium">
                <Pill className="h-4 w-4" />
                <span>Prescription</span>
              </div>
              <div className="space-y-2">
                {(metadata.medicines as Array<{ name: string; dosage: string; frequency: string; duration: string }>).map((med, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-lg",
                      isOwnMessage
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
              {metadata.notes && (
                <p className="text-sm opacity-80 italic">
                  Note: {metadata.notes as string}
                </p>
              )}
              <Button variant="secondary" size="sm" className="gap-2 w-full">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          ) : message.message_type === "lab_request" && metadata?.tests ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-medium">
                <FlaskConical className="h-4 w-4" />
                <span>Lab Request</span>
                {metadata.priority === "urgent" && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                {(metadata.tests as Array<{ name: string }>).map((test, i) => (
                  <p key={i} className="text-sm">
                    • {test.name}
                  </p>
                ))}
              </div>
              {metadata.notes && (
                <p className="text-sm opacity-80 italic">
                  Note: {metadata.notes as string}
                </p>
              )}
            </div>
          ) : (
            <p>{message.content}</p>
          )}
          <div
            className={cn(
              "flex items-center gap-1 mt-1 text-xs",
              isOwnMessage ? "justify-end opacity-70" : "text-muted-foreground"
            )}
          >
            <span>{formatTime(message.created_at)}</span>
            {isOwnMessage && <CheckCheck className="h-3 w-3" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Chat & Prescription"
      subtitle="Communicate with patients, pharmacy, and laboratory"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 h-[calc(100vh-160px)] lg:h-[calc(100vh-180px)] animate-fade-in">
        {/* Conversation List - hidden on mobile when a chat is open */}
        <div className={cn(
          "lg:col-span-1 bg-card rounded-xl border border-border/50 overflow-hidden flex-col",
          selectedChannel ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={() => setShowNewChat(true)}
            >
              <Plus className="h-4 w-4" /> New Chat
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
              </div>
            ) : (
              filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-muted/50",
                    selectedChannel?.id === channel.id && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          getChannelBadge(channel.type)
                        )}
                      >
                        {getChannelIcon(channel.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-foreground truncate">
                          {getParticipantName(channel)}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {channel.last_message
                            ? formatTime(channel.last_message.created_at)
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getChannelBadge(channel.type))}
                        >
                          {channel.type}
                        </Badge>
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {channel.last_message?.content || "No messages yet"}
                        </p>
                      </div>
                    </div>
                    {(channel.unread_count || 0) > 0 && (
                      <span className="shrink-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                        {channel.unread_count}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col">
          {selectedChannel ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      getChannelBadge(selectedChannel.type)
                    )}
                  >
                    {getChannelIcon(selectedChannel.type)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {getParticipantName(selectedChannel)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {selectedChannel.type} chat
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
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex items-end gap-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => setShowPrescription(true)}
                      title="Send Prescription"
                    >
                      <Pill className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => setShowLabRequest(true)}
                      title="Request Lab Tests"
                    >
                      <FlaskConical className="h-4 w-4" />
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
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">
                  Select a Conversation
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a chat from the list or start a new conversation
                </p>
                <Button onClick={() => setShowNewChat(true)} className="gap-2">
                  <Plus className="h-4 w-4" /> New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <NewChatDialog
        open={showNewChat}
        onOpenChange={setShowNewChat}
        onCreateChannel={createChannel}
      />
      <PrescriptionDialog
        open={showPrescription}
        onOpenChange={setShowPrescription}
        onSendPrescription={handleSendPrescription}
      />
      <LabRequestDialog
        open={showLabRequest}
        onOpenChange={setShowLabRequest}
        onSendLabRequest={handleSendLabRequest}
      />
    </DashboardLayout>
  );
};

export default Chat;
