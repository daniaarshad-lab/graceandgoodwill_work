import { useState, useEffect } from "react";
import { PlusCircle, FileText, AlertTriangle, RefreshCw, Paperclip, Clock, Edit2, Search, XCircle } from "lucide-react";
import Button from "@/components/Button";
import { adminService } from "@/services/admin/admin.service";
import { InternalNote, CreateInternalNotePayload, UpdateInternalNotePayload, GetInternalNotesParams } from "@/app/(protected)/admin/types/admin.types";
import AddNoteModal from "./AddNoteModal";
import EditNoteModal from "./EditNoteModal";
import NoteDetailsModal from "./NoteDetailsModal";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

interface InternalNotesProps {
  entityId: string;
  entityType: "CARER" | "CLIENT" | "PLACEMENT";
}

export default function InternalNotes({ entityId, entityType }: InternalNotesProps) {
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
  const [pinnedFilter, setPinnedFilter] = useState("ALL");

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setPinnedFilter("ALL");
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
      
      const params: GetInternalNotesParams = {};
      if (entityType === "CARER") params.carerProfileId = entityId;
      if (entityType === "CLIENT") params.clientProfileId = entityId;
      if (entityType === "PLACEMENT") params.placementId = entityId;
      
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (priorityFilter !== "ALL") params.priority = priorityFilter;
      if (pinnedFilter === "PINNED") params.isPinned = true;
      
      const response = await adminService.getInternalNotes(params);
      
      // Sort pinned first, then newest first based on createdAt
      const sorted = [...response.items].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setNotes(sorted);
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
  }, [entityId, entityType, debouncedSearch, statusFilter, priorityFilter, pinnedFilter]);

  const handleAddNote = async (payload: Omit<CreateInternalNotePayload, "carerProfileId" | "clientProfileId" | "placementId">) => {
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

  const handleEditNote = async (id: string, payload: UpdateInternalNotePayload) => {
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
      year: "numeric"
    });
    
    const timePart = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    return `${datePart} • ${timePart}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
        <div>
          <h3 className="text-xl font-bold text-gold-200">Internal Notes</h3>
          <p className="text-[11px] text-gold-100/50 mt-0.5">
            Private administrative notes. Not visible to clients or carers.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          fullWidth={false}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Add Note
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
            value={pinnedFilter}
            onChange={(e) => setPinnedFilter(e.target.value)}
            className="bg-navy-900 border border-gold-300/20 rounded-lg px-2.5 py-1.5 text-xs text-gold-100 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[100px] flex-1 sm:flex-none"
          >
            <option value="ALL">All Notes</option>
            <option value="PINNED">Pinned Only</option>
          </select>
          
          <button
            onClick={handleResetFilters}
            disabled={!(searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" || pinnedFilter !== "ALL")}
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1.5 rounded-lg transition-all duration-200 ${
              (searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" || pinnedFilter !== "ALL")
                ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <XCircle className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      <div className="relative h-[280px] flex flex-col">
        {loading ? (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gold-300/5 bg-navy-950/40 p-4">
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
            <Button variant="outline" onClick={fetchNotes} size="sm" fullWidth={false} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-gold-300/5 flex items-center justify-center text-gold-200/50 mb-3">
              {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" || pinnedFilter !== "ALL" ? (
                <Search className="h-6 w-6" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
            </div>
            <p className="text-sm font-semibold text-gold-200">
              {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" || pinnedFilter !== "ALL" 
                ? "No matches found" 
                : "No Internal Notes"}
            </p>
            <p className="text-xs text-gold-100/50 mt-1 max-w-sm">
              {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" || pinnedFilter !== "ALL" 
                ? "Try adjusting your search or filters to find what you're looking for." 
                : `There are currently no internal notes for this ${entityType.toLowerCase()}. Click "Add Note" to create one.`}
            </p>
            {(searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL" || pinnedFilter !== "ALL") && (
              <Button variant="outline" onClick={handleResetFilters} size="sm" fullWidth={false} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-300/20 hover:[&::-webkit-scrollbar-thumb]:bg-gold-300/40 [&::-webkit-scrollbar-thumb]:rounded-full">
            {notes.map((note) => (
              <div 
                key={note.id} 
                onClick={() => openDetails(note)}
                className={`group cursor-pointer rounded-xl border ${note.isPinned ? "border-gold/50 bg-gold/5" : "border-gold-300/10 bg-navy-950"} p-5 shadow-sm hover:border-gold-300/30 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded border border-gold-300/20 bg-navy-900 text-[10px] font-bold text-gold-200 uppercase tracking-wider">
                        [ {note.author?.firstName} {note.author?.lastName} ]
                      </span>
                      <span className="text-[11px] text-gold-100/40 font-mono">
                        {formatNoteDate(note.createdAt)}
                      </span>
                      {note.isPinned && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gold/20 text-[10px] text-gold">
                          Pinned
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-gold-50">{note.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => openEdit(note, e)}
                      className="p-1.5 rounded bg-navy-900 border border-gold-300/20 text-gold-100/70 hover:text-gold-200 hover:border-gold-300/50 transition-colors"
                      title="Edit Note"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gold-100/80 leading-relaxed line-clamp-3">
                  {note.content}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-gold-100/50">
                  <span className="flex items-center gap-1.5 rounded bg-navy-900/50 px-2 py-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      note.priority === 'HIGH' ? 'bg-rose-500' :
                      note.priority === 'MEDIUM' ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}></span>
                    {note.priority}
                  </span>
                  
                  <span className="flex items-center gap-1.5 rounded bg-navy-900/50 px-2 py-1">
                    {note.status}
                  </span>

                  {note.attachments && note.attachments.length > 0 && (
                    <span className="flex items-center gap-1.5 rounded bg-navy-900/50 px-2 py-1">
                      <Paperclip className="h-3 w-3" />
                      {note.attachments.length} Attachment{note.attachments.length > 1 ? 's' : ''}
                    </span>
                  )}
                  
                  {note.history && note.history.length > 0 && (
                    <span className="flex items-center gap-1.5 rounded bg-navy-900/50 px-2 py-1">
                      <Clock className="h-3 w-3" />
                      Edited
                    </span>
                  )}
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
