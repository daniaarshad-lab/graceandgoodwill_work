import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Shield,
  FileText,
  Clock,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  Eye,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { usePlatformStore, PlatformAuditEntry } from '../../data/platformStore';

export const ReportsView: React.FC = () => {
  const { auditEntries, careRequests, placements } = usePlatformStore();

  const [activeTab, setActiveTab] = useState<'audit' | 'operational'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<string>('all');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<PlatformAuditEntry | null>(null);

  // Extract unique filter options
  const adminOptions = Array.from(new Set(auditEntries.map((e) => e.adminName))).filter(Boolean);
  const actionOptions = Array.from(new Set(auditEntries.map((e) => e.actionType))).filter(Boolean);
  const locationOptions = Array.from(new Set(auditEntries.map((e) => e.location))).filter(Boolean);

  const filteredEntries = auditEntries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.clientName && entry.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.carerName && entry.carerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      entry.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAdmin = selectedAdmin === 'all' || entry.adminName === selectedAdmin;
    const matchesAction = selectedActionType === 'all' || entry.actionType === selectedActionType;
    const matchesLocation = selectedLocation === 'all' || entry.location === selectedLocation;

    return matchesSearch && matchesAdmin && matchesAction && matchesLocation;
  });

  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'Action Type',
      'Responsible Admin',
      'Role',
      'Entity Type',
      'Entity ID',
      'Client Name',
      'Carer Name',
      'Location',
      'Description',
      'Previous Value',
      'New Value',
    ];

    const rows = filteredEntries.map((e) => [
      `"${e.timestamp}"`,
      `"${e.actionType}"`,
      `"${e.adminName}"`,
      `"${e.adminRole}"`,
      `"${e.entityType}"`,
      `"${e.entityId}"`,
      `"${e.clientName || ''}"`,
      `"${e.carerName || ''}"`,
      `"${e.location || ''}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${(e.previousValue || '').replace(/"/g, '""')}"`,
      `"${(e.newValue || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Grace_Goodwill_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeColor = (type: string) => {
    switch (type) {
      case 'client_approval':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'care_request_created':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'published_to_all_carers':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'carer_invited':
      case 'carer_invitation_accepted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pricing_agreement':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'substantive_edit':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'placement_confirmed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Operational metrics
  const draftsAwaitingApproval = careRequests.filter(
    (c) => c.approvalStatus === 'Draft' || c.approvalStatus === 'Awaiting client approval'
  );
  const liveAwaitingMatching = careRequests.filter(
    (c) => c.approvalStatus === 'Approved' && c.stage !== 'Placement Confirmed' && c.stage !== 'Care Commenced'
  );
  const activePlacements = placements.filter((p) => p.status === 'Active');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#060D1E] font-medium tracking-tight">
            Reports & Comprehensive Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident logs of every care request revision, client approval, staff delegation, pricing adjustment and distribution action.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#F1EAD9] p-1 rounded-xl border border-[#D4AF7A]/20">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'audit'
                  ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                  : 'text-slate-700 hover:text-[#060D1E]'
              }`}
            >
              Activity & Audit History
            </button>
            <button
              onClick={() => setActiveTab('operational')}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'operational'
                  ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                  : 'text-slate-700 hover:text-[#060D1E]'
              }`}
            >
              Operational Status Reports
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4AF7A]/40 rounded-xl text-xs font-semibold text-[#060D1E] hover:bg-[#FAF7F2] transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#B88E3E]" />
            Export CSV
          </button>
        </div>
      </div>

      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2D8C3] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by client, admin, carer, reference or action description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B88E3E]/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-xl text-slate-700 focus:outline-none"
              >
                <option value="all">All Administrators</option>
                {adminOptions.map((adm) => (
                  <option key={adm} value={adm}>
                    {adm}
                  </option>
                ))}
              </select>

              <select
                value={selectedActionType}
                onChange={(e) => setSelectedActionType(e.target.value)}
                className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-xl text-slate-700 focus:outline-none"
              >
                <option value="all">All Action Types</option>
                {actionOptions.map((act) => (
                  <option key={act} value={act}>
                    {act.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-xl text-slate-700 focus:outline-none"
              >
                <option value="all">All Locations</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E2D8C3] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-slate-600 font-semibold border-b border-[#E2D8C3]">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Action Type</th>
                    <th className="py-3 px-4">Responsible Actor</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Client / Location</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EAD9]">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No audit records match the current criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {entry.timestamp}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${getActionBadgeColor(
                              entry.actionType
                            )}`}
                          >
                            {entry.actionType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#060D1E]">{entry.adminName}</div>
                          <div className="text-[10px] text-slate-400">{entry.adminRole}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-700">{entry.entityId}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{entry.entityType}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{entry.clientName || '—'}</div>
                          <div className="text-[10px] text-slate-500">{entry.location || 'National'}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs text-slate-600 line-clamp-2">
                          {entry.description}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedEntry(entry)}
                            className="p-1.5 text-slate-400 hover:text-[#B88E3E] rounded-lg hover:bg-[#FAF7F2]"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'operational' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E2D8C3] shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>Drafts / Awaiting Approval</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#060D1E]">
                {draftsAwaitingApproval.length}
              </div>
              <p className="text-[11px] text-amber-700 mt-1">Requires client checkbox review</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2D8C3] shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>Live Matching Requests</span>
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#060D1E]">
                {liveAwaitingMatching.length}
              </div>
              <p className="text-[11px] text-purple-700 mt-1">Open for carer applications/invitations</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2D8C3] shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>Active Placements</span>
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#060D1E]">
                {activePlacements.length}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">Carer on site & care active</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2D8C3] shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                <span>Total Audit Events Logged</span>
                <FileCheck className="w-4 h-4 text-[#B88E3E]" />
              </div>
              <div className="text-3xl font-serif font-bold text-[#060D1E]">
                {auditEntries.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Fully compliant archive</p>
            </div>
          </div>

          {/* Operational Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Drafts awaiting client action */}
            <div className="bg-white rounded-2xl border border-[#E2D8C3] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-sm text-[#060D1E]">
                  Care Requests Awaiting Client Approval
                </h3>
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {draftsAwaitingApproval.length} pending
                </span>
              </div>
              <div className="space-y-3">
                {draftsAwaitingApproval.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-xs text-[#060D1E]">{req.displayTitle}</div>
                      <div className="text-[11px] text-slate-500">
                        Ref: {req.id} · Version: {req.version || 'v1.0'} · {req.location}
                      </div>
                      <div className="text-[10px] text-amber-800 font-medium mt-0.5">
                        Agreed Weekly Fee: £{req.agreedClientWeeklyFee || 1450} · Carer Pay: £{req.weeklyPayment || 950}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 bg-amber-100 text-amber-900 rounded-lg font-medium">
                      {req.approvalStatus === 'Draft' ? 'Draft' : 'Awaiting Review'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Requests Awaiting Placement */}
            <div className="bg-white rounded-2xl border border-[#E2D8C3] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-bold text-sm text-[#060D1E]">
                  Approved & Live Matching Requests
                </h3>
                <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  {liveAwaitingMatching.length} live
                </span>
              </div>
              <div className="space-y-3">
                {liveAwaitingMatching.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-xs text-[#060D1E]">{req.displayTitle}</div>
                      <div className="text-[11px] text-slate-500">
                        Approved by {typeof req.clientApprovedBy === 'object' ? req.clientApprovedBy.name : (req.clientApprovedBy || 'Client')} · Distribution: {req.distributionOption || 'broadcast'}
                      </div>
                      <div className="text-[10px] text-emerald-800 font-medium mt-0.5">
                        Carers invited / applied: {req.invitedCarers?.length || 0}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-900 rounded-lg font-medium">
                      Live for Matching
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#D4AF7A]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D8C3] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#060D1E]">
                  Audit Record Details
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  ID: {selectedEntry.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Actor</span>
                  <span className="font-semibold text-slate-800">
                    {selectedEntry.adminName} ({selectedEntry.adminRole})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timestamp</span>
                  <span className="font-mono text-slate-800">{selectedEntry.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Action Type</span>
                  <span className="font-semibold text-slate-800">
                    {selectedEntry.actionType.replace(/_/g, ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Entity Reference</span>
                  <span className="font-mono text-slate-800">{selectedEntry.entityId}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-medium block mb-1">Description:</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-200">
                  {selectedEntry.description}
                </p>
              </div>

              {(selectedEntry.previousValue || selectedEntry.newValue) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 font-medium block mb-1 text-[11px]">
                      Previous Value:
                    </span>
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-[11px] font-mono whitespace-pre-wrap">
                      {selectedEntry.previousValue || 'None / Not recorded'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block mb-1 text-[11px]">
                      New Value:
                    </span>
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] font-mono whitespace-pre-wrap">
                      {selectedEntry.newValue || 'Not recorded'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 text-xs bg-[#060D1E] text-white rounded-lg hover:bg-slate-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
