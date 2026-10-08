"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Edit3,
  Save,
  Info,
  Calendar,
  User,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Tag,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/Button";
import ThinSpinner from "@/components/ThinSpinner";
import { backupCarerService } from "@/services/backupCarer.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

export interface HandoverNoteItem {
  id: string;
  leaveRequestId?: string;
  notes: string;
  authorName: string;
  authorRole: string; // "Primary Carer" | "Relief Carer" | "Admin"
  createdAt: string;
  updatedAt?: string;
  periodLabel?: string;
  isComplete?: boolean;
  completedAt?: string;
  completedByName?: string;
}

interface HandoverNotesManagerProps {
  placement: any;
  currentUserName?: string;
  currentUserRole?: string;
  isAdmin?: boolean;
  targetLeaveRequestId?: string | null;
  onHandoverUpdated?: () => void;
}

export default function HandoverNotesManager({
  placement,
  currentUserName = "Carer",
  currentUserRole = "Primary Carer",
  isAdmin = false,
  targetLeaveRequestId,
  onHandoverUpdated,
}: HandoverNotesManagerProps) {
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<HandoverNoteItem | null>(null);

  // Form States
  const [selectedLeaveIdForNew, setSelectedLeaveIdForNew] = useState<string>("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNotePeriodLabel, setNewNotePeriodLabel] = useState("");
  const [newNoteMarkComplete, setNewNoteMarkComplete] = useState(true);
  const [editNoteContent, setEditNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingNoteId, setTogglingNoteId] = useState<string | null>(null);
  const [showGuidance, setShowGuidance] = useState(false);

  // Resolved primary carer name
  const primaryCarer = placement.carerProfile;
  const primaryCarerName = primaryCarer
    ? `${primaryCarer.user?.firstName || primaryCarer.firstName || ""} ${
        primaryCarer.user?.lastName || primaryCarer.lastName || ""
      }`.trim() || "Primary Carer"
    : "Primary Carer";

  // Check if current user is active relief carer
  const isReliefCarer =
    currentUserRole.toLowerCase().includes("relief") ||
    placement.activeReliefCarerProfileId === placement.currentCarerProfileId;

  // Read existing custom notes array from placement.handoverNotes
  const getExistingCustomNotes = (): HandoverNoteItem[] => {
    if (!placement.handoverNotes) return [];
    const raw = placement.handoverNotes.trim();
    if (raw.startsWith("[") && raw.endsWith("]")) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  };

  // Compile all handover notes from leave requests + placement structured notes
  const handoverNotesList = useMemo(() => {
    const list: HandoverNoteItem[] = [];
    const existingCustom = getExistingCustomNotes();
    const seenLeaveRequestIds = new Set<string>();

    // 1. Add all structured custom notes
    for (const item of existingCustom) {
      if (item && item.notes) {
        list.push({
          id: item.id || `custom-${Date.now()}-${Math.random()}`,
          leaveRequestId: item.leaveRequestId,
          notes: item.notes,
          authorName: item.authorName || primaryCarerName,
          authorRole: item.authorRole || "Primary Carer",
          createdAt: item.createdAt || placement.createdAt,
          updatedAt: item.updatedAt || item.createdAt || placement.createdAt,
          periodLabel: item.periodLabel,
          isComplete: Boolean(item.isComplete),
          completedAt: item.completedAt,
          completedByName: item.completedByName,
        });
        if (item.leaveRequestId) {
          seenLeaveRequestIds.add(item.leaveRequestId);
        }
      }
    }

    // 2. Extract notes from leave requests that aren't already represented in placement.handoverNotes JSON
    const leaveRequests = placement.leaveRequests || [];
    for (const req of leaveRequests) {
      if (req.handoverNotes && req.handoverNotes.trim()) {
        const text = req.handoverNotes.trim();

        // If not already in the list, initialize individual item for this leave
        if (!seenLeaveRequestIds.has(req.id)) {
          const carerUser = req.carerProfile?.user || req.carerProfile;
          const authorName = carerUser
            ? `${carerUser.firstName || ""} ${carerUser.lastName || ""}`.trim()
            : primaryCarerName;
          const isPrimary = !req.carerProfileId || req.carerProfileId === placement.carerProfileId;

          const sDate = new Date(req.startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const eDate = new Date(req.endDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          list.push({
            id: `leave-${req.id}`,
            leaveRequestId: req.id,
            notes: text,
            authorName: authorName || primaryCarerName,
            authorRole: isPrimary ? "Primary Carer" : "Relief Carer",
            createdAt: req.requestedAt || req.createdAt || placement.createdAt,
            updatedAt: req.updatedAt || req.requestedAt || req.createdAt || placement.createdAt,
            periodLabel: `Relief Period: ${sDate} – ${eDate}`,
            isComplete: false,
          });
          seenLeaveRequestIds.add(req.id);
        }
      }
    }

    // 3. Fallback: If placement.handoverNotes was plain string (not JSON)
    if (placement.handoverNotes && !placement.handoverNotes.trim().startsWith("[")) {
      const plain = placement.handoverNotes.trim();
      const alreadyHas = list.some((n) => n.notes === plain);
      if (!alreadyHas) {
        list.push({
          id: `placement-root`,
          notes: plain,
          authorName: primaryCarerName,
          authorRole: "Primary Carer",
          createdAt: placement.handoverCompletedAt || placement.createdAt,
          updatedAt: placement.updatedAt || placement.createdAt,
          periodLabel: "Initial Handover Directives",
          isComplete: Boolean(placement.handoverCompletedAt),
          completedAt: placement.handoverCompletedAt,
          completedByName: primaryCarerName,
        });
      }
    }

    // Sort by latest updated / created first
    return list.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [placement, primaryCarerName]);

  // Handle redirect from leave tab to highlight or open modal
  useEffect(() => {
    if (targetLeaveRequestId) {
      const exists = handoverNotesList.some((n) => n.leaveRequestId === targetLeaveRequestId);
      if (!exists) {
        // Open modal preselected for this leave
        setSelectedLeaveIdForNew(targetLeaveRequestId);
        setIsAddModalOpen(true);
      } else {
        // Scroll to the card
        const el = document.getElementById(`handover-note-${targetLeaveRequestId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [targetLeaveRequestId, handoverNotesList]);

  // Available leave requests for selection in Add Modal
  const availableLeaveRequests = useMemo(() => {
    return placement.leaveRequests || [];
  }, [placement]);

  // 1. Submit Add Handover Note (Individual for a selected leave or general)
  const handleAddHandoverNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      const existing = getExistingCustomNotes();
      const nowIso = new Date().toISOString();

      let periodLabel = newNotePeriodLabel.trim();
      let leaveReqId: string | undefined = undefined;

      if (selectedLeaveIdForNew) {
        leaveReqId = selectedLeaveIdForNew;
        const matchingLeave = availableLeaveRequests.find(
          (l: any) => l.id === selectedLeaveIdForNew
        );
        if (matchingLeave) {
          const sDate = new Date(matchingLeave.startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const eDate = new Date(matchingLeave.endDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          periodLabel = `Relief Period: ${sDate} – ${eDate}`;
        }
      }

      const newEntry: HandoverNoteItem = {
        id: `note-${Date.now()}`,
        leaveRequestId: leaveReqId,
        notes: newNoteContent.trim(),
        authorName: currentUserName,
        authorRole: isReliefCarer ? "Relief Carer" : currentUserRole,
        createdAt: nowIso,
        updatedAt: nowIso,
        periodLabel: periodLabel || "General Care Directive",
        isComplete: newNoteMarkComplete,
        completedAt: newNoteMarkComplete ? nowIso : undefined,
        completedByName: newNoteMarkComplete ? currentUserName : undefined,
      };

      // Filter out any older entry for the same leave if replacing
      const filtered = leaveReqId
        ? existing.filter((e) => e.leaveRequestId !== leaveReqId)
        : existing;
      const updated = [newEntry, ...filtered];

      await backupCarerService.updatePlacementHandover(placement.id, {
        handoverNotes: JSON.stringify(updated),
        leaveRequestId: leaveReqId,
        leaveHandoverNotes: newNoteContent.trim(),
      });

      showSuccessToast(
        "Handover Note Added",
        leaveReqId
          ? "Individual handover note added for the selected relief leave period."
          : "General handover directive added to placement."
      );
      setNewNoteContent("");
      setNewNotePeriodLabel("");
      setSelectedLeaveIdForNew("");
      setIsAddModalOpen(false);
      if (onHandoverUpdated) onHandoverUpdated();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to add handover note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Submit Edit Handover Note (Updates timestamps and content)
  const handleSaveEditNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      const nowIso = new Date().toISOString();
      const existing = getExistingCustomNotes();

      // Find index in existing list or create
      const foundIdx = existing.findIndex((n) => n.id === editingNote.id);
      let updated: HandoverNoteItem[];

      if (foundIdx >= 0) {
        existing[foundIdx].notes = editNoteContent.trim();
        existing[foundIdx].updatedAt = nowIso;
        updated = existing;
      } else {
        // Was from leave request or legacy root
        const newEntry: HandoverNoteItem = {
          ...editingNote,
          notes: editNoteContent.trim(),
          updatedAt: nowIso,
        };
        updated = [newEntry, ...existing];
      }

      await backupCarerService.updatePlacementHandover(placement.id, {
        handoverNotes: JSON.stringify(updated),
        leaveRequestId: editingNote.leaveRequestId,
        leaveHandoverNotes: editNoteContent.trim(),
      });

      showSuccessToast(
        "Handover Note Updated",
        "The handover note and 'Updated at' timestamp have been saved."
      );
      setEditingNote(null);
      setEditNoteContent("");
      if (onHandoverUpdated) onHandoverUpdated();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to update handover note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Mark Individual Handover Note as Complete / Incomplete
  const handleToggleNoteComplete = async (note: HandoverNoteItem, markComplete: boolean) => {
    setTogglingNoteId(note.id);
    try {
      const nowIso = new Date().toISOString();
      const existing = getExistingCustomNotes();
      const foundIdx = existing.findIndex((n) => n.id === note.id);

      let updated: HandoverNoteItem[];
      if (foundIdx >= 0) {
        existing[foundIdx].isComplete = markComplete;
        existing[foundIdx].completedAt = markComplete ? nowIso : undefined;
        existing[foundIdx].completedByName = markComplete ? currentUserName : undefined;
        existing[foundIdx].updatedAt = nowIso;
        updated = existing;
      } else {
        const newEntry: HandoverNoteItem = {
          ...note,
          isComplete: markComplete,
          completedAt: markComplete ? nowIso : undefined,
          completedByName: markComplete ? currentUserName : undefined,
          updatedAt: nowIso,
        };
        updated = [newEntry, ...existing];
      }

      await backupCarerService.updatePlacementHandover(placement.id, {
        handoverNotes: JSON.stringify(updated),
        leaveRequestId: note.leaveRequestId,
      });

      showSuccessToast(
        markComplete ? "Handover Marked Complete" : "Handover Reopened",
        markComplete
          ? "This individual handover has been verified and marked as complete."
          : "Handover note has been reopened for updates."
      );
      if (onHandoverUpdated) onHandoverUpdated();
    } catch (err: any) {
      showErrorToast("Error", err.message || "Failed to update handover completion.");
    } finally {
      setTogglingNoteId(null);
    }
  };

  const totalNotesCount = handoverNotesList.length;
  const completedNotesCount = handoverNotesList.filter((n) => n.isComplete).length;
  const pendingNotesCount = totalNotesCount - completedNotesCount;

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action Controls */}
      <div className="p-5 sm:p-6 rounded-2xl border border-gold-300/20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-300/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-300/20 shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Handover Notes & Continuity Management
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-gold-300/30 bg-gold-300/10 text-gold-200 text-xs font-semibold">
                  {totalNotesCount} {totalNotesCount === 1 ? "Note" : "Notes"} Total
                </span>
                {pendingNotesCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-300 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {pendingNotesCount} Action Required
                  </span>
                ) : totalNotesCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    All Handovers Complete
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-gold-100/60 mt-1">
                Manage, edit, and individually mark handover instructions as complete for each relief leave period.
              </p>
            </div>
          </div>

          {/* Top Add Button */}
          <div className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedLeaveIdForNew("");
                setIsAddModalOpen(true);
              }}
              className="text-xs font-bold flex items-center gap-1.5 shadow-md shadow-gold/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Handover Note</span>
            </Button>
          </div>
        </div>

        {/* Status Callout Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-gold-300/15 bg-navy-950/60">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold-100/50 block">
              Total Handover Directives
            </span>
            <div className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-DEFAULT" />
              <span>{totalNotesCount} Recorded</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300/70 block">
              Verified Complete
            </span>
            <div className="text-base font-bold text-emerald-300 mt-0.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{completedNotesCount} Completed</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-950/20">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/70 block">
              Pending / Incomplete
            </span>
            <div className="text-base font-bold text-amber-300 mt-0.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{pendingNotesCount} Requiring Action</span>
            </div>
          </div>
        </div>

        {/* Guidance Toggle */}
        <div className="rounded-xl border border-gold-300/15 bg-navy-950/60 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowGuidance((prev) => !prev)}
            className="w-full p-3 flex items-center justify-between text-xs text-gold-200 hover:bg-gold-300/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 font-semibold">
              <Info className="w-4 h-4 text-gold-DEFAULT" />
              <span>Handover Continuity Checklist & Best Practices</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gold-100/60">
              <span>{showGuidance ? "Hide details" : "Show details"}</span>
              {showGuidance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showGuidance && (
            <div className="p-4 pt-1 border-t border-gold-300/10 space-y-2 text-xs text-gold-100/80">
              <p className="text-[11px] text-gold-100/60">
                To help incoming or returning carers maintain seamless continuity of support, consider including:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-gold-100/70 pl-2 list-disc list-inside">
                <li>Recent changes in client’s mobility, health, or wellbeing</li>
                <li>Recent falls, hospital visits, or incidents</li>
                <li>Medication adjustments or doses given</li>
                <li>Changes to daily routine, preferences, or sleep patterns</li>
                <li>Upcoming appointments or doctor visits</li>
                <li>Mobility equipment instructions or household nuances</li>
                <li>Relevant risks, triggers, or emotional notes</li>
                <li>Practical supplies or household restocking status</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 2. Handover Notes List (Individual per leave) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gold-100/70 pb-1">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Individual Handover Directives ({totalNotesCount})
          </span>
          <span className="text-[10px] text-gold-100/50">
            Sorted by most recently updated
          </span>
        </div>

        {handoverNotesList.length === 0 ? (
          <div className="p-10 rounded-2xl border border-dashed border-gold-300/20 text-center space-y-3 bg-navy-950/40">
            <FileText className="w-10 h-10 text-gold-300/30 mx-auto" />
            <h4 className="text-sm font-bold text-white">No handover notes recorded yet</h4>
            <p className="text-xs text-gold-100/60 max-w-md mx-auto">
              When booking unavailability periods or relief shifts, add handover notes to keep all carers informed and maintain care continuity.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedLeaveIdForNew("");
                setIsAddModalOpen(true);
              }}
              className="mt-2 text-xs !border-gold-300/30 !text-gold-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add First Handover Note
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {handoverNotesList.map((item, idx) => {
              const createdDate = new Date(item.createdAt);
              const updatedDate = item.updatedAt ? new Date(item.updatedAt) : null;
              const isTargeted = targetLeaveRequestId && item.leaveRequestId === targetLeaveRequestId;
              const isToggling = togglingNoteId === item.id;

              return (
                <div
                  key={item.id || idx}
                  id={item.leaveRequestId ? `handover-note-${item.leaveRequestId}` : `handover-note-${item.id}`}
                  className={`p-5 rounded-2xl border transition-all shadow-md space-y-4 ${
                    isTargeted
                      ? "border-gold-DEFAULT bg-navy-900/90 ring-2 ring-gold-DEFAULT/40 shadow-gold/20"
                      : "border-gold-300/15 bg-navy-950/70 hover:border-gold-300/30"
                  }`}
                >
                  {/* Card Header: Context, Status & Action Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-300/10 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-300/10 text-gold-200 border border-gold-300/25 flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-gold-DEFAULT" />
                        {item.periodLabel || "General Care Directive"}
                      </span>

                      {item.isComplete ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Handover Complete
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          Pending Completion
                        </span>
                      )}

                      {isTargeted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-DEFAULT/20 text-gold-DEFAULT border border-gold-DEFAULT/40">
                          Selected from Leave
                        </span>
                      )}
                    </div>

                    {/* Action Controls for this individual note */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNote(item);
                          setEditNoteContent(item.notes);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gold-200 hover:text-white bg-gold-300/10 hover:bg-gold-300/20 border border-gold-300/25 transition-all cursor-pointer"
                        title="Edit note text and update timestamp"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gold-DEFAULT" />
                        <span>Edit</span>
                      </button>

                      {item.isComplete ? (
                        <button
                          type="button"
                          onClick={() => handleToggleNoteComplete(item, false)}
                          disabled={isToggling}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
                          title="Reopen handover note for review"
                        >
                          {isToggling ? (
                            <ThinSpinner className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>Reopen</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleNoteComplete(item, true)}
                          disabled={isToggling}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer shadow-sm hover:scale-[1.02] disabled:opacity-50"
                          title="Mark this individual handover note as verified & complete"
                        >
                          {isToggling ? (
                            <ThinSpinner className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Mark as Complete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Content: The Handover Note */}
                  <div className="text-xs sm:text-sm text-gold-100/90 whitespace-pre-wrap leading-relaxed bg-navy-900/70 p-4 rounded-xl border border-gold-300/10 font-normal break-words break-all [overflow-wrap:anywhere] max-w-full overflow-hidden shadow-inner">
                    {item.notes}
                  </div>

                  {/* Card Footer: Added by, Created at, and Updated at timestamps */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gold-300/10 text-xs text-gold-100/70">
                    <div className="flex items-center gap-2 flex-wrap">
                      <User className="w-3.5 h-3.5 text-gold-DEFAULT shrink-0" />
                      <span>
                        Added by <strong className="text-white font-semibold">{item.authorName}</strong>{" "}
                        <span className="text-gold-300/80">({item.authorRole})</span>
                      </span>
                      <span className="text-gold-100/30">•</span>
                      <span className="text-gold-100/60">
                        {createdDate.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {createdDate.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      {updatedDate && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-900 border border-gold-300/15 text-[11px] text-emerald-300/90 font-medium">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          Updated at:{" "}
                          <strong className="text-emerald-300">
                            {updatedDate.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            {updatedDate.toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </strong>
                        </span>
                      )}

                      {item.isComplete && item.completedByName && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                          ✓ Verified by {item.completedByName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD HANDOVER NOTE (Fixed Scroll & Individual Leave)      */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-navy-950/85 p-3 sm:p-6 backdrop-blur-sm flex min-h-full items-center justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-xl my-auto flex flex-col rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl relative overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gold-300/10 shrink-0 bg-navy-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-300/20 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Add Handover Note
                  </h3>
                  <p className="text-xs text-gold-100/60">
                    Author: <span className="text-gold-200 font-semibold">{currentUserName}</span> ({currentUserRole})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable without cutoff */}
            <form
              id="add-handover-form"
              onSubmit={handleAddHandoverNote}
              className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar"
            >
              {/* Select Leave Request / Absence Period */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                  Associated Relief Leave Period
                </label>
                <select
                  value={selectedLeaveIdForNew}
                  onChange={(e) => setSelectedLeaveIdForNew(e.target.value)}
                  className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 focus:border-gold outline-none"
                >
                  <option value="">General Placement Directives (Not linked to specific leave)</option>
                  {availableLeaveRequests.map((req: any) => {
                    const sDate = new Date(req.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    const eDate = new Date(req.endDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <option key={req.id} value={req.id}>
                        Leave: {sDate} – {eDate} ({req.reason || "Planned Unavailability"})
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-gold-100/50">
                  Selecting a leave links this handover individually so it can be managed and marked complete for that specific period.
                </p>
              </div>

              {!selectedLeaveIdForNew && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                    Custom Subject / Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={newNotePeriodLabel}
                    onChange={(e) => setNewNotePeriodLabel(e.target.value)}
                    placeholder="e.g. End of Shift Handover, Medication Routine Update..."
                    className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 focus:border-gold outline-none"
                  />
                </div>
              )}

              {/* Handover Text Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                  Handover Notes & Continuity Instructions
                </label>
                <textarea
                  required
                  rows={6}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Enter detailed handover information, routines, medication updates, mobility notes, or practical directives..."
                  className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none resize-y"
                />
              </div>

              {/* Mark as Complete Checkbox */}
              <div className="p-3 rounded-xl border border-gold-300/10 bg-navy-950/70 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Mark Handover as Complete
                  </span>
                  <span className="text-[11px] text-gold-100/60">
                    Check this if you have completed and finalized all handover details for this period.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newNoteMarkComplete}
                  onChange={(e) => setNewNoteMarkComplete(e.target.checked)}
                  className="w-4 h-4 rounded border-gold-300/30 text-gold-DEFAULT focus:ring-gold-DEFAULT/50 cursor-pointer"
                />
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 sm:px-6 border-t border-gold-300/10 bg-navy-950/80 shrink-0">
              <Button
                variant="ghost-gold"
                size="sm"
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                form="add-handover-form"
                disabled={isSubmitting || !newNoteContent.trim()}
                className="font-bold shadow-md shadow-gold/20"
              >
                {isSubmitting ? "Saving..." : "Save Handover Note"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EDIT HANDOVER NOTE (Fixed Scroll & Updated Timestamps)  */}
      {/* ------------------------------------------------------------- */}
      {editingNote && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-navy-950/85 p-3 sm:p-6 backdrop-blur-sm flex min-h-full items-center justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-xl my-auto flex flex-col rounded-2xl border border-gold-300/20 bg-navy-900 shadow-2xl relative overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gold-300/10 shrink-0 bg-navy-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-300/20 shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Edit Handover Note
                  </h3>
                  <p className="text-xs text-gold-100/60">
                    Originally added by:{" "}
                    <span className="text-gold-200 font-semibold">{editingNote.authorName}</span> ({editingNote.authorRole})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="rounded-full p-2 text-gold-100/60 hover:bg-gold-300/10 hover:text-gold-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              id="edit-handover-form"
              onSubmit={handleSaveEditNote}
              className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar"
            >
              {editingNote.periodLabel && (
                <div className="p-2.5 rounded-xl bg-gold-300/10 border border-gold-300/20 text-xs text-gold-200 font-semibold flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gold-DEFAULT" />
                  <span>{editingNote.periodLabel}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider block">
                  Handover Notes
                </label>
                <textarea
                  required
                  rows={6}
                  value={editNoteContent}
                  onChange={(e) => setEditNoteContent(e.target.value)}
                  placeholder="Update handover details..."
                  className="w-full rounded-xl border border-gold-300/20 bg-navy-950 px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-gold-100/30 focus:border-gold outline-none resize-y"
                />
              </div>

              <div className="p-3 rounded-xl bg-navy-950/70 border border-gold-300/10 text-xs text-emerald-400 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Automatic Timestamp Update</span>
                </div>
                <p className="text-[11px] text-gold-100/70 leading-relaxed">
                  Upon saving, the note will be marked with the current timestamp under &quot;Updated at [date/time]&quot; and recorded with your profile credentials.
                </p>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 sm:px-6 border-t border-gold-300/10 bg-navy-950/80 shrink-0">
              <Button
                variant="ghost-gold"
                size="sm"
                type="button"
                onClick={() => setEditingNote(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                form="edit-handover-form"
                disabled={isSubmitting || !editNoteContent.trim()}
                className="font-bold shadow-md shadow-gold/20"
              >
                {isSubmitting ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
