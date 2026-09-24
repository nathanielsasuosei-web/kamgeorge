// Lightweight inline SVG icon set (stroke style, inherits currentColor).

function Svg({ size = 24, children, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function HeadphonesIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z" />
      <path d="M21 14h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5Z" />
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
    </Svg>
  );
}

export function WatchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="6" />
      <polyline points="12 10 12 12 13 13" />
      <path d="m16.13 7.66-.81-4.05a1 1 0 0 0-.98-.81h-4.68a1 1 0 0 0-.98.81l-.81 4.05" />
      <path d="m7.88 16.36.8 4a1 1 0 0 0 .98.81h4.68a1 1 0 0 0 .98-.81l.81-4.05" />
    </Svg>
  );
}

export function BagIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
}

export function GlassesIcon(props) {
  return (
    <Svg {...props}>
      <rect x="2" y="9" width="8" height="5" rx="2.5" />
      <rect x="14" y="9" width="8" height="5" rx="2.5" />
      <path d="M10 11.5h4" />
    </Svg>
  );
}

export function TruckIcon(props) {
  return (
    <Svg {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </Svg>
  );
}

export function MobileIcon(props) {
  return (
    <Svg {...props}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </Svg>
  );
}

export function ReturnsIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </Svg>
  );
}

export function LockIcon(props) {
  return (
    <Svg {...props}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function ChatIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </Svg>
  );
}

export function SendIcon(props) {
  return (
    <Svg {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </Svg>
  );
}

export function XIcon(props) {
  return (
    <Svg {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  );
}

export function ZapIcon(props) {
  return (
    <Svg {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}

export function PackageIcon(props) {
  return (
    <Svg {...props}>
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </Svg>
  );
}

export function CardIcon(props) {
  return (
    <Svg {...props}>
      <rect width="22" height="16" x="1" y="4" rx="2" />
      <line x1="1" x2="23" y1="10" y2="10" />
    </Svg>
  );
}

export function DropletIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

export function CartIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </Svg>
  );
}

export function UserIcon(props) {
  return (
    <Svg {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </Svg>
  );
}

export function TagIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </Svg>
  );
}

export function GridIcon(props) {
  return (
    <Svg {...props}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </Svg>
  );
}

export function PhoneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function HelpIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <polyline points="6 9 12 15 18 9" />
    </Svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <Svg {...props}>
      <polyline points="15 18 9 12 15 6" />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

export function StarIcon(props) {
  return (
    <Svg {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function StarBadgeIcon({ size = 20, className }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#f68b1e",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: size * 0.65,
        lineHeight: 1,
        boxShadow: "0 2px 4px rgba(246, 139, 30, 0.3)",
      }}
      aria-hidden="true"
    >
      ★
    </span>
  );
}

// Category Icons
export function StoreIcon(props) {
  return (
    <Svg {...props}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2" />
    </Svg>
  );
}

export function PhoneTabletIcon(props) {
  return (
    <Svg {...props}>
      <rect width="10" height="14" x="3" y="5" rx="1.5" />
      <path d="M8 16h.01" />
      <rect width="7" height="11" x="14" y="8" rx="1" />
      <path d="M17.5 16h.01" />
    </Svg>
  );
}

export function BeautyIcon(props) {
  return (
    <Svg {...props}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </Svg>
  );
}

export function HomeOfficeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </Svg>
  );
}

export function AppliancesIcon(props) {
  return (
    <Svg {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="9" y1="5" x2="9" y2="6" />
      <line x1="9" y1="13" x2="9" y2="16" />
    </Svg>
  );
}

export function TvIcon(props) {
  return (
    <Svg {...props}>
      <rect width="20" height="15" x="2" y="7" rx="2" />
      <polyline points="17 2 12 7 7 2" />
    </Svg>
  );
}

export function FashionIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
    </Svg>
  );
}

export function SupermarketIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function TrashIcon(props) {
  return (
    <Svg {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
}

export function EditIcon(props) {
  return (
    <Svg {...props}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </Svg>
  );
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

// Icon helper function to render category icon by string key
export function RenderCategoryIcon({ iconKey, size = 18, className }) {
  switch (iconKey?.toLowerCase()) {
    case "store":
    case "stores":
    case "official":
      return <StoreIcon size={size} className={className} />;
    case "phone":
    case "phones":
    case "tablets":
      return <PhoneTabletIcon size={size} className={className} />;
    case "beauty":
    case "health":
      return <BeautyIcon size={size} className={className} />;
    case "home":
    case "office":
      return <HomeOfficeIcon size={size} className={className} />;
    case "appliances":
    case "appliance":
      return <AppliancesIcon size={size} className={className} />;
    case "electronics":
    case "tv":
      return <TvIcon size={size} className={className} />;
    case "fashion":
    case "clothes":
      return <FashionIcon size={size} className={className} />;
    case "supermarket":
    case "groceries":
      return <SupermarketIcon size={size} className={className} />;
    case "headphones":
      return <HeadphonesIcon size={size} className={className} />;
    case "watch":
      return <WatchIcon size={size} className={className} />;
    case "glasses":
      return <GlassesIcon size={size} className={className} />;
    default:
      return <StoreIcon size={size} className={className} />;
  }
}
