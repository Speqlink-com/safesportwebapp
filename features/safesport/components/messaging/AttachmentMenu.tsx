"use client";

import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ImageIcon,
  VideoIcon,
  FileTextIcon,
  PaperclipIcon,
} from "lucide-react";

interface AttachmentMenuProps {
  onImageSelect: (files: FileList) => void;
  onVideoSelect: (files: FileList) => void;
  onDocumentSelect: (files: FileList) => void;
}

export function AttachmentMenu({
  onImageSelect,
  onVideoSelect,
  onDocumentSelect,
}: AttachmentMenuProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onImageSelect(e.target.files);
            e.target.value = "";
          }
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onVideoSelect(e.target.files);
            e.target.value = "";
          }
        }}
      />
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.csv,.xls,.xlsx,.ppt,.pptx"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onDocumentSelect(e.target.files);
            e.target.value = "";
          }
        }}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-accent transition-colors">
          <PaperclipIcon className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-48">
          <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
            <ImageIcon className="size-4 mr-2" />
            Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => videoInputRef.current?.click()}>
            <VideoIcon className="size-4 mr-2" />
            Video
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => documentInputRef.current?.click()}>
            <FileTextIcon className="size-4 mr-2" />
            Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
