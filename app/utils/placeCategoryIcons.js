/** آیکون‌های اختصاصی مراکز — outline 24×24، هم‌سبک Heroicons */

function Svg({ className, children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function PlaceHospitalIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M4 8h16" />
      <path d="M12 12v5M9.5 14.5h5" />
    </Svg>
  );
}

export function PlaceClinicIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 20V10l6-3 6 3v10" />
      <path d="M9 14h6M12 11v6" />
      <path d="M4 20h16" />
    </Svg>
  );
}

export function PlacePharmacyIcon(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M12 8v8M8.5 12h7" />
      <path d="M8 20h8" />
    </Svg>
  );
}

export function PlaceLabIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 3h6l1 7-4 11H12L8 10l1-7z" />
      <path d="M8 10h8" />
    </Svg>
  );
}

export function PlaceEmergencyIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l9 16H3L12 3z" />
      <path d="M12 9v4M12 16h.01" />
    </Svg>
  );
}

export function PlaceBloodIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 21c-3.5-4.5-6-7.5-6-10.5a6 6 0 1112 0C18 13.5 15.5 16.5 12 21z" />
      <path d="M12 11v3" />
    </Svg>
  );
}

export function PlaceMosqueIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 4c-2 0-3.5 1.5-3.5 3.5V9h7V7.5C15.5 5.5 14 4 12 4z" />
      <path d="M8.5 9h7v11h-7V9z" />
      <path d="M6 20h12" />
      <path d="M18 6V4M6 6V4" />
      <path d="M12 2v2" />
    </Svg>
  );
}

export function PlaceHusseiniyaIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 20V10l7-4 7 4v10" />
      <path d="M5 20h14" />
      <path d="M12 6v4" />
      <path d="M10 14h4" />
    </Svg>
  );
}

export function PlaceCemeteryIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 4c-2.5 0-4 1.8-4 4v12h8V8c0-2.2-1.5-4-4-4z" />
      <path d="M8 20h8" />
      <path d="M10 12h4" />
    </Svg>
  );
}

export function PlacePoliceIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 11h6M12 8v6" />
    </Svg>
  );
}

export function PlaceFireTruckIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 14h12v4H3v-4z" />
      <path d="M15 14h3l2 4h-5v-4z" />
      <path d="M6 14V9h6v5" />
      <path d="M9 6h3v3H9V6z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </Svg>
  );
}

export function PlaceGovernmentIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20V9l8-5 8 5v11" />
      <path d="M4 20h16" />
      <path d="M9 20v-6h6v6" />
      <path d="M12 4v3" />
    </Svg>
  );
}

export function PlaceBankIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 10h16L12 4 4 10z" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M4 18h16" />
    </Svg>
  );
}

export function PlaceAtmIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M12 13v3" />
      <path d="M7 18h10" />
    </Svg>
  );
}

export function PlaceSchoolIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3L3 8l9 5 9-5-9-5z" />
      <path d="M6 10v6l6 3 6-3v-6" />
      <path d="M20 8v8" />
    </Svg>
  );
}

export function PlaceUniversityIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 10h16L12 5 4 10z" />
      <path d="M6 10v7M10 10v7M14 10v7M18 10v7" />
      <path d="M4 17h16" />
      <circle cx="12" cy="3" r="1" />
    </Svg>
  );
}

export function PlaceBusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 8h14a2 2 0 012 2v6H3v-6a2 2 0 012-2z" />
      <path d="M3 16v2h18v-2" />
      <path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
      <path d="M8 12h8" />
    </Svg>
  );
}

export function PlaceTrainIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 6h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z" />
      <path d="M4 16h16" />
      <path d="M8 10h8M10 14h4" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
      <path d="M12 4v2" />
    </Svg>
  );
}

export function PlaceMetroIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="8" width="16" height="10" rx="2" />
      <path d="M8 14h8M12 11v6" />
      <path d="M7 18l-2 2M17 18l2 2" />
      <path d="M12 4v4" />
    </Svg>
  );
}

export function PlaceTaxiIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 14h16l-2-6H6l-2 6z" />
      <path d="M6 14v3h12v-3" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
      <path d="M10 8h4l1 3h-6l1-3z" />
    </Svg>
  );
}

export function PlaceAirportIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 12h18" />
      <path d="M12 12L8 8l4 4-4 4 4-4 4 4-4-4 4-4-4 4z" />
    </Svg>
  );
}

export function PlacePortIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 4v16" />
      <path d="M8 8c0 2 1.8 4 4 4s4-2 4-4" />
      <path d="M5 20c2-2 4-3 7-3s5 1 7 3" />
    </Svg>
  );
}

export function PlaceGasPumpIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 20V8h8v12" />
      <path d="M6 8h8V5H6v3z" />
      <path d="M14 12h2l2 3v5h-4v-8z" />
      <path d="M9 12v4" />
      <path d="M4 20h12" />
    </Svg>
  );
}

export function PlaceCngIcon(props) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="12" rx="5" ry="8" />
      <path d="M12 4v16" />
      <path d="M9 8h6M9 16h6" />
    </Svg>
  );
}

