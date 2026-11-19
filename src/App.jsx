import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  Palette,
  Sparkles,
  Mail,
  Bell,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  X,
  Upload,
  ArrowDown,
  Send,
  Eye,
  Lock,
  Layers,
  Frame,
  Award,
  Compass,
  Menu,
  ExternalLink,
  IndianRupee,
  Users,
  Save,
  RotateCcw,
  ShieldCheck,
  KeyRound,
  Cloud
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection
} from 'firebase/firestore';

// ============================================================================
// 0. CLOUD DATABASE (FIRESTORE) & STUDIO SECURITY CONFIGURATION
// Supports both live preview environment globals & Vite GitHub Actions secrets
// ============================================================================

// ES2015-safe helper to read environment variables without triggering import.meta warnings
const getEnvVar = (key) => {
  try {
    if (typeof window !== 'undefined' && window.__STUDIO_ENV__ && window.__STUDIO_ENV__[key]) {
      return window.__STUDIO_ENV__[key];
    }
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore restricted environment access
  }
  return '';
};

const getFirebaseConfig = () => {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    return JSON.parse(__firebase_config);
  }
  // Fallback for GitHub Actions / CI deployment using injected environment secrets
  const apiKey = getEnvVar('VITE_FIREBASE_API_KEY');
  if (apiKey) {
    return {
      apiKey,
      authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
      projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
      storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
      appId: getEnvVar('VITE_FIREBASE_APP_ID')
    };
  }
  return null;
};

const firebaseConfig = getFirebaseConfig();
const firebaseApp = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = firebaseApp ? getAuth(firebaseApp) : null;
const db = firebaseApp ? getFirestore(firebaseApp) : null;
const appId =
  typeof __app_id !== 'undefined' && __app_id
    ? __app_id
    : getEnvVar('VITE_APP_ID') || 'sourav-acharaya-portfolio';

// Admin Studio Master Passcode (Override via VITE_ADMIN_PASSWORD in GitHub Secrets)
const STUDIO_MASTER_PASSWORD =
  getEnvVar('VITE_ADMIN_PASSWORD') || 'Sourav@Art2026';

// ============================================================================
// 1. PROCEDURAL HIGH-DETAIL FINE ART GENERATOR (SVG DATA URIs)
// Guarantees zero broken images & museum-grade bespoke artworks across all 4
// mediums: Impasto Paintings, Charcoal Sketches, Color Pencil, and Watercolor.
// ============================================================================

const createArtDataUri = (svgContent) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;

const ART_ASSETS = {
  // Hero Impasto Background matching the vibrant Prussian teal, cadmium ochre, cream & vermilion palette
  heroImpasto: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="impastoTexture" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="4" seed="14" result="noise"/>
          <feDiffuseLighting in="noise" lighting-color="#FFFDF8" surfaceScale="3.2" result="light">
            <feDistantLight azimuth="45" elevation="55"/>
          </feDiffuseLighting>
          <feBlend mode="multiply" in="SourceGraphic" in2="light"/>
        </filter>
        <filter id="brushRough">
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="turb"/>
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="28" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <rect width="1600" height="1000" fill="#E8B931"/>
      <!-- Broad Cadmium Ochre & Warm Amber Base Strokes -->
      <path d="M-50,120 Q420,40 860,160 T1650,90 L1650,420 Q1120,360 640,460 T-50,390 Z" fill="#F2CA52" filter="url(#brushRough)"/>
      <path d="M120,580 Q580,500 1120,620 T1660,540 L1660,1040 L-40,1040 Z" fill="#D98A1C" filter="url(#brushRough)"/>
      <!-- Deep Prussian Teal Central Block & Strokes -->
      <rect x="460" y="210" width="640" height="510" rx="12" fill="#134659" filter="url(#brushRough)"/>
      <path d="M480,230 L1080,250 L1060,690 L470,670 Z" fill="#1B5B73" opacity="0.85" filter="url(#brushRough)"/>
      <path d="M80,620 Q340,560 540,650 L520,980 L40,980 Z" fill="#164E63" filter="url(#brushRough)"/>
      <!-- Sage & Viridian Palette Knife Layering -->
      <path d="M1040,260 L1460,240 L1440,660 L1050,640 Z" fill="#6F9A52" opacity="0.88" filter="url(#brushRough)"/>
      <path d="M180,140 L440,160 L410,490 L160,460 Z" fill="#8FB06A" opacity="0.75" filter="url(#brushRough)"/>
      <!-- Thick Titanium Cream Impasto Slabs -->
      <path d="M420,550 L740,540 L720,890 L400,900 Z" fill="#F6F1E3" filter="url(#brushRough)"/>
      <path d="M1120,560 L1410,550 L1390,880 L1100,870 Z" fill="#EFE8D5" filter="url(#brushRough)"/>
      <path d="M510,90 Q840,45 1130,115 L1100,210 Q810,185 500,220 Z" fill="#FAF4E1" opacity="0.92" filter="url(#brushRough)"/>
      <!-- Vermilion Red Knife Lines & Drips -->
      <path d="M455,150 L472,890" stroke="#C83524" stroke-width="16" stroke-linecap="round" filter="url(#brushRough)"/>
      <path d="M360,445 L770,435" stroke="#D13B28" stroke-width="11" stroke-linecap="round" filter="url(#brushRough)"/>
      <path d="M1395,210 L1412,920" stroke="#C23020" stroke-width="18" stroke-linecap="round" filter="url(#brushRough)"/>
      <path d="M775,660 L784,990" stroke="#C83524" stroke-width="14" stroke-linecap="round"/>
      <!-- Canvas Relief Overlay -->
      <rect width="1600" height="1000" fill="transparent" filter="url(#impastoTexture)" opacity="0.48"/>
    </svg>
  `),

  // Ultra-Subtle Fine Art Cotton Paper & Soft Pigment Mist (keeps scrolling effortless & museum-clean)
  galleryPaperTexture: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <defs>
        <filter id="cottonGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="11"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
      </defs>
      <rect width="800" height="800" fill="transparent"/>
      <rect width="800" height="800" filter="url(#cottonGrain)" opacity="0.032"/>
    </svg>
  `),

  // Featured Painting 1: Monolith in Prussian & Ochre
  painting1: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <filter id="p1" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="4" seed="4"/>
          <feDisplacementMap in="SourceGraphic" scale="22"/>
        </filter>
      </defs>
      <rect width="800" height="1000" fill="#E3B138"/>
      <rect x="60" y="70" width="680" height="860" fill="#F2CA52" filter="url(#p1)"/>
      <rect x="190" y="190" width="430" height="480" fill="#154A5E" filter="url(#p1)"/>
      <path d="M160,540 L460,530 L440,880 L150,870 Z" fill="#F7F2E6" filter="url(#p1)"/>
      <path d="M500,260 L710,250 L690,690 L490,680 Z" fill="#6F9A52" opacity="0.85" filter="url(#p1)"/>
      <path d="M225,130 L238,910" stroke="#C83826" stroke-width="15" filter="url(#p1)"/>
      <path d="M140,420 L540,410" stroke="#C83826" stroke-width="10" filter="url(#p1)"/>
    </svg>
  `),

  // Featured Painting 2: Golden Monsoon over Ghat
  painting2: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F7E4B2"/>
          <stop offset="55%" stop-color="#E5A93B"/>
          <stop offset="100%" stop-color="#1D596E"/>
        </linearGradient>
        <filter id="oil2">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="9"/>
          <feDisplacementMap in="SourceGraphic" scale="18"/>
        </filter>
      </defs>
      <rect width="800" height="1000" fill="url(#sky2)"/>
      <circle cx="540" cy="290" r="115" fill="#FFF6DC" opacity="0.9" filter="url(#oil2)"/>
      <path d="M0,560 Q260,490 520,550 T800,520 L800,1000 L0,1000 Z" fill="#164657" filter="url(#oil2)"/>
      <path d="M80,620 L340,610 L320,840 L60,850 Z" fill="#C94A2C" opacity="0.88" filter="url(#oil2)"/>
      <path d="M360,650 L720,640 L700,900 L350,890 Z" fill="#E9B84A" opacity="0.82" filter="url(#oil2)"/>
      <path d="M120,760 Q400,730 680,780" stroke="#FAF4E6" stroke-width="14" fill="none" filter="url(#oil2)"/>
    </svg>
  `),

  // Featured Painting 3: Symphony in Vermilion & Sage
  painting3: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <filter id="oil3">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" seed="21"/>
          <feDisplacementMap in="SourceGraphic" scale="24"/>
        </filter>
      </defs>
      <rect width="800" height="1000" fill="#F4EDE0"/>
      <path d="M90,110 L710,130 L680,870 L110,850 Z" fill="#2A6273" filter="url(#oil3)"/>
      <path d="M160,180 L470,170 L450,590 L150,580 Z" fill="#D99B26" filter="url(#oil3)"/>
      <path d="M330,360 L660,350 L640,790 L310,780 Z" fill="#C83E2B" opacity="0.9" filter="url(#oil3)"/>
      <path d="M210,520 L550,510 L530,840 L200,830 Z" fill="#FAF6ED" opacity="0.92" filter="url(#oil3)"/>
    </svg>
  `),

  // Sketch 1: Charcoal Portrait Study — Wisdom in Shadow
  sketch1: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <radialGradient id="paper1" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#FBF8F1"/>
          <stop offset="100%" stop-color="#E7DFD0"/>
        </radialGradient>
        <filter id="charcoal">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" seed="7"/>
          <feDisplacementMap in="SourceGraphic" scale="8"/>
        </filter>
      </defs>
      <rect width="800" height="1000" fill="url(#paper1)"/>
      <!-- Expressive Charcoal Head & Shoulder Contour -->
      <path d="M230,780 Q250,620 330,570 Q275,490 285,370 Q295,220 415,215 Q535,220 530,375 Q525,490 470,565 Q565,615 590,790" fill="none" stroke="#2D2B28" stroke-width="5" filter="url(#charcoal)"/>
      <!-- Cross-hatching Shadow Planes -->
      <path d="M415,235 Q515,250 510,385 Q500,490 435,545 L410,420 Z" fill="#3B3834" opacity="0.28" filter="url(#charcoal)"/>
      <path d="M325,365 Q360,350 385,368 M435,365 Q465,350 492,366" stroke="#262421" stroke-width="6" stroke-linecap="round" filter="url(#charcoal)"/>
      <path d="M408,370 L398,445 L420,452" fill="none" stroke="#2B2926" stroke-width="4" filter="url(#charcoal)"/>
      <path d="M368,492 Q410,508 450,490" fill="none" stroke="#2B2926" stroke-width="4.5" filter="url(#charcoal)"/>
      <!-- Gestural Graphite Strokes -->
      <g stroke="#4A4640" stroke-width="1.6" opacity="0.55">
        <line x1="440" y1="270" x2="505" y2="330"/>
        <line x1="445" y1="295" x2="510" y2="355"/>
        <line x1="440" y1="320" x2="505" y2="380"/>
        <line x1="435" y1="345" x2="498" y2="405"/>
        <line x1="430" y1="395" x2="492" y2="455"/>
        <line x1="250" y1="680" x2="350" y2="780"/>
        <line x1="270" y1="660" x2="380" y2="770"/>
        <line x1="460" y1="630" x2="575" y2="750"/>
      </g>
      <text x="540" y="910" font-family="Georgia, serif" font-style="italic" font-size="22" fill="#5C574F">S. Acharaya '25</text>
    </svg>
  `),

  // Sketch 2: Architectural Solitude — Varanasi Steps
  sketch2: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="#F4EFE4"/>
      <g stroke="#33302B" fill="none" stroke-linecap="round">
        <path d="M120,760 L680,760 M150,715 L650,715 M180,670 L620,670 M210,625 L590,625" stroke-width="3.5"/>
        <path d="M240,625 L240,340 L370,260 L500,340 L500,625" stroke-width="4"/>
        <path d="M295,625 L295,450 Q370,380 445,450 L445,625" stroke-width="3.5"/>
        <path d="M500,410 L630,410 L630,625" stroke-width="3"/>
        <path d="M140,830 Q390,805 660,835" stroke-width="2.5" opacity="0.7"/>
        <path d="M190,875 Q410,855 610,880" stroke-width="2" opacity="0.5"/>
      </g>
      <rect x="305" y="455" width="130" height="170" fill="#3D3934" opacity="0.22"/>
    </svg>
  `),

  // Color Pencil 1: Botanical Scarlet & Emerald Study
  colorPencil1: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <radialGradient id="cpBg" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#FCF9F2"/>
          <stop offset="100%" stop-color="#EFE7D8"/>
        </radialGradient>
        <filter id="pencilGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="3" seed="12"/>
          <feDisplacementMap in="SourceGraphic" scale="5"/>
        </filter>
      </defs>
      <rect width="800" height="1000" fill="url(#cpBg)"/>
      <!-- Stem & Layered Emerald Leaves -->
      <path d="M405,840 Q390,620 415,430" stroke="#2D5E43" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M402,650 Q260,610 220,510 Q320,515 402,610 Z" fill="#3B7A57" filter="url(#pencilGrain)"/>
      <path d="M408,580 Q550,530 595,435 Q490,450 408,545 Z" fill="#2B6144" filter="url(#pencilGrain)"/>
      <!-- Rich Layered Vermilion & Ochre Hibiscus Petals -->
      <g filter="url(#pencilGrain)">
        <ellipse cx="415" cy="315" rx="95" ry="135" fill="#D43D2A" transform="rotate(-12 415 315)"/>
        <ellipse cx="495" cy="385" rx="125" ry="90" fill="#E05336" transform="rotate(18 495 385)"/>
        <ellipse cx="330" cy="390" rx="125" ry="90" fill="#C43121" transform="rotate(-22 330 390)"/>
        <ellipse cx="455" cy="465" rx="95" ry="115" fill="#D9482B" transform="rotate(35 455 465)"/>
        <ellipse cx="365" cy="465" rx="95" ry="115" fill="#B82B1D" transform="rotate(-35 365 465)"/>
        <circle cx="412" cy="400" r="46" fill="#E8A828"/>
        <circle cx="412" cy="400" r="22" fill="#7D1D14"/>
      </g>
    </svg>
  `),

  // Color Pencil 2: Kingfisher in Prismacolor
  colorPencil2: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <rect width="800" height="1000" fill="#F9F5EC"/>
      <path d="M160,720 Q410,660 660,695" stroke="#6E5239" stroke-width="16" fill="none" stroke-linecap="round"/>
      <!-- Vibrant Teal & Copper Plumage -->
      <path d="M340,665 Q300,520 365,405 Q430,335 495,380 Q535,455 475,585 Q430,655 340,665 Z" fill="#186A82"/>
      <path d="M365,470 Q425,475 455,565 Q410,635 355,635 Q335,555 365,470 Z" fill="#E07A2B"/>
      <path d="M475,375 L615,345 L490,412 Z" fill="#2A2D30"/>
      <circle cx="455" cy="382" r="9" fill="#1A1A1A"/>
      <circle cx="458" cy="379" r="3" fill="#FFFFFF"/>
      <path d="M345,560 L235,695 L325,630 Z" fill="#114C5E"/>
    </svg>
  `),

  // Watercolor 1: Misty Himalayan Dawn
  watercolor1: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <linearGradient id="wcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F7E6C4"/>
          <stop offset="45%" stop-color="#F2C68D"/>
          <stop offset="100%" stop-color="#A8C7D1"/>
        </linearGradient>
        <filter id="wcBleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="5"/>
          <feDisplacementMap in="SourceGraphic" scale="32"/>
          <feGaussianBlur stdDeviation="2.5"/>
        </filter>
      </defs>
      <rect width="800" height="1000" fill="#FAF6EE"/>
      <rect x="45" y="45" width="710" height="910" fill="url(#wcSky)" opacity="0.85"/>
      <circle cx="530" cy="270" r="85" fill="#FFF8E6" opacity="0.85" filter="url(#wcBleed)"/>
      <!-- Translucent Layered Mountain Washes -->
      <path d="M45,490 L240,340 L430,450 L610,310 L755,430 L755,955 L45,955 Z" fill="#6D97A8" opacity="0.58" filter="url(#wcBleed)"/>
      <path d="M45,580 L190,460 L390,560 L570,430 L755,540 L755,955 L45,955 Z" fill="#2E6478" opacity="0.68" filter="url(#wcBleed)"/>
      <path d="M45,710 Q280,650 510,720 T755,690 L755,955 L45,955 Z" fill="#1B4859" opacity="0.78" filter="url(#wcBleed)"/>
    </svg>
  `),

  // Watercolor 2: Rain-Washed Courtyard in Kolkata
  watercolor2: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
      <defs>
        <filter id="wc2">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="17"/>
          <feDisplacementMap in="SourceGraphic" scale="24"/>
          <feGaussianBlur stdDeviation="1.8"/>
        </filter>
      </defs>
      <rect width="800" height="1000" fill="#F8F3E8"/>
      <rect x="70" y="90" width="660" height="580" fill="#E6B85C" opacity="0.45" filter="url(#wc2)"/>
      <rect x="140" y="180" width="230" height="440" fill="#235C6E" opacity="0.65" filter="url(#wc2)"/>
      <rect x="430" y="210" width="210" height="410" fill="#C44933" opacity="0.55" filter="url(#wc2)"/>
      <!-- Wet Pavement Reflections -->
      <path d="M70,660 L730,660 L730,920 L70,920 Z" fill="#9BB7C2" opacity="0.55" filter="url(#wc2)"/>
      <ellipse cx="260" cy="760" rx="95" ry="28" fill="#1D5263" opacity="0.45" filter="url(#wc2)"/>
      <ellipse cx="520" cy="800" rx="110" ry="30" fill="#C44933" opacity="0.42" filter="url(#wc2)"/>
    </svg>
  `),

  // Artist Studio Portrait Graphic
  artistPortrait: createArtDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 860">
      <defs>
        <linearGradient id="studioWarm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F5EFE4"/>
          <stop offset="100%" stop-color="#E3D7C3"/>
        </linearGradient>
      </defs>
      <rect width="700" height="860" fill="url(#studioWarm)"/>
      <!-- Background Easel & Canvas -->
      <rect x="85" y="110" width="330" height="420" rx="6" fill="#FAF6EE" stroke="#C8B99E" stroke-width="4"/>
      <rect x="115" y="145" width="270" height="320" fill="#1B4D5C" opacity="0.88"/>
      <path d="M135,230 L355,215 L340,390 L130,380 Z" fill="#D99B26" opacity="0.85"/>
      <path d="M295,160 L305,455" stroke="#C83E2B" stroke-width="10"/>
      <!-- Stylized Artistic Silhouette of Sourav Acharaya at Work -->
      <circle cx="465" cy="315" r="68" fill="#2A2927"/>
      <path d="M350,760 Q365,465 465,455 Q565,465 585,760 Z" fill="#234957"/>
      <path d="M425,495 L295,410" stroke="#234957" stroke-width="34" stroke-linecap="round"/>
      <line x1="255" y1="382" x2="320" y2="426" stroke="#8C583A" stroke-width="7" stroke-linecap="round"/>
      <circle cx="250" cy="379" r="7" fill="#C83E2B"/>
      <text x="60" y="810" font-family="Georgia, serif" font-size="20" letter-spacing="3" fill="#4E4A42">STUDIO ARCHIVE — KOLKATA &amp; RANCHI</text>
    </svg>
  `)
};

