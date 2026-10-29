import { useState } from "react";
import SectionCard from "./shared/SectionCard";
import ClientCarerAccommodationSection, {
  ClientAccommPhotoItem,
  CLIENT_SOLE_OCCUPANCY_BEDROOM,
} from "./ClientCarerAccommodationSection";
import Input from "@/components/Input";
import GoogleAddressAutocomplete from "@/components/GoogleAddressAutocomplete";
import MultiSelect from "@/components/MultiSelect";
import PhoneInput from "@/components/PhoneInput";
import Button from "@/components/Button";

const MOBILITY_OPTIONS = [
  "Independent (no aid)",
  "Independent (with aid)",
  "Requires support",
  "Wheelchair user",
  "Unable to walk, requires full assistance",
  "Bedbound, requires full support with mobility and repositioning",
];

const PERSONAL_CARE_OPTIONS = [
  "Washing/Bathing",
  "Dressing",
  "Toileting",
  "Continence Care",
  "Oral Care",
  "Hair Care",
  "Shaving",
  "Hearing aid assistance",
  "Nail care",
  "Other – please specify",
];

interface CareRequestFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  careType: string[];
  setCareType: (val: string[]) => void;
  support: string;
  setSupport: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  city?: string;
  setCity?: (val: string) => void;
  postcode?: string;
  setPostcode?: (val: string) => void;
  setLatitude?: (val: number | null) => void;
  setLongitude?: (val: number | null) => void;
  notes: string;
  setNotes: (val: string) => void;
  isOngoing: boolean;
  setIsOngoing: (val: boolean) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setActiveTab: (
    tab:
      | "overview"
      | "request"
      | "carers"
      | "tracking"
      | "enquiry"
      | "applications",
  ) => void;
}