export function PlaceEvChargeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M11 4L6 14h4l-1 6 7-12h-4l-1-4z" />
      <path d="M18 8v8M16 10h4" />
    </Svg>
  );
}

export function PlaceParkingIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 8h3.5a2.5 2.5 0 010 5H9V8z" />
    </Svg>
  );
}

export function PlaceParkIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 21V11" />
      <path d="M12 11c-3-2-6-1-6-5 0-2 2-4 6-4s6 2 6 4c0 4-3 3-6 5z" />
      <path d="M5 21h14" />
    </Svg>
  );
}

export function PlaceMountainIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20L10 8l4 6 2-4 4 10H4z" />
      <path d="M10 8l2 4" />
    </Svg>
  );
}

export function PlaceBeachIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 17c3-2 6-2 9 0s6 2 9 0" />
      <circle cx="17" cy="7" r="3" />
      <path d="M6 14l2-4 2 2 2-3" />
    </Svg>
  );
}

export function PlaceCinemaIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 6v12M11 6v12M15 6v12M19 6v12" />
    </Svg>
  );
}

export function PlaceMuseumIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20h16" />
      <path d="M6 20V10l6-4 6 4v10" />
      <path d="M9 14h6M12 10v4" />
    </Svg>
  );
}

export function PlaceStadiumIcon(props) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="14" rx="9" ry="5" />
      <path d="M3 14v3c0 2.8 4 5 9 5s9-2.2 9-5v-3" />
      <path d="M12 9V5M8 10l-2-3M16 10l2-3" />
    </Svg>
  );
}

export function PlacePoolIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 12c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
      <path d="M4 16c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
      <path d="M6 8h12l-1-3H7l-1 3z" />
    </Svg>
  );
}

export function PlaceShoppingIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 8h15l-1.5 9H7.5L6 8z" />
      <path d="M6 8L5 4H3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </Svg>
  );
}

export function PlaceBazaarIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 10h16v10H4V10z" />
      <path d="M4 10c0-3 2-5 4-5h8c2 0 4 2 4 5" />
      <path d="M12 5V3" />
    </Svg>
  );
}

export function PlaceHotelIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 20V8h16v12" />
      <path d="M4 12h16" />
      <path d="M8 12v8M16 12v8" />
      <path d="M10 15h4" />
    </Svg>
  );
}

export function PlaceTravelAgencyIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 10h8M8 14h5" />
      <path d="M12 3v3" />
    </Svg>
  );
}

export function PlaceMedicalCategoryIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </Svg>
  );
}

export function PlaceSecurityCategoryIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l8 4v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

export function PlaceTransportCategoryIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" />
      <path d="M7 9l2-2M17 9l-2-2M7 15l2 2M17 15l-2 2" />
    </Svg>
  );
}

export function PlaceFuelCategoryIcon(props) {
  return <PlaceGasPumpIcon {...props} />;
}

export function PlacePublicCategoryIcon(props) {
  return <PlaceParkIcon {...props} />;
}

export function PlaceCultureCategoryIcon(props) {
  return <PlaceMuseumIcon {...props} />;
}

export function PlaceSportsCategoryIcon(props) {
  return <PlaceStadiumIcon {...props} />;
}

export function PlaceTourismCategoryIcon(props) {
  return <PlaceHotelIcon {...props} />;
}

export function PlaceReligiousCategoryIcon(props) {
  return <PlaceMosqueIcon {...props} />;
}

export const PLACE_CATEGORY_CUSTOM_ICONS = {
  PlaceHospitalIcon,
  PlaceClinicIcon,
  PlacePharmacyIcon,
  PlaceLabIcon,
  PlaceEmergencyIcon,
  PlaceBloodIcon,
  PlaceMosqueIcon,
  PlaceHusseiniyaIcon,
  PlaceCemeteryIcon,
  PlacePoliceIcon,
  PlaceFireTruckIcon,
  PlaceGovernmentIcon,
  PlaceBankIcon,
  PlaceAtmIcon,
  PlaceSchoolIcon,
  PlaceUniversityIcon,
  PlaceBusIcon,
  PlaceTrainIcon,
  PlaceMetroIcon,
  PlaceTaxiIcon,
  PlaceAirportIcon,
  PlacePortIcon,
  PlaceGasPumpIcon,
  PlaceCngIcon,
  PlaceEvChargeIcon,
  PlaceParkingIcon,
  PlaceParkIcon,
  PlaceMountainIcon,
  PlaceBeachIcon,
  PlaceCinemaIcon,
  PlaceMuseumIcon,
  PlaceStadiumIcon,
  PlacePoolIcon,
  PlaceShoppingIcon,
  PlaceBazaarIcon,
  PlaceHotelIcon,
  PlaceTravelAgencyIcon,
  PlaceMedicalCategoryIcon,
  PlaceSecurityCategoryIcon,
  PlaceTransportCategoryIcon,
  PlaceFuelCategoryIcon,
  PlacePublicCategoryIcon,
  PlaceCultureCategoryIcon,
  PlaceSportsCategoryIcon,
  PlaceTourismCategoryIcon,
  PlaceReligiousCategoryIcon,
};
