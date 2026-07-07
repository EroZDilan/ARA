type IconProps = {
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BirdIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 14c2-1 3-3 3-5a5 5 0 0 1 10 0c0 1 .5 2 1.5 2.2-1 .8-2 1-3 .8.5 3-1.5 6-5.5 7-1.5.4-3 .3-4-.3" />
      <path d="M9 9h.01" />
      <path d="M3 19c2.5-.5 4-1.5 5-3" />
    </svg>
  );
}

export function HabitatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-4 3-6 5-9Z" />
      <path d="M12 21v-6" />
    </svg>
  );
}

export function CommunityIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="8.5" cy="8" r="2.7" />
      <circle cx="16" cy="9.5" r="2.2" />
      <path d="M3.5 19c.5-3 2.5-4.7 5-4.7s4.5 1.7 5 4.7" />
      <path d="M13.8 14.7c2 .2 3.6 1.8 4.1 4.3" />
    </svg>
  );
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5c-.8 0-1.5-.7-1.5-1.5Z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5c.8 0 1.5-.7 1.5-1.5Z" />
    </svg>
  );
}

export function NetworkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="17" r="2" />
      <circle cx="19" cy="17" r="2" />
      <path d="M12 7v5m0 0-5.2 3.3M12 12l5.2 3.3" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
