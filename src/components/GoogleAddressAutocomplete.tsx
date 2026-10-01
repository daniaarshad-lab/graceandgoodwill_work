"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Loader2, X, ChevronRight } from "lucide-react";
import { ParsedAddress } from "@/utils/googlePlaces";

export interface GoogleAddressAutocompleteProps {
  label?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (parsed: ParsedAddress) => void;
  placeholder?: string;
  error?: string;
  helperText?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  countryRestrictions?: string[];
  id?: string;
}

interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  types?: string[];
}

export default function GoogleAddressAutocomplete({
  label,
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing an address or postcode...",
  error,
  helperText,
  disabled = false,
  required = false,
  className = "",
  inputClassName = "",
  countryRestrictions = ["gb"],
  id,
}: GoogleAddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Debounced search query
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || query.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const country = countryRestrictions?.[0] || "gb";
        const res = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(
            query.trim()
          )}&country=${encodeURIComponent(country)}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch suggestions (${res.status})`);
        }

        const data = await res.json();
        const results: PlaceSuggestion[] = data.suggestions || [];
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        console.warn("[GoogleAddressAutocomplete] Search error:", err);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [countryRestrictions]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(val);
      }, 250);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = async (suggestion: PlaceSuggestion) => {
    setIsOpen(false);
    setIsFetchingDetails(true);

    // Immediately display the selected suggestion text in the input
    const displayAddress = suggestion.fullText || suggestion.mainText;
    onChange(displayAddress);

    try {
      const res = await fetch(
        `/api/places/details?placeId=${encodeURIComponent(suggestion.placeId)}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch place details (${res.status})`);
      }

      const data = await res.json();
      if (data.place) {
        const parsed: ParsedAddress = data.place;
        const finalAddress =
          parsed.formattedAddress || parsed.streetAddress || displayAddress;
        onChange(finalAddress);

        if (onAddressSelect) {
          onAddressSelect(parsed);
        }
      }
    } catch (err) {
      console.warn("[GoogleAddressAutocomplete] Details error:", err);
      // Fallback: at least deliver basic parsed address from suggestion
      if (onAddressSelect) {
        onAddressSelect({
          formattedAddress: displayAddress,
          streetAddress: suggestion.mainText,
          city: "",
          state: "",
          postcode: "",
          country: "United Kingdom",
          placeId: suggestion.placeId,
        });
      }
    } finally {
      setIsFetchingDetails(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className={`space-y-2 relative ${className}`}>
      {label && (
        <label className="form-label block text-sm font-medium text-gold-200">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Map pin or loading spinner */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-300/60 pointer-events-none flex items-center">
          {isLoading || isFetchingDetails ? (
            <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          disabled={disabled}
          required={required}
          autoComplete="off"
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-navy-950/80 pl-10 pr-10 py-3 text-gold-100 placeholder-gold-200/30 text-sm outline-none transition duration-300 focus:ring-2 focus:ring-gold-DEFAULT ${error
              ? "border-red-500/80 focus:ring-red-500/50"
              : "border-gold-300/20 hover:border-gold-300/40"
            } ${disabled ? "opacity-60 cursor-not-allowed bg-navy-900/50" : ""
            } ${inputClassName}`}
        />

        {/* Clear input button if value present and not disabled */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-300/40 hover:text-gold-200 p-1 rounded-md transition-colors"
            title="Clear address"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-[99999] overflow-hidden rounded-xl border border-gold-300/30 bg-navy-950 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.85),0_0_18px_rgba(212,175,122,0.15)] backdrop-blur-md">
          <div className="py-1.5 max-h-64 overflow-y-auto divide-y divide-gold-300/10">
            {suggestions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.placeId || idx}
                  onClick={() => handleSelectSuggestion(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 py-2.5 flex items-start gap-3 cursor-pointer transition-all duration-150 ${isSelected
                      ? "bg-gold-500/20 text-white"
                      : "hover:bg-gold-500/10 text-gold-100"
                    }`}
                >
                  <MapPin
                    className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-gold-300" : "text-gold-400/70"
                      }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gold-100 leading-snug truncate">
                      {item.mainText}
                    </p>
                    {item.secondaryText && (
                      <p className="text-xs text-gold-300/60 truncate mt-0.5">
                        {item.secondaryText}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 mt-1 shrink-0 transition-transform ${isSelected
                        ? "text-gold-300 translate-x-0.5"
                        : "text-gold-300/30"
                      }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="px-3 py-1.5 bg-navy-900/80 border-t border-gold-300/10 flex items-center justify-between text-[11px] text-gold-300/50">
            <span>Powered by Google Places</span>
            <span>Use ↑ ↓ to navigate, Enter to select</span>
          </div>
        </div>
      )}

      {error ? (
        <p className="form-help text-xs text-red-400 pl-1 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p className="form-help text-gold-200/50 text-[12px] pl-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
