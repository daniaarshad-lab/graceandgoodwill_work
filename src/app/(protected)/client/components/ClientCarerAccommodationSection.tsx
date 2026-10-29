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
  Lightbulb,
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

export const CLIENT_SOLE_OCCUPANCY_BEDROOM = "Private bedroom (sole occupancy)";
export const CLIENT_SHARED_CARER_BEDROOM =
  "Shared bedroom with another live-in carer, subject to both carers’ agreement";

interface ClientCarerAccommodationSectionProps {
  hasPrivateBedroom: boolean;
  setHasPrivateBedroom: (v: boolean) => void;
  multipleCarersInHousehold: boolean;
  setMultipleCarersInHousehold: (v: boolean) => void;
  bedroomType: string;
  setBedroomType: (v: string) => void;
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
  multipleCarersInHousehold,
  setMultipleCarersInHousehold,
  bedroomType,
  setBedroomType,
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

  const bedroomOptions = multipleCarersInHousehold
    ? [CLIENT_SOLE_OCCUPANCY_BEDROOM, CLIENT_SHARED_CARER_BEDROOM]
    : [CLIENT_SOLE_OCCUPANCY_BEDROOM];

  const isBathroomOther =
    bathroomType === "Other – please specify" ||
    bathroomType === "Other, please specify";
  const isShowerOther =
    showerType === "Other – please specify" ||
    showerType === "Other, please specify";