// ============================================================================
// 2. INITIAL CURATED PORTFOLIO DATA & CONTEXT
// ============================================================================

const INITIAL_ARTWORKS = [
  {
    id: 'art-1',
    title: 'Monolith in Prussian & Ochre',
    category: 'Featured Paintings',
    medium: 'Heavy Impasto Oil & Cold Wax on Linen',
    dimensions: '36 × 48 in',
    year: '2026',
    featured: true,
    image: ART_ASSETS.painting1,
    description:
      'An exploration of architectural memory and raw pigment relief. Thick palette-knife ridges of Prussian teal and cadmium ochre collide with a singular vermilion incision.'
  },
  {
    id: 'art-2',
    title: 'Golden Monsoon Over the Ghat',
    category: 'Featured Paintings',
    medium: 'Acrylic & Oil Glaze on Stretched Canvas',
    dimensions: '30 × 40 in',
    year: '2025',
    featured: true,
    image: ART_ASSETS.painting2,
    description:
      'Capturing the luminous tension just before the first monsoon downpour breaks over ancient river steps.'
  },
  {
    id: 'art-3',
    title: 'Symphony in Vermilion & Sage',
    category: 'Featured Paintings',
    medium: 'Mixed Media Impasto on Belgian Linen',
    dimensions: '24 × 36 in',
    year: '2026',
    featured: true,
    image: ART_ASSETS.painting3,
    description:
      'A study in chromatic equilibrium—balancing fiery vermilion gestures against serene sage and slate undertones.'
  },
  {
    id: 'art-4',
    title: 'Wisdom in Chiaroscuro',
    category: 'Sketches',
    medium: 'Willow Charcoal & Compressed Graphite on Cotton Rag',
    dimensions: '16 × 20 in',
    year: '2025',
    featured: false,
    image: ART_ASSETS.sketch1,
    description:
      'Intimate portrait study emphasizing sculptural light, expressive cross-hatching, and quiet human resilience.'
  },
  {
    id: 'art-5',
    title: 'Morning Steps of Kashi',
    category: 'Sketches',
    medium: '2B–8B Graphite Pencil on Cold-Press Archival Paper',
    dimensions: '14 × 18 in',
    year: '2024',
    featured: false,
    image: ART_ASSETS.sketch2,
    description:
      'Plein-air architectural sketch drawn at dawn, preserving perspective rhythm and atmospheric stillness.'
  },
  {
    id: 'art-6',
    title: 'Scarlet Hibiscus Botanical Study',
    category: 'Color Pencil',
    medium: 'Polychromos & Luminance Color Pencil on Bristol Vellum',
    dimensions: '12 × 16 in',
    year: '2025',
    featured: false,
    image: ART_ASSETS.colorPencil1,
    description:
      'Over twenty burnished layers of crimson, cadmium orange, and emerald pigment achieving oil-like depth.'
  },
  {
    id: 'art-7',
    title: 'Azure Kingfisher at Rest',
    category: 'Color Pencil',
    medium: 'Wax & Oil-Based Color Pencil on Hot-Press Cotton',
    dimensions: '11 × 14 in',
    year: '2026',
    featured: false,
    image: ART_ASSETS.colorPencil2,
    description:
      'Hyper-detailed feather micro-textures celebrating Indian avian wildlife.'
  },
  {
    id: 'art-8',
    title: 'Misty Himalayan First Light',
    category: 'Watercolor',
    medium: 'Transparent Artist Watercolor on 300gsm Arches',
    dimensions: '18 × 24 in',
    year: '2025',
    featured: false,
    image: ART_ASSETS.watercolor1,
    description:
      'Wet-on-wet atmospheric washes capturing receding mountain ridges bathed in amber dawn.'
  },
  {
    id: 'art-9',
    title: 'Rain-Washed Courtyard',
    category: 'Watercolor',
    medium: 'Watercolor & Gouache Highlights on Rough Paper',
    dimensions: '15 × 22 in',
    year: '2026',
    featured: false,
    image: ART_ASSETS.watercolor2,
    description:
      'Shimmering reflections across wet stone after an afternoon shower in North Kolkata.'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-1042',
    clientName: 'Ananya Sen',
    clientEmail: 'ananya.sen@example.com',
    city: 'Kolkata',
    medium: 'Color Pencil',
    size: 'A3 (11.7 × 16.5 in)',
    subjects: 2,
    quotedPrice: '₹12,000',
    notes: 'A realistic couple portrait for our parents’ 30th anniversary with warm golden-hour tones.',
    referenceImage: ART_ASSETS.sketch1,
    status: 'New',
    createdAt: 'Today, 10:15 AM',
    unread: true
  }
];

