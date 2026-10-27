"use client";

import React, { useRef } from "react";
import {
  BedDouble,
  ShowerHead,
  Camera,
  Upload,
  Check,
  Trash2,
  RefreshCw,
  Clock,
  Info,
  AlertCircle,
} from "lucide-react";

export type ClientAccommPhotoCategory =
  | "Carer Bedroom"
  | "Bathroom"
  | "Additional Space";

export interface ClientAccommPhotoItem {
  id: string;
  url: string;
  category: ClientAccommPhotoCategory;
  status: "pending_approval" | "approved" | "rejected";
}

interface ClientCarerAccommodationSectionProps {
  hasPrivateBedroom: boolean;
  setHasPrivateBedroom: (v: boolean) => void;
  bathroomType: string;
  setBathroomType: (v: string) => void;
  bathroomOther: string;
  setBathroomOther: (v: string) => void;
  showerType: string;
  setShowerType: (v: string) => void;
  showerOther: string;
  setShowerOther: (v: string) => void;
  photos: ClientAccommPhotoItem[];
  setPhotos: React.Dispatch<React.SetStateAction<ClientAccommPhotoItem[]>>;
  photoConsentConfirmed: boolean;
  setPhotoConsentConfirmed: (v: boolean) => void;
  validationError?: string | null;
}

const BATHROOM_OPTIONS = [
  "Private bathroom",
  "Ensuite bathroom",
  "Shared bathroom with client",
  "Shared bathroom with household",
  "Other – please specify",
];

const SHOWER_OPTIONS = [
  "Private",
  "Shared with client",
  "Shared with household",
  "Other – please specify",
];

const PRIMARY_SLOTS: {
  slotKey: string;
  category: ClientAccommPhotoCategory;
  uploadLabel: string;
  replaceLabel: string;
}[] = [
  {
    slotKey: "slot-bedroom",
    category: "Carer Bedroom",
    uploadLabel: "Upload carer bedroom photo",
    replaceLabel: "Replace carer bedroom photo",
  },
  {
    slotKey: "slot-bathroom",
    category: "Bathroom",
    uploadLabel: "Upload bathroom photo",
    replaceLabel: "Replace bathroom photo",
  },
  {
    slotKey: "slot-additional",
    category: "Additional Space",
    uploadLabel: "Upload additional photo",
    replaceLabel: "Replace additional photo",
  },
];

