import React from 'react';
import disneyPlusLogo from '../assets/icons/disney_plus.png';
import primeVideoLogo from '../assets/icons/prime_video.png';
import globoplayLogo from '../assets/icons/globoplay.png';

interface AppIconProps {
  type: string;
  name: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ type, name, className = '', size = 36 }) => {
  switch (type) {
    case 'netflix':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Official Netflix Red Ribbon N */}
          <path d="M25 12H38V88H25V12Z" fill="#B81D24" />
          <path d="M62 12H75V88H62V12Z" fill="#B81D24" />
          <path d="M25 12L63 88H75L37 12H25Z" fill="#E50914" />
        </svg>
      );

    case 'youtube':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Official YouTube Red Rounded Plaque with Play Triangle */}
          <rect width="88" height="62" x="6" y="19" rx="16" fill="#FF0000" />
          <polygon points="43,36 65,50 43,64" fill="#FFFFFF" />
        </svg>
      );

    case 'prime':
      return (
        <img
          src={primeVideoLogo}
          alt={name}
          className={`object-contain select-none transition-transform ${className}`}
          style={{ width: size, height: size }}
          loading="eager"
        />
      );

    case 'disney':
      return (
        <img
          src={disneyPlusLogo}
          alt={name}
          className={`object-contain select-none transition-transform ${className}`}
          style={{ width: size, height: size }}
          loading="eager"
        />
      );

    case 'spotify':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Official Spotify Green Circle with 3 Black Arcs */}
          <circle cx="50" cy="50" r="45" fill="#1ED760" />
          <path d="M28 38C42 33 63 34 75 41" stroke="#121212" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M31 50C43 46 59 47 70 53" stroke="#121212" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M34 62C44 58 57 59 66 64" stroke="#121212" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );

    case 'tidal':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Official Tidal Logo: 4 Diamonds forming a T on Black */}
          <rect width="90" height="90" x="5" y="5" rx="20" fill="#000000" />
          {/* Top-Left Diamond */}
          <polygon points="21.7,22 35.8,36 21.7,50 7.6,36" fill="#FFFFFF" />
          {/* Top-Center Diamond */}
          <polygon points="50,22 64.1,36 50,50 35.8,36" fill="#FFFFFF" />
          {/* Top-Right Diamond */}
          <polygon points="78.3,22 92.4,36 78.3,50 64.1,36" fill="#FFFFFF" />
          {/* Bottom-Center Diamond (Under Top-Center) */}
          <polygon points="50,50 64.1,64.1 50,78.3 35.8,64.1" fill="#FFFFFF" />
        </svg>
      );

    case 'globoplay':
      return (
        <img
          src={globoplayLogo}
          alt={name}
          className={`object-contain select-none transition-transform ${className}`}
          style={{ width: size, height: size }}
          loading="eager"
        />
      );

    case 'grid':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          {/* Free My TV / Android TV Official 3x3 App Drawer Grid */}
          <rect width="90" height="90" x="5" y="5" rx="20" fill="#18181B" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <circle cx="32" cy="32" r="6.5" fill="#FFFFFF" />
          <circle cx="50" cy="32" r="6.5" fill="#FFFFFF" />
          <circle cx="68" cy="32" r="6.5" fill="#FFFFFF" />
          <circle cx="32" cy="50" r="6.5" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="6.5" fill="#38BDF8" />
          <circle cx="68" cy="50" r="6.5" fill="#FFFFFF" />
          <circle cx="32" cy="68" r="6.5" fill="#FFFFFF" />
          <circle cx="50" cy="68" r="6.5" fill="#FFFFFF" />
          <circle cx="68" cy="68" r="6.5" fill="#FFFFFF" />
        </svg>
      );

    case 'appletv':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <rect width="90" height="90" x="5" y="5" rx="20" fill="#1A1A1A" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <path d="M46 36C46 32 49 28 52 26C49 26 45 28 43 31C41 34 40 37 40 39C43 39 46 38 46 36Z" fill="#FFFFFF" />
          <path d="M54 48C54 42 58 39 58 39C55 35 50 35 48 35C43 35 40 37 38 37C35 37 33 35 30 35C24 35 18 41 18 52C18 63 26 73 31 73C33 73 35 71 38 71C40 71 43 73 45 73C50 73 54 67 56 63C50 60 54 50 54 48Z" fill="#FFFFFF" />
          <text x="68" y="60" fill="#FFFFFF" fontSize="24" fontWeight="bold" fontFamily="sans-serif">tv</text>
        </svg>
      );

    case 'max':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <rect width="90" height="90" x="5" y="5" rx="20" fill="#000000" />
          <text x="50" y="60" fill="#FFFFFF" fontSize="30" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">max</text>
        </svg>
      );

    case 'plex':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <rect width="90" height="90" x="5" y="5" rx="20" fill="#282A2D" />
          <polygon points="32,24 64,50 32,76" fill="#E5A00D" />
          <polygon points="46,24 74,50 46,76" fill="#F4B400" opacity="0.6" />
        </svg>
      );

    case 'playstore':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={`select-none ${className}`}>
          {/* Authentic Google Play Multi-Colored Triangle Logo */}
          <path d="M22 16C20.6 17.2 20 19 20 21.5V78.5C20 81 20.6 82.8 22 84L23 85L57 51V49L23 15L22 16Z" fill="#00D2FF" />
          <path d="M68 62L57 51V49L68 38L69 38.6L82 46C86 48.3 86 51.7 82 54L69 61.4L68 62Z" fill="#FFD600" />
          <path d="M69 61.4L57 49.5L22 84.5C23.6 86 26.2 86.2 29 84.6L69 61.4Z" fill="#FF3333" />
          <path d="M69 38.6L29 15.4C26.2 13.8 23.6 14 22 15.5L57 50.5L69 38.6Z" fill="#00E676" />
        </svg>
      );

    case 'settings':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
          <rect width="90" height="90" x="5" y="5" rx="20" fill="#334155" />
          <circle cx="50" cy="50" r="16" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M50 18V28M50 72V82M18 50H28M72 50H82M27 27L34 34M66 66L73 73M73 27L66 34M34 66L27 73" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <div className={`flex items-center justify-center rounded-xl bg-white/10 text-white font-semibold ${className}`} style={{ width: size, height: size }}>
          {name.charAt(0)}
        </div>
      );
  }
};