const DEFAULT_PRICING_CONFIG = {
  basePrices: {
    Sketch: 3500,
    'Color Pencil': 6000,
    Watercolor: 5500,
    'Oil / Acrylic Painting': 11000
  },
  sizeAddons: {
    'A4 (8.3 × 11.7 in)': 0,
    'A3 (11.7 × 16.5 in)': 3500,
    '18 × 24 in': 8500,
    '24 × 36 in': 16000,
    Custom: 12000
  },
  extraSubjectFee: 2500,
  framingFee: 1800,
  turnaroundDays: {
    Sketch: '5–7 days',
    'Color Pencil': '8–12 days',
    Watercolor: '7–10 days',
    'Oil / Acrylic Painting': '14–21 days'
  }
};

const PortfolioContext = createContext(null);

// ============================================================================
// 3. HARDWARE-ACCELERATED 3D TILT ARTWORK CARD COMPONENT
// ============================================================================

const TiltArtworkCard = ({ artwork, onSelect }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    glareX: 50,
    glareY: 50,
    isHovered: false
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`,
      glareX,
      glareY,
      isHovered: true
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      glareX: 50,
      glareY: 50,
      isHovered: false
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(artwork)}
      style={{
        transform: transformStyle.transform,
        transition: transformStyle.isHovered
          ? 'transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)'
          : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d'
      }}
      className="group cursor-pointer rounded-2xl bg-[#FFFDF9]/90 backdrop-blur-md p-4 sm:p-5 border border-[#E5DEC9] shadow-[0_14px_34px_-12px_rgba(27,77,92,0.16)] hover:shadow-[0_28px_54px_-14px_rgba(27,77,92,0.28)] relative select-none"
    >
      {/* Museum Matting & Canvas Frame */}
      <div className="relative overflow-hidden rounded-xl bg-[#F3EDE4] aspect-[4/5] border border-[#E8E0CE]">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Specular Canvas Sheen on 3D Tilt */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: transformStyle.isHovered ? 0.38 : 0,
            background: `radial-gradient(circle at ${transformStyle.glareX}% ${transformStyle.glareY}%, rgba(255, 252, 242, 0.85), transparent 62%)`
          }}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-[#FAF7F2]/92 text-[#1E1E1C] backdrop-blur-md border border-[#E5DEC9] shadow-sm">
            {artwork.category}
          </span>
          {artwork.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#D99B26] text-[#FFFDF9] shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          )}
        </div>

        {/* Hover Inspect Cue */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#FAF7F2]/95 via-[#FAF7F2]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
          <span className="text-xs font-medium text-[#1B4D5C] flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Inspect in 3D Lightbox
          </span>
          <span className="text-xs text-[#5A574F]">{artwork.dimensions}</span>
        </div>
      </div>

      {/* Editorial Plate Caption */}
      <div className="pt-4 px-1" style={{ transform: 'translateZ(18px)' }}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#1E1E1C] leading-snug group-hover:text-[#1B4D5C] transition-colors">
            {artwork.title}
          </h3>
          <span className="text-xs font-medium text-[#7A7467] shrink-0 pt-1">
            {artwork.year}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#5C584F] mt-1 line-clamp-1">
          {artwork.medium}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Firebase Auth User State (Rule 3: Auth before any Firestore query)
  const [user, setUser] = useState(null);
  const [cloudSynced, setCloudSynced] = useState(false);

  // Portfolio Data State (Hydrated from Cloud Firestore with Initial Curated Fallback)
  const [artworks, setArtworks] = useState(INITIAL_ARTWORKS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [pricingConfig, setPricingConfig] = useState(DEFAULT_PRICING_CONFIG);
  const [draftPricing, setDraftPricing] = useState(DEFAULT_PRICING_CONFIG);

  // UI & Navigation State
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [studioPasscode, setStudioPasscode] = useState(STUDIO_MASTER_PASSWORD);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [adminTab, setAdminTab] = useState('add'); // 'add' | 'manage' | 'pricing' | 'orders' | 'security'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // 1. Initialize Cloud Authentication First
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Studio cloud auth notice:', err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-Time Firestore Listeners (Strict Rule 1 Paths + Rule 2 Simple Queries)
  useEffect(() => {
    if (!db || !user) return;

    // Public Artworks Collection
    const artworksCol = collection(db, 'artifacts', appId, 'public', 'data', 'artworks');
    const unsubArtworks = onSnapshot(
      artworksCol,
      (snapshot) => {
        setCloudSynced(true);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          fetched.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
          setArtworks(fetched);
        } else {
          // Seed initial curated gallery into cloud on first run
          INITIAL_ARTWORKS.forEach((art, idx) => {
            setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'artworks', art.id), {
              ...art,
              createdAtMs: Date.now() - idx * 1000
            }).catch(() => {});
          });
        }
      },
      (err) => console.error('Artworks sync error:', err)
    );

    // Public Commission Orders / Notifications Collection
    const ordersCol = collection(db, 'artifacts', appId, 'public', 'data', 'commissions');
    const unsubOrders = onSnapshot(
      ordersCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedOrders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          fetchedOrders.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
          setOrders(fetchedOrders);
        }
      },
      (err) => console.error('Orders sync error:', err)
    );

    // Studio Settings & Live Commission Pricing Document
    const settingsDoc = doc(db, 'artifacts', appId, 'public', 'data', 'studio_settings', 'config');
    const unsubSettings = onSnapshot(
      settingsDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.pricingConfig) {
            setPricingConfig(data.pricingConfig);
            setDraftPricing(data.pricingConfig);
          }
          if (data.adminPasscode) {
            setStudioPasscode(data.adminPasscode);
          }
        }
      },
      (err) => console.error('Studio settings sync error:', err)
    );

    return () => {
      unsubArtworks();
      unsubOrders();
      unsubSettings();
    };
  }, [user]);

  // 3D Hero Parallax Mouse State
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });
  // Smooth Scroll Progress for Dynamic Sunlit Gallery Atmosphere
  const [scrollProgress, setScrollProgress] = useState(0);

  // Commission Form State
  const [commissionForm, setCommissionForm] = useState({
    clientName: '',
    clientEmail: '',
    city: '',
    medium: 'Oil / Acrylic Painting',
    size: '18 × 24 in',
    subjects: 1,
    includeFraming: false,
    notes: '',
    referenceImage: ''
  });
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null);

  // Admin New Artwork Form State
  const [newArtForm, setNewArtForm] = useState({
    title: '',
    category: 'Featured Paintings',
    medium: '',
    dimensions: '24 × 36 in',
    year: '2026',
    description: '',
    featured: true,
    image: ART_ASSETS.painting1
  });

  const triggerToast = (title, subtitle) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const unreadOrdersCount = orders.filter((o) => o.unread).length;

  // Hero 3D Parallax Handler
  const handleHeroMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX / innerWidth - 0.5) * 2;
    const normY = (e.clientY / innerHeight - 0.5) * 2;
    setHeroOffset({ x: normX, y: normY });
  };

  // Smooth Scroll Listener for Seamless Color Atmosphere Transition
  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / docHeight));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Section Scroller
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Pre-fill Commission Form from Lightbox
  const handleCommissionSimilar = (artwork) => {
    setSelectedArtwork(null);
    const mappedMedium =
      artwork.category === 'Sketches'
        ? 'Sketch'
        : artwork.category === 'Color Pencil'
        ? 'Color Pencil'
        : artwork.category === 'Watercolor'
        ? 'Watercolor'
        : 'Oil / Acrylic Painting';

    setCommissionForm((prev) => ({
      ...prev,
      medium: mappedMedium,
      notes: `Inspired by "${artwork.title}" (${artwork.medium}). I would love to commission a custom piece in a similar palette and style.`
    }));
    scrollToSection('commission');
  };

  // Handle Reference Photo Upload in Commission Form
  const handleReferenceUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCommissionForm((prev) => ({ ...prev, referenceImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Custom Portrait / Artwork Commission
  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    if (!commissionForm.clientName.trim() || !commissionForm.clientEmail.trim()) return;

    const formattedQuote = formatINR(calculateCommissionTotal());
    const orderCode = `ORD-${Math.floor(1050 + Math.random() * 8900)}`;

    const newOrderPayload = {
      orderCode,
      clientName: commissionForm.clientName,
      clientEmail: commissionForm.clientEmail,
      city: commissionForm.city || 'Not specified',
      medium: commissionForm.medium,
      size: commissionForm.size,
      subjects: commissionForm.subjects,
      quotedPrice: formattedQuote,
      notes: commissionForm.notes || 'Custom portrait / fine art request.',
      referenceImage: commissionForm.referenceImage || ART_ASSETS.sketch1,
      status: 'New',
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      createdAtMs: Date.now(),
      unread: true
    };

    try {
      if (db && user) {
        const docRef = await addDoc(
          collection(db, 'artifacts', appId, 'public', 'data', 'commissions'),
          newOrderPayload
        );
        setLastSubmittedOrder({ id: docRef.id, ...newOrderPayload });
      } else {
        const localOrder = { id: orderCode, ...newOrderPayload };
        setOrders((prev) => [localOrder, ...prev]);
        setLastSubmittedOrder(localOrder);
      }

      triggerToast(
        'Commission Sent to Sourav’s Studio!',
        `Order ${orderCode} (${formattedQuote}) saved & sent to Artist Studio inbox.`
      );
    } catch (err) {
      console.error('Commission save error:', err);
      triggerToast('Submission Notice', 'Prepared your order—please also click Direct Mail below.');
    }

    setCommissionForm({
      clientName: '',
      clientEmail: '',
      city: '',
      medium: 'Oil / Acrylic Painting',
      size: '18 × 24 in',
      subjects: 1,
      includeFraming: false,
      notes: '',
      referenceImage: ''
    });
  };

  // Build mailto: link for direct email notification
  const buildMailtoLink = (order) => {
    const displayId = order.orderCode || order.id;
    const subject = encodeURIComponent(
      `[Art Commission ${displayId}] ${order.medium} (${order.size}) — ${order.clientName}`
    );
    const body = encodeURIComponent(
      `Hello Sourav Acharaya,\n\nI would like to commission a custom artwork.\n\n` +
        `• Order ID: ${displayId}\n` +
        `• Name: ${order.clientName}\n` +
        `• Email: ${order.clientEmail}\n` +
        `• City: ${order.city}\n` +
        `• Preferred Medium: ${order.medium}\n` +
        `• Canvas / Paper Size: ${order.size}\n` +
        `• Subjects / Faces in Photo: ${order.subjects || 1}\n` +
        `• Estimated Studio Quote: ${order.quotedPrice || formatINR(calculateCommissionTotal())}\n` +
        `• Vision & Notes: ${order.notes}\n\n` +
        `Looking forward to discussing this piece with you!\nWarm regards,\n${order.clientName}`
    );
    return `mailto:sourav.acharaya.studio@example.com?subject=${subject}&body=${body}`;
  };

  // Admin: Handle Artwork Image Upload (Compressed for fast Cloud Firestore sync)
  const handleNewArtFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1100;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
        setNewArtForm((prev) => ({ ...prev, image: compressedDataUrl }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Admin: Publish New Artwork to Live Cloud Portfolio
  const handlePublishArtwork = async (e) => {
    e.preventDefault();
    if (!newArtForm.title.trim()) return;

    const createdPayload = {
      title: newArtForm.title.trim(),
      category: newArtForm.category,
      medium: newArtForm.medium.trim() || `${newArtForm.category} on Archival Surface`,
      dimensions: newArtForm.dimensions.trim() || '24 × 36 in',
      year: newArtForm.year.trim() || '2026',
      featured: newArtForm.featured,
      image: newArtForm.image,
      description:
        newArtForm.description.trim() ||
        'Original fine artwork created in the studio of Sourav Acharaya.',
      createdAtMs: Date.now()
    };

    try {
      if (db && user) {
        await addDoc(
          collection(db, 'artifacts', appId, 'public', 'data', 'artworks'),
          createdPayload
        );
      } else {
        setArtworks((prev) => [{ id: `art-${Date.now()}`, ...createdPayload }, ...prev]);
      }

      triggerToast(
        'New Artwork Published Live!',
        `"${createdPayload.title}" is now synced across the live portfolio.`
      );
    } catch (err) {
      console.error('Publish artwork error:', err);
      triggerToast('Upload Error', 'Could not sync image. Try a slightly smaller image.');
    }

    setNewArtForm({
      title: '',
      category: 'Featured Paintings',
      medium: '',
      dimensions: '24 × 36 in',
      year: '2026',
      description: '',
      featured: true,
      image: ART_ASSETS.painting2
    });
    setAdminTab('manage');
  };

  // Admin: Toggle Featured Status in Cloud
  const toggleFeatured = async (id) => {
    const target = artworks.find((a) => a.id === id);
    if (!target) return;
    if (db && user) {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'artworks', id), {
        featured: !target.featured
      }).catch((err) => console.error(err));
    } else {
      setArtworks((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, featured: !item.featured } : item
        )
      );
    }
  };

  // Admin: Delete Artwork from Cloud
  const deleteArtwork = async (id) => {
    if (db && user) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'artworks', id)).catch(
        (err) => console.error(err)
      );
    } else {
      setArtworks((prev) => prev.filter((item) => item.id !== id));
    }
    triggerToast('Artwork Removed', 'The live portfolio collection has been updated.');
  };

  // Admin: Update Commission Status in Cloud
  const updateOrderStatus = async (id, status) => {
    if (db && user) {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'commissions', id), {
        status,
        unread: false
      }).catch((err) => console.error(err));
    } else {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === id ? { ...ord, status, unread: false } : ord
        )
      );
    }
  };

  // Open Admin Studio (Requires Master Password before revealing orders or controls)
  const handleOpenAdmin = () => {
    setDraftPricing(pricingConfig);
    setPasscodeInput('');
    setPasscodeError('');
    setAdminOpen(true);
  };

  // Save Updated Commission Pricing to Cloud
  const handleSavePricing = async (e) => {
    e.preventDefault();
    setPricingConfig(draftPricing);
    if (db && user) {
      await setDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'studio_settings', 'config'),
        { pricingConfig: draftPricing, adminPasscode: studioPasscode },
        { merge: true }
      ).catch((err) => console.error(err));
    }
    triggerToast(
      'Commission Rates Updated Live!',
      'New portrait & painting prices are now live for all visitors.'
    );
  };

  const handleResetPricing = async () => {
    setDraftPricing(DEFAULT_PRICING_CONFIG);
    setPricingConfig(DEFAULT_PRICING_CONFIG);
    if (db && user) {
      await setDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'studio_settings', 'config'),
        { pricingConfig: DEFAULT_PRICING_CONFIG, adminPasscode: studioPasscode },
        { merge: true }
      ).catch((err) => console.error(err));
    }
    triggerToast('Default Studio Rates Restored', 'All commission prices reset to defaults.');
  };

  // Admin: Update Custom Studio Password in Cloud
  const handleUpdateStudioPassword = async (e) => {
    e.preventDefault();
    if (newPasswordInput.trim().length < 6) {
      triggerToast('Password Too Short', 'Please choose at least 6 characters.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      triggerToast('Passwords Do Not Match', 'Please confirm the exact same password.');
      return;
    }
    const updatedPass = newPasswordInput.trim();
    setStudioPasscode(updatedPass);
    if (db && user) {
      await setDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'studio_settings', 'config'),
        { adminPasscode: updatedPass, pricingConfig },
        { merge: true }
      ).catch((err) => console.error(err));
    }
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    triggerToast(
      'Admin Password Updated!',
      'Your new private studio password is saved in the cloud.'
    );
  };

  // Filtered Artworks for Gallery Section
  const featuredArtworks = artworks.filter((a) => a.featured);
  const filteredCollection =
    activeCategory === 'All'
      ? artworks
      : artworks.filter((a) => a.category === activeCategory);

  const CATEGORIES = [
    'All',
    'Featured Paintings',
    'Sketches',
    'Color Pencil',
    'Watercolor'
  ];

  // Live Dynamic Quote Calculator driven by Artist Studio Pricing Config
  const calculateCommissionTotal = () => {
    const base = Number(pricingConfig.basePrices[commissionForm.medium] || 0);
    const sizeAdd = Number(pricingConfig.sizeAddons[commissionForm.size] || 0);
    const extraPeople = Math.max(0, Number(commissionForm.subjects || 1) - 1);
    const peopleAdd = extraPeople * Number(pricingConfig.extraSubjectFee || 0);
    const frameAdd = commissionForm.includeFraming ? Number(pricingConfig.framingFee || 0) : 0;
    return base + sizeAdd + peopleAdd + frameAdd;
  };

  const formatINR = (amount) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  return (
    <PortfolioContext.Provider value={{ artworks, orders, pricingConfig }}>
      <div
        className="relative min-h-screen text-[#1E1E1C] selection:bg-[#1B4D5C] selection:text-[#FAF7F2] overflow-x-hidden transition-colors duration-700"
        style={{
          backgroundColor:
            scrollProgress < 0.28
              ? '#FAF7F2' // Warm Gallery Alabaster
              : scrollProgress < 0.58
              ? '#F6F1E7' // Sunlit Raw Linen
              : scrollProgress < 0.84
              ? '#F4EFE6' // Warm Parchment Cream
              : '#F7F2E8' // Soft Champagne Ivory
        }}
      >
        {/* Dynamic Scroll-Reactive Pigment Aura & Fine Cotton Paper Grain (Zero jarring shapes) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Top-Left Prussian Teal & Sea-Glass Ambient Wash */}
          <div
            className="absolute -top-32 -left-32 w-[620px] h-[620px] rounded-full blur-[130px] transition-transform duration-700 ease-out"
            style={{
              background:
                'radial-gradient(circle, rgba(27, 77, 92, 0.14) 0%, rgba(27, 77, 92, 0) 72%)',
              transform: `translate3d(${scrollProgress * 140}px, ${
                scrollProgress * 220
              }px, 0)`
            }}
          />
          {/* Mid-Right Cadmium Ochre & Warm Honey Glow */}
          <div
            className="absolute top-[28%] -right-40 w-[680px] h-[680px] rounded-full blur-[140px] transition-transform duration-700 ease-out"
            style={{
              background:
                'radial-gradient(circle, rgba(217, 155, 38, 0.16) 0%, rgba(217, 155, 38, 0) 72%)',
              transform: `translate3d(${scrollProgress * -160}px, ${
                scrollProgress * 120
              }px, 0)`
            }}
          />
          {/* Bottom-Left Soft Terracotta / Vermilion Warmth */}
          <div
            className="absolute -bottom-40 left-[12%] w-[640px] h-[640px] rounded-full blur-[145px] transition-transform duration-700 ease-out"
            style={{
              background:
                'radial-gradient(circle, rgba(200, 62, 43, 0.10) 0%, rgba(200, 62, 43, 0) 72%)',
              transform: `translate3d(${scrollProgress * 110}px, ${
                scrollProgress * -140
              }px, 0)`
            }}
          />
          {/* Tactile Archival Paper Grain Overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${ART_ASSETS.galleryPaperTexture}")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>

        {/* Load Editorial Fonts: Cormorant Garamond & Plus Jakarta Sans */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #FAF7F2;
            color: #1E1E1C;
          }
          .font-serif-display {
            font-family: 'Cormorant Garamond', Georgia, serif;
          }
          .hero-artist-shadow {
            text-shadow:
              0 4px 18px rgba(15, 22, 26, 0.78),
              0 12px 38px rgba(15, 22, 26, 0.58),
              0 2px 4px rgba(0, 0, 0, 0.85);
          }
          .hero-subtitle-shadow {
            text-shadow:
              0 2px 12px rgba(15, 22, 26, 0.82),
              0 1px 3px rgba(0, 0, 0, 0.85);
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .animate-float-slow {
            animation: floatSlow 5s ease-in-out infinite;
          }
        `}</style>

        {/* ==================================================================
            LIVE TOAST NOTIFICATION BANNER
           ================================================================== */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#FAF7F2] border border-[#1B4D5C]/30 shadow-[0_20px_45px_rgba(27,77,92,0.22)] rounded-2xl p-4 flex items-start gap-3.5 transition-all">
            <div className="w-9 h-9 rounded-full bg-[#1B4D5C] text-[#FAF7F2] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[#1E1E1C]">
                {toastMessage.title}
              </h4>
              <p className="text-xs text-[#5C584F] mt-0.5">
                {toastMessage.subtitle}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-[#7A7467] hover:text-[#1E1E1C] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ==================================================================
            1. SUNLIT GLASSMORPHIC EDITORIAL NAVBAR (ZERO BLACK)
           ================================================================== */}
        <header
          className="fixed top-0 inset-x-0 z-40 border-b border-[#E5DEC9]/80 transition-all"
          style={{
            backgroundColor: 'rgba(250, 247, 242, 0.90)',
            backdropFilter: 'blur(14px)'
          }}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
            {/* Minimalist Serif Monogram 'SA' */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group text-left"
            >
              <span className="font-serif-display text-3xl sm:text-[34px] font-normal tracking-[0.14em] text-[#1E1E1C] group-hover:text-[#1B4D5C] transition-colors">
                SA
              </span>
              <span className="hidden md:inline-block h-5 w-[1px] bg-[#D9D0BE]" />
              <span className="hidden md:inline-block text-[11px] uppercase tracking-[0.22em] text-[#6E695F]">
                Fine Art Studio
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#3B3934]">
              <button
                onClick={() => scrollToSection('selected-work')}
                className="hover:text-[#1B4D5C] transition-colors py-2"
              >
                Selected Work
              </button>
              <button
                onClick={() => scrollToSection('collections')}
                className="hover:text-[#1B4D5C] transition-colors py-2"
              >
                Collections
              </button>
              <button
                onClick={() => scrollToSection('vision')}
                className="hover:text-[#1B4D5C] transition-colors py-2"
              >
                Vision &amp; Ambition
              </button>
              <button
                onClick={() => scrollToSection('commission')}
                className="hover:text-[#1B4D5C] transition-colors py-2"
              >
                Commission Portrait
              </button>
            </nav>

            {/* Right Controls: Artist Studio Admin Button + Mobile Drawer Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAdmin}
                className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide bg-[#F3EDE4] hover:bg-[#1B4D5C] text-[#1E1E1C] hover:text-[#FAF7F2] border border-[#DFD6C3] transition-all shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Artist Studio</span>
                {adminUnlocked && unreadOrdersCount > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#C83E2B] text-[#FAF7F2] animate-pulse">
                    {unreadOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-[#F3EDE4] border border-[#E5DEC9] text-[#1E1E1C]"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E5DEC9] px-6 py-5 space-y-3 shadow-lg">
              <button
                onClick={() => scrollToSection('selected-work')}
                className="block w-full text-left py-2 text-sm font-medium text-[#1E1E1C] hover:text-[#1B4D5C]"
              >
                Selected Work
              </button>
              <button
                onClick={() => scrollToSection('collections')}
                className="block w-full text-left py-2 text-sm font-medium text-[#1E1E1C] hover:text-[#1B4D5C]"
              >
                Collections (Sketches, Color Pencil, Watercolor)
              </button>
              <button
                onClick={() => scrollToSection('vision')}
                className="block w-full text-left py-2 text-sm font-medium text-[#1E1E1C] hover:text-[#1B4D5C]"
              >
                Vision &amp; Ambition
              </button>
              <button
                onClick={() => scrollToSection('commission')}
                className="block w-full text-left py-2 text-sm font-semibold text-[#1B4D5C]"
              >
                Commission a Portrait
              </button>
            </div>
          )}
        </header>

        {/* ==================================================================
            2. FULL-BLEED 3D PARALLAX IMPASTO HERO SECTION
            (Inspired by editorial reference with Prussian Teal, Cadmium Ochre,
             Warm Cream & Vermilion brush strokes + sculptural title shadow)
           ================================================================== */}
        <section
          onMouseMove={handleHeroMouseMove}
          className="relative z-10 min-h-[92vh] sm:min-h-screen pt-20 flex items-center justify-center overflow-hidden border-b border-[#E5DEC9]"
        >
          {/* Layer 1 (Back Z-Plane): Textured Abstract Impasto Canvas */}
          <div
            className="absolute inset-[-4%] pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${heroOffset.x * -18}px, ${heroOffset.y * -14}px, 0) scale(1.06)`
            }}
          >
            <img
              src={ART_ASSETS.heroImpasto}
              alt="Abstract Impasto Canvas by Sourav Acharaya"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Layer 2 (Mid Z-Plane): Soft Ambient Radial Vignette behind Center Typography for Sculptural Contrast */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 47%, rgba(19, 44, 54, 0.42) 0%, rgba(19, 44, 54, 0.16) 45%, rgba(250, 247, 242, 0.25) 100%)'
            }}
          />

          {/* Seamless Painterly Bottom Dissolve into the Sunlit Gallery Wall */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(250, 247, 242, 0) 0%, rgba(250, 247, 242, 0.85) 72%, #FAF7F2 100%)'
            }}
          />

          {/* Layer 3 (Front Z-Plane): Floating 3D Editorial Typography with Rich Sculptural Shadow */}
          <div
            className="relative z-10 max-w-5xl mx-auto px-6 text-center transition-transform duration-200 ease-out"
            style={{
              transform: `translate3d(${heroOffset.x * 16}px, ${heroOffset.y * 12}px, 40px)`
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md border border-[#E5DEC9] shadow-md mb-6">
              <span className="w-2 h-2 rounded-full bg-[#C83E2B]" />
              <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#1B4D5C]">
                Contemporary Painter &amp; Portraitist
              </span>
            </div>

            <p className="font-serif-display italic text-2xl sm:text-3xl text-[#FFFDF9] mb-2 tracking-wide hero-subtitle-shadow">
              Art by
            </p>

            <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-medium tracking-[0.22em] sm:tracking-[0.28em] text-[#FFFDF9] uppercase leading-[1.12] hero-artist-shadow pl-[0.22em]">
              SOURAV ACHARAYA
            </h1>

            <p className="max-w-xl mx-auto mt-6 text-sm sm:text-base md:text-lg text-[#1E1E1C] font-medium leading-relaxed bg-[#FAF7F2]/88 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-[#E5DEC9] shadow-[0_14px_34px_rgba(15,22,26,0.18)]">
              Translating human emotion, light, and cultural memory into tactile impasto paintings, luminous watercolors, and heirloom portraits.
            </p>

            {/* Primary Hero Actions */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('selected-work')}
                className="px-7 py-3.5 rounded-full bg-[#1B4D5C] hover:bg-[#153D49] text-[#FAF7F2] text-sm font-semibold tracking-wide shadow-[0_14px_30px_-6px_rgba(15,22,26,0.5)] transition-all hover:-translate-y-0.5"
              >
                Explore Selected Works
              </button>
              <button
                onClick={() => scrollToSection('commission')}
                className="px-7 py-3.5 rounded-full bg-[#FAF7F2]/95 hover:bg-[#FFFDF9] text-[#1E1E1C] border border-[#D8CEBA] text-sm font-semibold tracking-wide shadow-[0_14px_30px_-6px_rgba(15,22,26,0.3)] transition-all hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D99B26]" />
                Commission a Portrait
              </button>
            </div>
          </div>

          {/* Scroll Cue */}
          <button
            onClick={() => scrollToSection('selected-work')}
            aria-label="Scroll to Selected Work"
            className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-[#1E1E1C] bg-[#FAF7F2]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#E5DEC9] shadow-md hover:bg-[#FAF7F2] transition-all"
          >
            <span>Gallery</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#1B4D5C] animate-bounce" />
          </button>
        </section>

        {/* ==================================================================
            3. SELECTED WORK — 3D INTERACTIVE MASTERPIECES SHOWCASE
           ================================================================== */}
        <section id="selected-work" className="relative z-10 py-20 sm:py-28 px-5 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 bg-[#FAF7F2]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#E5DEC9] shadow-sm">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1B4D5C] block mb-2">
                Curated Exhibition
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#1E1E1C] tracking-tight">
                Featured Masterpieces
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-[#4A4740] leading-relaxed">
              Hover across each framed canvas to experience spatial depth and surface texture. Click any painting to inspect details or commission a bespoke variation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {featuredArtworks.map((artwork) => (
              <TiltArtworkCard
                key={artwork.id}
                artwork={artwork}
                onSelect={setSelectedArtwork}
              />
            ))}
          </div>
        </section>

        {/* ==================================================================
            4. CATEGORIZED COLLECTIONS (SKETCHES, COLOR PENCIL, WATERCOLOR, PAINTINGS)
           ================================================================== */}
        <section
          id="collections"
          className="relative z-10 py-20 sm:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#FAF7F2]/60 via-[#F2ECE1]/85 to-[#FAF7F2]/60 border-y border-[#E5DEC9]/80"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C83E2B] block mb-2">
                Mediums &amp; Archive
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#1E1E1C]">
                Complete Studio Collections
              </h2>
              <p className="text-sm sm:text-base text-[#4A4740] mt-3">
                Explore Sourav’s versatility across raw charcoal sketches, layered color pencil realism, fluid watercolors, and heavy impasto paintings.
              </p>
            </div>

            {/* Interactive Medium Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-14">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                const count =
                  category === 'All'
                    ? artworks.length
                    : artworks.filter((a) => a.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-[#1B4D5C] text-[#FAF7F2] shadow-[0_8px_20px_-4px_rgba(27,77,92,0.4)]'
                        : 'bg-[#FAF7F2] text-[#3B3934] hover:bg-[#FFFDF9] border border-[#DFD6C3]'
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#FAF7F2]/20 text-[#FAF7F2]'
                          : 'bg-[#F3EDE4] text-[#6E695F]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3D Tilt Artwork Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCollection.map((artwork) => (
                <TiltArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onSelect={setSelectedArtwork}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            5. ARTIST VISION & AMBITION ("THE PHILOSOPHY")
           ================================================================== */}
        <section id="vision" className="relative z-10 py-20 sm:py-28 px-5 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center bg-[#FAF7F2]/85 backdrop-blur-md p-6 sm:p-12 rounded-3xl border border-[#E5DEC9] shadow-[0_20px_50px_-15px_rgba(27,77,92,0.12)]">
            {/* Left: 3D Framed Studio Archive Portrait */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-[#F3EDE4] p-5 sm:p-6 border border-[#E2D9C5] shadow-[0_24px_50px_-15px_rgba(27,77,92,0.18)] animate-float-slow">
                <div className="overflow-hidden rounded-2xl border border-[#D9CEB8]">
                  <img
                    src={ART_ASSETS.artistPortrait}
                    alt="Sourav Acharaya in his fine art studio"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between px-1">
                  <div>
                    <p className="font-serif-display text-xl font-semibold text-[#1E1E1C]">
                      Sourav Acharaya
                    </p>
                    <p className="text-xs text-[#6E695F]">
                      Fine Artist &amp; Bespoke Portraitist
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D99B26]/20 text-[#8F620C] border border-[#D99B26]/40">
                    Est. Studio
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Artistic Ambition, Statement & Milestones */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1B4D5C] block">
                Artist Manifesto &amp; Ambition
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#1E1E1C] leading-[1.15]">
                Bridging Classical Realism with Bold, Tactile Expression.
              </h2>

              <p className="text-base sm:text-lg text-[#4A4740] leading-relaxed">
                “Every surface carries a pulse. Whether I am building sculptural ridges of Prussian teal and ochre with a palette knife, or layering twenty delicate passes of colored pencil to capture the warmth in a subject’s eyes, my ambition is to create art that outlives trends and becomes a family heirloom.”
              </p>

              <p className="text-sm sm:text-base text-[#5C584F] leading-relaxed">
                Working across India and shipping commissioned pieces worldwide, Sourav Acharaya dedicates his practice to elevating traditional hand-crafted portraiture and expressive contemporary painting—bringing museum-grade craftsmanship into private homes and architectural spaces.
              </p>

              {/* 3 Pillars of Practice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-[#F3EDE4] border border-[#E5DEC9]">
                  <Compass className="w-5 h-5 text-[#1B4D5C] mb-2" />
                  <h4 className="font-serif-display text-xl font-semibold text-[#1E1E1C]">
                    4 Signature Mediums
                  </h4>
                  <p className="text-xs text-[#5C584F] mt-1">
                    Impasto Oil, Charcoal, Color Pencil &amp; Watercolor mastery.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F3EDE4] border border-[#E5DEC9]">
                  <Frame className="w-5 h-5 text-[#D99B26] mb-2" />
                  <h4 className="font-serif-display text-xl font-semibold text-[#1E1E1C]">
                    Archival Longevity
                  </h4>
                  <p className="text-xs text-[#5C584F] mt-1">
                    100% cotton rag papers, Belgian linen &amp; lightfast pigments.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F3EDE4] border border-[#E5DEC9]">
                  <Award className="w-5 h-5 text-[#C83E2B] mb-2" />
                  <h4 className="font-serif-display text-xl font-semibold text-[#1E1E1C]">
                    Bespoke Commissions
                  </h4>
                  <p className="text-xs text-[#5C584F] mt-1">
                    Custom portraits &amp; statement canvases tailored to your space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            6. CUSTOM PORTRAIT & ARTWORK COMMISSION SYSTEM (MAIL + NOTIFICATION)
           ================================================================== */}
        <section
          id="commission"
          className="relative z-10 py-20 sm:py-28 px-5 sm:px-8 bg-gradient-to-b from-[#FAF7F2]/50 via-[#EFE8DC]/85 to-[#F7F2E8] border-t border-[#E5DEC9]/80"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1B4D5C] block mb-2">
                Bespoke Studio Orders
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#1E1E1C]">
                Commission a Custom Portrait or Painting
              </h2>
              <p className="text-sm sm:text-base text-[#4A4740] mt-3">
                Select your preferred medium, dimensions, and number of subjects in the photo—get an instant live quote and notify Sourav Acharaya directly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Commission Form */}
              <form
                onSubmit={handleCommissionSubmit}
                className="lg:col-span-8 bg-[#FAF7F2]/95 backdrop-blur-md rounded-3xl p-6 sm:p-9 border border-[#E5DEC9] shadow-[0_20px_50px_-15px_rgba(27,77,92,0.14)] space-y-6"
              >
                {/* Step 1: Choose Medium */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.18em] font-semibold text-[#5C584F] mb-3">
                    1. Choose Artistic Medium
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Sketch', 'Color Pencil', 'Watercolor', 'Oil / Acrylic Painting'].map(
                      (med) => {
                        const selected = commissionForm.medium === med;
                        return (
                          <button
                            type="button"
                            key={med}
                            onClick={() =>
                              setCommissionForm((prev) => ({ ...prev, medium: med }))
                            }
                            className={`p-3.5 rounded-2xl text-left border transition-all ${
                              selected
                                ? 'bg-[#1B4D5C] text-[#FAF7F2] border-[#1B4D5C] shadow-md'
                                : 'bg-[#FFFDF9] text-[#1E1E1C] border-[#E5DEC9] hover:border-[#1B4D5C]/50'
                            }`}
                          >
                            <span className="block text-xs sm:text-sm font-semibold leading-snug">
                              {med}
                            </span>
                            <span
                              className={`block text-[11px] mt-1 font-medium ${
                                selected ? 'text-[#F2CA52]' : 'text-[#1B4D5C]'
                              }`}
                            >
                              From {formatINR(pricingConfig.basePrices[med])}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Step 2: Choose Dimensions */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.18em] font-semibold text-[#5C584F] mb-3">
                    2. Select Canvas / Paper Dimensions
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {Object.keys(pricingConfig.sizeAddons).map((sz) => {
                      const active = commissionForm.size === sz;
                      const addon = pricingConfig.sizeAddons[sz];
                      return (
                        <button
                          type="button"
                          key={sz}
                          onClick={() =>
                            setCommissionForm((prev) => ({ ...prev, size: sz }))
                          }
                          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            active
                              ? 'bg-[#D99B26] text-[#FFFDF9] border-[#D99B26] shadow-sm'
                              : 'bg-[#FFFDF9] text-[#3B3934] border-[#E5DEC9] hover:border-[#D99B26]'
                          }`}
                        >
                          <span>{sz}</span>
                          {addon > 0 && (
                            <span className="opacity-80 text-[10px]">
                              (+{formatINR(addon)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2B: Number of Subjects / Faces in Photo & Framing Option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F3EDE4]/85 border border-[#E5DEC9]">
                  <div>
                    <label className="block text-xs font-semibold text-[#3B3934] mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#1B4D5C]" />
                      <span>Subjects / Faces in Photo</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() =>
                            setCommissionForm((prev) => ({ ...prev, subjects: num }))
                          }
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            commissionForm.subjects === num
                              ? 'bg-[#1B4D5C] text-[#FAF7F2] border-[#1B4D5C]'
                              : 'bg-[#FFFDF9] text-[#3B3934] border-[#DFD6C3]'
                          }`}
                        >
                          {num === 4 ? '4+' : `${num} ${num === 1 ? 'Person' : 'People'}`}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#6E695F] mt-1.5">
                      +{formatINR(pricingConfig.extraSubjectFee)} per additional face/subject
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={commissionForm.includeFraming}
                        onChange={(e) =>
                          setCommissionForm((prev) => ({
                            ...prev,
                            includeFraming: e.target.checked
                          }))
                        }
                        className="w-4 h-4 mt-0.5 accent-[#1B4D5C]"
                      />
                      <div>
                        <span className="block text-xs font-semibold text-[#1E1E1C]">
                          Add Museum Teakwood Framing (+{formatINR(pricingConfig.framingFee)})
                        </span>
                        <span className="block text-[11px] text-[#6E695F] mt-0.5">
                          Ready-to-hang archival UV-protected frame
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Step 3: Client Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={commissionForm.clientName}
                      onChange={(e) =>
                        setCommissionForm((prev) => ({
                          ...prev,
                          clientName: e.target.value
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={commissionForm.clientEmail}
                      onChange={(e) =>
                        setCommissionForm((prev) => ({
                          ...prev,
                          clientEmail: e.target.value
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                      City / Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolkata, India"
                      value={commissionForm.city}
                      onChange={(e) =>
                        setCommissionForm((prev) => ({
                          ...prev,
                          city: e.target.value
                        }))
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                    />
                  </div>
                </div>

                {/* Step 4: Reference Photo Upload & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                      Upload Reference Photo (Optional)
                    </label>
                    <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-[#D6CCB8] bg-[#FFFDF9] hover:border-[#1B4D5C] cursor-pointer transition-colors p-3 text-center">
                      {commissionForm.referenceImage ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={commissionForm.referenceImage}
                            alt="Reference Preview"
                            className="w-20 h-20 object-cover rounded-xl border border-[#E5DEC9]"
                          />
                          <span className="text-xs font-medium text-[#1B4D5C]">
                            Reference attached! Click to replace
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-[#1B4D5C] mb-1.5" />
                          <span className="text-xs font-medium text-[#3B3934]">
                            Click to attach portrait reference
                          </span>
                          <span className="text-[11px] text-[#7A7467] mt-0.5">
                            JPG, PNG, or WEBP
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReferenceUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                      Vision, Mood &amp; Framing Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe the subject, preferred color palette, occasion, or deadline..."
                      value={commissionForm.notes}
                      onChange={(e) =>
                        setCommissionForm((prev) => ({
                          ...prev,
                          notes: e.target.value
                        }))
                      }
                      className="w-full h-32 px-4 py-3 rounded-2xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C] resize-none"
                    />
                  </div>
                </div>

                {/* Submit Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#5C584F] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#C83E2B] shrink-0" />
                    <span>
                      Sends an instant studio notification &amp; prepares direct mail to Sourav.
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-full bg-[#1B4D5C] hover:bg-[#143B47] text-[#FAF7F2] text-sm font-semibold tracking-wide shadow-[0_12px_25px_-6px_rgba(27,77,92,0.45)] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Notify Artist &amp; Submit Order</span>
                  </button>
                </div>
              </form>

              {/* Right Column: Live Estimate Guide + Direct Email Dispatch Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-3xl p-6 border border-[#E5DEC9] shadow-sm">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#D99B26]">
                    Live Studio Quote
                  </span>
                  <h3 className="font-serif-display text-2xl font-semibold text-[#1E1E1C] mt-1">
                    {commissionForm.medium}
                  </h3>
                  <p className="text-xs text-[#6E695F] mt-0.5">
                    {commissionForm.size} • {commissionForm.subjects}{' '}
                    {commissionForm.subjects === 1 ? 'Subject' : 'Subjects'}
                    {commissionForm.includeFraming ? ' • Framed' : ''}
                  </p>

                  <div className="my-5 p-4 rounded-2xl bg-[#F3EDE4] border border-[#E5DEC9]">
                    <span className="text-xs text-[#5C584F] block">
                      Total Estimated Studio Investment
                    </span>
                    <span className="font-serif-display text-4xl font-bold text-[#1B4D5C] mt-1 block">
                      {formatINR(calculateCommissionTotal())}
                    </span>
                    <div className="mt-2 pt-2 border-t border-[#DFD6C3]/80 text-[11px] text-[#5C584F] space-y-0.5">
                      <div className="flex justify-between">
                        <span>Base ({commissionForm.medium}):</span>
                        <span>{formatINR(pricingConfig.basePrices[commissionForm.medium])}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size ({commissionForm.size}):</span>
                        <span>+{formatINR(pricingConfig.sizeAddons[commissionForm.size])}</span>
                      </div>
                      {commissionForm.subjects > 1 && (
                        <div className="flex justify-between">
                          <span>Extra Subjects ({commissionForm.subjects - 1}):</span>
                          <span>
                            +
                            {formatINR(
                              (commissionForm.subjects - 1) * pricingConfig.extraSubjectFee
                            )}
                          </span>
                        </div>
                      )}
                      {commissionForm.includeFraming && (
                        <div className="flex justify-between">
                          <span>Museum Framing:</span>
                          <span>+{formatINR(pricingConfig.framingFee)}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-[#1B4D5C] mt-2.5 block">
                      Estimated Turnaround:{' '}
                      {pricingConfig.turnaroundDays[commissionForm.medium] || '10–14 days'}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#4A4740]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B4D5C] shrink-0" />
                      Progress photos shared at sketch &amp; final stages
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B4D5C] shrink-0" />
                      Signed Certificate of Authenticity included
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1B4D5C] shrink-0" />
                      Insured protective tube or museum crate shipping
                    </li>
                  </ul>
                </div>

                {/* Instant Email Dispatch Card (Appears after submission or available anytime) */}
                <div className="bg-[#FFFDF9]/95 backdrop-blur-md rounded-3xl p-6 border border-[#D99B26]/50 shadow-sm">
                  <div className="flex items-center gap-2.5 text-[#1B4D5C] mb-2">
                    <Mail className="w-5 h-5" />
                    <h4 className="font-serif-display text-xl font-semibold">
                      Direct Artist Mail Dispatch
                    </h4>
                  </div>
                  <p className="text-xs text-[#5C584F] leading-relaxed mb-4">
                    {lastSubmittedOrder
                      ? `Order ${lastSubmittedOrder.id} (${lastSubmittedOrder.quotedPrice}) is live in Sourav’s Studio Inbox! You can also launch your mail client to send a direct copy.`
                      : 'Prefer to email Sourav Acharaya directly with your inquiry? Launch a pre-formatted studio mail anytime.'}
                  </p>
                  <a
                    href={buildMailtoLink(
                      lastSubmittedOrder || {
                        id: 'INQUIRY',
                        clientName: commissionForm.clientName || 'Art Collector',
                        clientEmail: commissionForm.clientEmail || 'collector@example.com',
                        city: commissionForm.city || 'India',
                        medium: commissionForm.medium,
                        size: commissionForm.size,
                        subjects: commissionForm.subjects,
                        quotedPrice: formatINR(calculateCommissionTotal()),
                        notes: commissionForm.notes || 'Interested in commissioning an artwork.'
                      }
                    )}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#F3EDE4] hover:bg-[#D99B26] text-[#1E1E1C] hover:text-[#FFFDF9] border border-[#DFD6C3] text-xs font-semibold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Pre-Filled Email to Sourav</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            7. WARM IVORY EDITORIAL FOOTER (NO BLACK)
           ================================================================== */}
        <footer className="relative z-10 bg-[#FAF7F2]/90 backdrop-blur-md border-t border-[#E5DEC9] py-12 px-5 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-serif-display text-3xl tracking-[0.14em] text-[#1E1E1C]">
                SA
              </span>
              <div>
                <p className="font-serif-display text-lg font-semibold text-[#1E1E1C]">
                  Sourav Acharaya
                </p>
                <p className="text-xs text-[#6E695F]">
                  © {new Date().getFullYear()} Sourav Acharaya Fine Art Studio. All Rights Reserved.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#5C584F]">
              <button
                onClick={() => scrollToSection('selected-work')}
                className="hover:text-[#1B4D5C]"
              >
                Selected Work
              </button>
              <button
                onClick={() => scrollToSection('collections')}
                className="hover:text-[#1B4D5C]"
              >
                Collections
              </button>
              <button
                onClick={() => scrollToSection('commission')}
                className="hover:text-[#1B4D5C]"
              >
                Commissions
              </button>
              <button
                onClick={handleOpenAdmin}
                className="text-[#1B4D5C] font-semibold hover:underline"
              >
                Artist Studio Login
              </button>
            </div>
          </div>
        </footer>

        {/* ==================================================================
            8. 3D LIGHTBOX ARTWORK INSPECTOR MODAL
           ================================================================== */}
        {selectedArtwork && (
          <div
            onClick={() => setSelectedArtwork(null)}
            className="fixed inset-0 z-50 bg-[#1E1E1C]/45 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-3xl border border-[#E5DEC9] shadow-[0_32px_70px_rgba(30,30,28,0.28)] overflow-hidden grid grid-cols-1 md:grid-cols-12"
            >
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#FAF7F2]/90 border border-[#E5DEC9] flex items-center justify-center text-[#1E1E1C] hover:bg-[#1B4D5C] hover:text-[#FAF7F2] transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Artwork Plate */}
              <div className="md:col-span-7 bg-[#F3EDE4] p-6 sm:p-8 flex items-center justify-center">
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="max-h-[68vh] w-auto object-contain rounded-xl shadow-[0_18px_40px_rgba(30,30,28,0.18)] border border-[#DFD6C3]"
                />
              </div>

              {/* Curator Notes */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#1B4D5C]/10 text-[#1B4D5C]">
                    {selectedArtwork.category}
                  </span>
                  <h3 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#1E1E1C] mt-3 leading-tight">
                    {selectedArtwork.title}
                  </h3>
                  <p className="text-xs font-medium text-[#7A7467] mt-1">
                    Created {selectedArtwork.year} • Signed by Sourav Acharaya
                  </p>

                  <div className="my-6 space-y-3 border-y border-[#E5DEC9] py-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#6E695F]">Medium</span>
                      <span className="font-semibold text-[#1E1E1C] text-right max-w-[60%]">
                        {selectedArtwork.medium}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E695F]">Dimensions</span>
                      <span className="font-semibold text-[#1E1E1C]">
                        {selectedArtwork.dimensions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6E695F]">Availability</span>
                      <span className="font-semibold text-[#1B4D5C]">
                        Original / Custom Commission
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#4A4740] leading-relaxed">
                    {selectedArtwork.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E5DEC9] space-y-2.5">
                  <button
                    onClick={() => handleCommissionSimilar(selectedArtwork)}
                    className="w-full py-3.5 px-5 rounded-full bg-[#1B4D5C] hover:bg-[#143B47] text-[#FAF7F2] text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#D99B26]" />
                    <span>Order Similar / Commission Piece</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            9. INTERACTIVE ARTIST STUDIO ADMIN PANEL (PUBLISH + MANAGE + INBOX)
           ================================================================== */}
        {adminOpen && (
          <div
            onClick={() => setAdminOpen(false)}
            className="fixed inset-0 z-50 bg-[#1E1E1C]/45 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-3xl border border-[#E5DEC9] shadow-[0_32px_70px_rgba(30,30,28,0.28)] overflow-hidden my-auto"
            >
              {/* Admin Modal Top Header */}
              <div className="px-6 sm:px-8 py-5 bg-[#F3EDE4] border-b border-[#E5DEC9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1B4D5C] text-[#FAF7F2] flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-2xl font-semibold text-[#1E1E1C]">
                      Artist Studio — Sourav Acharaya
                    </h3>
                    <p className="text-xs text-[#6E695F]">
                      Manage artworks, live portrait rates &amp; client commission notifications
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAdminOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#DFD6C3] flex items-center justify-center text-[#1E1E1C] hover:bg-[#1B4D5C] hover:text-[#FAF7F2] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Studio Gate: Strict Custom Admin Password Only (Public Visitors Blocked) */}
              {!adminUnlocked ? (
                <div className="p-8 sm:p-14 text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-[#1B4D5C]/10 text-[#1B4D5C] flex items-center justify-center mx-auto mb-5 border border-[#1B4D5C]/20">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] font-semibold bg-[#F3EDE4] text-[#5C584F] border border-[#E5DEC9] mb-3">
                    Restricted Artist Access
                  </span>
                  <h4 className="font-serif-display text-3xl font-semibold text-[#1E1E1C]">
                    Sourav Acharaya Studio Vault
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C584F] mt-2 mb-6 leading-relaxed">
                    This workspace is strictly restricted to the artist. Enter your private studio master password to publish paintings, edit commission rates, or inspect client orders.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (passcodeInput === studioPasscode) {
                        setAdminUnlocked(true);
                        setPasscodeError('');
                        setPasscodeInput('');
                        // Mark unread orders seen upon verified admin login
                        orders.forEach((o) => {
                          if (o.unread) updateOrderStatus(o.id, o.status);
                        });
                      } else {
                        setPasscodeError('Access Denied: Invalid studio password.');
                      }
                    }}
                    className="space-y-3.5"
                  >
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="Enter Private Studio Password"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-center text-sm tracking-widest focus:outline-none focus:border-[#1B4D5C]"
                    />
                    {passcodeError && (
                      <p className="text-xs text-[#C83E2B] font-semibold">{passcodeError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-[#1B4D5C] text-[#FAF7F2] text-sm font-semibold hover:bg-[#143B47] transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Verify &amp; Enter Studio</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Unlocked Admin Workspace */
                <div>
                  {/* Admin Navigation Tabs */}
                  <div className="px-6 pt-4 bg-[#FAF7F2] border-b border-[#E5DEC9] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setAdminTab('add')}
                        className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                          adminTab === 'add'
                            ? 'border-[#1B4D5C] text-[#1B4D5C] bg-[#F3EDE4]/60'
                            : 'border-transparent text-[#6E695F] hover:text-[#1E1E1C]'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Piece</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('manage')}
                        className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                          adminTab === 'manage'
                            ? 'border-[#1B4D5C] text-[#1B4D5C] bg-[#F3EDE4]/60'
                            : 'border-transparent text-[#6E695F] hover:text-[#1E1E1C]'
                        }`}
                      >
                        <Layers className="w-4 h-4" />
                        <span>Manage Portfolio ({artworks.length})</span>
                      </button>

                      <button
                        onClick={() => {
                          setDraftPricing(pricingConfig);
                          setAdminTab('pricing');
                        }}
                        className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                          adminTab === 'pricing'
                            ? 'border-[#1B4D5C] text-[#1B4D5C] bg-[#F3EDE4]/60'
                            : 'border-transparent text-[#6E695F] hover:text-[#1E1E1C]'
                        }`}
                      >
                        <IndianRupee className="w-4 h-4 text-[#D99B26]" />
                        <span>Commission Pricing</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('orders')}
                        className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                          adminTab === 'orders'
                            ? 'border-[#1B4D5C] text-[#1B4D5C] bg-[#F3EDE4]/60'
                            : 'border-transparent text-[#6E695F] hover:text-[#1E1E1C]'
                        }`}
                      >
                        <Bell className="w-4 h-4 text-[#C83E2B]" />
                        <span>Orders ({orders.length})</span>
                      </button>

                      <button
                        onClick={() => setAdminTab('security')}
                        className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                          adminTab === 'security'
                            ? 'border-[#1B4D5C] text-[#1B4D5C] bg-[#F3EDE4]/60'
                            : 'border-transparent text-[#6E695F] hover:text-[#1E1E1C]'
                        }`}
                      >
                        <KeyRound className="w-4 h-4 text-[#1B4D5C]" />
                        <span>Security</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F3EDE4] text-[#1B4D5C] border border-[#DFD6C3]">
                        <Cloud className="w-3 h-3" />
                        {cloudSynced ? 'Cloud Synced' : 'Local Studio Mode'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminUnlocked(false);
                          setAdminOpen(false);
                        }}
                        className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#C83E2B]/10 text-[#C83E2B] hover:bg-[#C83E2B] hover:text-[#FAF7F2] transition-colors"
                      >
                        Lock Studio
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: ADD NEW ARTWORK */}
                  {adminTab === 'add' && (
                    <form
                      onSubmit={handlePublishArtwork}
                      className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[72vh] overflow-y-auto"
                    >
                      <div className="md:col-span-5 space-y-4">
                        <label className="block text-xs font-semibold text-[#3B3934]">
                          Artwork Preview &amp; Upload
                        </label>
                        <div className="rounded-2xl bg-[#F3EDE4] p-3 border border-[#E5DEC9]">
                          <img
                            src={newArtForm.image}
                            alt="New Artwork Preview"
                            className="w-full aspect-[4/5] object-cover rounded-xl"
                          />
                        </div>

                        <label className="w-full py-2.5 px-4 rounded-xl bg-[#FFFDF9] hover:bg-[#F3EDE4] border border-[#DFD6C3] text-xs font-semibold text-[#1B4D5C] flex items-center justify-center gap-2 cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Upload Painting / Sketch Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleNewArtFileUpload}
                            className="hidden"
                          />
                        </label>

                        {/* Quick Demo Preset Artwork Switcher */}
                        <div>
                          <span className="block text-[11px] text-[#6E695F] mb-1.5">
                            Or test with a studio sample image:
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: 'Impasto', src: ART_ASSETS.painting1 },
                              { label: 'Sketch', src: ART_ASSETS.sketch1 },
                              { label: 'Pencil', src: ART_ASSETS.colorPencil1 },
                              { label: 'Water', src: ART_ASSETS.watercolor1 }
                            ].map((preset) => (
                              <button
                                type="button"
                                key={preset.label}
                                onClick={() =>
                                  setNewArtForm((prev) => ({ ...prev, image: preset.src }))
                                }
                                className="p-1 rounded-lg border border-[#DFD6C3] bg-[#FFFDF9] hover:border-[#1B4D5C] text-[10px] font-medium text-center"
                              >
                                <img
                                  src={preset.src}
                                  alt={preset.label}
                                  className="w-full h-10 object-cover rounded mb-1"
                                />
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                            Artwork Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Autumn Reflections on Hooghly"
                            value={newArtForm.title}
                            onChange={(e) =>
                              setNewArtForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                              Collection Section
                            </label>
                            <select
                              value={newArtForm.category}
                              onChange={(e) =>
                                setNewArtForm((prev) => ({
                                  ...prev,
                                  category: e.target.value
                                }))
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C]"
                            >
                              <option value="Featured Paintings">Featured Paintings</option>
                              <option value="Sketches">Sketches</option>
                              <option value="Color Pencil">Color Pencil</option>
                              <option value="Watercolor">Watercolor</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                              Dimensions &amp; Year
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="24 × 36 in"
                                value={newArtForm.dimensions}
                                onChange={(e) =>
                                  setNewArtForm((prev) => ({
                                    ...prev,
                                    dimensions: e.target.value
                                  }))
                                }
                                className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C]"
                              />
                              <input
                                type="text"
                                placeholder="2026"
                                value={newArtForm.year}
                                onChange={(e) =>
                                  setNewArtForm((prev) => ({
                                    ...prev,
                                    year: e.target.value
                                  }))
                                }
                                className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C]"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                            Medium &amp; Surface Details
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Oil & Impasto Knife on Belgian Linen"
                            value={newArtForm.medium}
                            onChange={(e) =>
                              setNewArtForm((prev) => ({ ...prev, medium: e.target.value }))
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                            Curator Story / Inspiration
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Write the story behind this piece..."
                            value={newArtForm.description}
                            onChange={(e) =>
                              setNewArtForm((prev) => ({
                                ...prev,
                                description: e.target.value
                              }))
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C] resize-none"
                          />
                        </div>

                        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F3EDE4] border border-[#E5DEC9] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newArtForm.featured}
                            onChange={(e) =>
                              setNewArtForm((prev) => ({
                                ...prev,
                                featured: e.target.checked
                              }))
                            }
                            className="w-4 h-4 accent-[#1B4D5C]"
                          />
                          <span className="text-xs font-semibold text-[#1E1E1C]">
                            Highlight in “Featured Masterpieces” Showcase on Homepage
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-full bg-[#1B4D5C] hover:bg-[#143B47] text-[#FAF7F2] text-sm font-semibold tracking-wide shadow-md transition-all"
                        >
                          Publish Artwork to Live Portfolio
                        </button>
                      </div>
                    </form>
                  )}

                  {/* TAB 2: MANAGE EXISTING COLLECTION */}
                  {adminTab === 'manage' && (
                    <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto space-y-3">
                      {artworks.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E5DEC9]"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-14 h-16 rounded-xl object-cover border border-[#DFD6C3] shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-serif-display text-xl font-semibold text-[#1E1E1C] truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-[#6E695F] truncate">
                                {item.category} • {item.dimensions} • {item.year}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => toggleFeatured(item.id)}
                              title="Toggle Featured Status"
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 border transition-colors ${
                                item.featured
                                  ? 'bg-[#D99B26] text-[#FFFDF9] border-[#D99B26]'
                                  : 'bg-[#F3EDE4] text-[#5C584F] border-[#DFD6C3]'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="hidden sm:inline">
                                {item.featured ? 'Featured' : 'Feature'}
                              </span>
                            </button>

                            <button
                              onClick={() => deleteArtwork(item.id)}
                              title="Delete Artwork"
                              className="p-2 rounded-full bg-[#F3EDE4] hover:bg-[#C83E2B] text-[#5C584F] hover:text-[#FAF7F2] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: COMMISSION PRICING MANAGER */}
                  {adminTab === 'pricing' && (
                    <form
                      onSubmit={handleSavePricing}
                      className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5DEC9]">
                        <div>
                          <h4 className="font-serif-display text-2xl font-semibold text-[#1E1E1C]">
                            Manage Custom Photo &amp; Portrait Rates
                          </h4>
                          <p className="text-xs text-[#6E695F]">
                            Adjust base rates by medium, canvas/paper size add-ons, and extra subject fees. Changes update the live Commission Calculator immediately.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetPricing}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F3EDE4] hover:bg-[#E8DFCE] text-xs font-semibold text-[#4A4740] border border-[#DFD6C3] shrink-0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Defaults</span>
                        </button>
                      </div>

                      {/* Medium Base Rates & Turnaround */}
                      <div>
                        <h5 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#1B4D5C] mb-3">
                          1. Base Portrait Price by Medium (₹ INR)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.keys(draftPricing.basePrices).map((med) => (
                            <div
                              key={med}
                              className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5DEC9] space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-[#1E1E1C]">
                                  {med}
                                </span>
                                <span className="text-xs font-bold text-[#1B4D5C]">
                                  {formatINR(draftPricing.basePrices[med])}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                <div>
                                  <label className="block text-[11px] text-[#6E695F] mb-1">
                                    Base Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={draftPricing.basePrices[med]}
                                    onChange={(e) =>
                                      setDraftPricing((prev) => ({
                                        ...prev,
                                        basePrices: {
                                          ...prev.basePrices,
                                          [med]: Number(e.target.value)
                                        }
                                      }))
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD6C3] text-sm font-semibold text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-[#6E695F] mb-1">
                                    Turnaround Time
                                  </label>
                                  <input
                                    type="text"
                                    value={draftPricing.turnaroundDays[med] || ''}
                                    onChange={(e) =>
                                      setDraftPricing((prev) => ({
                                        ...prev,
                                        turnaroundDays: {
                                          ...prev.turnaroundDays,
                                          [med]: e.target.value
                                        }
                                      }))
                                    }
                                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD6C3] text-xs font-medium text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Size Multipliers / Add-ons */}
                      <div>
                        <h5 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#1B4D5C] mb-3">
                          2. Paper &amp; Canvas Size Add-on Rates (₹ INR)
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {Object.keys(draftPricing.sizeAddons).map((sz) => (
                            <div
                              key={sz}
                              className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E5DEC9]"
                            >
                              <label className="block text-xs font-semibold text-[#1E1E1C] mb-1.5 line-clamp-1">
                                {sz}
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="100"
                                value={draftPricing.sizeAddons[sz]}
                                onChange={(e) =>
                                  setDraftPricing((prev) => ({
                                    ...prev,
                                    sizeAddons: {
                                      ...prev.sizeAddons,
                                      [sz]: Number(e.target.value)
                                    }
                                  }))
                                }
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD6C3] text-sm font-semibold text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Extra Subject & Framing Add-ons */}
                      <div>
                        <h5 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#1B4D5C] mb-3">
                          3. Additional Photo Subjects &amp; Framing Fees (₹ INR)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5DEC9]">
                            <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                              Extra Face / Person in Photo (₹ per subject)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={draftPricing.extraSubjectFee}
                              onChange={(e) =>
                                setDraftPricing((prev) => ({
                                  ...prev,
                                  extraSubjectFee: Number(e.target.value)
                                }))
                              }
                              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD6C3] text-sm font-semibold text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                            />
                          </div>
                          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E5DEC9]">
                            <label className="block text-xs font-semibold text-[#1E1E1C] mb-1">
                              Optional Museum Teakwood Framing (₹)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={draftPricing.framingFee}
                              onChange={(e) =>
                                setDraftPricing((prev) => ({
                                  ...prev,
                                  framingFee: Number(e.target.value)
                                }))
                              }
                              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD6C3] text-sm font-semibold text-[#1E1E1C] focus:outline-none focus:border-[#1B4D5C]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-7 py-3.5 rounded-full bg-[#1B4D5C] hover:bg-[#143B47] text-[#FAF7F2] text-sm font-semibold tracking-wide shadow-md transition-all flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save &amp; Apply Live Pricing</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* TAB 4: COMMISSION INBOX & NOTIFICATIONS */}
                  {adminTab === 'orders' && (
                    <div className="p-6 sm:p-8 max-h-[72vh] overflow-y-auto space-y-4">
                      {orders.length === 0 ? (
                        <p className="text-center text-sm text-[#6E695F] py-10">
                          No commission requests yet.
                        </p>
                      ) : (
                        orders.map((ord) => (
                          <div
                            key={ord.id}
                            className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E5DEC9] flex flex-col md:flex-row justify-between gap-5"
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={ord.referenceImage}
                                alt="Client Reference"
                                className="w-20 h-20 rounded-xl object-cover border border-[#DFD6C3] shrink-0"
                              />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-bold text-[#1B4D5C]">
                                    {ord.orderCode || ord.id}
                                  </span>
                                  {ord.quotedPrice && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D99B26]/20 text-[#8A5D0A]">
                                      Quote: {ord.quotedPrice}
                                    </span>
                                  )}
                                  <span className="text-xs text-[#7A7467]">
                                    • {ord.createdAt}
                                  </span>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                      ord.status === 'New'
                                        ? 'bg-[#C83E2B]/15 text-[#C83E2B]'
                                        : ord.status === 'In Progress'
                                        ? 'bg-[#D99B26]/20 text-[#8A5D0A]'
                                        : 'bg-[#1B4D5C]/15 text-[#1B4D5C]'
                                    }`}
                                  >
                                    {ord.status}
                                  </span>
                                </div>

                                <h4 className="font-serif-display text-2xl font-semibold text-[#1E1E1C] mt-1">
                                  {ord.clientName}{' '}
                                  <span className="text-sm font-sans font-normal text-[#6E695F]">
                                    ({ord.city})
                                  </span>
                                </h4>
                                <p className="text-xs font-semibold text-[#1B4D5C] mt-0.5">
                                  {ord.medium} — {ord.size}
                                  {ord.subjects ? ` • ${ord.subjects} Subject(s)` : ''}
                                </p>
                                <p className="text-xs text-[#4A4740] mt-2 leading-relaxed">
                                  “{ord.notes}”
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between items-end gap-3 shrink-0">
                              <select
                                value={ord.status}
                                onChange={(e) =>
                                  updateOrderStatus(ord.id, e.target.value)
                                }
                                className="px-3 py-1.5 rounded-xl bg-[#F3EDE4] border border-[#DFD6C3] text-xs font-semibold text-[#1E1E1C]"
                              >
                                <option value="New">Status: New</option>
                                <option value="In Progress">Status: In Progress</option>
                                <option value="Completed">Status: Completed</option>
                              </select>

                              <a
                                href={`mailto:${ord.clientEmail}?subject=${encodeURIComponent(
                                  `Re: Your Art Commission (${ord.orderCode || ord.id}) — Sourav Acharaya Studio`
                                )}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1B4D5C] text-[#FAF7F2] text-xs font-semibold hover:bg-[#143B47] transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reply to Client</span>
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 5: STUDIO ADMIN PASSWORD SECURITY */}
                  {adminTab === 'security' && (
                    <form
                      onSubmit={handleUpdateStudioPassword}
                      className="p-6 sm:p-8 max-w-lg mx-auto space-y-5"
                    >
                      <div>
                        <h4 className="font-serif-display text-2xl font-semibold text-[#1E1E1C]">
                          Change Admin Studio Password
                        </h4>
                        <p className="text-xs text-[#6E695F] mt-1">
                          Update the private password required to unlock Sourav Acharaya’s Artist Studio. Changes sync immediately to your cloud database.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                          New Studio Password (min. 6 characters)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Enter new strong password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#3B3934] mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Re-enter new password"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#DFD6C3] text-sm focus:outline-none focus:border-[#1B4D5C]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-full bg-[#1B4D5C] hover:bg-[#143B47] text-[#FAF7F2] text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Save New Studio Password</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PortfolioContext.Provider>
  );
}