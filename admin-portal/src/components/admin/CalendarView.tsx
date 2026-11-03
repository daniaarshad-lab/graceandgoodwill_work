import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Shield,
  MapPin,
  AlertTriangle,
  FileText,
  Filter,
  CheckCircle2,
  X,
  Plus,
  RefreshCw,
  Info,
} from 'lucide-react';
import { usePlatformStore, CalendarPlacementEvent } from '../../data/platformStore';

export const CalendarView: React.FC = () => {
  const { calendarEvents, careRequests } = usePlatformStore();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [currentMonth, setCurrentMonth] = useState('October 2024');
  const [selectedEvent, setSelectedEvent] = useState<CalendarPlacementEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [unscheduledDrawerOpen, setUnscheduledDrawerOpen] = useState(true);

  // Unscheduled requests (those that have no confirmed start date or are in draft/new enquiry)
  const unscheduledRequests = careRequests.filter(
    (c) => c.stage === 'New Enquiries' || c.approvalStatus === 'Draft' || !c.preferredStart
  );

  const filteredEvents = calendarEvents.filter((ev) => {
    const matchesStatus = filterStatus === 'all' || ev.type === filterStatus;
    const matchesLocation = filterLocation === 'all' || ev.location.includes(filterLocation);
    return matchesStatus && matchesLocation;
  });

  const getEventStyle = (type: CalendarPlacementEvent['type']) => {
    switch (type) {
      case 'confirmed_ongoing':
        return {
          bg: 'bg-sky-100 border-sky-300 text-sky-900',
          dot: 'bg-sky-500',
          label: 'Confirmed Ongoing',
        };
      case 'confirmed_future':
        return {
          bg: 'bg-emerald-100 border-emerald-300 text-emerald-900',
          dot: 'bg-emerald-500',
          label: 'Confirmed Future',
        };
      case 'published_awaiting':
        return {
          bg: 'bg-amber-100 border-amber-300 text-amber-900',
          dot: 'bg-amber-500',
          label: 'Published Awaiting Carers',
        };
      case 'urgent_unmatched':
        return {
          bg: 'bg-rose-100 border-rose-300 text-rose-900 font-semibold',
          dot: 'bg-rose-500',
          label: 'Urgent Unmatched',
        };
      case 'draft_awaiting_approval':
        return {
          bg: 'bg-slate-100 border-slate-300 text-slate-700',
          dot: 'bg-slate-400',
          label: 'Draft / Awaiting Approval',
        };
      default:
        return {
          bg: 'bg-slate-100 border-slate-300 text-slate-700',
          dot: 'bg-slate-400',
          label: 'Unspecified',
        };
    }
  };

  // Calendar matrix for demonstration (October 2024)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Sample month grid days (Oct 2024 starts on Tuesday)
  const calendarDays = [
    { day: 30, month: 'prev', dateStr: '2024-09-30' },
    { day: 1, month: 'curr', dateStr: '2024-10-01' },
    { day: 2, month: 'curr', dateStr: '2024-10-02' },
    { day: 3, month: 'curr', dateStr: '2024-10-03' },
    { day: 4, month: 'curr', dateStr: '2024-10-04' },
    { day: 5, month: 'curr', dateStr: '2024-10-05' },
    { day: 6, month: 'curr', dateStr: '2024-10-06' },
    { day: 7, month: 'curr', dateStr: '2024-10-07' },
    { day: 8, month: 'curr', dateStr: '2024-10-08' },
    { day: 9, month: 'curr', dateStr: '2024-10-09' },
    { day: 10, month: 'curr', dateStr: '2024-10-10' },
    { day: 11, month: 'curr', dateStr: '2024-10-11' },
    { day: 12, month: 'curr', dateStr: '2024-10-12', isToday: true },
    { day: 13, month: 'curr', dateStr: '2024-10-13' },
    { day: 14, month: 'curr', dateStr: '2024-10-14' },
    { day: 15, month: 'curr', dateStr: '2024-10-15' },
    { day: 16, month: 'curr', dateStr: '2024-10-16' },
    { day: 17, month: 'curr', dateStr: '2024-10-17' },
    { day: 18, month: 'curr', dateStr: '2024-10-18' },
    { day: 19, month: 'curr', dateStr: '2024-10-19' },
    { day: 20, month: 'curr', dateStr: '2024-10-20' },
    { day: 21, month: 'curr', dateStr: '2024-10-21' },
    { day: 22, month: 'curr', dateStr: '2024-10-22' },
    { day: 23, month: 'curr', dateStr: '2024-10-23' },
    { day: 24, month: 'curr', dateStr: '2024-10-24' },
    { day: 25, month: 'curr', dateStr: '2024-10-25' },
    { day: 26, month: 'curr', dateStr: '2024-10-26' },
    { day: 27, month: 'curr', dateStr: '2024-10-27' },
    { day: 28, month: 'curr', dateStr: '2024-10-28' },
    { day: 29, month: 'curr', dateStr: '2024-10-29' },
    { day: 30, month: 'curr', dateStr: '2024-10-30' },
    { day: 31, month: 'curr', dateStr: '2024-10-31' },
    { day: 1, month: 'next', dateStr: '2024-11-01' },
    { day: 2, month: 'next', dateStr: '2024-11-02' },
    { day: 3, month: 'next', dateStr: '2024-11-03' },
  ];

  // Helper to map event to days
  const getEventsForDay = (dateStr: string) => {
    return filteredEvents.filter((ev) => {
      if (ev.endDateISO && ev.startDateISO <= dateStr && ev.endDateISO >= dateStr) return true;
      if (ev.startDateISO === dateStr) return true;
      return false;
    });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header & View Modes */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif text-[#060D1E] font-medium tracking-tight">
              Operational Care Calendar
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#B88E3E] font-medium border border-[#D4AF7A]/30">
              Live Placements &amp; Rotations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual schedule of ongoing live-in care, upcoming starts, relief handovers, and published unallocated requests.
          </p>
        </div>

        {/* View Switcher and Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-[#D4AF7A]/40 rounded-xl px-2 py-1 shadow-2xs">
            <button
              onClick={() => setCurrentMonth('September 2024')}
              className="p-1 text-slate-500 hover:text-[#060D1E]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-[#060D1E] font-serif">
              {currentMonth}
            </span>
            <button
              onClick={() => setCurrentMonth('November 2024')}
              className="p-1 text-slate-500 hover:text-[#060D1E]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#F1EAD9] p-1 rounded-xl border border-[#D4AF7A]/20">
            {(['month', 'week', 'day', 'agenda'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  viewMode === m
                    ? 'bg-[#060D1E] text-[#FAF7F2] shadow-sm'
                    : 'text-slate-700 hover:text-[#060D1E]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => setUnscheduledDrawerOpen(!unscheduledDrawerOpen)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
              unscheduledDrawerOpen
                ? 'bg-[#060D1E] text-white border-[#060D1E]'
                : 'bg-white text-slate-700 border-[#D4AF7A]/40 hover:bg-[#FAF7F2]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#B88E3E]" />
            Unscheduled ({unscheduledRequests.length})
          </button>
        </div>
      </div>

      {/* Legend Bar (Exact Requirements Colors) */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E2D8C3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
            Color Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-sky-200 border border-sky-400" />
            <span className="text-slate-700 text-[11px]">Confirmed Ongoing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-200 border border-emerald-400" />
            <span className="text-slate-700 text-[11px]">Confirmed Future</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-200 border border-amber-400" />
            <span className="text-slate-700 text-[11px]">Published Awaiting Carer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-200 border border-rose-400" />
            <span className="text-rose-800 text-[11px] font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Urgent Unmatched
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-400" />
            <span className="text-slate-700 text-[11px]">Draft / Awaiting Approval</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 text-xs bg-[#FAF7F2] border border-[#D4AF7A]/30 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Placement Statuses</option>
            <option value="confirmed_ongoing">Confirmed Ongoing</option>
            <option value="confirmed_future">Confirmed Future</option>
            <option value="published_awaiting">Published Awaiting</option>
            <option value="urgent_unmatched">Urgent Unmatched</option>
            <option value="draft_awaiting_approval">Draft / Awaiting Approval</option>
          </select>
        </div>
      </div>

      {/* Main Grid + Unscheduled Drawer */}
      <div className="flex gap-6 items-start">
        {/* Calendar Area */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E2D8C3] shadow-xs overflow-hidden">
          {viewMode === 'month' && (
            <div className="grid grid-cols-7 border-b border-[#E2D8C3]">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="py-2.5 text-center text-xs font-semibold text-slate-500 bg-[#FAF7F2] border-r border-[#E2D8C3] last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>
          )}

          {viewMode === 'month' && (
            <div className="grid grid-cols-7 auto-rows-[120px] divide-x divide-y divide-[#E2D8C3]">
              {calendarDays.map((d, idx) => {
                const dayEvents = getEventsForDay(d.dateStr);
                const isCurrentMonth = d.month === 'curr';
                return (
                  <div
                    key={idx}
                    className={`p-1.5 flex flex-col justify-between overflow-hidden transition-colors ${
                      !isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'
                    } ${d.isToday ? 'bg-amber-50/20' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                          d.isToday
                            ? 'bg-[#B88E3E] text-white font-bold'
                            : isCurrentMonth
                            ? 'text-slate-700'
                            : 'text-slate-300'
                        }`}
                      >
                        {d.day}
                      </span>
                      {dayEvents.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Day Events Stack */}
                    <div className="space-y-1 overflow-y-auto flex-1">
                      {dayEvents.slice(0, 2).map((ev) => {
                        const style = getEventStyle(ev.type);
                        return (
                          <button
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className={`w-full text-left p-1 rounded-md border text-[10px] leading-tight truncate flex items-center gap-1 shadow-2xs hover:opacity-90 ${style.bg}`}
                          >
                            {ev.isEmergency && (
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                            )}
                            <span className="font-semibold truncate">{ev.clientName}</span>
                            {ev.carerName && (
                              <span className="opacity-80 truncate hidden sm:inline">
                                ({ev.carerName.split(' ')[0]})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Agenda View */}
          {viewMode === 'agenda' && (
            <div className="divide-y divide-[#E2D8C3] p-4">
              {filteredEvents.map((ev) => {
                const style = getEventStyle(ev.type);
                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="py-3 px-4 hover:bg-[#FAF7F2] rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-3 h-3 rounded-full ${style.dot}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#060D1E]">
                            {ev.clientName}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${style.bg}`}
                          >
                            {style.label}
                          </span>
                          {ev.isEmergency && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" /> Urgent
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Dates: {ev.startDateISO} to {ev.endDateISO || 'Ongoing'} · Location: {ev.location}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-medium text-slate-700">
                        {ev.carerName ? `Carer: ${ev.carerName}` : 'Unallocated'}
                      </div>
                      <div className="text-[11px] text-[#B88E3E] font-medium">
                        {ev.statusLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Week & Day fallback view */}
          {(viewMode === 'week' || viewMode === 'day') && (
            <div className="p-8 text-center text-xs text-slate-500">
              <CalendarIcon className="w-8 h-8 text-[#B88E3E] mx-auto mb-2 opacity-60" />
              <p className="font-medium text-slate-700">
                Displaying condensed {viewMode} timeline.
              </p>
              <p className="mt-1">
                Please switch to Month or Agenda view for complete cross-client scheduling.
              </p>
            </div>
          )}
        </div>

        {/* Unscheduled Care Requests Sidebar */}
        {unscheduledDrawerOpen && (
          <div className="w-80 bg-white rounded-2xl border border-[#E2D8C3] p-4 shadow-xs shrink-0 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2D8C3]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B88E3E]" />
                <h3 className="font-serif font-bold text-xs text-[#060D1E]">
                  Unscheduled Requests
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                {unscheduledRequests.length} Pending
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              Care requests without confirmed start dates or currently in draft/awaiting approval stages.
            </p>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {unscheduledRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3] hover:border-[#B88E3E] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#060D1E] mb-1">
                    <span>{req.displayTitle}</span>
                    <span className="text-[10px] text-amber-800 font-normal">
                      {req.approvalStatus === 'Draft' ? 'Draft' : 'Awaiting Approval'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Ref: {req.id} · {req.location}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-[#B88E3E] font-medium">
                      Agreed: £{req.agreedClientWeeklyFee || 1400}/wk
                    </span>
                    <button
                      onClick={() =>
                        setSelectedEvent({
                          id: `temp-${req.id}`,
                          title: req.displayTitle,
                          clientName: req.displayTitle,
                          carerName: 'Carer Matching in Progress',
                          location: req.location || 'London',
                          startDateISO: '2024-10-20',
                          endDateISO: '2024-11-03',
                          type: 'published_awaiting',
                          colorCategory: 'yellow',
                          isEmergency: false,
                          statusLabel: 'Published Awaiting Carer',
                          responsibleAdmin: 'Jessica Smith',
                          linkedRequestId: req.id,
                        })
                      }
                      className="px-2 py-1 bg-[#060D1E] text-white rounded text-[10px] hover:bg-slate-800"
                    >
                      Allocate Dates
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#D4AF7A]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D8C3] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-[#060D1E]">
                  Placement Schedule Details
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedEvent.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E2D8C3]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Client</span>
                  <span className="font-semibold text-slate-800">{selectedEvent.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Allocated Carer</span>
                  <span className="font-semibold text-slate-800">
                    {selectedEvent.carerName || 'Unallocated / Awaiting Applications'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Placement Schedule</span>
                  <span className="text-slate-800 font-medium">
                    {selectedEvent.startDateISO} to {selectedEvent.endDateISO || 'Ongoing'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status &amp; Category</span>
                  <span className="text-slate-800 font-medium">
                    {selectedEvent.statusLabel} ({selectedEvent.colorCategory})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="text-slate-800 font-medium">
                    {selectedEvent.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Responsible Admin</span>
                  <span className="text-slate-800 font-semibold">
                    {selectedEvent.responsibleAdmin}
                  </span>
                </div>
              </div>

              {selectedEvent.reliefDates && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                  <span className="text-blue-900 font-semibold block text-[11px]">
                    Confirmed Relief Rotations / Dates:
                  </span>
                  <p className="text-blue-800 text-[11px] mt-0.5">
                    {selectedEvent.reliefDates}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
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
