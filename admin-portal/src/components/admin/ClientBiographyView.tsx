import React, { useEffect, useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  FileText,
  Heart,
  Home,
  MapPin,
  Maximize2,
  MessageCircle,
  Pause,
  Play,
  Plus,
  Save,
  Star,
  User,
  Video,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { DEFAULT_ELEANOR_THOMAS_AVATAR } from '../../data/clientProfileImages';
import { usePlatformStore } from '../../data/platformStore';
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface ClientBiographyViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

export const ClientBiographyView: React.FC<ClientBiographyViewProps> = ({
  onBack,
  onNavigate,
}) => {
  const { clientAvatars } = usePlatformStore();
  const avatarUrl = clientAvatars['eleanor-thomas'] || DEFAULT_ELEANOR_THOMAS_AVATAR;

  const [editingBio, setEditingBio] = useState(false);
  const [editingLifestyle, setEditingLifestyle] = useState(false);
  const [editingRoutines, setEditingRoutines] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState(false);
  const [editingHobbies, setEditingHobbies] = useState(false);
  const [editingLanguages, setEditingLanguages] = useState(false);
  const [editingCommNotes, setEditingCommNotes] = useState(false);

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoSeconds, setVideoSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [quote, setQuote] = useState(
    'I’m a friendly and independent person who still loves an active life, good conversation and spending time outdoors.'
  );
  const [bioSummary, setBioSummary] = useState(
    'Eleanor is an intelligent, warm and sociable person who values her independence. She enjoys a calm and structured routine, loves being outdoors, and takes a keen interest in the arts and current affairs. She is looking for a carer who is kind, reliable and shares her interest in meaningful conversation.'
  );

  const [lifestyleText, setLifestyleText] = useState(
    'Eleanor enjoys a balanced and fulfilling lifestyle. She likes to spend time in her garden, attend local art exhibitions, and maintain an active social life with family and friends. She values a calm home environment and enjoys regular outings, cultural events and staying informed about current affairs.'
  );

  const [routines, setRoutines] = useState([
    { id: 'r1', time: '7:30am', activity: 'Wakes up and enjoys a cup of tea' },
    { id: 'r2', time: '8:00am', activity: 'Breakfast and reads the newspaper' },
    { id: 'r3', time: '10:00am', activity: 'Short walk or light exercise' },
    { id: 'r4', time: '12:00pm', activity: 'Lunch' },
    { id: 'r5', time: 'Afternoon', activity: 'Hobbies, gardening or social activities' },
    { id: 'r6', time: '6:00pm', activity: 'Dinner' },
    { id: 'r7', time: 'Evening', activity: 'TV, reading or phone calls with family' },
    { id: 'r8', time: '10:00pm', activity: 'Bedtime' },
  ]);

  const [preferences, setPreferences] = useState([
    'A calm and respectful approach',
    'Support with maintaining independence',
    'Enjoys companionship and conversation',
    'Prefers female carers',
    'Comfortable with outings and appointments',
    'Values punctuality and reliability',
    'Enjoys home-cooked meals',
    'Likes a tidy and organised home',
  ]);
  const [newPreference, setNewPreference] = useState('');

  const [personalityTraits, setPersonalityTraits] = useState([
    'Warm',
    'Sociable',
    'Independent',
    'Intelligent',
    'Positive',
    'Thoughtful',
    'Gentle',
    'Great sense of humour',
  ]);
  const [newTrait, setNewTrait] = useState('');

  const [hobbies, setHobbies] = useState([
    'Gardening',
    'Art & Exhibitions',
    'Music',
    'Reading',
    'Theatre',
    'Current Affairs',
    'Travel',
  ]);
  const [newHobby, setNewHobby] = useState('');

  const [spokenLanguages, setSpokenLanguages] = useState([
    { id: 'l1', code: 'GB', language: 'English', proficiency: 'Native' },
    { id: 'l2', code: 'FR', language: 'French', proficiency: 'Conversational' },
  ]);
  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] = useState('Conversational');

  const [communicationNotes, setCommunicationNotes] = useState(
    'Eleanor prefers clear, honest communication. She enjoys regular updates and likes to be involved in decisions about her care and support. She values kindness, patience and a good sense of humour.'
  );

  useEffect(() => {
    if (!isPlayingVideo) return;
    const timer = window.setInterval(() => {
      setVideoSeconds((prev) => {
        if (prev >= 168) {
          setIsPlayingVideo(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlayingVideo]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 relative overflow-hidden">
      {/* Background Grace & Goodwill 3D Gold Knot Watermark */}
      <div className="absolute top-0 right-0 w-[420px] sm:w-[540px] lg:w-[620px] h-48 sm:h-56 pointer-events-none select-none z-0 overflow-hidden opacity-[0.20]">
        <img
          src="/website_logo.png"
          alt=""
          className="w-full h-full object-contain object-right filter brightness-110 contrast-110"
        />
      </div>

      {/* Unified Client Section Navigation */}
      {onNavigate && (
        <ClientSectionNav currentView="client-biography" onNavigate={onNavigate} />
      )}

      {/* Breadcrumbs */}
      <div className="relative z-10 flex items-center gap-2 text-xs text-[#7D7362]">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-[#0A1629] transition-colors cursor-pointer"
        >
          Clients
        </button>
        <span>&gt;</span>
        <span>Eleanor Thomas</span>
        <span>&gt;</span>
        <span className="font-semibold text-[#0A1629]">Biography</span>
      </div>

      {/* Page Heading */}
      <div className="relative z-10 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-[36px] font-semibold text-[#0A1629] tracking-tight leading-tight">
          Client Biography
        </h1>
        <p className="text-sm text-[#5C5549] mt-1.5 leading-relaxed">
          Get to know the person behind the profile. A deeper understanding helps us find the right
          carer and create the best possible support.
        </p>
      </div>

      {/* HERO PROFILE & INTRODUCTION VIDEO CARD */}
      <div className="relative z-10 bg-white rounded-2xl p-5 sm:p-6 border border-[#EAE3D4] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Portrait Photo with Change Photo Button */}
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden min-h-[280px] bg-[#FAF7F2] border border-[#EAE3D4]">
          <img
            src={avatarUrl}
            alt="Eleanor Thomas"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onNavigate?.('client-portal-profile')}
            className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A1629]/80 hover:bg-[#0A1629] text-white text-xs font-medium backdrop-blur-sm transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-[#D4AF7A]" />
            <span>Change photo</span>
          </button>
        </div>

        {/* Center: Name, Age/Location, Quote & Biography */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0A1629]">
                  Eleanor Thomas
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Active Client
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBio(!editingBio)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#B88E3E]" />
                  <span>{editingBio ? 'Done' : 'Edit Profile'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingBio(false);
                    showToast('Client biography saved as draft.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A1629] hover:bg-[#132544] text-[#EBD8B2] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#D4AF7A]" />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#334155]">
              <span>Age 82</span>
              <span className="text-[#D5CBB8]" aria-hidden="true">
                |
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>Chelsea, London</span>
              </span>
            </div>

            {editingBio ? (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-[#7D7362] mb-1">
                    Personal Quote
                  </label>
                  <textarea
                    rows={2}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#B88E3E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#7D7362] mb-1">
                    Biography Summary
                  </label>
                  <textarea
                    rows={4}
                    value={bioSummary}
                    onChange={(e) => setBioSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] focus:outline-none focus:border-[#B88E3E]"
                  />
                </div>
              </div>
            ) : (
              <>
                <blockquote className="pt-1 flex items-start gap-2">
                  <span className="font-serif text-3xl leading-none text-[#C5A059] select-none">
                    &ldquo;
                  </span>
                  <p className="font-serif italic text-base sm:text-[17px] text-[#1E293B] leading-snug">
                    {quote}&rdquo;
                  </p>
                </blockquote>

                <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                  {bioSummary}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right: Introduction Video Player */}
        <div className="lg:col-span-4 flex flex-col justify-end">
          <div className="relative rounded-2xl overflow-hidden bg-[#0A1629] border border-[#EAE3D4] h-60 sm:h-64 group">
            <img
              src={avatarUrl}
              alt="Eleanor Thomas Introduction Video"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isPlayingVideo ? 'scale-105 brightness-95' : 'brightness-90'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />

            {/* Top-right Video Label */}
            <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/65 text-white text-[11px] font-medium backdrop-blur-sm">
              <Video className="w-3.5 h-3.5 text-[#D4AF7A]" />
              <span>Introduction video</span>
            </div>

            {/* Center Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
              aria-label={isPlayingVideo ? 'Pause introduction video' : 'Play introduction video'}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/95 hover:bg-white text-[#0A1629] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              {isPlayingVideo ? (
                <Pause className="w-6 h-6 fill-[#0A1629]" />
              ) : (
                <Play className="w-6 h-6 fill-[#0A1629] ml-0.5" />
              )}
            </button>

            {/* Bottom Controls Scrubber */}
            <div className="absolute bottom-0 inset-x-0 px-3.5 py-2.5 flex items-center gap-2.5 text-white text-[11px]">
              <button
                type="button"
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="hover:text-[#D4AF7A] cursor-pointer"
              >
                {isPlayingVideo ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>
              <span className="tabular-nums font-mono text-[10.5px]">
                {formatDuration(videoSeconds)} / 2:48
              </span>
              <input
                type="range"
                min={0}
                max={168}
                value={videoSeconds}
                onChange={(e) => setVideoSeconds(Number(e.target.value))}
                className="flex-1 h-1 accent-[#D4AF7A] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-[#D4AF7A] cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="hover:text-[#D4AF7A] cursor-pointer"
                aria-label="Fullscreen video"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: Lifestyle Overview | Daily Routines | Preferences */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* 1. Lifestyle Overview */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E]">
                <Home className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0A1629]">
                Lifestyle Overview
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingLifestyle(!editingLifestyle)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5C5549] hover:text-[#0A1629] underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingLifestyle ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          {editingLifestyle ? (
            <textarea
              rows={6}
              value={lifestyleText}
              onChange={(e) => setLifestyleText(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] leading-relaxed focus:outline-none focus:border-[#B88E3E]"
            />
          ) : (
            <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">{lifestyleText}</p>
          )}
        </div>

        {/* 2. Daily Routines */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E]">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0A1629]">Daily Routines</h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingRoutines(!editingRoutines)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5C5549] hover:text-[#0A1629] underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingRoutines ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {routines.map((routine, idx) => (
              <div key={routine.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className="w-2 h-2 rounded-full bg-[#C5A059] shrink-0" />
                  {idx < routines.length - 1 && (
                    <span className="w-px h-4 bg-[#EAE3D4] mt-0.5" />
                  )}
                </div>

                {editingRoutines ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={routine.time}
                      onChange={(e) =>
                        setRoutines((prev) =>
                          prev.map((r) =>
                            r.id === routine.id ? { ...r, time: e.target.value } : r
                          )
                        )
                      }
                      className="w-20 px-2 py-1 rounded-lg border border-[#DFD5C2] bg-[#FAF7F2] text-xs font-semibold text-[#0A1629]"
                    />
                    <input
                      type="text"
                      value={routine.activity}
                      onChange={(e) =>
                        setRoutines((prev) =>
                          prev.map((r) =>
                            r.id === routine.id ? { ...r, activity: e.target.value } : r
                          )
                        )
                      }
                      className="flex-1 px-2 py-1 rounded-lg border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629]"
                    />
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-12 gap-2">
                    <span className="col-span-4 font-semibold text-[#334155] tabular-nums">
                      {routine.time}
                    </span>
                    <span className="col-span-8 text-[#475569]">{routine.activity}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E]">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#0A1629]">Preferences</h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingPreferences(!editingPreferences)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5C5549] hover:text-[#0A1629] underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingPreferences ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <ul className="space-y-2 text-xs">
            {preferences.map((pref, idx) => (
              <li key={idx} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#8C6D2B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-[#334155]">{pref}</span>
                </div>
                {editingPreferences && (
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences(preferences.filter((_, itemIdx) => itemIdx !== idx))
                    }
                    className="text-[#8A8175] hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {editingPreferences && (
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                placeholder="Add preference..."
                className="flex-1 px-2.5 py-1.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newPreference.trim()) return;
                  setPreferences([...preferences, newPreference.trim()]);
                  setNewPreference('');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#0A1629] text-white text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: Personality | Interests & Hobbies | Spoken Languages | Communication Notes */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {/* 1. Personality */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E]">
                <User className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#0A1629]">Personality</h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingPersonality(!editingPersonality)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5C5549] hover:text-[#0A1629] underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingPersonality ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {personalityTraits.map((trait) => (
              <span
                key={trait}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] text-xs font-medium text-[#0A1629]"
              >
                <span>{trait}</span>
                {editingPersonality && (
                  <button
                    type="button"
                    onClick={() =>
                      setPersonalityTraits(personalityTraits.filter((t) => t !== trait))
                    }
                    className="text-[#8A8175] hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {editingPersonality && (
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newTrait}
                onChange={(e) => setNewTrait(e.target.value)}
                placeholder="Add trait..."
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#DFD5C2] bg-[#FAF7F2] text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newTrait.trim()) return;
                  setPersonalityTraits([...personalityTraits, newTrait.trim()]);
                  setNewTrait('');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0A1629] text-white text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 2. Interests & Hobbies */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E]">
                <Star className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#0A1629]">
                Interests &amp; Hobbies
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingHobbies(!editingHobbies)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5C5549] hover:text-[#0A1629] underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingHobbies ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {hobbies.map((hobby) => (
              <span
                key={hobby}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] text-xs font-medium text-[#0A1629]"
              >
                <span>{hobby}</span>
                {editingHobbies && (
                  <button
                    type="button"
                    onClick={() => setHobbies(hobbies.filter((h) => h !== hobby))}
                    className="text-[#8A8175] hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {editingHobbies && (
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="Add interest..."
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#DFD5C2] bg-[#FAF7F2] text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newHobby.trim()) return;
                  setHobbies([...hobbies, newHobby.trim()]);
                  setNewHobby('');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#0A1629] text-white text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 3. Spoken Languages */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E]">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#0A1629]">
                Spoken Languages
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingLanguages(!editingLanguages)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5C5549] hover:text-[#0A1629] underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingLanguages ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {spokenLanguages.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE3D4] text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0A1629] text-[#EBD8B2] text-[10px] font-bold flex items-center justify-center">
                    {item.code}
                  </span>
                  <span className="font-semibold text-[#0A1629]">{item.language}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#7D7362]">{item.proficiency}</span>
                  {editingLanguages && (
                    <button
                      type="button"
                      onClick={() =>
                        setSpokenLanguages(spokenLanguages.filter((l) => l.id !== item.id))
                      }
                      className="text-[#8A8175] hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {editingLanguages && (
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                  placeholder="Language"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#DFD5C2] bg-[#FAF7F2] text-xs"
                />
                <select
                  value={newLangProf}
                  onChange={(e) => setNewLangProf(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-[#DFD5C2] bg-[#FAF7F2] text-xs"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Conversational">Conversational</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!newLangName.trim()) return;
                    setSpokenLanguages([
                      ...spokenLanguages,
                      {
                        id: `lang-${Date.now()}`,
                        code: newLangName.trim().slice(0, 2).toUpperCase(),
                        language: newLangName.trim(),
                        proficiency: newLangProf,
                      },
                    ]);
                    setNewLangName('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0A1629] text-white text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Communication Notes */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAE3D4] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FAF6EE] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E]">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-[#0A1629]">
                Communication Notes
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingCommNotes(!editingCommNotes)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5C5549] hover:text-[#0A1629] underline cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#B88E3E]" />
              <span>{editingCommNotes ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          {editingCommNotes ? (
            <textarea
              rows={5}
              value={communicationNotes}
              onChange={(e) => setCommunicationNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] text-xs text-[#0A1629] leading-relaxed focus:outline-none focus:border-[#B88E3E]"
            />
          ) : (
            <p className="text-xs text-[#475569] leading-relaxed">{communicationNotes}</p>
          )}
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1629]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#060D1E] rounded-2xl border border-[#D4AF7A]/40 max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Video className="w-4 h-4 text-[#D4AF7A]" />
                <span>Eleanor Thomas — Client Introduction Video (2:48)</span>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={avatarUrl}
                alt="Eleanor Thomas Introduction"
                className="w-full h-full object-cover opacity-85"
              />
              <button
                type="button"
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="absolute w-16 h-16 rounded-full bg-white text-[#0A1629] flex items-center justify-center shadow-xl cursor-pointer"
              >
                {isPlayingVideo ? (
                  <Pause className="w-7 h-7 fill-[#0A1629]" />
                ) : (
                  <Play className="w-7 h-7 fill-[#0A1629] ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#060D1E] text-white px-4 py-3 rounded-2xl border border-[#D4AF7A] shadow-xl flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          <span className="text-[#EBD8B2] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
