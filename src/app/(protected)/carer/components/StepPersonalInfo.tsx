import FullScreenLoader from "@/components/FullScreenLoader";
import React, { useState } from "react";
import SectionCard from "./shared/SectionCard";
import Input from "@/components/Input";
import GoogleAddressAutocomplete from "@/components/GoogleAddressAutocomplete";
import PhoneInput from "@/components/PhoneInput";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { showErrorToast } from "@/utils/toast";

interface Props {
  portal: any;
  onNext: () => void;
  onBack?: () => void;
}

const PREDEFINED_RELATIONSHIPS = [
  "Spouse",
  "Parent",
  "Mother",
  "Father",
  "Son",
  "Daughter",
  "Daughter In-law",
  "Son In-law",
  "Brother",
  "Sister",
  "Grandparent",
  "Grandchild",
  "Aunt",
  "Uncle",
  "Cousin",
  "Partner",
  "Legal Guardian",
  "Next of Kin",
  "Friend",
  "Neighbour",
  "Carer",
];

const RELATIONSHIP_OPTIONS = [
  { value: "", label: "Select relationship" },
  ...PREDEFINED_RELATIONSHIPS.map((r) => ({ value: r, label: r })),
  { value: "Other", label: "Other" },
];

export default function StepPersonalInfo({ portal, onNext, onBack }: Props) {
  const [isLocalSaving, setIsLocalSaving] = useState(false);

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    email,
    setEmail,
    dateOfBirth,
    setDateOfBirth,
    address,
    setAddress,
    city,
    setCity,
    postcode,
    setPostcode,
    setLatitude,
    setLongitude,
    emergencyContactName,
    setEmergencyContactName,
    emergencyContactNumber,
    setEmergencyContactNumber,
    emergencyContactRelation,
    setEmergencyContactRelation,
  } = portal;

  const [postcodeSuggestions, setPostcodeSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [dropdownRel, setDropdownRel] = useState<string>(() => {
    if (!emergencyContactRelation) return "";
    if (PREDEFINED_RELATIONSHIPS.includes(emergencyContactRelation))
      return emergencyContactRelation;
    return "Other";
  });

  const handlePostcodeChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;
    setPostcode(val);

    if (val.trim()) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.postcode;
        return copy;
      });
    }

    if (val.length > 2) {
      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${val}/autocomplete`,
        );
        const data = await res.json();
        if (data.status === 200) {
          setPostcodeSuggestions(data.result || []);
          setShowSuggestions(true);
        } else {
          setPostcodeSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        console.error("Postcode fetch error", err);
      }
    } else {
      setPostcodeSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!firstName?.trim() || !lastName?.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }
    if (!address?.trim()) {
      newErrors.address = "Address is required";
    }
    if (!postcode?.trim()) {
      newErrors.postcode = "Postcode is required";
    }
    if (!city?.trim()) {
      newErrors.city = "City is required";
    }
    if (!email?.trim()) {
      newErrors.email = "Email Address is required";
    }
    if (!phone?.trim()) {
      newErrors.phone = "Mobile Number is required";
    }
    if (!emergencyContactName?.trim()) {
      newErrors.emergencyContactName = "Emergency Contact Name is required";
    }
    if (!emergencyContactNumber?.trim()) {
      newErrors.emergencyContactNumber = "Emergency Contact Number is required";
    }
    if (!emergencyContactRelation?.trim()) {
      newErrors.emergencyContactRelation =
        "Emergency Contact Relationship is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    let resolvedLat = portal.latitude;
    let resolvedLng = portal.longitude;
    let resolvedCity = city;

    if (
      (resolvedLat === null ||
        resolvedLat === undefined ||
        resolvedLng === null ||
        resolvedLng === undefined) &&
      postcode?.trim()
    ) {
      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`
        );
        const data = await res.json();
        if (data.status === 200 && data.result) {
          if (data.result.latitude !== undefined) {
            resolvedLat = data.result.latitude;
            if (setLatitude) setLatitude(resolvedLat);
          }
          if (data.result.longitude !== undefined) {
            resolvedLng = data.result.longitude;
            if (setLongitude) setLongitude(resolvedLng);
          }
          if (data.result.admin_district && !resolvedCity) {
            resolvedCity = data.result.admin_district;
            if (setCity) setCity(resolvedCity);
          }
        }
      } catch (err) {
        console.warn("Postcode geocode fallback error:", err);
      }
    }

    const syntheticEvent = { preventDefault: () => { } } as React.FormEvent;
    setIsLocalSaving(true);
    const success = await portal.handleSaveProfile(syntheticEvent, 2, {
      city: resolvedCity,
      latitude: resolvedLat,
      longitude: resolvedLng,
    });
    setIsLocalSaving(false);
    if (success) {
      onNext();
    }
  };

  const getMinAgeDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const maxDate = getMinAgeDate();

  if (isLocalSaving) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto w-full">
        <FullScreenLoader isVisible={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionCard className="space-y-6 p-6 md:p-8">
        <h3 className="text-xl font-bold text-gold-200 border-b border-gold-300/10 pb-4">
          Personal Information
        </h3>
        <p className="text-sm text-gold-100/60 mb-4">
          All items marked with * are compulsory.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            value={`${firstName || ""} ${lastName || ""}`.trim()}
            onChange={(e) => {
              const val = e.target.value;
              const parts = val.split(" ");
              setFirstName(parts[0] || "");
              setLastName(parts.slice(1).join(" ") || "");
              if (parts[0]?.trim() && parts.slice(1).join(" ")?.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.fullName;
                  return copy;
                });
              }
            }}
            placeholder="Full Name"
            error={errors.fullName}
          />
          <Input
            label="Date of Birth *"
            type="date"
            value={dateOfBirth ? dateOfBirth.split("T")[0] : ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val && val > maxDate) {
                showErrorToast(
                  "Validation Error",
                  "You must be at least 18 years old.",
                );
                return;
              }
              setDateOfBirth(val);
              if (val) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.dateOfBirth;
                  return copy;
                });
              }
            }}
            placeholder="DD/MM/YYYY"
            max={maxDate}
            error={errors.dateOfBirth}
          />
          <GoogleAddressAutocomplete
            label="Address *"
            value={address}
            onChange={(val) => {
              setAddress(val);
              if (val.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.address;
                  return copy;
                });
              }
            }}
            onAddressSelect={(parsed) => {
              if (parsed.formattedAddress) {
                setAddress(parsed.formattedAddress);
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.address;
                  return copy;
                });
              }
              if (parsed.city && setCity) {
                setCity(parsed.city);
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.city;
                  return copy;
                });
              }
              if (parsed.postcode) {
                setPostcode(parsed.postcode);
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.postcode;
                  return copy;
                });
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
          <Input
            label="City / Town *"
            value={city || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (setCity) setCity(val);
              if (val.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.city;
                  return copy;
                });
              }
            }}
            placeholder="e.g. London"
            error={errors.city}
          />
          <div className="relative">
            <Input
              label="Postcode *"
              value={postcode}
              onChange={handlePostcodeChange}
              placeholder="Postcode"
              error={errors.postcode}
            />
            {showSuggestions && postcodeSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-navy-900 border border-gold-300/20 rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-h-48 overflow-y-auto">
                {postcodeSuggestions.map((p) => (
                  <li
                    key={p}
                    className="px-4 py-2 text-sm text-gold-100 hover:bg-gold-DEFAULT/10 cursor-pointer"
                    onClick={async () => {
                      setPostcode(p);
                      setShowSuggestions(false);
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.postcode;
                        return copy;
                      });
                      try {
                        const res = await fetch(
                          `https://api.postcodes.io/postcodes/${encodeURIComponent(p)}`
                        );
                        const data = await res.json();
                        if (data.status === 200 && data.result) {
                          if (data.result.latitude !== undefined && setLatitude) {
                            setLatitude(data.result.latitude);
                          }
                          if (data.result.longitude !== undefined && setLongitude) {
                            setLongitude(data.result.longitude);
                          }
                          if (data.result.admin_district && !city && setCity) {
                            setCity(data.result.admin_district);
                          }
                        }
                      } catch (err) {
                        console.warn("Postcode suggestion lookup error:", err);
                      }
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Input
            label="Email Address *"
            type="email"
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              if (val.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.email;
                  return copy;
                });
              }
            }}
            placeholder="Email"
            error={errors.email}
          />
          <PhoneInput
            label="Mobile Number *"
            value={phone}
            onChange={(val) => {
              setPhone(val);
              if (val.trim()) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.phone;
                  return copy;
                });
              }
            }}
            placeholder="Mobile Number"
            error={errors.phone}
          />
        </div>

        <div className="pt-6 mt-6 border-t border-gold-300/10">
          <h4 className="text-lg font-semibold text-gold-200 mb-4">
            Emergency Contact Details *
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Contact Name *"
              value={emergencyContactName}
              onChange={(e) => {
                const val = e.target.value;
                setEmergencyContactName(val);
                if (val.trim()) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.emergencyContactName;
                    return copy;
                  });
                }
              }}
              placeholder="Name"
              error={errors.emergencyContactName}
            />
            <PhoneInput
              label="Contact Number *"
              value={emergencyContactNumber}
              onChange={(val) => {
                setEmergencyContactNumber(val);
                if (val.trim()) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.emergencyContactNumber;
                    return copy;
                  });
                }
              }}
              placeholder="Phone"
              error={errors.emergencyContactNumber}
            />
            <div className="flex flex-col gap-4">
              <Select
                label="Relationship *"
                value={dropdownRel}
                onChange={(e) => {
                  const val = e.target.value;
                  setDropdownRel(val);
                  if (val === "Other") {
                    setEmergencyContactRelation("");
                  } else {
                    setEmergencyContactRelation(val);
                    if (val.trim()) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.emergencyContactRelation;
                        return copy;
                      });
                    }
                  }
                }}
                options={RELATIONSHIP_OPTIONS}
                error={
                  dropdownRel !== "Other"
                    ? errors.emergencyContactRelation
                    : undefined
                }
              />

              {dropdownRel === "Other" && (
                <Input
                  label="Specify Relationship *"
                  value={emergencyContactRelation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmergencyContactRelation(val);
                    if (val.trim()) {
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.emergencyContactRelation;
                        return copy;
                      });
                    }
                  }}
                  placeholder="Enter relationship"
                  error={errors.emergencyContactRelation}
                />
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-between items-center pt-4 gap-4">
        {onBack ? (
          <Button type="button" variant="ghost-gold" onClick={onBack} disabled={isLocalSaving || portal.isProfileSaving}>
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          disabled={isLocalSaving || portal.isProfileSaving}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
}