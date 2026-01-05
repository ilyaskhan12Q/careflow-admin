import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type ChannelType = "patient" | "pharmacy" | "laboratory" | "internal";
export type MessageType = "text" | "prescription" | "lab_request" | "lab_result" | "medicine_request";

export interface ChatChannel {
  id: string;
  name: string;
  type: ChannelType;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  participants?: ChatParticipant[];
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ChatParticipant {
  id: string;
  channel_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  last_read_at: string | null;
  profile?: {
    full_name: string;
    email: string;
  };
}

export interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  sender?: {
    full_name: string;
    email: string;
  };
}

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch all channels for the current user
  const fetchChannels = useCallback(async () => {
    if (!user) return;

    try {
      const { data: channelsData, error } = await supabase
        .from("chat_channels")
        .select(`
          *,
          chat_participants (
            id,
            user_id,
            role,
            last_read_at
          )
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Fetch last message and profiles for each channel
      const enrichedChannels = await Promise.all(
        (channelsData || []).map(async (channel) => {
          // Get last message
          const { data: lastMsg } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("channel_id", channel.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const participant = channel.chat_participants?.find(
            (p: ChatParticipant) => p.user_id === user.id
          );
          
          let unreadCount = 0;
          if (participant?.last_read_at) {
            const { count } = await supabase
              .from("chat_messages")
              .select("*", { count: "exact", head: true })
              .eq("channel_id", channel.id)
              .gt("created_at", participant.last_read_at)
              .neq("sender_id", user.id);
            unreadCount = count || 0;
          } else {
            const { count } = await supabase
              .from("chat_messages")
              .select("*", { count: "exact", head: true })
              .eq("channel_id", channel.id)
              .neq("sender_id", user.id);
            unreadCount = count || 0;
          }

          // Fetch participant profiles
          const participantUserIds = channel.chat_participants?.map((p: ChatParticipant) => p.user_id) || [];
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, full_name, email")
            .in("user_id", participantUserIds);

          const enrichedParticipants = channel.chat_participants?.map((p: ChatParticipant) => ({
            ...p,
            profile: profiles?.find((pr) => pr.user_id === p.user_id),
          }));

          return {
            ...channel,
            type: channel.type as ChannelType,
            participants: enrichedParticipants,
            last_message: lastMsg as ChatMessage | undefined,
            unread_count: unreadCount,
          } as ChatChannel;
        })
      );

      setChannels(enrichedChannels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch messages for a channel
  const fetchMessages = useCallback(async (channelId: string) => {
    if (!user) return;

    try {
      const { data: messagesData, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch sender profiles
      const senderIds = [...new Set(messagesData?.map((m) => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", senderIds);

      const enrichedMessages: ChatMessage[] = (messagesData || []).map((msg) => ({
        ...msg,
        message_type: msg.message_type as MessageType,
        metadata: (msg.metadata || {}) as Record<string, unknown>,
        sender: profiles?.find((p) => p.user_id === msg.sender_id),
      }));

      setMessages(enrichedMessages);

      // Mark messages as read
      await supabase
        .from("chat_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("channel_id", channelId)
        .eq("user_id", user.id);

    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [user]);

  // Send a message
  const sendMessage = useCallback(async (
    content: string,
    messageType: MessageType = "text",
    metadata: Record<string, unknown> = {}
  ) => {
    if (!user || !selectedChannel) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase.from("chat_messages").insert([{
        channel_id: selectedChannel.id,
        sender_id: user.id,
        content,
        message_type: messageType,
        metadata: metadata as unknown as Record<string, never>,
      }]);

      if (error) throw error;

      // Update channel's updated_at
      await supabase
        .from("chat_channels")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedChannel.id);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  }, [user, selectedChannel, toast]);

  // Create a new channel
  const createChannel = useCallback(async (
    name: string,
    type: ChannelType,
    participantUserIds: string[]
  ) => {
    if (!user) return null;

    try {
      // Create channel
      const { data: channel, error: channelError } = await supabase
        .from("chat_channels")
        .insert({
          name,
          type,
          created_by: user.id,
        })
        .select()
        .single();

      if (channelError) throw channelError;

      // Get current user's role
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      // Add creator as participant
      await supabase.from("chat_participants").insert({
        channel_id: channel.id,
        user_id: user.id,
        role: userRoles?.role || "doctor",
      });

      // Add other participants
      for (const participantId of participantUserIds) {
        const { data: participantRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", participantId)
          .single();

        await supabase.from("chat_participants").insert({
          channel_id: channel.id,
          user_id: participantId,
          role: participantRole?.role || "patient",
        });
      }

      toast({
        title: "Success",
        description: "Chat created successfully",
      });

      await fetchChannels();
      return channel;
    } catch (error) {
      console.error("Error creating channel:", error);
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive",
      });
      return null;
    }
  }, [user, fetchChannels, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    fetchChannels();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // If message is in current channel, add it
          if (selectedChannel && newMessage.channel_id === selectedChannel.id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("user_id, full_name, email")
              .eq("user_id", newMessage.sender_id)
              .single();

            setMessages((prev) => [
              ...prev,
              { ...newMessage, sender: profile || undefined },
            ]);

            // Mark as read if not own message
            if (newMessage.sender_id !== user.id) {
              await supabase
                .from("chat_participants")
                .update({ last_read_at: new Date().toISOString() })
                .eq("channel_id", selectedChannel.id)
                .eq("user_id", user.id);
            }
          }

          // Refresh channels to update last message and unread count
          fetchChannels();
        }
      )
      .subscribe();

    // Subscribe to channel updates
    const channelsChannel = supabase
      .channel("chat-channels")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_channels",
        },
        () => {
          fetchChannels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(channelsChannel);
    };
  }, [user, selectedChannel, fetchChannels]);

  // Fetch messages when channel is selected
  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel.id);
    } else {
      setMessages([]);
    }
  }, [selectedChannel, fetchMessages]);

  return {
    channels,
    selectedChannel,
    setSelectedChannel,
    messages,
    loading,
    sendingMessage,
    sendMessage,
    createChannel,
    fetchChannels,
  };
};
