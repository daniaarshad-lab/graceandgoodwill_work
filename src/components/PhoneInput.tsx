"use client";

import React from "react";
import dynamic from "next/dynamic";
import "react-phone-input-2/lib/style.css";

const ReactPhoneInput = dynamic(() => import("react-phone-input-2"), {
  ssr: false,
});

interface PhoneInputProps {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function PhoneInput({
  label,
  value,
  onChange,
  error,
  placeholder = "Enter phone number",
  disabled = false,
  className = "",
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
      z-index: 30;
    }
    
    /* Match the exact background, border, typography, and height of standard Input components */
    .phone-input-container .phone-input-field {
      width: 100% !important;
      height: 46px !important;
      background-color: rgba(255, 255, 255, 0.035) !important;
      color: rgba(220, 200, 170, 0.92) !important;
      border: 1px solid rgba(160, 128, 84, 0.22) !important;
      border-radius: 12px !important;
      font-size: 0.875rem !important;
      font-family: 'Poppins', 'Segoe UI', Inter, sans-serif !important;
      padding-left: 58px !important;
      outline: none !important;
      transition: all 0.25s ease !important;
    }

    .phone-input-container.has-error .phone-input-field {
      border: 1px solid rgba(239, 68, 68, 0.55) !important;
    }

    /* Same focus ring and border states as standard input focus */
    .phone-input-container .phone-input-field:focus {
      border-color: rgba(160, 128, 84, 0.60) !important;
      background-color: rgba(255, 255, 255, 0.06) !important;
      box-shadow: 0 0 0 3px rgba(160, 128, 84, 0.10), 0 1px 8px rgba(0, 0, 0, 0.28) !important;
    }

    .phone-input-container.has-error .phone-input-field:focus {
      border-color: rgba(239, 68, 68, 0.55) !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.10) !important;
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
      border-top-color: rgba(160, 128, 84, 0.5) !important;
      margin-left: 6px !important;
    }

    .phone-input-container .selected-flag.open .arrow {
      border-bottom-color: rgba(160, 128, 84, 0.5) !important;
    }
    
    .phone-input-container .phone-input-field:hover {
      border-color: rgba(160, 128, 84, 0.38) !important;
      background-color: rgba(255, 255, 255, 0.055) !important;
    }

    .phone-input-container.has-error .phone-input-field:hover {
      border-color: rgba(239, 68, 68, 0.55) !important;
    }
    
    /* =========================================================================
       PREMIUM COUNTRY DROPDOWN UI
       ========================================================================= */
       
    .phone-input-container .phone-input-dropdown {
      position: absolute !important;
      left: -1px !important;
      background-color: #0f1a33 !important; /* bg-navy-900 */
      border: 1px solid rgba(160, 128, 84, 0.22) !important; /* gold outline border */
      border-radius: 12px !important;
      color: #fde6c4 !important;
      font-size: 13px !important;
      margin-top: 4px !important;
      box-shadow: 0 12px 40px rgba(5, 8, 22, 0.6) !important; /* elegant soft shadow */
      z-index: 100 !important;
      max-height: 250px !important;
      overflow-y: auto !important; /* enable scroll directly on the dropdown */
      padding: 0 !important;
      width: 290px !important;
      max-width: calc(100vw - 80px) !important;
      list-style: none !important;
    }

    /* If inside AuthSplitLayout (.asl-right), position the dropdown upwards to prevent clipping at the bottom of the card */
    .asl-right .phone-input-container .phone-input-dropdown {
      bottom: 100% !important;
      top: auto !important;
      margin-bottom: 4px !important;
      margin-top: 0 !important;
      box-shadow: 0 -12px 40px rgba(5, 8, 22, 0.6) !important; /* elegant upwards shadow */
    }

    /* Custom Scrollbar for Country List */
    .phone-input-container .phone-input-dropdown::-webkit-scrollbar {
      width: 6px !important;
    }

    .phone-input-container .phone-input-dropdown::-webkit-scrollbar-track {
      background: #0f1a33 !important;
    }

    .phone-input-container .phone-input-dropdown::-webkit-scrollbar-thumb {
      background-color: rgba(160, 128, 84, 0.2) !important;
      border-radius: 10px !important;
    }

    .phone-input-container .phone-input-dropdown::-webkit-scrollbar-thumb:hover {
      background-color: #A08054 !important;
    }

    /* Search Container inside dropdown */
    .phone-input-container .phone-input-dropdown .search {
      background-color: #0a1128 !important; /* bg-navy-950 */
      border-bottom: 1px solid rgba(160, 128, 84, 0.1) !important;
      padding: 10px !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      position: sticky !important; /* pin search box to top */
      top: 0 !important;
      z-index: 10 !important;
    }

    /* Search Box Input - looks exactly like mini Email input! */
    .phone-input-container .phone-input-dropdown .search-box {
      width: 100% !important;
      height: 36px !important;
      background-color: rgba(15, 26, 51, 0.8) !important; /* bluish bg */
      border: 1px solid rgba(160, 128, 84, 0.22) !important; /* match gold border */
      color: #fde6c4 !important;
      border-radius: 8px !important;
      padding: 8px 12px !important;
      font-size: 12px !important;
      margin: 0 !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }

    .phone-input-container .phone-input-dropdown .search-box:focus {
      border-color: rgba(160, 128, 84, 0.60) !important;
      box-shadow: 0 0 0 2px rgba(160, 128, 84, 0.10) !important;
    }

    /* Country List Items spacing & hover */
    .phone-input-container .phone-input-dropdown .country {
      padding: 10px 16px !important; /* better spacing */
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      transition: all 0.15s ease !important;
      height: auto !important;
      min-height: 36px !important;
      line-height: 1.4 !important;
    }

    .phone-input-container .phone-input-dropdown .country:hover {
      background-color: rgba(160, 128, 84, 0.08) !important; /* premium gold tint hover */
      color: #A08054 !important;
    }

    .phone-input-container .phone-input-dropdown .country.highlight {
      background-color: rgba(160, 128, 84, 0.12) !important;
      color: #A08054 !important;
    }

    .phone-input-container .phone-input-dropdown .country-name {
      color: #fde6c4 !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      max-width: 170px !important;
      line-height: 1.4 !important;
    }

    .phone-input-container .phone-input-dropdown .dial-code {
      color: rgba(253, 230, 196, 0.5) !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      margin-left: auto !important; /* align dial codes beautifully to the right */
      line-height: 1.4 !important;
      flex-shrink: 0 !important;
    }
  `;

  return (
    <div className="space-y-2 text-left">
      <label className="form-label">{label}</label>

      <div className="relative">
        <ReactPhoneInput
          country="gb"
          value={value.startsWith("+") ? value.substring(1) : value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          enableSearch={true}
          disableSearchIcon={true}
          autocompleteSearch={true}
          containerClass={`phone-input-container ${error ? 'has-error' : ''}`}
          inputClass="phone-input-field"
          buttonClass="phone-input-flag-button"
          dropdownClass="phone-input-dropdown"
          inputStyle={{
            width: "100%",
            height: "46px",
            backgroundColor: "transparent",
            color: "inherit",
            borderRadius: "12px",
            border: error
              ? "1px solid rgba(239, 68, 68, 0.55)"
              : "1px solid rgba(160, 128, 84, 0.22)",
            fontSize: "0.875rem",
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

      {error && <p className="form-help text-red-500">{error}</p>}
    </div>
  );
}