export default function CareRequestForm({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  careType,
  setCareType,
  support,
  setSupport,
  startDate,
  setStartDate,
  duration,
  setDuration,
  address,
  setAddress,
  city,
  setCity,
  postcode,
  setPostcode,
  setLatitude,
  setLongitude,
  notes,
  setNotes,
  isOngoing,
  setIsOngoing,
  errors,
  isSubmitting,
  onSubmit,
  setActiveTab,
}: CareRequestFormProps) {
  const [mobilityLevel, setMobilityLevel] = useState<string>("Requires support");
  const [mobilityDetails, setMobilityDetails] = useState<string>("");
  const [personalCare, setPersonalCare] = useState<string[]>([]);
  const [personalCareDetails, setPersonalCareDetails] = useState<string>("");

  const [hasPrivateBedroom, setHasPrivateBedroom] = useState<boolean>(true);
  const [multipleCarersInHousehold, setMultipleCarersInHousehold] =
    useState<boolean>(false);
  const [bedroomType, setBedroomType] = useState<string>(
    CLIENT_SOLE_OCCUPANCY_BEDROOM,
  );
  const [bathroomType, setBathroomType] = useState<string>("Private bathroom");
  const [bathroomOther, setBathroomOther] = useState<string>("");
  const [showerType, setShowerType] = useState<string>("Private");
  const [showerOther, setShowerOther] = useState<string>("");
  const [accommPhotos, setAccommPhotos] = useState<ClientAccommPhotoItem[]>([]);
  // Never preselected: false by default
  const [photoConsentConfirmed, setPhotoConsentConfirmed] =
    useState<boolean>(false);
  const [accommError, setAccommError] = useState<string | null>(null);

  const isPersonalCareSelected = (option: string) => {
    const norm = (s: string) => s.toLowerCase().replace(/[\s/–-]+/g, "");
    return personalCare.some((item) => norm(item) === norm(option));
  };

  const togglePersonalCareOption = (option: string) => {
    const norm = (s: string) => s.toLowerCase().replace(/[\s/–-]+/g, "");
    setPersonalCare((prev) => {
      const exists = prev.some((item) => norm(item) === norm(option));
      return exists
        ? prev.filter((item) => norm(item) !== norm(option))
        : [...prev, option];
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    setAccommError(null);
    if (!hasPrivateBedroom) {
      e.preventDefault();
      setAccommError(
        "Please confirm that the live-in carer will have their own private bedroom for the duration of the placement.",
      );
      return;
    }
    if (accommPhotos.length > 0 && !photoConsentConfirmed) {
      e.preventDefault();
      setAccommError(
        "Please tick the confirmation checkbox beneath the accommodation photographs before submitting, or remove the photographs if you prefer not to upload any.",
      );
      return;
    }
    onSubmit(e);
  };

  return (
    <SectionCard className="space-y-6">
      <div className="border-b border-gold-300/10 pb-4">
        <h3 className="text-lg font-bold text-gold-200">
          Submit Care Requirements
        </h3>
        <p className="text-xs text-gold-100/60 leading-relaxed mt-1">
          Specify details about the care needed. Start browsing carer profiles,
          comparing qualifications, experience, specialist skills and
          availability before creating your own shortlist. Explore at your own
          pace while benefiting from verified profiles and the support of Grace
          &amp; Goodwill whenever you need assistance.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Full Name of Requestor"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            error={errors.fullName}
          />
          <Input
            label="Contact Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter contact email"
            type="email"
            error={errors.email}
          />
          <PhoneInput
            label="Contact Phone"
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
            error={errors.phone}
          />

          <MultiSelect
            label="Care Type Required"
            value={careType}
            onChange={setCareType}
            error={errors.careType}
            options={[
              {
                value: "Companion Support",
                label: "Companion Live-in Care",
              },
              {
                value: "24/7 Live-in Companion Support",
                label: "24/7 Live-in Care",
              },
              {
                value: "Post-Operative Rehabilitation",
                label: "Rehabilitation Live-in Care",
              },
              {
                value: "Elderly Dementia Support",
                label: "Dementia Live-in Care",
              },
              {
                value: "Palliative Care",
                label: "Palliative Live-in Care",
              },
              {
                value: "Couple Care",
                label: "Couple Live-in Care",
              },
              {
                value: "Respite Care",
                label: "Respite Live-in Care",
              },
            ]}
          />

          <Input
            label="Preferred Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            error={errors.startDate}
          />

          <div className="flex flex-col space-y-2">
            <Input
              label="End Date"
              type="date"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Select end date"
              error={errors.duration}
              disabled={isOngoing}
              min={
                startDate
                  ? (() => {
                      const start = new Date(startDate);
                      start.setDate(start.getDate() + 2);
                      return start.toISOString().split("T")[0];
                    })()
                  : undefined
              }
            />
            <label className="flex items-center gap-2 text-sm text-gold-200 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOngoing}
                onChange={(e) => {
                  setIsOngoing(e.target.checked);
                  if (e.target.checked) {
                    setDuration("");
                  }
                }}
                className="w-4 h-4 rounded border-gold-300/20 bg-navy-950 text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-offset-navy-950"
              />
              Ongoing (Endless)
            </label>
          </div>
        </div>

        {/* Mobility & Personal Care Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Mobility */}
          <div className="rounded-xl border border-gold-300/15 bg-navy-950/60 p-4 space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gold-200">Mobility</h4>
              <p className="text-xs text-gold-100/60 mt-0.5">
                Select the client&apos;s current mobility level and provide any
                transfer, repositioning or specialist equipment details.
              </p>
              <p className="text-[11px] text-gold-200/80 italic mt-1 leading-snug">
                Distinguish between clients who cannot walk but can still be transferred into a wheelchair, and those who are completely bedbound.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOBILITY_OPTIONS.map((option) => {
                const selected = mobilityLevel === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMobilityLevel(option)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer text-left ${
                      selected
                        ? "bg-gold-DEFAULT/20 border-gold-DEFAULT text-gold-100"
                        : "bg-navy-950 border-gray-300/20 text-gold-100/75 hover:border-gold-300/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <textarea
              rows={3}
              value={mobilityDetails}
              onChange={(e) => setMobilityDetails(e.target.value)}
              placeholder="Additional mobility details (e.g. assistance with transfers, repositioning, hoist or specialist moving and handling equipment)..."
              className="w-full rounded-xl border border-gray-300/20 bg-navy-950 px-3.5 py-2.5 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-xs"
            />
          </div>

          {/* Personal Care Requirements */}
          <div className="rounded-xl border border-gold-300/15 bg-navy-950/60 p-4 space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gold-200">
                Personal Care Requirements
              </h4>
              <p className="text-xs text-gold-100/60 mt-0.5">
                Support required with (select all that apply)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {PERSONAL_CARE_OPTIONS.map((option) => {
                const selected = isPersonalCareSelected(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => togglePersonalCareOption(option)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      selected
                        ? "bg-gold-DEFAULT/20 border-gold-DEFAULT text-gold-100"
                        : "bg-navy-950 border-gray-300/20 text-gold-100/75 hover:border-gold-300/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <textarea
              rows={3}
              value={personalCareDetails}
              onChange={(e) => setPersonalCareDetails(e.target.value)}
              placeholder="Add further personal care details where necessary..."
              className="w-full rounded-xl border border-gray-300/20 bg-navy-950 px-3.5 py-2.5 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold-200">
            Describe the Required Support
          </label>
          <textarea
            rows={4}
            value={support}
            onChange={(e) => setSupport(e.target.value)}
            placeholder="Describe specific client details, medication support, mobility support, and daily routines..."
            className={`w-full rounded-xl border bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm ${
              errors.support ? "border-red-500" : "border-gray-300/20"
            }`}
          ></textarea>
          {errors.support && (
            <p className="text-xs text-red-500 font-medium">{errors.support}</p>
          )}
        </div>

        <GoogleAddressAutocomplete
          label="Care recipient's home address"
          value={address}
          onChange={(val) => setAddress(val)}
          onAddressSelect={(parsed) => {
            if (parsed.formattedAddress) {
              setAddress(parsed.formattedAddress);
            }
            if (parsed.city && setCity) {
              setCity(parsed.city);
            }
            if (parsed.postcode && setPostcode) {
              setPostcode(parsed.postcode);
            }
            if (parsed.lat !== undefined && setLatitude) {
              setLatitude(parsed.lat);
            }
            if (parsed.lng !== undefined && setLongitude) {
              setLongitude(parsed.lng);
            }
          }}
          placeholder="Start typing an address or postcode..."
          error={errors.address}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City / Town"
            value={city || ""}
            onChange={(e) => setCity && setCity(e.target.value)}
            placeholder="e.g. London"
            error={errors.city}
          />
          <Input
            label="Postcode"
            value={postcode || ""}
            onChange={(e) => setPostcode && setPostcode(e.target.value)}
            placeholder="e.g. SW1A 1AA"
            error={errors.postcode}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gold-200">
            Additional Family Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special dietary preferences, pets, or hobbies..."
            className="w-full rounded-xl border border-gray-300/20 bg-navy-950 px-4 py-3 text-gold-100 outline-none focus:ring-2 focus:ring-gold-DEFAULT transition duration-300 text-sm"
          ></textarea>
        </div>

        <ClientCarerAccommodationSection
          hasPrivateBedroom={hasPrivateBedroom}
          setHasPrivateBedroom={setHasPrivateBedroom}
          multipleCarersInHousehold={multipleCarersInHousehold}
          setMultipleCarersInHousehold={setMultipleCarersInHousehold}
          bedroomType={bedroomType}
          setBedroomType={setBedroomType}
          bathroomType={bathroomType}
          setBathroomType={setBathroomType}
          bathroomOther={bathroomOther}
          setBathroomOther={setBathroomOther}
          showerType={showerType}
          setShowerType={setShowerType}
          showerOther={showerOther}
          setShowerOther={setShowerOther}
          photos={accommPhotos}
          setPhotos={setAccommPhotos}
          photoConsentConfirmed={photoConsentConfirmed}
          setPhotoConsentConfirmed={setPhotoConsentConfirmed}
          validationError={accommError}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={() => setActiveTab("overview")}
            variant="ghost-gold"
            size="sm"
            fullWidth={false}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            size="sm"
            fullWidth={false}
          >
            {isSubmitting ? "Submitting Request..." : "Submit Care Request"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