export default function ClientCarerAccommodationSection({
  hasPrivateBedroom,
  setHasPrivateBedroom,
  bathroomType,
  setBathroomType,
  bathroomOther,
  setBathroomOther,
  showerType,
  setShowerType,
  showerOther,
  setShowerOther,
  photos,
  setPhotos,
  photoConsentConfirmed,
  setPhotoConsentConfirmed,
  validationError,
}: ClientCarerAccommodationSectionProps) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getSlotPhoto = (category: ClientAccommPhotoCategory) =>
    photos.find((p) => p.category === category);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: ClientAccommPhotoCategory,
    replaceId?: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const nextItem: ClientAccommPhotoItem = {
          id: `accomm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          url: reader.result,
          category,
          status: "pending_approval",
        };
        setPhotos((prev) =>
          replaceId
            ? prev.map((p) => (p.id === replaceId ? nextItem : p))
            : [...prev, nextItem],
        );
        // Any new or replacement photo requires active unchecked client consent
        setPhotoConsentConfirmed(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (updated.length === 0) {
        setPhotoConsentConfirmed(false);
      }
      return updated;
    });
  };

  return (
    <div className="rounded-2xl border border-[#E6DFD0] bg-[#FDFBF7] p-4 sm:p-6 space-y-5 text-[#1E293B]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#0A1629]">
            Carer Accommodation
          </h4>
          <p className="text-xs sm:text-sm text-[#5C5549] mt-0.5">
            Please provide details about the live-in carer&apos;s accommodation
            and personal space.
          </p>
        </div>
        {photos.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Admin Approval</span>
          </span>
        )}
      </div>

      {validationError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-start gap-2.5 text-xs text-rose-900">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{validationError}</span>
        </div>
      )}

      {/* 1. Private Bedroom */}
      <div className="bg-white rounded-xl p-5 border border-[#EAE2D2] space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border border-[#EDE3CE] flex items-center justify-center text-[#B88E3E] shrink-0">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-serif text-lg font-semibold text-[#0A1629]">
              Private Bedroom
            </h5>
            <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
              A live-in carer must be provided with their own private bedroom
              and suitable personal space for the duration of the placement.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-3 pt-1 cursor-pointer">
          <button
            type="button"
            role="checkbox"
            aria-checked={hasPrivateBedroom}
            onClick={() => setHasPrivateBedroom(!hasPrivateBedroom)}
            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors shrink-0 cursor-pointer ${
              hasPrivateBedroom
                ? "bg-[#0A1629] border-[#0A1629] text-white"
                : "bg-white border-[#94A3B8]"
            }`}
          >
            {hasPrivateBedroom && <Check className="w-3.5 h-3.5" />}
          </button>
          <span className="text-xs sm:text-[13px] font-semibold text-[#0A1629]">
            I confirm that the live-in carer will have their own private
            bedroom. <span className="text-rose-600">*</span>
          </span>
        </label>
      </div>

      {/* 2. Bathroom Arrangements */}
      <div className="bg-white rounded-xl p-5 border border-[#EAE2D2] space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border border-[#EDE3CE] flex items-center justify-center text-[#B88E3E] shrink-0">
            <ShowerHead className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-serif text-lg font-semibold text-[#0A1629]">
              Bathroom Arrangements
            </h5>
            <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
              Please confirm the bathroom and shower/bathing arrangements for
              the live-in carer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#EAE2D2] bg-[#FDFBF7] p-4 space-y-2">
            <div className="text-xs font-bold text-[#0A1629] mb-1">
              Bathroom arrangements
            </div>
            {BATHROOM_OPTIONS.map((opt) => {
              const selected = bathroomType === opt;
              return (
                <label
                  key={opt}
                  onClick={() => setBathroomType(opt)}
                  className="flex items-center gap-2.5 text-xs text-[#1E293B] cursor-pointer py-0.5"
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                      selected
                        ? "bg-[#0A1629] border-[#0A1629]"
                        : "bg-white border-[#CBD5E1]"
                    }`}
                  >
                    {selected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className={selected ? "font-medium text-[#0A1629]" : ""}>
                    {opt}
                  </span>
                </label>
              );
            })}
            {bathroomType === "Other – please specify" && (
              <input
                type="text"
                value={bathroomOther}
                onChange={(e) => setBathroomOther(e.target.value)}
                placeholder="Please specify bathroom arrangement..."
                className="w-full mt-2 px-3 py-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
              />
            )}
          </div>

          <div className="rounded-xl border border-[#EAE2D2] bg-[#FDFBF7] p-4 space-y-2">
            <div className="text-xs font-bold text-[#0A1629] mb-1">
              Shower/bathing arrangements
            </div>
            {SHOWER_OPTIONS.map((opt) => {
              const selected = showerType === opt;
              return (
                <label
                  key={opt}
                  onClick={() => setShowerType(opt)}
                  className="flex items-center gap-2.5 text-xs text-[#1E293B] cursor-pointer py-0.5"
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                      selected
                        ? "bg-[#0A1629] border-[#0A1629]"
                        : "bg-white border-[#CBD5E1]"
                    }`}
                  >
                    {selected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className={selected ? "font-medium text-[#0A1629]" : ""}>
                    {opt}
                  </span>
                </label>
              );
            })}
            {showerType === "Other – please specify" && (
              <input
                type="text"
                value={showerOther}
                onChange={(e) => setShowerOther(e.target.value)}
                placeholder="Please specify shower/bathing arrangement..."
                className="w-full mt-2 px-3 py-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Accommodation Photos (Optional) + Mandatory Consent Checkbox + Blue Privacy Notice */}
      <div className="bg-white rounded-xl p-5 border border-[#EAE2D2] space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border border-[#EDE3CE] flex items-center justify-center text-[#B88E3E] shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-serif text-lg font-semibold text-[#0A1629]">
              Accommodation Photos (Optional)
            </h5>
            <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
              You can upload photographs of the carer&apos;s bedroom, bathroom
              and/or additional relevant areas. Uploading photographs is
              entirely optional, and any uploaded or replacement photographs are
              reviewed by Admin before becoming visible to carers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {PRIMARY_SLOTS.map((slot) => {
            const existing = getSlotPhoto(slot.category);
            return (
              <div
                key={slot.slotKey}
                className="rounded-xl border border-dashed border-[#D8CEBC] bg-[#FDFBF7] p-3 flex flex-col justify-between min-h-[168px]"
              >
                <input
                  ref={(el) => {
                    fileRefs.current[slot.slotKey] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(e, slot.category, existing?.id)
                  }
                />

                {existing ? (
                  <div className="space-y-2.5">
                    <div className="relative h-28 w-full rounded-lg overflow-hidden border border-[#E2D9C8]">
                      <img
                        src={existing.url}
                        alt={slot.category}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50/95 text-amber-800 border border-amber-200">
                        Pending Approval
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#0A1629]">
                      {slot.category}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileRefs.current[slot.slotKey]?.click()}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#D8CEBC] bg-white hover:bg-[#FAF5EE] text-[11px] font-semibold text-[#0A1629] cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-[#B88E3E]" />
                        <span>Replace</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(existing.id)}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[11px] font-semibold text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRefs.current[slot.slotKey]?.click()}
                    className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-4 cursor-pointer hover:bg-[#FAF6EE]/60 rounded-lg transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FAF6EE] border border-[#E5DAC3] flex items-center justify-center text-[#B88E3E]">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#0A1629]">
                      {slot.uploadLabel}
                    </span>
                    <span className="text-[11px] text-[#786F62]">
                      Optional &bull; JPG or PNG
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Mandatory Consent Checkbox (Unchecked by default; mandatory ONLY if client uploads photos) */}
        <div
          className={`rounded-xl p-3.5 border transition-colors ${
            photos.length > 0 && !photoConsentConfirmed
              ? "bg-[#FAF6EE] border-[#C5A059]"
              : "bg-[#FDFBF7] border-[#EAE2D2]"
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <button
              type="button"
              role="checkbox"
              aria-checked={photoConsentConfirmed}
              onClick={() => setPhotoConsentConfirmed(!photoConsentConfirmed)}
              className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border transition-colors shrink-0 cursor-pointer ${
                photoConsentConfirmed
                  ? "bg-[#0A1629] border-[#0A1629] text-white"
                  : "bg-white border-[#64748B]"
              }`}
            >
              {photoConsentConfirmed && <Check className="w-3.5 h-3.5" />}
            </button>
            <span className="text-xs sm:text-[13px] text-[#0A1629] leading-relaxed font-medium">
              I confirm that I am happy for these accommodation photographs to
              be reviewed by Grace &amp; Goodwill and displayed to approved
              carers within the Grace &amp; Goodwill platform, and that they do
              not contain people, personal photographs, documents, house numbers
              or sensitive information.
              {photos.length > 0 && (
                <span className="text-rose-600 font-bold ml-1">*</span>
              )}
            </span>
          </label>
        </div>

        {/* Blue Information Notice directly underneath checkbox with exact required wording */}
        <div className="rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-4 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#1D4ED8] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-[13px] text-[#1E3A8A] leading-relaxed">
            Please do not upload photographs containing people, personal
            photographs, visible house numbers, street numbers, documents or
            other identifying or sensitive information. Only upload photographs
            of the live-in carer’s bedroom, bathroom and any other private space
            available to the carer, if you feel happy and comfortable doing so.
            Uploading photographs is entirely optional.
          </p>
        </div>
      </div>
    </div>
  );
}
