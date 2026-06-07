import React from 'react';
import { C, SIZE_DATA, SizeName, SIZES } from './tokens';

/* ── Size Button ─────────────────────────────────────────────── */
interface SizeButtonProps {
  size: SizeName;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function SizeButton({ size, isActive = false, onClick, disabled = false }: SizeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 52,
        height: 42,
        backgroundColor: isActive ? C.black : C.white,
        color: isActive ? C.white : C.black,
        border: `1.5px solid ${isActive ? C.black : C.border}`,
        borderRadius: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.3px',
      }}
    >
      {size}
    </button>
  );
}

/* ── Fit Bar ─────────────────────────────────────────────────── */
interface FitBarProps {
  fit: number; // 0–100
  dark?: boolean;
  showLabels?: boolean;
  width?: number;
}

export function FitBar({ fit, dark = false, showLabels = true, width = 200 }: FitBarProps) {
  const fillW = Math.max(4, (fit / 100) * width);
  const trackColor = dark ? 'rgba(255,255,255,0.12)' : C.border;
  const fillColor = dark ? C.white : C.black;
  const dotBorder = dark ? '#111' : C.white;
  const textColor = dark ? '#888888' : C.gray;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif' }}>
      {showLabels && (
        <span style={{ fontSize: 10, color: textColor, width: 28 }}>Slim</span>
      )}
      <div style={{ position: 'relative', width, height: 14, display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div
          style={{
            width,
            height: 6,
            backgroundColor: trackColor,
            borderRadius: 3,
            position: 'absolute',
            left: 0,
          }}
        />
        {/* Fill */}
        <div
          style={{
            width: fillW,
            height: 6,
            backgroundColor: fillColor,
            borderRadius: 3,
            position: 'absolute',
            left: 0,
            transition: 'width 0.4s ease',
          }}
        />
        {/* Dot */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: fillColor,
            border: `2px solid ${dotBorder}`,
            position: 'absolute',
            left: fillW - 7,
            transition: 'left 0.4s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {showLabels && (
        <span style={{ fontSize: 10, color: textColor, width: 44 }}>Oversize</span>
      )}
    </div>
  );
}

/* ── Size Preview Panel ──────────────────────────────────────── */
interface SizePreviewPanelProps {
  size: SizeName;
}

export function SizePreviewPanel({ size }: SizePreviewPanelProps) {
  const data = SIZE_DATA[size];

  const chipText =
    size === 'XS' || size === 'S'
      ? 'Fit ajustado'
      : size === 'L' || size === 'XL'
      ? 'Fit amplio'
      : 'Talla estándar';

  const metrics = [
    { label: 'ANCHO',   value: `${data.ancho} cm` },
    { label: 'LARGO',   value: `${data.largo} cm` },
    { label: 'HOLGURA', value: data.holgura },
  ];

  return (
    <div
      style={{
        backgroundColor: '#f9f9f9',
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: '12px 12px 10px',
        width: '100%',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.gray, letterSpacing: '0.5px' }}>
          MEDIDAS
        </span>
        <span
          style={{
            backgroundColor: C.black,
            color: C.white,
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 20,
          }}
        >
          {size}
        </span>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              flex: 1,
              backgroundColor: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: '7px 8px',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 600, color: C.gray, letterSpacing: '0.3px', marginBottom: 4 }}>
              {m.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Fit bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: C.gray }}>Slim</span>
        <span style={{ fontSize: 10, color: C.gray }}>Oversize</span>
      </div>
      <FitBar fit={data.fit} width={280} showLabels={false} />

      {/* Chip */}
      <div style={{ marginTop: 10 }}>
        <span
          style={{
            display: 'inline-block',
            backgroundColor: C.chipSuccessBg,
            color: C.chipSuccessFg,
            fontSize: 10,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 20,
          }}
        >
          ✓ Disponible · {chipText}
        </span>
      </div>
    </div>
  );
}

/* ── Match Badge ─────────────────────────────────────────────── */
interface MatchBadgeProps {
  pct: number;
}

export function MatchBadge({ pct }: MatchBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: C.matchGreen,
        color: C.white,
        fontSize: 12,
        fontWeight: 700,
        padding: '5px 14px',
        borderRadius: 14,
        letterSpacing: '0.3px',
      }}
    >
      {pct}% Match
    </span>
  );
}

/* ── Chip ────────────────────────────────────────────────────── */
interface ChipProps {
  label: string;
  bg: string;
  fg: string;
}

export function Chip({ label, bg, fg }: ChipProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        backgroundColor: bg,
        color: fg,
        fontSize: 10,
        fontWeight: 600,
        padding: '4px 12px',
        borderRadius: 20,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {label}
    </span>
  );
}