  return (
    <div className="rounded-2xl border border-[#E6DFD0] bg-[#F8F5EE] p-4 sm:p-6 space-y-5 text-[#1E293B]">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Approval (Admin Review Required)</span>
          </span>
        )}
      </div>

      {validationError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 flex items-start gap-2.5 text-xs text-rose-900">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-medium leading-relaxed">{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 8 COLS: Private Bedroom + Unified Bathroom Arrangements & Accommodation Photos */}
        <div className="lg:col-span-8 space-y-5">
          {/* Card 1: Private Bedroom */}
          <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#E6DFD0] space-y-3.5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] flex items-center justify-center text-[#B88E3E] shrink-0">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-serif text-lg font-semibold text-[#0A1629]">
                  Private Bedroom
                </h5>
                <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
                  The live-in carer must have their own private bedroom. Sharing a bedroom with the client or other household members is not permitted.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
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
                I confirm that the live-in carer will have their own private bedroom for the duration of the placement. <span className="text-rose-600">*</span>
              </span>
            </label>

            <div className="pt-1 border-t border-[#EAE2D2]/80">
              <label className="inline-flex items-center gap-2 text-xs text-[#5C5549] cursor-pointer mt-1.5">
                <input
                  type="checkbox"
                  checked={multipleCarersInHousehold}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setMultipleCarersInHousehold(checked);
                    if (!checked) setBedroomType(CLIENT_SOLE_OCCUPANCY_BEDROOM);
                  }}
                  className="w-3.5 h-3.5 accent-[#0A1629] rounded cursor-pointer"
                />
                <span>
                  Multiple live-in carers are accommodated in the same household
                </span>
              </label>

              {multipleCarersInHousehold && (
                <div className="mt-2.5 rounded-xl bg-white border border-[#EAE2D2] p-3 space-y-1.5">
                  {bedroomOptions.map((opt) => {
                    const selected = bedroomType === opt;
                    return (
                      <label
                        key={opt}
                        onClick={() => setBedroomType(opt)}
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
                        <span
                          className={
                            selected ? "font-medium text-[#0A1629]" : ""
                          }
                        >
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Unified Bathroom Arrangements + Accommodation Photos (Optional) */}
          <div className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#E6DFD0] space-y-5 shadow-sm">
            {/* Bathroom Arrangements */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <ShowerHead className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-serif text-lg font-semibold text-[#0A1629]">
                    Bathroom Arrangements
                  </h5>
                  <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
                    Please confirm the bathroom and shower/bathing arrangements
                    for the live-in carer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-[#EAE2D2] bg-white p-3.5 space-y-2">
                  <div className="text-xs font-bold text-[#0A1629]">
                    Bathroom arrangements
                  </div>
                  {BATHROOM_OPTIONS.map((opt) => {
                    const selected =
                      bathroomType === opt ||
                      (opt === "Other – please specify" && isBathroomOther);
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
                        <span
                          className={
                            selected ? "font-medium text-[#0A1629]" : ""
                          }
                        >
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                  {isBathroomOther && (
                    <input
                      type="text"
                      value={bathroomOther}
                      onChange={(e) => setBathroomOther(e.target.value)}
                      placeholder="Please specify bathroom arrangement..."
                      className="w-full mt-2 px-3 py-2 rounded-lg border border-[#DFD5C2] bg-white text-xs text-[#0A1629] focus:outline-none focus:border-[#C5A059]"
                    />
                  )}
                </div>

                <div className="rounded-xl border border-[#EAE2D2] bg-white p-3.5 space-y-2">
                  <div className="text-xs font-bold text-[#0A1629]">
                    Shower/bathing arrangements
                  </div>
                  {SHOWER_OPTIONS.map((opt) => {
                    const selected =
                      showerType === opt ||
                      (opt === "Other – please specify" && isShowerOther);
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
                        <span
                          className={
                            selected ? "font-medium text-[#0A1629]" : ""
                          }
                        >
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                  {isShowerOther && (
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

            <div className="border-t border-[#EAE2D2]" />

            {/* Accommodation Photos (Optional) + Mandatory Consent Checkbox + Blue Privacy Notice */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4E8] border border-[#E8DEC8] flex items-center justify-center text-[#B88E3E] shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-serif text-lg text-[#0A1629]">
                    <span className="font-semibold">Accommodation Photos</span>{" "}
                    <span className="font-normal text-[#334155]">
                      (Optional)
                    </span>
                  </h5>
                  <p className="text-xs text-[#5C5549] mt-0.5 leading-relaxed">
                    You can upload photographs of the carer&apos;s bedroom,
                    bathroom and/or additional relevant areas. These are
                    optional but can help carers understand the accommodation
                    available.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {PRIMARY_SLOTS.map((slot) => {
                  const existing = getSlotPhoto(slot.category);
                  return (
                    <div
                      key={slot.slotKey}
                      className="rounded-xl border border-[#DFD5C2] bg-white overflow-hidden flex flex-col justify-between shadow-sm"
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
                        <div className="relative h-32 w-full bg-[#EFE9DD]">
                          <img
                            src={existing.url}
                            alt={slot.category}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-900/90 text-amber-50 text-[10px] font-semibold">
                            Pending Approval
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(existing.id)}
                            title="Remove photograph"
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0A1629]/85 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRefs.current[slot.slotKey]?.click()}
                          className="h-32 w-full flex flex-col items-center justify-center text-center gap-1.5 p-3 bg-[#FAF7F2] hover:bg-[#F3ECE0] transition-colors cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-white border border-[#E5DAC3] flex items-center justify-center text-[#B88E3E]">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-[#0A1629]">
                            {slot.category}
                          </span>
                          <span className="text-[10.5px] text-[#786F62]">
                            Optional &bull; JPG or PNG
                          </span>
                        </button>
                      )}

                      <div className="bg-[#F4EDE0] border-t border-[#E5DEC9] px-2.5 py-2 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => fileRefs.current[slot.slotKey]?.click()}
                          className="text-[11px] font-semibold text-[#0A1629] hover:text-[#8C6D2B] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          {existing ? (
                            <>
                              <RefreshCw className="w-3 h-3 text-[#8C6D2B]" />
                              <span>{slot.replaceLabel}</span>
                            </>
                          ) : (
                            <>
                              <span>&uarr;</span>
                              <span>{slot.uploadLabel}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mandatory Consent Checkbox (Strictly NOT preselected; mandatory ONLY if client uploads photos) */}
              <div
                className={`rounded-xl p-3.5 border transition-colors ${
                  photos.length > 0 && !photoConsentConfirmed
                    ? "bg-white border-[#C5A059]"
                    : "bg-white border-[#DFD5C2]"
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={photoConsentConfirmed}
                    onClick={() =>
                      setPhotoConsentConfirmed(!photoConsentConfirmed)
                    }
                    className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border-2 transition-colors shrink-0 cursor-pointer ${
                      photoConsentConfirmed
                        ? "bg-[#0A1629] border-[#0A1629] text-white"
                        : "bg-white border-[#475569]"
                    }`}
                  >
                    {photoConsentConfirmed && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <span className="text-xs text-[#1E293B] leading-relaxed">
                    I confirm that I am authorised to upload these images and
                    agree that these particular images may be shown to approved
                    carers within the Grace &amp; Goodwill network who are
                    considering or undertaking this care arrangement. I
                    understand that uploading accommodation photographs is
                    optional and that I can remove them from my profile.{" "}
                    {photos.length > 0 ? (
                      <span className="text-rose-600 font-bold">*</span>
                    ) : (
                      <span className="text-[#64748B] italic">
                        (Only required if you choose to upload photographs)
                      </span>
                    )}
                  </span>
                </label>
              </div>

              {/* Blue Information Notice directly underneath checkbox with exact required wording */}
              <div className="rounded-xl bg-[#E8F1FA] border border-[#BFD6EE] p-3.5 flex items-start gap-3 text-xs text-[#1D3B5E]">
                <div className="w-5 h-5 rounded-full bg-[#1B4F8C] text-white flex items-center justify-center font-serif font-bold text-[11px] shrink-0 mt-0.5">
                  !
                </div>
                <p className="leading-relaxed">
                  Please do not upload photographs containing people, personal
                  photographs, visible house numbers, street numbers, documents
                  or other identifying or sensitive information. Only upload
                  photographs of the live-in carer’s bedroom, bathroom and any
                  other private space available to the carer, if you feel happy
                  and comfortable doing so. Uploading photographs is entirely
                  optional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: Bedroom Illustration Image + Why This Information Is Important + Helpful Tips */}
        <div className="lg:col-span-4 bg-[#FDFBF7] rounded-2xl border border-[#E6DFD0] p-4 sm:p-5 space-y-4 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80"
            alt="Comfortable private carer bedroom"
            className="w-full h-52 object-cover rounded-xl border border-[#EAE2D2]"
          />

          <div className="space-y-2">
            <h5 className="font-serif text-lg font-semibold text-[#0A1629] pb-2 border-b border-[#DED4C1]">
              Why this information is important
            </h5>
            <p className="text-xs text-[#5C5549] leading-relaxed">
              Having a comfortable, private space helps the live-in carer feel
              rested and supported, which contributes to a positive and
              sustainable care arrangement for everyone.
            </p>
          </div>

          <div className="bg-[#F6F0E4] rounded-xl p-4 border border-[#E5DEC9] space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#B88E3E] shrink-0" />
              <span className="font-serif text-base font-semibold text-[#0A1629]">
                Helpful tips
              </span>
            </div>
            <div className="space-y-2 text-xs text-[#334155]">
              {[
                "The live-in carer must have their own private bedroom.",
                "A quiet and comfortable space helps the carer to rest.",
                "Compulsory: The live-in carer must have access to a fully equipped bathroom with a toilet, washbasin and either a shower or bathtub.",
                "You can upload photographs to give carers a better understanding of the accommodation.",
                "Photographs are optional.",
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#B88E3E] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
