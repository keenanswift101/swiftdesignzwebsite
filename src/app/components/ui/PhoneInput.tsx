"use client";

import { useState, useRef, useEffect } from "react";

const DIAL_CODES = [
  { code: "+264", country: "Namibia",      iso: "na" },
  { code: "+27",  country: "South Africa", iso: "za" },
  { code: "+267", country: "Botswana",     iso: "bw" },
  { code: "+263", country: "Zimbabwe",     iso: "zw" },
  { code: "+260", country: "Zambia",       iso: "zm" },
  { code: "+258", country: "Mozambique",   iso: "mz" },
  { code: "+244", country: "Angola",       iso: "ao" },
  { code: "+254", country: "Kenya",        iso: "ke" },
  { code: "+234", country: "Nigeria",      iso: "ng" },
  { code: "+44",  country: "UK",           iso: "gb" },
  { code: "+1",   country: "US / Canada",  iso: "us" },
  { code: "+49",  country: "Germany",      iso: "de" },
  { code: "+61",  country: "Australia",    iso: "au" },
  { code: "+91",  country: "India",        iso: "in" },
];

const SORTED_CODES = [...DIAL_CODES].sort((a, b) => b.code.length - a.code.length);

function parseStored(value: string): { dialCode: string; local: string } {
  if (!value) return { dialCode: "+264", local: "" };
  const compact = value.replace(/\s/g, "");
  for (const { code } of SORTED_CODES) {
    if (compact.startsWith(code)) {
      return { dialCode: code, local: value.slice(code.length).trimStart() };
    }
  }
  return { dialCode: "+264", local: value };
}

function stripDialCode(raw: string, dialCode: string): string {
  const digitsOnly = raw.replace(/\D/g, "");
  const codeDigits = dialCode.replace("+", "");
  if (digitsOnly.startsWith(codeDigits) && digitsOnly.length > codeDigits.length + 3) {
    const after = digitsOnly.slice(codeDigits.length);
    return after.startsWith("0") ? after.slice(1) : after;
  }
  return raw;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function PhoneInput({ value, onChange, placeholder = "81 234 5678", className = "", style }: Props) {
  const parsed = parseStored(value);
  const [dialCode, setDialCode] = useState(parsed.dialCode);
  const [localNumber, setLocalNumber] = useState(parsed.local);
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const selected = DIAL_CODES.find((d) => d.code === dialCode) ?? DIAL_CODES[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleDialChange = (code: string) => {
    setDialCode(code);
    setOpen(false);
    onChange(localNumber ? `${code} ${localNumber}` : "");
  };

  const handleLocalChange = (raw: string) => {
    const cleaned = stripDialCode(raw, dialCode);
    setLocalNumber(cleaned);
    onChange(cleaned ? `${dialCode} ${cleaned}` : "");
  };

  const containerStyle: React.CSSProperties = { ...style, display: "flex", alignItems: "stretch", overflow: "visible" };

  return (
    <div className={"rounded-lg " + className} style={containerStyle}>
      {/* Dial code selector */}
      <div ref={dropRef} className="relative shrink-0" style={{ borderRight: "1px solid rgba(48,176,176,0.15)" }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 h-full px-2.5 cursor-pointer"
          aria-label="Select country code"
          aria-expanded={open}
        >
          <img
            src={`https://flagcdn.com/w20/${selected.iso}.png`}
            srcSet={`https://flagcdn.com/w40/${selected.iso}.png 2x`}
            width={18}
            height={13}
            alt={selected.country}
            className="rounded-sm shrink-0"
            style={{ objectFit: "cover" }}
          />
          <span className="text-gray-400 text-[12px] font-mono">{selected.code}</span>
          <span className="text-gray-600 text-[9px]">{open ? "▲" : "▾"}</span>
        </button>

        {/* Dropdown list */}
        {open && (
          <div
            className="absolute top-full left-0 z-200 mt-1 rounded-lg overflow-hidden overflow-y-auto"
            style={{
              background: "rgba(16,16,16,0.98)",
              border: "1px solid rgba(48,176,176,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              backdropFilter: "blur(12px)",
              minWidth: "170px",
              maxHeight: "240px",
            }}
          >
            {DIAL_CODES.map(({ code, country, iso }) => (
              <button
                key={code}
                type="button"
                onClick={() => handleDialChange(code)}
                className={"w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors " + (
                  code === dialCode
                    ? "bg-[rgba(48,176,176,0.12)] text-(--swift-teal)"
                    : "text-gray-300 hover:bg-white/5"
                )}
              >
                <img
                  src={`https://flagcdn.com/w20/${iso}.png`}
                  srcSet={`https://flagcdn.com/w40/${iso}.png 2x`}
                  width={18}
                  height={13}
                  alt=""
                  className="rounded-sm shrink-0"
                  style={{ objectFit: "cover" }}
                />
                <span className="font-mono text-[12px] shrink-0">{code}</span>
                <span className="text-[11px] text-gray-500">{country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Local number input */}
      <input
        type="tel"
        value={localNumber}
        onChange={(e) => handleLocalChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="tel-national"
        className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none px-3"
        style={{ border: "none" }}
      />
    </div>
  );
}
