import { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  FileText,
  AlertTriangle,
  RefreshCw,
  Paperclip,
  Clock,
  Edit2,
  Search,
  XCircle,
  Check,
} from "lucide-react";
import Button from "@/components/Button";
import { adminService } from "@/services/admin/admin.service";
import {
  InternalNote,
  CreateInternalNotePayload,
  UpdateInternalNotePayload,
  GetInternalNotesParams,
} from "@/app/(protected)/admin/types/admin.types";
import AddNoteModal from "./AddNoteModal";
import EditNoteModal from "./EditNoteModal";
import NoteDetailsModal from "./NoteDetailsModal";
import { useAuth } from "@/contexts/AuthContext";
import { NOTE_CATEGORIES } from "./AddNoteModal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface InternalNotesProps {
  entityId: string;
  entityType: "CARER" | "CLIENT" | "PLACEMENT";
}

export default function InternalNotes({
  entityId,
  entityType,
}: InternalNotesProps) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [selectedNote, setSelectedNote] = useState<InternalNote | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [pinnedFilter, setPinnedFilter] = useState("ALL");
  const [dateRangeFilter, setDateRangeFilter] = useState("ALL");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
    setPinnedFilter("ALL");
    setDateRangeFilter("ALL");
    setCustomStartDate("");
    setCustomEndDate("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetInternalNotesParams = { limit: 5000 };
      if (entityType === "CARER") params.carerProfileId = entityId;
      if (entityType === "CLIENT") params.clientProfileId = entityId;
      if (entityType === "PLACEMENT") params.placementId = entityId;

      const response = await adminService.getInternalNotes(params);
      setNotes(response.items || []);
    } catch (err: any) {
      console.error("Failed to load internal notes", err);
      setError(err.message || "Could not load internal notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId) {
      fetchNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, entityType]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // 1. Global Search
        if (debouncedSearch) {
          const s = debouncedSearch.toLowerCase().trim();

          const title = (note.title || "").toLowerCase();
          const content = (note.content || "").toLowerCase();
          const authorFirst = (note.author?.firstName || "").toLowerCase();
          const authorLast = (note.author?.lastName || "").toLowerCase();
          const authorFull = `${authorFirst} ${authorLast}`.trim();
          const category = (note.category || "").toLowerCase();

          const matchTitle = title.includes(s);
          const matchContent = content.includes(s);
          const matchAuthorFirst = authorFirst.includes(s);
          const matchAuthorLast = authorLast.includes(s);
          const matchAuthorFull = authorFull.includes(s);
          const matchCategory = category.includes(s);

          if (
            !matchTitle &&
            !matchContent &&
            !matchAuthorFirst &&
            !matchAuthorLast &&
            !matchAuthorFull &&
            !matchCategory
          ) {
            return false;
          }
        }

        // 2. Status
        if (statusFilter !== "ALL" && note.status !== statusFilter)
          return false;

        // 3. Priority
        if (priorityFilter !== "ALL" && note.priority !== priorityFilter)
          return false;

        // 4. Category
        if (categoryFilter !== "ALL" && note.category !== categoryFilter)
          return false;

        // 5. Pinned
        if (pinnedFilter === "PINNED" && !note.isPinned) return false;

        // 6. Date Range
        if (dateRangeFilter !== "ALL") {
          if (!note.createdAt) return false;

          const noteDate = new Date(note.createdAt);
          if (isNaN(noteDate.getTime())) return false;

          const now = new Date();

          if (dateRangeFilter === "TODAY") {
            if (noteDate.toDateString() !== now.toDateString()) return false;
          } else if (dateRangeFilter === "YESTERDAY") {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (noteDate.toDateString() !== yesterday.toDateString())
              return false;
          } else if (dateRangeFilter === "LAST_7_DAYS") {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setHours(0, 0, 0, 0);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            if (noteDate < sevenDaysAgo) return false;
          } else if (dateRangeFilter === "LAST_30_DAYS") {
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setHours(0, 0, 0, 0);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            if (noteDate < thirtyDaysAgo) return false;
          } else if (dateRangeFilter === "THIS_MONTH") {
            if (
              noteDate.getMonth() !== now.getMonth() ||
              noteDate.getFullYear() !== now.getFullYear()
            )
              return false;
          } else if (dateRangeFilter === "CUSTOM") {
            if (customStartDate) {
              const start = new Date(customStartDate);
              start.setHours(0, 0, 0, 0);
              if (noteDate < start) return false;
            }
            if (customEndDate) {
              const end = new Date(customEndDate);
              end.setHours(23, 59, 59, 999);
              if (noteDate > end) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [
    notes,
    debouncedSearch,
    statusFilter,
    priorityFilter,
    categoryFilter,
    pinnedFilter,
    dateRangeFilter,
    customStartDate,
    customEndDate,
  ]);

  const handleAddNote = async (
    payload: Omit<
      CreateInternalNotePayload,
      "carerProfileId" | "clientProfileId" | "placementId"
    >,
  ) => {
    try {
      const fullPayload: CreateInternalNotePayload = {
        ...payload,
      };
      if (entityType === "CARER") fullPayload.carerProfileId = entityId;
      if (entityType === "CLIENT") fullPayload.clientProfileId = entityId;
      if (entityType === "PLACEMENT") fullPayload.placementId = entityId;

      await adminService.addInternalNote(fullPayload);
      showSuccessToast("Note Added", "Internal note successfully saved.");
      fetchNotes(); // refetch to apply server sorting/ids
    } catch (err: any) {
      console.error("Failed to add internal note", err);
      showErrorToast("Error", err.message || "Failed to add internal note.");
      throw err;
    }
  };

  const handleEditNote = async (
    id: string,
    payload: UpdateInternalNotePayload,
  ) => {
    try {
      await adminService.updateInternalNote(id, payload);
      showSuccessToast("Note Updated", "Internal note successfully updated.");
      fetchNotes();
    } catch (err: any) {
      console.error("Failed to update internal note", err);
      showErrorToast("Error", err.message || "Failed to update internal note.");
      throw err;
    }
  };

  const openDetails = (note: InternalNote) => {
    setSelectedNote(note);
    setIsDetailsModalOpen(true);
  };

  const openEdit = (note: InternalNote, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNote(note);
    setIsEditModalOpen(true);
  };

  // Date formatter for display
  const formatNoteDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Unknown Date";

    const datePart = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const timePart = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} • ${timePart}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start sm:items-center justify-between border-b border-gold-300/10 pb-3 gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-gold-200 truncate">
            Internal Notes
          </h3>
          <p className="text-[11px] text-gold-100/50 mt-0.5 leading-relaxed">
            Private administrative notes. Not visible to clients or carers.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          fullWidth={false}
          className="flex items-center gap-2 shrink-0 whitespace-nowrap mt-1 sm:mt-0"
        >
          <PlusCircle className="h-4 w-4 shrink-0" /> Add Note
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-3 bg-navy-950/40 px-3 py-2.5 rounded-xl border border-gold-300/10">
        <div className="relative w-full md:w-[260px] shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold-200/50" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-gold-300/20 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gold-100 placeholder:text-gold-200/30 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[100px] flex-1 sm:flex-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[100px] flex-1 sm:flex-none"
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[100px] flex-1 sm:flex-none max-w-[150px] truncate"
          >
            <option value="ALL">All Categories</option>
            {NOTE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={pinnedFilter}
            onChange={(e) => setPinnedFilter(e.target.value)}
            className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[100px] flex-1 sm:flex-none"
          >
            <option value="ALL">All Notes</option>
            <option value="PINNED">Pinned Only</option>
          </select>

          <select
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[100px] flex-1 sm:flex-none"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="CUSTOM">Custom Range</option>
          </select>

          {dateRangeFilter === "CUSTOM" &&
            (() => {
              const today = new Date();
              const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              return (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    max={customEndDate || maxDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors"
                    title="Start Date"
                  />
                  <span className="text-gold-200/50 text-xs">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    min={customStartDate}
                    max={maxDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors"
                    title="End Date"
                  />
                </div>
              );
            })()}

          <button
            onClick={handleResetFilters}
            disabled={
              !(
                searchQuery ||
                statusFilter !== "ALL" ||
                priorityFilter !== "ALL" ||
                categoryFilter !== "ALL" ||
                pinnedFilter !== "ALL" ||
                dateRangeFilter !== "ALL"
              )
            }
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1.5 rounded-lg transition-all duration-200 ${
              searchQuery ||
              statusFilter !== "ALL" ||
              priorityFilter !== "ALL" ||
              categoryFilter !== "ALL" ||
              pinnedFilter !== "ALL" ||
              dateRangeFilter !== "ALL"
                ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <XCircle className="h-3 w-3" />
            Clear Filters
          </button>
        </div>
      </div>

      <div className="relative h-[60vh] lg:h-[280px] flex flex-col">
        {loading ? (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-gold-300/5 bg-navy-950/40 p-4"
              >
                <div className="flex gap-4">
                  <div className="h-6 w-24 bg-gold-300/10 rounded-full" />
                  <div className="h-6 w-32 bg-gold-300/5 rounded" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full bg-gold-300/5 rounded" />
                  <div className="h-4 w-2/3 bg-gold-300/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-8 w-8 text-rose-400 mb-2" />
            <p className="text-sm font-semibold text-rose-400 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={fetchNotes}
              size="sm"
              fullWidth={false}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-gold-300/5 flex items-center justify-center text-gold-200/50 mb-3">
              {searchQuery ||
              statusFilter !== "ALL" ||
              priorityFilter !== "ALL" ||
              categoryFilter !== "ALL" ||
              pinnedFilter !== "ALL" ||
              dateRangeFilter !== "ALL" ? (
                <Search className="h-6 w-6" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
            </div>
            <p className="text-sm font-semibold text-gold-200">
              {searchQuery ||
              statusFilter !== "ALL" ||
              priorityFilter !== "ALL" ||
              categoryFilter !== "ALL" ||
              pinnedFilter !== "ALL" ||
              dateRangeFilter !== "ALL"
                ? "No matches found"
                : "No Internal Notes"}
            </p>
            <p className="text-xs text-gold-100/50 mt-1 max-w-sm">
              {searchQuery ||
              statusFilter !== "ALL" ||
              priorityFilter !== "ALL" ||
              categoryFilter !== "ALL" ||
              pinnedFilter !== "ALL" ||
              dateRangeFilter !== "ALL"
                ? "Try adjusting your search or filters to find what you're looking for."
                : `There are currently no internal notes for this ${entityType.toLowerCase()}. Click "Add Note" to create one.`}
            </p>
            {(searchQuery ||
              statusFilter !== "ALL" ||
              priorityFilter !== "ALL" ||
              categoryFilter !== "ALL" ||
              pinnedFilter !== "ALL" ||
              dateRangeFilter !== "ALL") && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                size="sm"
                fullWidth={false}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => openDetails(note)}
                className={`group cursor-pointer rounded-xl border ${note.isPinned ? "border-gold/50 bg-gold/5" : "border-gold-300/10 bg-navy-950"} p-5 shadow-sm hover:border-gold-300/30 transition-all`}
              >
                <div className="flex items-start justify-between mb-3 border-b border-gold-300/10 pb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-gold-200 font-medium tracking-wide opacity-80 uppercase">
                      Added by:
                    </span>
                    <h4 className="text-base font-bold text-gold-100">
                      {note.author?.firstName} {note.author?.lastName}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gold-100/50">
                        {formatNoteDate(note.createdAt)}
                      </span>
                      {note.isPinned && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gold/10 text-[10px] text-gold uppercase tracking-wider font-semibold whitespace-nowrap">
                          Pinned
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(note, e);
                        }}
                        className="p-2 rounded transition-colors bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-400 cursor-pointer"
                        title="Edit Note"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <h5 className="font-semibold text-gold-50 mb-2">
                  {note.title}
                </h5>

                <div className="text-sm text-gold-100/80 leading-relaxed line-clamp-3">
                  {note.content}
                </div>

                {/* Follow Up Date & Tagged Admins */}
                {(note.followUpDate ||
                  (note.taggedAdmins && note.taggedAdmins.length > 0)) && (
                  <div className="mt-3 flex flex-wrap gap-3 pt-2 border-t border-gold-300/5">
                    {note.followUpDate && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-semibold">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>
                          Follow Up:{" "}
                          {new Date(note.followUpDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {note.taggedAdmins && note.taggedAdmins.length > 0 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gold-300/10 border border-gold-300/20 text-gold-200 text-[10px] font-semibold">
                        <span>@{note.taggedAdmins.join(", @")}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gold-300/10 flex items-center justify-between gap-4 text-xs text-gold-100/70 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  <div className="flex items-center gap-3">
                    {note.category && (
                      <span className="flex items-center gap-1.5 font-medium text-gold-200 whitespace-nowrap border-r border-gold-300/20 pr-3">
                        {note.category}
                      </span>
                    )}

                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          note.priority === "HIGH"
                            ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                            : note.priority === "MEDIUM"
                              ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                              : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                        }`}
                      ></span>
                      {note.priority}
                    </span>

                    <span
                      className={`flex items-center gap-1.5 whitespace-nowrap before:content-['•'] before:text-gold-300/30 ${
                        note.status === "RESOLVED"
                          ? "text-emerald-400 font-semibold"
                          : ""
                      }`}
                    >
                      {note.status === "RESOLVED" && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      {note.status}
                    </span>

                    {note.status === "ACTIVE" && note.priority === "HIGH" && (
                      <span className="flex items-center gap-1.5 whitespace-nowrap before:content-['•'] before:text-gold-300/30 text-rose-400 font-bold uppercase text-[10px] tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> Action Required
                      </span>
                    )}

                    {note.attachments && note.attachments.length > 0 && (
                      <span className="flex items-center gap-1.5 whitespace-nowrap before:content-['•'] before:text-gold-300/30">
                        <Paperclip className="h-3 w-3" />
                        {note.attachments.length} Attachment
                        {note.attachments.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(note);
                    }}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-navy-900 border border-gold-300/20 text-gold-200 hover:bg-gold-300/10 transition-colors font-medium whitespace-nowrap"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    View History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNote}
      />

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
        onSave={handleEditNote}
      />

      <NoteDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
        onAttachmentUploaded={fetchNotes}
      />
    </div>
  );
}
