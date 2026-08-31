"use client";

import { useState, useRef, useEffect } from "react";
import { SafeSportSidebar } from "@/components/safesport-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeSwitcher from "@/components/theme_switcher";
import { athleteNavData } from "@/features/safesport/data/athlete-nav";
import {
  mockFamilies,
  mockFamilyMembers,
  mockConversations,
  getConversationParticipants,
  getConversationMessages,
  getFamilyMembers,
} from "@/features/safesport/data/messaging-data";
import type {
  Conversation,
  FamilyMember,
  Message,
} from "@/features/safesport/types/messaging";
import {
  SearchIcon,
  MessageSquareIcon,
  SmileIcon,
  PaperclipIcon,
  SendIcon,
  CircleIcon,
  FileIcon,
  ImageIcon,
  VideoIcon,
  ChevronDownIcon,
  XIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import type { Theme } from "emoji-picker-react";
import { ImageMessage } from "@/features/safesport/components/messaging/ImageMessage";
import { VideoMessage } from "@/features/safesport/components/messaging/VideoMessage";
import { DocumentMessage } from "@/features/safesport/components/messaging/DocumentMessage";
import { AttachmentMenu } from "@/features/safesport/components/messaging/AttachmentMenu";
import { AttachmentPreview } from "@/features/safesport/components/messaging/AttachmentPreview";
import { toast } from "sonner";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function MessagingPage() {
  const { theme } = useTheme();
  const [selectedFamily] = useState(mockFamilies[0]); // Green Valley Academy
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(
    {},
  );
  const [pendingAttachments, setPendingAttachments] = useState<{
    files: File[];
    type: "image" | "video" | "document";
  } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const familyMembers = getFamilyMembers(selectedFamily.id);
  const currentUserId = "user-004"; // Dr. Sarah Njeri (current user)

  const allConversations = mockConversations.filter(
    (c) =>
      c.familyId === selectedFamily.id &&
      c.participants.some((p) => p.userId === currentUserId), // Only show conversations user is in
  );

  const conversations = allConversations
    .filter((c) => c.type === "direct") // Only direct conversations in the list
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    ); // Sort by most recent

  const selectedConversation = allConversations.find(
    (c) => c.id === selectedConversationId,
  );

  // Combine mock messages with local messages
  const baseMessages = selectedConversation
    ? getConversationMessages(selectedConversation.id)
    : [];
  const conversationLocalMessages = selectedConversationId
    ? localMessages[selectedConversationId] || []
    : [];
  const messages = [...baseMessages, ...conversationLocalMessages];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const conversationParticipants = selectedConversation
    ? getConversationParticipants(selectedConversation.id)
    : [];

  const filteredMembers = familyMembers.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `msg-local-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderName: "Dr. Sarah Njeri",
      senderRole: "Clinician",
      content: messageInput.trim(),
      replyTo: replyingTo
        ? {
            messageId: replyingTo.id,
            senderName:
              replyingTo.senderId === currentUserId
                ? "You"
                : replyingTo.senderName,
            content: replyingTo.content,
            isCurrentUser: replyingTo.senderId === currentUserId,
          }
        : undefined,
      status: "sent",
      createdAt: new Date().toISOString(),
    };

    setLocalMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        newMessage,
      ],
    }));

    setMessageInput("");
    setShowEmojiPicker(false);
    setReplyingTo(null);
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  };

  const handleImageSelect = async (files: FileList) => {
    if (!selectedConversation) return;
    setPendingAttachments({ files: Array.from(files), type: "image" });
  };

  const handleVideoSelect = async (files: FileList) => {
    if (!selectedConversation) return;

    // Validate 5-minute limit before preview
    for (const file of Array.from(files)) {
      const duration = await getVideoDuration(file);
      if (duration > 300) {
        toast.error("Videos must be 5 minutes or shorter.");
        return;
      }
    }

    setPendingAttachments({ files: Array.from(files), type: "video" });
  };

  const handleDocumentSelect = async (files: FileList) => {
    if (!selectedConversation) return;
    setPendingAttachments({ files: Array.from(files), type: "document" });
  };

  const handleSendAttachments = (caption: string) => {
    if (!pendingAttachments || !selectedConversation) return;

    for (const file of pendingAttachments.files) {
      const url = URL.createObjectURL(file);

      const attachment = {
        id: `att-local-${Date.now()}-${Math.random()}`,
        messageId: `msg-local-${Date.now()}-${Math.random()}`,
        type: pendingAttachments.type,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        url,
        uploadStatus: "uploaded" as const,
        createdAt: new Date().toISOString(),
      };

      const newMessage: Message = {
        id: attachment.messageId,
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        senderName: "Dr. Sarah Njeri",
        senderRole: "Clinician",
        content: caption,
        attachments: [attachment],
        status: "sent",
        createdAt: new Date().toISOString(),
      };

      setLocalMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: [
          ...(prev[selectedConversation.id] || []),
          newMessage,
        ],
      }));
    }

    setPendingAttachments(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedConversation) return;

    setLocalMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: (prev[selectedConversation.id] || []).filter(
        (m) => m.id !== messageId,
      ),
    }));
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!selectedConversation) return;

    setLocalMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: (prev[selectedConversation.id] || []).map(
        (m) => (m.id === messageId ? { ...m, content: newContent } : m),
      ),
    }));
    setEditingMessageId(null);
  };

  const handleStartConversation = (member: FamilyMember) => {
    // Check if conversation exists
    const existingConv = conversations.find(
      (c) =>
        c.type === "direct" &&
        c.participants.some((p) => p.userId === member.id),
    );

    if (existingConv) {
      setSelectedConversationId(existingConv.id);
    } else {
      // Mock create conversation
      console.log(
        "Starting conversation with:",
        member.firstName,
        member.lastName,
      );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getOtherParticipant = (
    conv: Conversation,
  ): FamilyMember | undefined => {
    if (conv.type !== "direct") return undefined;
    const participants = getConversationParticipants(conv.id);
    return participants.find((p) => p.id !== currentUserId);
  };

  return (
    <SidebarProvider>
      <SafeSportSidebar navData={athleteNavData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Messages</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="flex flex-1 min-h-0">
          {/* Left Panel: Chats List */}
          <div className="w-80 border-r flex flex-col bg-muted/20 min-h-0">
            {/* Header */}
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Chats</h2>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members..."
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-2">
                {/* Family Group Chat - Always at top */}
                <Card
                  className={`p-3 cursor-pointer transition-colors hover:bg-accent mb-2 ${
                    selectedConversationId === "family-group"
                      ? "bg-accent border-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedConversationId("family-group")}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-12">
                      {selectedFamily.logo ? (
                        <img
                          src={selectedFamily.logo}
                          alt={selectedFamily.name}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {selectedFamily.name.substring(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        {selectedFamily.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedFamily.memberCount} members
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Search Results - Members */}
                {searchQuery && (
                  <div className="space-y-1 mb-2">
                    <p className="text-xs text-muted-foreground px-2 mb-1">
                      Members
                    </p>
                    {filteredMembers.map((member) => (
                      <Card
                        key={member.id}
                        className="p-3 cursor-pointer transition-colors hover:bg-accent"
                        onClick={() => handleStartConversation(member)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="size-10">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={member.firstName}
                                  className="object-cover"
                                />
                              ) : (
                                <AvatarFallback className="text-xs">
                                  {member.firstName[0]}
                                  {member.lastName[0]}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <CircleIcon
                              className={`absolute -bottom-0.5 -right-0.5 size-3 fill-current ${
                                member.status === "online"
                                  ? "text-primary"
                                  : member.status === "away"
                                    ? "text-yellow-500"
                                    : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {member.role}
                              {member.team ? ` • ${member.team}` : ""}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Direct Conversations */}
                {!searchQuery && (
                  <div className="space-y-1">
                    {conversations.map((conv) => {
                      const otherParticipant = getOtherParticipant(conv);
                      if (!otherParticipant) return null;

                      return (
                        <Card
                          key={conv.id}
                          className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                            selectedConversationId === conv.id
                              ? "bg-accent border-primary"
                              : ""
                          }`}
                          onClick={() => setSelectedConversationId(conv.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="size-10">
                                {otherParticipant.avatar ? (
                                  <img
                                    src={otherParticipant.avatar}
                                    alt={otherParticipant.firstName}
                                    className="object-cover"
                                  />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {otherParticipant.firstName[0]}
                                    {otherParticipant.lastName[0]}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <CircleIcon
                                className={`absolute -bottom-0.5 -right-0.5 size-3 fill-current ${
                                  otherParticipant.status === "online"
                                    ? "text-primary"
                                    : otherParticipant.status === "away"
                                      ? "text-yellow-500"
                                      : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <p className="font-medium text-sm truncate">
                                  {otherParticipant.firstName}{" "}
                                  {otherParticipant.lastName}
                                </p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {conv.lastMessage
                                    ? formatDate(conv.lastMessage.createdAt)
                                    : ""}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground truncate">
                                  {conv.lastMessage?.content ||
                                    "No messages yet"}
                                </p>
                                {conv.unreadCount > 0 && (
                                  <Badge
                                    variant="default"
                                    className="ml-2 size-5 rounded-full p-0 flex items-center justify-center"
                                  >
                                    {conv.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Center Panel: Messages */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="h-16 shrink-0 border-b px-6 flex items-center justify-between">
                  {selectedConversation.type === "group" ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        {selectedFamily.logo ? (
                          <img
                            src={selectedFamily.logo}
                            alt={selectedFamily.name}
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback>
                            {selectedFamily.name.substring(0, 2)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">
                          {selectedFamily.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {conversationParticipants.length} members
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      {conversationParticipants.map((participant) => {
                        if (participant.id === currentUserId) return null; // Skip current user
                        return (
                          <div
                            key={participant.id}
                            className="flex items-center gap-3"
                          >
                            <div className="relative">
                              <Avatar className="size-10">
                                {participant.avatar ? (
                                  <img
                                    src={participant.avatar}
                                    alt={participant.firstName}
                                    className="object-cover"
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {participant.firstName[0]}
                                    {participant.lastName[0]}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <CircleIcon
                                className={`absolute -bottom-0.5 -right-0.5 size-3 fill-current ${
                                  participant.status === "online"
                                    ? "text-primary"
                                    : participant.status === "away"
                                      ? "text-yellow-500"
                                      : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {participant.firstName} {participant.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {participant.role} • {participant.status}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {selectedConversation.contextLabel && (
                    <Badge variant="outline">
                      {selectedConversation.contextLabel}
                    </Badge>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 message-viewport">
                  <style jsx>{`
                    .message-viewport::-webkit-scrollbar {
                      width: 8px;
                    }
                    .message-viewport::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .message-viewport::-webkit-scrollbar-thumb {
                      background: #72e34d;
                      border-radius: 4px;
                    }
                    .message-viewport::-webkit-scrollbar-thumb:hover {
                      background: #82f35d;
                    }
                  `}</style>
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const showDate =
                        index === 0 ||
                        formatDate(messages[index - 1].createdAt) !==
                          formatDate(message.createdAt);

                      const isCurrentUser = message.senderId === currentUserId;

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex gap-3 ${isCurrentUser ? "justify-end" : ""} group`}
                          >
                            {!isCurrentUser && (
                              <Avatar className="size-8 mt-1">
                                {message.senderAvatar ? (
                                  <img
                                    src={message.senderAvatar}
                                    alt={message.senderName}
                                    className="object-cover"
                                  />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {message.senderName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            )}
                            <div
                              className={`${isCurrentUser ? "items-end" : ""}`}
                            >
                              {!isCurrentUser && (
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className="text-xs font-medium">
                                    {message.senderName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(message.createdAt)}
                                  </span>
                                </div>
                              )}

                              <div
                                className="relative cursor-pointer"
                                onDoubleClick={() => {
                                  setReplyingTo(message);
                                  setEditingMessageId(null);
                                }}
                                title="Double-click to reply"
                              >
                                {/* Message actions dropdown for current user - top left of bubble */}
                                {isCurrentUser && message.content && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="absolute -top-1 -left-8 inline-flex size-6 shrink-0 items-center justify-center rounded-lg hover:bg-accent transition-colors">
                                      <ChevronDownIcon className="size-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setReplyingTo(message);
                                          setEditingMessageId(null);
                                        }}
                                      >
                                        Reply
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setEditingMessageId(message.id);
                                          setMessageInput(message.content);
                                          setReplyingTo(null);
                                        }}
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDeleteMessage(message.id)
                                        }
                                        className="text-destructive"
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}

                                {/* Attachments */}
                                {message.attachments &&
                                  message.attachments.length > 0 && (
                                    <div className="space-y-2">
                                      {message.attachments.map((attachment) => (
                                        <div key={attachment.id}>
                                          {attachment.type === "image" && (
                                            <ImageMessage
                                              attachment={attachment}
                                              isCurrentUser={isCurrentUser}
                                            />
                                          )}
                                          {attachment.type === "video" && (
                                            <VideoMessage
                                              attachment={attachment}
                                              isCurrentUser={isCurrentUser}
                                            />
                                          )}
                                          {attachment.type === "document" && (
                                            <DocumentMessage
                                              attachment={attachment}
                                              isCurrentUser={isCurrentUser}
                                            />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                {/* Text message bubble */}
                                {message.content && (
                                  <div
                                    className={`rounded-lg p-3 ${
                                      isCurrentUser
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    } ${message.attachments && message.attachments.length > 0 ? "mt-2" : ""}`}
                                  >
                                    {/* Reply preview - WhatsApp style */}
                                    {message.replyTo && (
                                      <div
                                        className={`mb-2 pl-3 py-2 pr-2 rounded ${
                                          isCurrentUser
                                            ? "bg-primary-foreground/10"
                                            : "bg-background/50"
                                        } border-l-4 ${
                                          message.replyTo.isCurrentUser
                                            ? "border-primary"
                                            : "border-accent-foreground/30"
                                        }`}
                                      >
                                        <p
                                          className={`text-xs font-semibold mb-0.5 ${
                                            isCurrentUser
                                              ? "text-primary-foreground"
                                              : "text-primary"
                                          }`}
                                        >
                                          {message.replyTo.senderName}
                                        </p>
                                        <p
                                          className={`text-xs line-clamp-2 ${
                                            isCurrentUser
                                              ? "text-primary-foreground/70"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {message.replyTo.content}
                                        </p>
                                      </div>
                                    )}

                                    <p className="text-sm whitespace-pre-wrap">
                                      {message.content}
                                    </p>
                                  </div>
                                )}

                                {isCurrentUser && (
                                  <div className="flex items-baseline justify-end gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(message.createdAt)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Composer */}
                <div className="shrink-0 p-3">
                  {/* Attachment Preview */}
                  {pendingAttachments && (
                    <div className="mb-3">
                      <AttachmentPreview
                        files={pendingAttachments.files}
                        type={pendingAttachments.type}
                        onSend={handleSendAttachments}
                        onCancel={() => setPendingAttachments(null)}
                      />
                    </div>
                  )}

                  {/* Reply Preview in Composer */}
                  {replyingTo && (
                    <div className="mb-2 flex items-center gap-2 bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary mb-0.5">
                          Replying to{" "}
                          {replyingTo.senderId === currentUserId
                            ? "yourself"
                            : replyingTo.senderName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {replyingTo.content}
                        </p>
                      </div>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="shrink-0 size-6 rounded-full hover:bg-accent flex items-center justify-center"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-input rounded-full">
                    {/* Attachment button - outside input */}
                    {!editingMessageId && (
                      <div onClick={() => setShowEmojiPicker(false)}>
                        <AttachmentMenu
                          onImageSelect={handleImageSelect}
                          onVideoSelect={handleVideoSelect}
                          onDocumentSelect={handleDocumentSelect}
                        />
                      </div>
                    )}

                    {/* Input container with buttons inside - WhatsApp style */}
                    <div
                      className={`flex-1 relative  rounded-full flex items-center  py-2 gap-2 min-h-[48px] ${editingMessageId ? "px-3" : "pr-3"}`}
                    >
                      {/* Emoji picker */}
                      {showEmojiPicker && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowEmojiPicker(false)}
                          />
                          <div className="absolute bottom-full left-0 mb-2 z-50">
                            <EmojiPicker
                              onEmojiClick={handleEmojiClick}
                              theme={
                                (theme === "dark" ? "dark" : "light") as Theme
                              }
                            />
                          </div>
                        </>
                      )}

                      {/* Emoji button - inside input */}
                      <button
                        className="shrink-0 p-1 hover:bg-accent rounded-full transition-colors"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <SmileIcon className="size-5 " />
                      </button>

                      {/* Input field */}
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            editingMessageId
                              ? handleEditMessage(
                                  editingMessageId,
                                  messageInput,
                                )
                              : handleSendMessage();
                          }
                          if (e.key === "Escape") {
                            setEditingMessageId(null);
                            setMessageInput("");
                          }
                        }}
                        placeholder={
                          editingMessageId ? "Edit message" : "Type a message"
                        }
                        className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
                      />

                      {/* Send button - inside input, only shows when there's text */}
                      {messageInput.trim() && (
                        <button
                          onClick={() =>
                            editingMessageId
                              ? handleEditMessage(
                                  editingMessageId,
                                  messageInput,
                                )
                              : handleSendMessage()
                          }
                          className="shrink-0 size-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors"
                        >
                          <SendIcon className="size-4 text-primary-foreground" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquareIcon className="size-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Choose a conversation from the list or search for a family
                    member to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
