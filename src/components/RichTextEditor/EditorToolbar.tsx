"use client";

import React from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link2,
  Link2Off,
  Pilcrow,
  RemoveFormatting,
} from "lucide-react";
import type { EditorCommand } from "./editorCommands";

export interface ToolbarState {
  bold: boolean;
  italic: boolean;
  block: string;
}

interface EditorToolbarProps {
  state: ToolbarState;
  disabled?: boolean;
  onCommand: (command: EditorCommand) => void;
  onRequestLink: () => void;
}

interface ToolButton {
  command: EditorCommand | "link";
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  isActive: (state: ToolbarState) => boolean;
}

const BUTTONS: ToolButton[][] = [
  [
    {
      command: "bold",
      label: "Bold",
      Icon: Bold,
      isActive: (s) => s.bold,
    },
    {
      command: "italic",
      label: "Italic",
      Icon: Italic,
      isActive: (s) => s.italic,
    },
  ],
  [
    {
      command: "paragraph",
      label: "Paragraph",
      Icon: Pilcrow,
      isActive: (s) => s.block === "p" || s.block === "",
    },
    {
      command: "h2",
      label: "Heading 2",
      Icon: Heading2,
      isActive: (s) => s.block === "h2",
    },
    {
      command: "h3",
      label: "Heading 3",
      Icon: Heading3,
      isActive: (s) => s.block === "h3",
    },
    {
      command: "blockquote",
      label: "Quote",
      Icon: Quote,
      isActive: (s) => s.block === "blockquote",
    },
  ],
  [
    {
      command: "ul",
      label: "Bulleted list",
      Icon: List,
      isActive: () => false,
    },
    {
      command: "ol",
      label: "Numbered list",
      Icon: ListOrdered,
      isActive: () => false,
    },
  ],
  [
    {
      command: "link",
      label: "Insert link",
      Icon: Link2,
      isActive: () => false,
    },
    {
      command: "unlink",
      label: "Remove link",
      Icon: Link2Off,
      isActive: () => false,
    },
    {
      command: "clear",
      label: "Clear formatting",
      Icon: RemoveFormatting,
      isActive: () => false,
    },
  ],
];

export default function EditorToolbar({
  state,
  disabled,
  onCommand,
  onRequestLink,
}: EditorToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className="flex flex-wrap items-center gap-1 border-b border-gold-300/10 bg-navy-950/60 px-2 py-2"
    >
      {BUTTONS.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex > 0 && (
            <span
              aria-hidden="true"
              className="mx-1 h-5 w-px shrink-0 bg-gold-300/10"
            />
          )}
          {group.map(({ command, label, Icon, isActive }) => {
            const active = isActive(state);
            return (
              <button
                key={command}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={active}
                disabled={disabled}
                /* Critical: without preventDefault the mousedown blurs the
                   editor, the Selection collapses, and execCommand silently
                   operates on nothing. */
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  command === "link" ? onRequestLink() : onCommand(command)
                }
                className={`flex h-8 w-8 items-center justify-center rounded-lg border transition duration-200 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-gold-300/50 ${
                  active
                    ? "border-gold-300/40 bg-gold-DEFAULT/15 text-gold-DEFAULT"
                    : "border-transparent text-gold-200/60 hover:border-gold-300/20 hover:bg-gold-300/10 hover:text-gold-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
