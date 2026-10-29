import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  Edit2,
  Globe,
  Heart,
  Home,
  Info,
  Mail,
  MapPin,
  Calendar,
  PawPrint,
  Phone,
  Search,
  Send,
  Upload,
  User,
  Users,
  X,
  CheckCircle2,
} from 'lucide-react';
import { CLIENT_PROFILE_AVATAR_PRESETS } from '../../data/clientProfileImages';
import { usePlatformStore } from '../../data/platformStore';
import { AdminView } from './AdminSidebar';
import { ClientSectionNav } from './ClientSectionNav';

interface ClientProfilePortalViewProps {
  onBack: () => void;
  onNavigate?: (view: AdminView) => void;
}

const LANGUAGE_SUGGESTIONS = [
  'English',
  'Portuguese',
  'French',
  'Arabic',
  'Spanish',
  'Italian',
  'German',
  'Polish',
  'Welsh',
  'Hindi',
  'Urdu',
  'Mandarin',
  'Greek',
];

const HOME_ENVIRONMENT_OPTIONS = [
  'Bungalow',
  'Terraced house',
  'Semi-detached',
  'Detached house',
  'Flat / Apartment',
  'Ground floor bedroom',
  'Lift access',
  'Shared bathroom',
  'Ensuite',
  'WiFi',
  'Garden',
  'Parking',
];

const LIFESTYLE_PETS_OPTIONS = [
  'Smokes',
  'No smoking',
  'Dog(s)',
  'Cat(s)',
  'Bird(s)',
  'Pet mouse',
  'Other pets',
];

const PREFERENCES_INTERESTS_OPTIONS = [
  'Reading',
  'Music',
  'Television',
  'Gardening',
  'Faith',
  'Walks',
  'Flowers',
  'Pets',
  'Quiet routine',
];

