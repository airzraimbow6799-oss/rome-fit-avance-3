import React, { useState } from 'react';
import { C, SIZE_DATA, SizeName, SIZES } from '../components/romefit/tokens';
import { SizeButton, FitBar, SizePreviewPanel, MatchBadge, Chip } from '../components/romefit/SharedComponents';
import { Mannequin } from '../components/romefit/Mannequin';

/* ── Section wrapper ────────────────────────────────────────────── */
function Section({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#999', letterSpacing: '1px', margin: 0, fontFamily: 'Inter, sans-serif' }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 11, color: '#bbb', margin: '4px 0 0', fontFamily: 'Inter, sans-serif' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Color Swatch ───────────────────────────────────────────────── */
function Swatch({ name, hex, textColor }: { name: string; hex: string; textColor: string }) {
  return (
    <div
      style={{
        width: 110,
        height: 70,
        backgroundColor: hex,
        borderRadius: 6,
        border: hex === C.white ? `1px solid ${C.border}` : 'none',
        padding: '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'Inter, sans-serif',
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 600, color: textColor }}>{name}</span>
      <span style={{ fontSize: 9, color: textColor, opacity: 0.75 }}>{hex}</span>
    </div>
  );
}

/* ── CTA Button preview ─────────────────────────────────────────── */
function CTABtn({
  label, bg, color, border,
}: { label: string; bg: string; color: string; border: string }) {
  return (
    <button
      style={{
        height: 50,
        padding: '0 24px',
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.5px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Typography Row ─────────────────────────────────────────────── */
function TypeRow({ style, label, spec }: { style: React.CSSProperties; label: string; spec: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 120, fontSize: 11, color: C.gray, fontFamily: 'Inter, sans-serif' }}>{label}</div>
      <div style={{ flex: 1, fontFamily: 'Inter, sans-serif', ...style }}>RomeFit — Premium</div>
      <div style={{ width: 180, fontSize: 10, color: '#bbb', fontFamily: 'Inter, sans-serif' }}>{spec}</div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────── */
export function DesignSystemPage() {
  const [activeSize, setActiveSize] = useState<SizeName>('M');

  const colors = [
    { name: 'Black',      hex: C.black,         text: C.white },
    { name: 'DarkGray',   hex: C.darkGray,       text: C.white },
    { name: 'Gray',       hex: C.gray,           text: C.white },
    { name: 'LightGray',  hex: C.lightGray,      text: C.black },
    { name: 'Border',     hex: C.border,         text: C.black },
    { name: 'White',      hex: C.white,          text: C.black },
    { name: 'Red',        hex: C.red,            text: C.white },
    { name: 'Green',      hex: C.greenPrimary,   text: C.white },
    { name: 'Match',      hex: C.matchGreen,     text: C.white },
    { name: 'ChipSucBg',  hex: C.chipSuccessBg,  text: C.chipSuccessFg },
    { name: 'ChipWrnBg',  hex: C.chipWarningBg,  text: C.chipWarningFg },
    { name: 'DarkBg',     hex: C.darkBg,         text: C.darkText },
    { name: 'DarkSurf',   hex: C.darkSurface,    text: C.darkText },
    { name: 'DarkAccent', hex: C.darkAccent,     text: C.darkBg },
  ];

  const chipDefs: { label: string; bg: string; fg: string }[] = [
    { label: '✓ Disponible',     bg: C.chipSuccessBg, fg: C.chipSuccessFg },
    { label: 'Fit ajustado',     bg: '#eeeeee',        fg: '#444444' },
    { label: 'Fit amplio',       bg: '#eeeeee',        fg: '#444444' },
    { label: '⚙ Talla a medida', bg: C.darkGray,       fg: C.white },
    { label: '91% Match',        bg: C.matchGreen,     fg: C.white },
    { label: '⚠ Sin stock',      bg: C.chipWarningBg,  fg: C.chipWarningFg },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        padding: '40px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              fontStyle: 'italic',
              color: C.black,
              letterSpacing: '-1px',
            }}
          >
            ROME
          </span>
          <div
            style={{
              height: 28,
              width: 1,
              backgroundColor: C.border,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: C.gray,
              letterSpacing: '1px',
            }}
          >
            DESIGN SYSTEM
          </span>
        </div>
        <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>
          RomeFit Design System Builder · Tokens, componentes y guías de estilo
        </p>
      </div>

      {/* ── Color Palette ── */}
      <Section title="COLOR PALETTE — styles.css :root">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {colors.map((c) => (
            <Swatch key={c.name} name={c.name} hex={c.hex} textColor={c.text} />
          ))}
        </div>
      </Section>

      {/* ── Typography ── */}
      <Section title="TYPOGRAPHY — Inter font family" subtitle="RomeFit Text Styles">
        <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: '0 20px' }}>
          <TypeRow label="Logo / 24 ExtraBold"   style={{ fontSize: 24, fontWeight: 800, fontStyle: 'italic' }}    spec="ExtraBold Italic · -1px" />
          <TypeRow label="H1 / 28 Medium"        style={{ fontSize: 28, fontWeight: 500 }}                         spec="Medium · -0.5px" />
          <TypeRow label="H2 / 22 SemiBold"      style={{ fontSize: 22, fontWeight: 600 }}                         spec="SemiBold · 0px" />
          <TypeRow label="H3 / 16 SemiBold"      style={{ fontSize: 16, fontWeight: 600 }}                         spec="SemiBold · 0px" />
          <TypeRow label="Nav / 11 SemiBold"     style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px' }} spec="SemiBold · +0.5px" />
          <TypeRow label="Body / 14 Regular"     style={{ fontSize: 14, fontWeight: 400 }}                         spec="Regular · 0px" />
          <TypeRow label="Label / 13 Regular"    style={{ fontSize: 13, fontWeight: 400 }}                         spec="Regular · 0px" />
          <TypeRow label="Caption / 11 SemiBold" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px' }} spec="SemiBold · +0.8px" />
          <TypeRow label="Badge / 11 Bold"       style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }} spec="Bold · +0.5px" />
          <TypeRow label="Predicted / 28 ExtraBold" style={{ fontSize: 28, fontWeight: 800, fontStyle: 'italic' }} spec="ExtraBold Italic · 0px" />
        </div>
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>
        {/* ── Size Buttons ── */}
        <div>
          <Section title="SIZE BUTTONS — app.js sizeBtns" subtitle="Default + Active states for XS → XL">
            <div>
              <div style={{ fontSize: 11, color: C.gray, marginBottom: 8 }}>Default</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {SIZES.map((s) => (
                  <SizeButton key={s} size={s} isActive={false} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: C.gray, marginBottom: 8 }}>Active</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {SIZES.map((s) => (
                  <SizeButton key={s} size={s} isActive onClick={() => setActiveSize(s)} />
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 42,
                  maxWidth: 320,
                  backgroundColor: C.lightGray,
                  border: `1.5px solid #aaaaaa`,
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.darkGray,
                  cursor: 'pointer',
                }}
              >
                ⚙&nbsp; Personalizado — Ingresa tus medidas
              </div>
            </div>
          </Section>
        </div>

        {/* ── Chips ── */}
        <div>
          <Section title="CHIPS — size-chips" subtitle="Status labels and badges">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chipDefs.map((ch) => (
                <div key={ch.label}>
                  <Chip label={ch.label} bg={ch.bg} fg={ch.fg} />
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── Fit Bars ── */}
      <Section title="FIT BARS — SIZE_DATA fitPos (0–100%)" subtitle="Visual slider showing fit position per size">
        <div
          style={{
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {SIZES.map((s) => {
            const d = SIZE_DATA[s];
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span
                  style={{
                    width: 28,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.black,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {s}
                </span>
                <FitBar fit={d.fit} width={280} />
                <span style={{ fontSize: 11, color: C.gray, fontFamily: 'Inter, sans-serif', width: 120 }}>
                  {d.fit}% · {d.ancho}cm × {d.largo}cm
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Size Preview Panels ── */}
      <Section title="SIZE PREVIEW PANELS — renderMainTshirt()" subtitle="Select a size to preview all panels">
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {SIZES.map((s) => (
            <SizeButton
              key={s}
              size={s}
              isActive={activeSize === s}
              onClick={() => setActiveSize(s)}
            />
          ))}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 12,
          }}
        >
          {SIZES.map((s) => (
            <SizePreviewPanel key={s} size={s} />
          ))}
        </div>
      </Section>

      {/* ── Mannequin preview ── */}
      <Section title="MANNEQUIN 3D — Three.js Mannequin Preview" subtitle="SVG placeholder · updates per size and color">
        <div
          style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          {/* Light bg mannequins */}
          {[
            { s: 'XS', color: '#ffffff' },
            { s: 'M',  color: '#ffffff' },
            { s: 'XL', color: '#ffffff' },
            { s: 'M',  color: '#111111' },
          ].map(({ s, color }, i) => (
            <div
              key={i}
              style={{
                backgroundColor: color === '#ffffff' ? '#f0f0f0' : '#f0f0f0',
                borderRadius: 6,
                width: 130,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <div style={{ width: 90, height: 160 }}>
                <Mannequin size={s as SizeName} shirtColor={color} className="w-full h-full" />
              </div>
              <div style={{ fontSize: 10, color: C.gray, fontFamily: 'Inter, sans-serif', marginTop: 6 }}>
                {s} · {color === '#ffffff' ? 'Blanco' : 'Negro'}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        {/* ── CTA Buttons ── */}
        <Section title="CTA BUTTONS" subtitle="Primary actions on product page">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <CTABtn label="AGREGAR AL CARRITO"  bg={C.white}        color={C.black} border={C.black} />
            <CTABtn label="COMPRAR AHORA"        bg={C.black}        color={C.white} border={C.black} />
            <CTABtn label="CALCULAR MI TALLA"   bg={C.greenPrimary} color={C.white} border={C.greenPrimary} />
            <CTABtn label="SOLICITAR CONFECCIÓN" bg={C.black}        color={C.white} border={C.black} />
          </div>
        </Section>

        {/* ── Match Badge ── */}
        <Section title="MATCH BADGE — finishBtn (91–98%)" subtitle="Appears after wizard completion">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[91, 94, 96, 98].map((pct) => (
              <div key={pct}>
                <MatchBadge pct={pct} />
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── Variables reference ── */}
      <Section title="VARIABLES — RomeFit/SizeSystem · talla/* + medidas/*" subtitle="Mapped from SIZE_DATA constants">
        <div
          style={{
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ backgroundColor: C.lightGray }}>
                {['Variable', 'XS', 'S', 'M', 'L', 'XL'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '8px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.gray,
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'talla/widthMod',   key: 'wm' as const },
                { name: 'talla/lengthMod',  key: 'lm' as const },
                { name: 'talla/fitPos',     key: 'fit' as const },
                { name: 'medidas/ancho_cm', key: 'ancho' as const },
                { name: 'medidas/largo_cm', key: 'largo' as const },
                { name: 'talla/holgura',    key: 'holgura' as const },
              ].map((row, idx) => (
                <tr
                  key={row.name}
                  style={{ backgroundColor: idx % 2 === 0 ? C.white : '#fafafa' }}
                >
                  <td
                    style={{
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.darkGray,
                      borderBottom: `1px solid ${C.border}`,
                      fontFamily: 'monospace',
                    }}
                  >
                    {row.name}
                  </td>
                  {SIZES.map((s) => (
                    <td
                      key={s}
                      style={{
                        padding: '8px 14px',
                        fontSize: 12,
                        color: C.black,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {String((SIZE_DATA[s] as any)[row.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
