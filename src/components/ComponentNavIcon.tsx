import type { BridgeComponent } from "../lib/bridgeData";

type ComponentNavIconProps = {
  component: BridgeComponent;
};

export function ComponentNavIcon({ component }: ComponentNavIconProps) {
  return (
    <span className="component-nav-icon" aria-hidden="true">
      <svg viewBox="0 0 28 28" role="img">
        {renderIcon(component.navIcon)}
      </svg>
    </span>
  );
}

function renderIcon(icon: BridgeComponent["navIcon"]) {
  switch (icon) {
    case "shield-rail":
      return (
        <>
          <path d="M14 4l8 3v6c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V7z" />
          <path d="M10 12h8M10 16h8M14 8v12" />
        </>
      );
    case "deck-road":
      return (
        <>
          <path d="M4 10h20M6 16h16M8 22h12" />
          <path d="M8 10v7M20 10v7" />
          <path d="M14 11v4" className="icon-dash" />
        </>
      );
    case "girder":
      return (
        <>
          <path d="M4 9h20M4 19h20" />
          <path d="M7 10l4 8M13 10l4 8M19 10l-4 8" />
        </>
      );
    case "cross-girder":
      return (
        <>
          <path d="M5 9h18M5 19h18M9 5v18M19 5v18" />
          <path d="M9 9l10 10M19 9L9 19" />
        </>
      );
    case "bearing-pad":
      return (
        <>
          <path d="M7 8h14M9 8v6M19 8v6" />
          <rect height="5" rx="1.5" width="14" x="7" y="14" />
          <path d="M5 22h18" />
        </>
      );
    case "pier-column":
      return (
        <>
          <path d="M8 6h12M7 22h14" />
          <rect height="14" rx="1.8" width="8" x="10" y="8" />
        </>
      );
    case "abutment-wall":
      return (
        <>
          <path d="M7 7h8v16H7z" />
          <path d="M15 10l7 4v9h-7" />
          <path d="M18 15h4M18 19h4" />
        </>
      );
    case "pile-cap":
      return (
        <>
          <rect height="6" rx="1.5" width="18" x="5" y="8" />
          <path d="M8 14v8M14 14v8M20 14v8" />
          <path d="M6 23h16" />
        </>
      );
    case "pile-group":
      return (
        <>
          <rect height="5" rx="1.5" width="18" x="5" y="5" />
          <path d="M7 10v14M12 10v14M17 10v14M22 10v14" />
        </>
      );
    case "soil-strata":
      return (
        <>
          <path d="M4 10c4-3 7 3 11 0s6-2 9 0" />
          <path d="M4 16c4-3 7 3 11 0s6-2 9 0" />
          <path d="M4 22c4-3 7 3 11 0s6-2 9 0" />
        </>
      );
    default:
      return null;
  }
}