export const ClientProfilePortalView: React.FC<ClientProfilePortalViewProps> = ({
  onBack,
  onNavigate,
}) => {
  const {
    clientAvatars,
    setClientAvatar,
    clientUploadedPhotos,
    addClientUploadedPhoto,
  } = usePlatformStore();

  const [selectedClientKey, setSelectedClientKey] = useState<'margaret-lewis' | 'eleanor-thomas'>(
    'margaret-lewis'
  );
  const [editingProfile, setEditingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [clientDetails, setClientDetails] = useState({
    'margaret-lewis': {
      name: 'Margaret Lewis',
      location: 'Chester, Cheshire',
      joined: 'Joined Feb 2023',
    },
    'eleanor-thomas': {
      name: 'Eleanor Thomas',
      location: 'Chelsea, London',
      joined: 'Joined May 2024',
    },
  });

  const [languages, setLanguages] = useState<string[]>([
    'English',
    'Portuguese',
    'French',
    'Arabic',
  ]);
  const [languageQuery, setLanguageQuery] = useState('');

  const [homeEnvironment, setHomeEnvironment] = useState<string[]>([
    'Ground floor bedroom',
    'Lift access',
    'Ensuite',
    'WiFi',
    'Garden',
  ]);

  const [lifestylePets, setLifestylePets] = useState<string[]>(['No smoking', 'Dog(s)']);

  const [preferencesInterests, setPreferencesInterests] = useState<string[]>([
    'Reading',
    'Music',
    'Gardening',
    'Walks',
    'Flowers',
  ]);

  const [referralForm, setReferralForm] = useState({
    friendName: '',
    phone: '',
    email: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeClient = clientDetails[selectedClientKey];
  const currentAvatar =
    clientAvatars[selectedClientKey] || CLIENT_PROFILE_AVATAR_PRESETS[0].url;
  const storedPhotos = clientUploadedPhotos[selectedClientKey] || [];
  const storedCount = Math.min(10, Math.max(1, storedPhotos.length));

  const toggleSelection = (
    item: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setter(list.filter((entry) => entry !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - storedPhotos.length;
    if (remainingSlots <= 0) {
      showToast('Maximum of 10 stored profile photos reached.');
      e.target.value = '';
      return;
    }

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = typeof reader.result === 'string' ? reader.result : '';
          if (!dataUrl) return;
          const label = file.name.replace(/\.[^/.]+$/, '').slice(0, 18) || 'Uploaded photo';
          addClientUploadedPhoto(selectedClientKey, {
            id: `upload-${Date.now()}-${index}`,
            label,
            url: dataUrl,
          });
          setClientAvatar(selectedClientKey, dataUrl);
          showToast('Profile image uploaded and set as your active display photo.');
        };
        reader.readAsDataURL(file);
      });

    e.target.value = '';
  };

  const filteredLanguageSuggestions = LANGUAGE_SUGGESTIONS.filter(
    (lang) =>
      !languages.includes(lang) &&
      lang.toLowerCase().includes(languageQuery.trim().toLowerCase())
  );

  const handleSendReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralForm.friendName.trim() || (!referralForm.phone.trim() && !referralForm.email.trim())) {
      showToast('Please enter your friend’s name and a phone number or email address.');
      return;
    }
    showToast(`Thank you — referral for ${referralForm.friendName.trim()} has been sent to Grace & Goodwill.`);
    setReferralForm({ friendName: '', phone: '', email: '' });
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
        <ClientSectionNav currentView="client-portal-profile" onNavigate={onNavigate} />
      )}

      {/* Top Breadcrumb + Client Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7D7362] hover:text-[#0A1629] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clients</span>
        </button>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#EAE3D4] text-xs shadow-sm">
          <span className="text-[#7D7362]">Client Portal Profile:</span>
          <select
            value={selectedClientKey}
            onChange={(e) =>
              setSelectedClientKey(e.target.value as 'margaret-lewis' | 'eleanor-thomas')
            }
            className="font-semibold text-[#0A1629] bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="margaret-lewis">Margaret Lewis (Chester, Cheshire)</option>
            <option value="eleanor-thomas">Eleanor Thomas (Chelsea, London)</option>
          </select>
        </div>
      </div>

      {/* Page Title & Edit Profile Button */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-[34px] font-semibold text-[#0A1629] tracking-tight leading-tight">
            Client Profile
          </h1>
          <p className="text-sm text-[#5C5549] mt-1">
            View and manage client details, preferences and important information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (editingProfile) {
              showToast('Client profile details updated.');
            }
            setEditingProfile(!editingProfile);
          }}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#DFD5C2] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#0A1629] shadow-sm transition-colors cursor-pointer"
        >
          {editingProfile ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Done Editing</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      {/* ROW 1: Client Portrait Card + Choose a Profile Image */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Client Portrait & Summary */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full p-1.5 bg-gradient-to-tr from-[#C5A059] via-[#EBD8B2] to-[#B88E3E] shadow-sm">
              <img
                src={currentAvatar}
                alt={activeClient.name}
                className="w-full h-full rounded-full object-cover bg-[#FAF7F2]"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload profile photo"
              className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#B88E3E] hover:bg-[#A17B32] text-white border-2 border-white flex items-center justify-center shadow-sm transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {editingProfile ? (
            <div className="w-full max-w-xs space-y-2">
              <input
                type="text"
                value={activeClient.name}
                onChange={(e) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    [selectedClientKey]: {
                      ...prev[selectedClientKey],
                      name: e.target.value,
                    },
                  }))
                }
                className="w-full text-center font-serif text-2xl font-semibold text-[#0A1629] px-3 py-1 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] focus:outline-none focus:border-[#B88E3E]"
              />
              <input
                type="text"
                value={activeClient.location}
                onChange={(e) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    [selectedClientKey]: {
                      ...prev[selectedClientKey],
                      location: e.target.value,
                    },
                  }))
                }
                className="w-full text-center text-xs text-[#5C5549] px-3 py-1.5 rounded-xl border border-[#DFD5C2] bg-[#FAF7F2] focus:outline-none focus:border-[#B88E3E]"
              />
            </div>
          ) : (
            <>
              <h2 className="font-serif text-2xl sm:text-[28px] font-semibold text-[#0A1629] leading-tight">
                {activeClient.name}
              </h2>
              <div className="text-xs font-semibold text-[#8C6D2B] mt-1">Client</div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#5C5549] mt-3 pt-3 border-t border-[#F2ECE0] w-full">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B88E3E]" />
                  <span>{activeClient.location}</span>
                </span>
                <span className="text-[#D5CBB8]" aria-hidden="true">
                  |
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B88E3E]" />
                  <span>{activeClient.joined}</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right: Choose a Profile Image */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm flex flex-col justify-between space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                  Choose a profile image
                </h3>
                <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
                  Choose from our suggestions or upload your own photo. You can store up to 10
                  profile pictures and choose one as your display image.
                </p>
              </div>
            </div>

            {/* 1 of 10 photos counter + progress bar */}
            <div className="sm:text-right shrink-0 min-w-[130px]">
              <div className="text-xs font-semibold text-[#5C5549] tabular-nums">
                {storedCount} of 10 photos
              </div>
              <div className="w-full sm:w-32 h-2 bg-[#F2ECE0] rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-[#C5A059] to-[#B88E3E] rounded-full transition-all duration-300"
                  style={{ width: `${(storedCount / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 10 Suggested Profile Images + Upload Your Own Photo */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-1">
            {CLIENT_PROFILE_AVATAR_PRESETS.map((preset) => {
              const isSelected = currentAvatar === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setClientAvatar(selectedClientKey, preset.url);
                    showToast(`Selected "${preset.label}" as your display profile image.`);
                  }}
                  className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
                >
                  <div
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 transition-all ${
                      isSelected
                        ? 'ring-2 ring-[#B88E3E] bg-[#FAF6EE] scale-105'
                        : 'hover:ring-2 hover:ring-[#D4AF7A]/60 bg-transparent'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full rounded-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-[#C5A059] text-white border-2 border-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs leading-tight text-center ${
                      isSelected
                        ? 'font-semibold text-[#0A1629]'
                        : 'text-[#5C5549] group-hover:text-[#0A1629]'
                    }`}
                  >
                    {preset.label}
                  </span>
                </button>
              );
            })}

            {/* Upload Your Own Photo */}
            <div className="col-span-3 sm:col-span-2 flex items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 sm:h-26 rounded-full border border-[#DFD5C2] bg-[#FAF7F2] hover:bg-white hover:border-[#B88E3E] flex flex-col items-center justify-center gap-1.5 px-4 text-center transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-white border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] group-hover:scale-105 transition-transform">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#0A1629] leading-tight">
                  Upload your own
                  <br />
                  photo
                </span>
              </button>
            </div>
          </div>

          {/* Stored Client Photos Strip (Allows Switching Back to Portrait or Custom Uploads) */}
          {storedPhotos.length > 0 && (
            <div className="pt-3 border-t border-[#F2ECE0] flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold text-[#7D7362]">
                Your stored photos ({storedPhotos.length}/10):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {storedPhotos.map((photo) => {
                  const isCurrent = currentAvatar === photo.url;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => {
                        setClientAvatar(selectedClientKey, photo.url);
                        showToast(`Switched display image to "${photo.label}".`);
                      }}
                      className={`inline-flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border text-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#B88E3E] bg-[#FAF6EE] font-semibold text-[#0A1629]'
                          : 'border-[#EAE3D4] bg-white text-[#5C5549] hover:border-[#D4AF7A]'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="max-w-[120px] truncate">{photo.label}</span>
                      {isCurrent && <Check className="w-3 h-3 text-[#B88E3E]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Languages + Home Environment */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Languages */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Languages</h3>
              <p className="text-xs text-[#5C5549] mt-0.5">
                Select the languages you speak or are comfortable with.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguages(languages.filter((item) => item !== lang))}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5EFE3] hover:bg-[#EDE3D0] border border-[#E2D6C1] text-xs font-semibold text-[#0A1629] transition-colors cursor-pointer"
              >
                <span>{lang}</span>
                <X className="w-3.5 h-3.5 text-[#7D7362]" />
              </button>
            ))}

            <div className="relative flex-1 min-w-[210px]">
              <Search className="w-3.5 h-3.5 text-[#8A8175] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={languageQuery}
                onChange={(e) => setLanguageQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && languageQuery.trim()) {
                    e.preventDefault();
                    const formatted = languageQuery.trim();
                    if (!languages.includes(formatted)) {
                      setLanguages([...languages, formatted]);
                    }
                    setLanguageQuery('');
                  }
                }}
                placeholder="Start typing a language..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] focus:bg-white focus:border-[#B88E3E] text-xs text-[#0A1629] placeholder-[#8A8175] outline-none"
              />
              {languageQuery.trim().length > 0 && filteredLanguageSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-[#EAE3D4] rounded-xl shadow-lg py-1 z-20 max-h-40 overflow-y-auto">
                  {filteredLanguageSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setLanguages([...languages, suggestion]);
                        setLanguageQuery('');
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-[#0A1629] hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Home Environment */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Home Environment</h3>
              <p className="text-xs text-[#5C5549] mt-0.5">
                Tell us about your home and living arrangements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {HOME_ENVIRONMENT_OPTIONS.map((option) => {
              const selected = homeEnvironment.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleSelection(option, homeEnvironment, setHomeEnvironment)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#F5EBD6] border-[#D4AF7A] text-[#0A1629] font-semibold'
                      : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#5C5549] hover:border-[#D4AF7A]'
                  }`}
                >
                  {selected && (
                    <span className="w-4 h-4 rounded-full bg-[#B88E3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                  )}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 3: Lifestyle & Pets + Preferences & Interests */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lifestyle & Pets */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] shrink-0">
              <PawPrint className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                Lifestyle &amp; Pets
              </h3>
              <p className="text-xs text-[#5C5549] mt-0.5">
                Let us know about your lifestyle and any pets.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {LIFESTYLE_PETS_OPTIONS.map((option) => {
              const selected = lifestylePets.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (option === 'Smokes') {
                      setLifestylePets((prev) =>
                        prev.includes('Smokes')
                          ? prev.filter((x) => x !== 'Smokes')
                          : [...prev.filter((x) => x !== 'No smoking'), 'Smokes']
                      );
                      return;
                    }
                    if (option === 'No smoking') {
                      setLifestylePets((prev) =>
                        prev.includes('No smoking')
                          ? prev.filter((x) => x !== 'No smoking')
                          : [...prev.filter((x) => x !== 'Smokes'), 'No smoking']
                      );
                      return;
                    }
                    toggleSelection(option, lifestylePets, setLifestylePets);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#F5EBD6] border-[#D4AF7A] text-[#0A1629] font-semibold'
                      : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#5C5549] hover:border-[#D4AF7A]'
                  }`}
                >
                  {selected && (
                    <span className="w-4 h-4 rounded-full bg-[#B88E3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                  )}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferences & Interests */}
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] shrink-0">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
                Preferences &amp; Interests
              </h3>
              <p className="text-xs text-[#5C5549] mt-0.5">
                Select the activities and interests you enjoy.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {PREFERENCES_INTERESTS_OPTIONS.map((option) => {
              const selected = preferencesInterests.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    toggleSelection(option, preferencesInterests, setPreferencesInterests)
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#F5EBD6] border-[#D4AF7A] text-[#0A1629] font-semibold'
                      : 'bg-[#FAF7F2] border-[#EAE3D4] text-[#5C5549] hover:border-[#D4AF7A]'
                  }`}
                >
                  {selected && (
                    <span className="w-4 h-4 rounded-full bg-[#B88E3E] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                  )}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 4: Refer a Friend + Important Information */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Refer a Friend */}
        <form
          onSubmit={handleSendReferral}
          className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#EAE3D4] shadow-sm space-y-4"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#0A1629]">Refer a Friend</h3>
              <p className="text-xs text-[#5C5549] mt-0.5">
                Know someone who might benefit from our services? Send us their details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <User className="w-3.5 h-3.5 text-[#8A8175] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={referralForm.friendName}
                  onChange={(e) =>
                    setReferralForm((prev) => ({ ...prev, friendName: e.target.value }))
                  }
                  placeholder="Friend's Name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] focus:bg-white focus:border-[#B88E3E] text-xs text-[#0A1629] placeholder-[#8A8175] outline-none"
                />
              </div>

              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[#8A8175] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={referralForm.phone}
                  onChange={(e) => setReferralForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone Number"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] focus:bg-white focus:border-[#B88E3E] text-xs text-[#0A1629] placeholder-[#8A8175] outline-none"
                />
              </div>

              <div className="sm:col-span-2 relative">
                <Mail className="w-3.5 h-3.5 text-[#8A8175] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={referralForm.email}
                  onChange={(e) => setReferralForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email Address"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAE3D4] bg-[#FAF7F2] focus:bg-white focus:border-[#B88E3E] text-xs text-[#0A1629] placeholder-[#8A8175] outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#B88E3E] hover:brightness-105 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send referral</span>
              </button>
            </div>
          </div>
        </form>

        {/* Important Information */}
        <div className="lg:col-span-5 bg-[#FAF7F2] rounded-2xl p-6 border border-[#EAE3D4] shadow-sm flex flex-col justify-center space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#EAE3D4] flex items-center justify-center text-[#B88E3E] shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#0A1629]">
              Important Information
            </h3>
          </div>
          <p className="text-xs sm:text-[13px] text-[#5C5549] leading-relaxed">
            Your profile content can be corrected or updated by our admin team at any time. If you
            notice anything that needs to be changed, please let us know.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#060D1E] text-white px-4 py-3 rounded-2xl border border-[#D4AF7A] shadow-xl flex items-center gap-2.5 text-xs max-w-md">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF7A] shrink-0" />
          <span className="text-[#EBD8B2] font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
