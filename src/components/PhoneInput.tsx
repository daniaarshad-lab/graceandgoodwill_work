"use client";

import React from "react";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export default function PhoneInput({
  label,
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
}: PhoneInputProps) {
  const handlePhoneChange = (phoneVal: string) => {
    if (phoneVal) {
      const formattedVal = phoneVal.startsWith("+") ? phoneVal : `+${phoneVal}`;
      onChange(formattedVal);
    } else {
      onChange("");
    }
  };

  const rawCss = `
    .phone-input-container {
      width: 100% !important;
      position: relative;
    }
    
    /* Match the exact background, border, typography, and height of standard Input components */
    .phone-input-container .phone-input-field {
      width: 100% !important;
      height: 48px !important;
      background-color: transparent !important;
      color: inherit !important;
      border: ${error ? "1px solid #ef4444" : "1px solid #d1d5db"} !important;
      border-radius: 12px !important;
      font-size: 14px !important;
      padding-left: 58px !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }

    /* Same focus ring and border states as standard input focus */
    .phone-input-container .phone-input-field:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
    }

    /* Sits seamlessly inside the input box */
    .phone-input-container .phone-input-flag-button {
      background-color: transparent !important;
      border: none !important;
      position: absolute !important;
      top: 1px !important;
      bottom: 1px !important;
      left: 1px !important;
      height: calc(100% - 2px) !important;
      border-radius: 12px 0 0 12px !important;
      width: 48px !important;
      padding-left: 10px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .phone-input-container .phone-input-flag-button:hover,
    .phone-input-container .phone-input-flag-button.open {
      background-color: transparent !important;
      border: none !important;
    }

    .phone-input-container .selected-flag {
      background-color: transparent !important;
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .phone-input-container .selected-flag .arrow {
      border-top-color: #9ca3af !important;
      margin-left: 6px !important;
    }

    .phone-input-container .selected-flag.open .arrow {
      border-bottom-color: #9ca3af !important;
    }
    
    /* Hover and Focus Overrides - Matches regular Input exactly (no blue hover border!) */
    .phone-input-container .phone-input-field:hover {
      border-color: ${error ? "#ef4444" : "#9ca3af"} !important;
    }
    
    /* =========================================================================
       PREMIUM COUNTRY DROPDOWN UI
       ========================================================================= */
       
    .phone-input-container .phone-input-dropdown {
      background-color: #0f1a33 !important; /* bg-navy-900 */
      border: 1px solid rgba(212, 175, 55, 0.15) !important; /* gold outline border */
      border-radius: 12px !important;
      color: #fde6c4 !important;
      font-size: 13px !important;
      margin-top: 4px !important;
      box-shadow: 0 12px 40px rgba(5, 8, 22, 0.6) !important; /* elegant soft shadow */
      z-index: 100 !important;
      max-height: 250px !important;
      overflow: hidden !important; /* clip search bar corners */
      padding: 0 !important;
      width: 290px !important;
    }

    /* Custom Scrollbar for Country List */
    .phone-input-container .phone-input-dropdown .country-list {
      margin: 0 !important;
      padding: 4px 0 !important;
      max-height: 195px !important;
      overflow-y: auto !important;
    }

    .phone-input-container .phone-input-dropdown .country-list::-webkit-scrollbar {
      width: 6px !important;
    }

    .phone-input-container .phone-input-dropdown .country-list::-webkit-scrollbar-track {
      background: #0f1a33 !important;
    }

    .phone-input-container .phone-input-dropdown .country-list::-webkit-scrollbar-thumb {
      background-color: rgba(212, 175, 55, 0.2) !important;
      border-radius: 10px !important;
    }

    .phone-input-container .phone-input-dropdown .country-list::-webkit-scrollbar-thumb:hover {
      background-color: #d4af37 !important;
    }

    /* Search Container inside dropdown */
    .phone-input-container .phone-input-dropdown .search {
      background-color: #0a1128 !important; /* bg-navy-950 */
      border-bottom: 1px solid rgba(212, 175, 55, 0.1) !important;
      padding: 10px !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    /* Search Box Input - looks exactly like mini Email input! */
    .phone-input-container .phone-input-dropdown .search-box {
      width: 100% !important;
      height: 36px !important;
      background-color: rgba(15, 26, 51, 0.8) !important; /* bluish bg */
      border: 1px solid #d1d5db !important; /* gray-300 border */
      color: #fde6c4 !important;
      border-radius: 8px !important;
      padding: 8px 12px !important;
      font-size: 12px !important;
      margin: 0 !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }

    .phone-input-container .phone-input-dropdown .search-box:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
    }

    /* Country List Items spacing & hover */
    .phone-input-container .phone-input-dropdown .country-list .country {
      padding: 10px 16px !important; /* better spacing */
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      transition: all 0.15s ease !important;
    }

    .phone-input-container .phone-input-dropdown .country-list .country:hover {
      background-color: rgba(212, 175, 55, 0.08) !important; /* premium gold tint hover */
      color: #d4af37 !important;
    }

    .phone-input-container .phone-input-dropdown .country-list .country.highlight {
      background-color: rgba(212, 175, 55, 0.12) !important;
      color: #d4af37 !important;
    }

    .phone-input-container .phone-input-dropdown .country-name {
      color: #fde6c4 !important;
      font-size: 13px !important;
      font-weight: 500 !important;
    }

    .phone-input-container .phone-input-dropdown .dial-code {
      color: rgba(253, 230, 196, 0.5) !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      margin-left: auto !important; /* align dial codes beautifully to the right */
    }
  `;

  return (
    <div className="space-y-2 text-left">
      <label className="text-sm font-medium text-gold-200 block">{label}</label>

      <div className="relative">
        <ReactPhoneInput
          country="gb"
          value={value.startsWith("+") ? value.substring(1) : value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          enableSearch={true}
          disableSearchIcon={true}
          autocompleteSearch={true}
          containerClass="phone-input-container"
          inputClass="phone-input-field"
          buttonClass="phone-input-flag-button"
          dropdownClass="phone-input-dropdown"
          inputStyle={{
            width: "100%",
            height: "48px",
            backgroundColor: "transparent",
            color: "inherit",
            borderRadius: "12px",
            border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
            fontSize: "14px",
            outline: "none",
            paddingLeft: "58px",
            transition: "all 0.2s ease",
          }}
          buttonStyle={{
            backgroundColor: "transparent",
            border: "none",
          }}
        />

        <style dangerouslySetInnerHTML={{ __html: rawCss }} />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
