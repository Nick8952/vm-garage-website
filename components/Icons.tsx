/** Kleine Inline-SVG-Icons (keine Icon-Schrift, keine Emojis). Alle dekorativ: aria-hidden. */
const basis = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function TelefonIcon() {
  return (
    <svg {...basis}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
export function RouteIcon() {
  return (
    <svg {...basis}>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}
export function KopierenIcon() {
  return (
    <svg {...basis}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
export function MailIcon() {
  return (
    <svg {...basis}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
export function PfeilIcon() {
  return (
    <svg {...basis}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
export function MenueIcon() {
  return (
    <svg {...basis} width={24} height={24}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}
export function SchliessenIcon() {
  return (
    <svg {...basis} width={24} height={24}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
export function HakenIcon() {
  return (
    <svg {...basis}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Gefüllter Stern (Bewertungen) – kein Icon-Font, eigenes Pfad-SVG. */
export function SternIcon({ gefuellt = true }: { gefuellt?: boolean }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill={gefuellt ? "currentColor" : "none"} stroke="currentColor" strokeWidth={gefuellt ? 0 : 2} aria-hidden="true">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}
