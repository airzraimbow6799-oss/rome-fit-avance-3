import React from 'react';
import { SIZE_DATA, SizeName } from './tokens';

interface MannequinProps {
  size?: SizeName;
  shirtColor?: string;
  dark?: boolean;
  className?: string;
  hasLongSleeves?: boolean;
}

export function Mannequin({ size = 'M', shirtColor = '#ffffff', dark = false, className = '', hasLongSleeves = false }: MannequinProps) {
  const data = SIZE_DATA[size];
  const bodyColor = dark ? '#D8D8D8' : '#1f1f1f';
  const cx = 150;
  const sy = 100;

  const shirtHalfW = 70 + data.wm * 26;
  const shirtLen = 162 + data.lm * 52;
  const sleeveLen = 62;
  const sleeveBottomW = 22;
  const neckBg = dark ? '#2C2C2C' : '#ebebeb';

  // Cuff detail color
  const cuffColor = shirtColor === '#ffffff' || shirtColor === '#f9f9f9'
    ? 'rgba(0,0,0,0.12)'
    : 'rgba(255,255,255,0.22)';

  return (
    <svg viewBox="0 0 300 480" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Head */}
      <ellipse cx={cx} cy="50" rx="27" ry="31" fill={bodyColor} />
      {/* Neck */}
      <rect x="141" y="79" width="18" height="23" fill={bodyColor} />
      {/* Body */}
      <rect x="116" y="100" width="68" height="200" rx="3" fill={bodyColor} />

      {/* Left upper arm */}
      <rect x="54" y="100" width="64" height="24" rx="5" fill={bodyColor} />
      {/* Left forearm */}
      <rect x="45" y="122" width="24" height="115" rx="4" fill={bodyColor} />

      {/* Right upper arm */}
      <rect x="182" y="100" width="64" height="24" rx="5" fill={bodyColor} />
      {/* Right forearm */}
      <rect x="231" y="122" width="24" height="115" rx="4" fill={bodyColor} />

      {/* Legs */}
      <rect x="118" y="298" width="30" height="182" rx="4" fill={bodyColor} />
      <rect x="152" y="298" width="30" height="182" rx="4" fill={bodyColor} />

      {/* ── SHIRT BODY ── */}
      <rect x={cx - shirtHalfW} y={sy} width={shirtHalfW * 2} height={shirtLen} rx="5" fill={shirtColor} />

      {/* ── SHORT SLEEVE left ── */}
      <polygon
        points={`
          ${cx - shirtHalfW},${sy + 4}
          ${cx - shirtHalfW - sleeveLen},${sy + 18}
          ${cx - shirtHalfW - sleeveLen + sleeveBottomW},${sy + 72}
          ${cx - shirtHalfW},${sy + 58}
        `}
        fill={shirtColor}
      />
      {/* ── SHORT SLEEVE right ── */}
      <polygon
        points={`
          ${cx + shirtHalfW},${sy + 4}
          ${cx + shirtHalfW + sleeveLen},${sy + 18}
          ${cx + shirtHalfW + sleeveLen - sleeveBottomW},${sy + 72}
          ${cx + shirtHalfW},${sy + 58}
        `}
        fill={shirtColor}
      />

      {/* ── LONG SLEEVE EXTENSION (only for long-sleeve products) ── */}
      {hasLongSleeves && (
        <>
          {/* Left forearm covered — bridged from sleeve bottom to wrist */}
          <rect x={43} y={166} width={28} height={69} rx={2} fill={shirtColor} />
          {/* Left cuff */}
          <rect x={44} y={227} width={26} height={10} rx={3} fill={cuffColor} />

          {/* Right forearm covered */}
          <rect x={229} y={166} width={28} height={69} rx={2} fill={shirtColor} />
          {/* Right cuff */}
          <rect x={230} y={227} width={26} height={10} rx={3} fill={cuffColor} />
        </>
      )}

      {/* Neck opening */}
      <path d={`M ${cx - 26} ${sy + 1} Q ${cx} ${sy + 30} ${cx + 26} ${sy + 1}`} fill={neckBg} />

      {/* Seam lines (light shirts only) */}
      {shirtColor !== '#000000' && shirtColor !== '#111111' && shirtColor !== '#2a2a2a' && shirtColor !== '#1a2744' && (
        <>
          <line x1={cx - shirtHalfW} y1={sy + 5} x2={cx - shirtHalfW} y2={sy + shirtLen} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          <line x1={cx + shirtHalfW} y1={sy + 5} x2={cx + shirtHalfW} y2={sy + shirtLen} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        </>
      )}
    </svg>
  );
}
