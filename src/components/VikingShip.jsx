import React from "react";

export default function VikingShip({ size = 48, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sail */}
      <path
        d="M32 6 L32 32 L18 24 Z"
        fill="#f97316"
        opacity="0.9"
      />
      <path
        d="M32 6 L32 32 L46 24 Z"
        fill="#ea6c0a"
        opacity="0.9"
      />
      {/* Mast */}
      <line x1="32" y1="4" x2="32" y2="38" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />
      {/* Sail stripes */}
      <line x1="25" y1="20" x2="32" y2="14" stroke="white" strokeWidth="1" opacity="0.5" />
      <line x1="22" y1="26" x2="32" y2="18" stroke="white" strokeWidth="1" opacity="0.5" />
      {/* Hull */}
      <path
        d="M10 38 Q12 44 20 46 L44 46 Q52 44 54 38 Z"
        fill="#1e293b"
      />
      {/* Hull bottom curve */}
      <path
        d="M14 46 Q32 54 50 46"
        stroke="#f97316"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Oars */}
      <line x1="20" y1="43" x2="14" y2="52" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="45" x2="21" y2="54" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="37" y1="45" x2="43" y2="54" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="43" x2="50" y2="52" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      {/* Dragon head */}
      <path
        d="M54 38 Q58 36 60 34 Q58 32 56 33 Q57 30 55 30 Q53 31 53 34 L54 38Z"
        fill="#1e293b"
      />
      {/* Dragon eye */}
      <circle cx="57" cy="33" r="1" fill="#f97316" />
      {/* Shield on hull */}
      <circle cx="25" cy="42" r="2.5" fill="#f97316" opacity="0.7" />
      <circle cx="32" cy="42" r="2.5" fill="#f97316" opacity="0.7" />
      <circle cx="39" cy="42" r="2.5" fill="#f97316" opacity="0.7" />
      {/* Water waves */}
      <path
        d="M8 56 Q14 53 20 56 Q26 59 32 56 Q38 53 44 56 Q50 59 56 56"
        stroke="#94a3b8"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M4 60 Q10 57 16 60 Q22 63 28 60 Q34 57 40 60 Q46 63 52 60 Q58 57 62 60"
        stroke="#94a3b8"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
