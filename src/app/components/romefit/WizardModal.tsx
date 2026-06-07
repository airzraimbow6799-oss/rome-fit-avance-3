import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { C, SIZE_DATA, SizeName, SIZES, ALL_SIZES } from './tokens';
import { useResponsive } from '../../hooks/useResponsive';
import { MatchBadge } from './SharedComponents';
import { Mannequin } from './Mannequin';

/* ── Types ──────────────────────────────────────────────────────── */
type FitStyle = 'Muy Justo' | 'Justo' | 'Oversize Moderado' | 'Oversize Extremo';
type MarcaReferencia = 'Nike' | 'Adidas' | 'Zara' | 'H&M' | 'Supreme' | 'Off-White' | 'Local Peruano' | 'Otra' | '';
type Complexion = 'Delgado' | 'Regular' | 'Atlético' | 'Robusto' | '';

interface WizardData {
  // Paso 1: Medidas
  altura: string;
  peso: string;
  pecho: string;
  complexion: Complexion;
  // Paso 2: Estilo de ajuste
  fitStyle: FitStyle;
  // Paso 3: Marca de referencia (opcional)
  marca: MarcaReferencia;
  tallaHabitual: SizeName | '';
}

/* ── Validation limits ──────────────────────────────────────────── */
const ALTURA_MAX = 210; // cm  — un poco más de 2 metros
const ALTURA_MIN = 100;
const PESO_MAX   = 200; // kg
const PESO_MIN   = 20;
const PECHO_MAX  = 150; // cm
const PECHO_MIN  = 60;  // cm

/* ── Size computation ──────────────────────────────────────────── */
// ALL_SIZES index: XS=0, S=1, M=2, L=3, XL=4, XXL=5, XXXL=6
// Sizing based on standard Latino/Peruvian male shirt measurements
function computeRecommendation(data: WizardData, seed: number) {
  const peso   = parseFloat(data.peso);
  const altura = parseFloat(data.altura);
  const pecho  = parseFloat(data.pecho);

  let sizeIdx = 2; // default M
  let confidence: 'Alta' | 'Media' | 'Baja' = 'Baja';

  const hasPecho  = !isNaN(pecho) && pecho > 0;
  const hasBMI    = !isNaN(peso) && !isNaN(altura) && altura > 0;

  // Primary: chest circumference — most accurate metric for shirt sizing
  if (hasPecho) {
    if      (pecho < 88)  sizeIdx = 0; // XS: ≤87 cm
    else if (pecho < 94)  sizeIdx = 1; // S: 88–93 cm
    else if (pecho < 100) sizeIdx = 2; // M: 94–99 cm
    else if (pecho < 106) sizeIdx = 3; // L: 100–105 cm
    else if (pecho < 114) sizeIdx = 4; // XL: 106–113 cm
    else if (pecho < 122) sizeIdx = 5; // XXL: 114–121 cm
    else                  sizeIdx = 6; // XXXL: ≥122 cm
    confidence = 'Alta';
  }

  // Secondary: BMI — used alone or to nudge chest-based result
  if (hasBMI) {
    const bmi = peso / Math.pow(altura / 100, 2);
    let bmiIdx = 2;
    if      (bmi < 18.5) bmiIdx = 0;
    else if (bmi < 21.5) bmiIdx = 1;
    else if (bmi < 24.5) bmiIdx = 2;
    else if (bmi < 27.5) bmiIdx = 3;
    else if (bmi < 31.0) bmiIdx = 4;
    else if (bmi < 35.0) bmiIdx = 5;
    else                 bmiIdx = 6;

    if (hasPecho) {
      // Both provided: if they diverge by ≥2 steps, nudge chest result 1 step toward BMI
      const diff = bmiIdx - sizeIdx;
      if (Math.abs(diff) >= 2) sizeIdx = sizeIdx + Math.sign(diff);
    } else {
      sizeIdx    = bmiIdx;
      confidence = 'Media';
    }
  }

  // Complexion adjustment (shoulders/torso build)
  if (data.complexion === 'Delgado')  sizeIdx = Math.max(0, sizeIdx - 1);
  if (data.complexion === 'Atlético') sizeIdx = Math.min(6, sizeIdx + 1);
  if (data.complexion === 'Robusto')  sizeIdx = Math.min(6, sizeIdx + 1);
  if (data.complexion && confidence === 'Baja') confidence = 'Media';

  // Fit style preference
  if (data.fitStyle === 'Muy Justo'         && sizeIdx > 0) sizeIdx--;
  if (data.fitStyle === 'Oversize Moderado' && sizeIdx < 6) sizeIdx++;
  if (data.fitStyle === 'Oversize Extremo')                 sizeIdx = Math.min(6, sizeIdx + 2);

  // Reference brand confirms data → upgrade confidence
  if (data.marca && data.tallaHabitual && confidence !== 'Alta') confidence = 'Alta';

  if (!hasPecho && !hasBMI) confidence = 'Baja';

  const clamped = Math.max(0, Math.min(6, sizeIdx));
  const size    = ALL_SIZES[clamped];
  const match   = confidence === 'Alta' ? 92 + (seed % 6) : confidence === 'Media' ? 82 + (seed % 8) : 70 + (seed % 10);
  const needsConfeccion = clamped >= 5;

  return { size, match, needsConfeccion, confidence };
}

/* ── Fit bar value helper ───────────────────────────────────────── */
function getFitValue(size: SizeName, fitStyle: FitStyle) {
  const base = SIZE_DATA[size].fit;
  let bonus = 0;
  if (fitStyle === 'Muy Justo') bonus = -10;
  else if (fitStyle === 'Oversize Moderado') bonus = 10;
  else if (fitStyle === 'Oversize Extremo') bonus = 18;
  return Math.min(96, Math.max(10, base + bonus));
}

/* ── Radio option card ──────────────────────────────────────────── */
function RadioCard({
  icon, label, subtitle, selected, onClick,
}: {
  icon: string; label: string; subtitle?: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 18px',
        border: `1.5px solid ${selected ? C.black : C.border}`,
        borderRadius: 8,
        backgroundColor: selected ? '#f9f9f9' : C.white,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.13s',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Radio circle */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${selected ? C.black : '#cccccc'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'border-color 0.13s',
        }}
      >
        {selected && (
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: C.black,
            }}
          />
        )}
      </div>

      {/* Icon */}
      <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{icon}</span>

      {/* Label */}
      <div>
        <div style={{ fontSize: 14, fontWeight: selected ? 600 : 400, color: C.black, lineHeight: 1.3 }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
    </button>
  );
}

/* ── Right panel stat row ──────────────────────────────────────── */
function StatRow({ icon, label, value, filled }: { icon: string; label: string; value: string; filled: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span style={{ fontSize: 12, color: '#999999' }}>{label}</span>
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: filled ? '#ffffff' : '#555555',
          transition: 'color 0.2s',
        }}
      >
        {filled ? value : '—'}
      </span>
    </div>
  );
}

/* ── Confeccion Modal ──────────────────────────────────────────── */
const TIMELINE_STEPS = [
  'Solicitud\nenviada',
  'Solicitud\nrecibida',
  'En\nconfección',
  'En proceso\nde envío',
  'Enviado a\ndomicilio',
];

function ConfeccionModal({
  onClose,
  onProcederAlPago,
  onAddToCart,
  productName = 'Polo Oversized Premium',
  price = 'S/. 89.90',
  confeccionSize = 'XXL',
}: {
  onClose: () => void;
  onProcederAlPago?: () => void;
  onAddToCart?: () => void;
  productName?: string;
  price?: string;
  confeccionSize?: SizeName;
}) {
  const basePrice   = parseFloat(price.replace('S/. ', '')) || 89.90;
  const envioPrice  = 20.00;
  const total       = basePrice + envioPrice;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30000,
        backdropFilter: 'blur(4px)',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 480,
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 28px 90px rgba(0,0,0,0.35)',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          padding: '36px 28px 28px',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 22, color: '#999999', cursor: 'pointer', lineHeight: 1 }}
        >
          ✕
        </button>

        {/* Scissors icon */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="9" stroke="#111" strokeWidth="2.5" fill="none"/>
            <circle cx="14" cy="38" r="9" stroke="#111" strokeWidth="2.5" fill="none"/>
            <circle cx="14" cy="14" r="3" fill="#111"/>
            <circle cx="14" cy="38" r="3" fill="#111"/>
            <line x1="20" y1="17" x2="44" y2="8" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="20" y1="35" x2="44" y2="44" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="28" y1="24" x2="44" y2="28" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111111', textAlign: 'center', margin: '0 0 10px', lineHeight: 1.3, fontFamily: 'Inter, sans-serif' }}>
          Esta prenda se envía a confección
        </h2>

        {/* Size badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            backgroundColor: '#111111', color: '#ffffff',
            borderRadius: 20, padding: '5px 16px',
            fontFamily: 'Inter, sans-serif',
          }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', opacity: 0.7 }}>TALLA CALCULADA</span>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.5px' }}>{confeccionSize}</span>
          </div>
        </div>

        {/* Subtitle */}
        <p style={{ fontSize: 14, color: '#666666', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.65, fontFamily: 'Inter, sans-serif' }}>
          Tu estilo y medidas requieren un ajuste especial que no tenemos actualmente en stock inmediato. Lo crearemos exclusivamente para ti.
        </p>

        {/* Info box */}
        <div style={{ backgroundColor: '#f5f5f5', borderRadius: 8, padding: '16px 18px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 10 }}>
            <span style={{ fontSize: 14, marginTop: 1 }}>⏱</span>
            <p style={{ fontSize: 13, color: '#111111', margin: 0, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
              <strong>Tiempo de confección:</strong> 5 a 7 días hábiles.
            </p>
          </div>
          <p style={{ fontSize: 13, color: '#555555', margin: '0 0 18px', lineHeight: 1.65, fontFamily: 'Inter, sans-serif' }}>
            ¿Por qué este tiempo? Realizamos el patronaje personalizado, cortamos la tela manualmente y ensamblamos tu prenda desde cero para garantizar tu calce perfecto.
          </p>

          {/* Timeline */}
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {TIMELINE_STEPS.map((label, i) => (
              <div
                key={i}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
              >
                {/* left connector */}
                {i > 0 && (
                  <div style={{ position: 'absolute', top: 9, left: 0, right: '50%', height: 2, backgroundColor: '#cccccc' }} />
                )}
                {/* right connector */}
                {i < TIMELINE_STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 9, left: '50%', right: 0, height: 2, backgroundColor: '#cccccc' }} />
                )}
                {/* Dot */}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: i === 0 ? '#111111' : '#ffffff',
                  border: `2px solid ${i === 0 ? '#111111' : '#cccccc'}`,
                  position: 'relative', zIndex: 1,
                }} />
                {/* Label */}
                <div style={{
                  fontSize: 9.5, color: i === 0 ? '#111111' : '#888888',
                  fontWeight: i === 0 ? 700 : 400, textAlign: 'center',
                  marginTop: 6, lineHeight: 1.3, whiteSpace: 'pre-line',
                  fontFamily: 'Inter, sans-serif', padding: '0 2px',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment summary */}
        <div style={{ border: '1px solid #e5e5e5', borderRadius: 8, padding: '16px 18px', marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111111', marginBottom: 14, fontFamily: 'Inter, sans-serif' }}>
            Resumen a pagar
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#333333', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
            <span>{productName} (A Medida)</span>
            <span>S/. {basePrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#888888', marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>
            <span>Talla confección: <strong style={{ color: '#111111' }}>{confeccionSize}</strong></span>
            <span style={{ backgroundColor: '#f0f0f0', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>Artesanal</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#333333', marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed #eeeeee', fontFamily: 'Inter, sans-serif' }}>
            <span>Envío Express</span>
            <span>S/. {envioPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, color: '#111111', fontFamily: 'Inter, sans-serif' }}>
            <span>TOTAL</span>
            <span>S/. {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Note */}
        <p style={{ fontSize: 13, color: '#666666', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.55, fontFamily: 'Inter, sans-serif' }}>
          Recibirás actualizaciones constantes de cada etapa de tu prenda.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onProcederAlPago}
            style={{ width: '100%', height: 52, backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '1px', fontFamily: 'Inter, sans-serif' }}
          >
            PROCEDER AL PAGO
          </button>
          <button
            onClick={() => {
              onAddToCart?.();
            }}
            style={{ width: '100%', height: 46, backgroundColor: 'transparent', color: '#111111', border: '1.5px solid #111111', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' }}
          >
            🛍️ AÑADIR A LA CESTA
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Step Components ──────────────────────────────────────────── */

const COMPLEXION_OPTIONS: { value: Complexion; icon: string; label: string; desc: string }[] = [
  { value: 'Delgado',   icon: '🤏', label: 'Delgado',   desc: 'Muy delgado' },
  { value: 'Regular',   icon: '🙆', label: 'Regular',   desc: 'Talla promedio para altura' },
  { value: 'Atlético',  icon: '💪', label: 'Atlético',  desc: 'Musculoso, bien definido' },
  { value: 'Robusto',   icon: '🏋️', label: 'Robusto',   desc: 'Talla más grande' },
];

function StepMedidas({
  data,
  onChange,
  errors,
}: {
  data: WizardData;
  onChange: (k: keyof WizardData, v: string) => void;
  errors: { altura: string | null; peso: string | null; pecho: string | null };
}) {
  const numericFields: {
    label: string;
    placeholder: string;
    field: 'altura' | 'peso' | 'pecho';
    error: string | null;
    icon: string;
    helper?: string;
  }[] = [
    { label: 'Altura (cm)', placeholder: 'Ej: 175', field: 'altura', error: errors.altura, icon: '📏' },
    { label: 'Peso (kg)', placeholder: 'Ej: 70', field: 'peso', error: errors.peso, icon: '⚖️' },
    { label: 'Pecho (cm)', placeholder: 'Ej: 95', field: 'pecho', error: errors.pecho, icon: '📐', helper: 'Mide alrededor del punto más ancho del pecho' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: C.black, margin: '0 0 8px', fontFamily: 'Inter, sans-serif' }}>
        Paso 1 de 3 — ¿Cuáles son tus medidas?
      </h3>
      <p style={{ fontSize: 12, color: C.gray, margin: '0 0 18px', lineHeight: 1.5 }}>
        Ingresa tus medidas para encontrar tu talla ideal
      </p>

      {numericFields.map(({ label, placeholder, field, error, icon, helper }) => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: error ? '#C00000' : C.black,
              marginBottom: 6,
              fontFamily: 'Inter, sans-serif',
              transition: 'color 0.2s',
              fontWeight: 500,
            }}
          >
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
            <span style={{ color: '#C00000', fontSize: 13, lineHeight: 1 }}>*</span>
          </label>
          {helper && (
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 6, lineHeight: 1.4 }}>
              💡 {helper}
            </div>
          )}
          <input
            type="number"
            value={data[field] as string}
            onChange={(e) => onChange(field, e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              height: 46,
              border: `1.5px solid ${error ? '#C00000' : C.border}`,
              borderRadius: 6,
              padding: '0 14px',
              fontSize: 14,
              color: C.black,
              backgroundColor: error ? '#fff5f5' : C.white,
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, background-color 0.2s',
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = C.black;
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.borderColor = error ? '#C00000' : C.border;
            }}
          />
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0,  height: 'auto' }}
                exit={{ opacity: 0, y: -4,    height: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 5,
                  fontSize: 12,
                  color: '#C00000',
                  fontFamily: 'Inter, sans-serif',
                  overflow: 'hidden',
                }}
              >
                <span>⚠</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Complexión selector */}
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: C.black,
          marginBottom: 8,
          fontFamily: 'Inter, sans-serif',
        }}>
          🧍 Complexión <span style={{ fontSize: 11, color: C.gray, fontWeight: 400 }}>(opcional)</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {COMPLEXION_OPTIONS.map((opt) => {
            const selected = data.complexion === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange('complexion', selected ? '' : opt.value)}
                style={{
                  padding: '10px 6px 8px',
                  border: `${selected ? 2 : 1.5}px solid ${selected ? '#8B0000' : C.border}`,
                  borderRadius: 6,
                  backgroundColor: selected ? 'rgba(139,0,0,0.07)' : C.white,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4, lineHeight: 1 }}>{opt.icon}</div>
                <div style={{
                  fontSize: 11,
                  fontWeight: selected ? 700 : 500,
                  color: selected ? '#8B0000' : C.black,
                  lineHeight: 1.2,
                }}>
                  {opt.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        fontSize: 10,
        color: '#888888',
        marginBottom: 8,
      }}>
        * Campo obligatorio
      </div>

      <div style={{
        padding: '10px 14px',
        backgroundColor: '#f9fafb',
        borderRadius: 6,
        fontSize: 12,
        color: C.gray,
        lineHeight: 1.5,
      }}>
        <span style={{ fontWeight: 600, color: C.black }}>¿No tienes cinta métrica?</span> Puedes usar tu talla de referencia en el siguiente paso.
      </div>
    </div>
  );
}

function StepEstiloAjuste({ data, onChange }: { data: WizardData; onChange: (k: keyof WizardData, v: string) => void }) {
  const options: { icon: string; label: FitStyle; subtitle: string; recommended?: boolean }[] = [
    { icon: '👔', label: 'Muy Justo', subtitle: 'Ajustado al cuerpo, sin holgura' },
    { icon: '👕', label: 'Justo', subtitle: 'Sigue la forma sin apretar' },
    { icon: '🧥', label: 'Oversize Moderado', subtitle: 'Hombros caídos, holgado', recommended: true },
    { icon: '🌊', label: 'Oversize Extremo', subtitle: 'Muy amplio, caída dramática' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: C.black, margin: '0 0 8px', fontFamily: 'Inter, sans-serif' }}>
        Paso 2 de 3 — ¿Cómo te gusta que te quede?
      </h3>
      <p style={{ fontSize: 12, color: C.gray, margin: '0 0 18px', lineHeight: 1.5 }}>
        Selecciona tu estilo de ajuste preferido
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt) => (
          <div key={opt.label} style={{ position: 'relative' }}>
            {opt.recommended && (
              <div style={{
                position: 'absolute',
                top: -8,
                right: 12,
                backgroundColor: C.red,
                color: C.white,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.5px',
                padding: '3px 8px',
                borderRadius: 10,
                zIndex: 1,
              }}>
                RECOMENDADO
              </div>
            )}
            <RadioCard
              icon={opt.icon}
              label={opt.label}
              subtitle={opt.subtitle}
              selected={data.fitStyle === opt.label}
              onClick={() => onChange('fitStyle', opt.label)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepMarcaReferencia({
  data,
  onChange,
  step2FitStyle,
  marcaError,
}: {
  data: WizardData;
  onChange: (k: keyof WizardData, v: string) => void;
  step2FitStyle: FitStyle;
  marcaError: boolean;
}) {
  const marcas: MarcaReferencia[] = ['Nike', 'Adidas', 'Zara', 'H&M', 'Supreme', 'Off-White', 'Local Peruano', 'Otra'];
  const tallas: SizeName[] = ['XS', 'S', 'M', 'L', 'XL'];

  function handleMarcaClick(m: MarcaReferencia) {
    if (data.marca === m) {
      // Deselect brand and its size
      onChange('marca', '');
      onChange('tallaHabitual', '');
    } else {
      onChange('marca', m);
      onChange('tallaHabitual', '');
    }
  }

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: C.black, margin: '0 0 4px', fontFamily: 'Inter, sans-serif' }}>
        Paso 3 de 3 — ¿En qué marca compras normalmente? <span style={{ fontSize: 12, fontWeight: 400, color: C.gray }}>(Opcional)</span>
      </h3>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: 6, padding: '5px 10px', fontSize: 11, color: '#15803d',
        marginBottom: 14,
      }}>
        Tu preferencia: <strong>{step2FitStyle}</strong>
      </div>
      <p style={{ fontSize: 12, color: C.gray, margin: '0 0 14px', lineHeight: 1.5 }}>
        Selecciona una marca y tu talla habitual — esto mejora la precisión de la recomendación.
      </p>

      {/* Accordion-style marca list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {marcas.map((m) => {
          const isSelected = data.marca === m;
          const hasError = isSelected && marcaError;
          return (
            <div key={m}>
              <button
                onClick={() => handleMarcaClick(m)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: `1.5px solid ${isSelected ? (hasError ? '#C00000' : '#8B0000') : C.border}`,
                  borderRadius: isSelected ? '6px 6px 0 0' : 6,
                  backgroundColor: isSelected ? (hasError ? '#fff5f5' : 'rgba(139,0,0,0.05)') : C.white,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 400,
                  color: isSelected ? '#8B0000' : C.black,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <span>{m}</span>
                <span style={{ fontSize: 12, color: isSelected ? '#8B0000' : C.gray }}>
                  {isSelected ? '▲ Seleccionado' : '▼ Seleccionar'}
                </span>
              </button>

              {/* Expanded: size selector */}
              {isSelected && (
                <div style={{
                  border: `1.5px solid ${hasError ? '#C00000' : '#8B0000'}`,
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  padding: '12px 14px',
                  backgroundColor: '#fafafa',
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: hasError ? '#C00000' : C.black,
                    marginBottom: 8,
                  }}>
                    Tu talla habitual en {m}:
                    {hasError && <span style={{ color: '#C00000', fontSize: 11, marginLeft: 6 }}>⚠ Selecciona una talla</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {tallas.map((t) => {
                      const tallaSelected = data.tallaHabitual === t;
                      return (
                        <button
                          key={t}
                          onClick={() => onChange('tallaHabitual', tallaSelected ? '' : t)}
                          style={{
                            flex: 1,
                            padding: '9px 4px',
                            border: `1.5px solid ${tallaSelected ? '#8B0000' : C.border}`,
                            borderRadius: 5,
                            backgroundColor: tallaSelected ? '#8B0000' : C.white,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 700,
                            color: tallaSelected ? C.white : C.black,
                            fontFamily: 'Inter, sans-serif',
                            textAlign: 'center',
                            transition: 'all 0.13s',
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '10px 14px',
        backgroundColor: '#f0f9ff',
        borderRadius: 6,
        fontSize: 12,
        color: '#0369a1',
        lineHeight: 1.5,
        border: '1px solid #bae6fd',
      }}>
        <strong>💡 Consejo:</strong> Proporcionar tu marca y talla de referencia aumenta la precisión de la recomendación.
      </div>
    </div>
  );
}

function StepResult({
  result,
  onApply,
  fitStyle,
}: {
  result: { size: SizeName; match: number; confidence: 'Alta' | 'Media' | 'Baja' };
  onApply: () => void;
  fitStyle: FitStyle;
}) {
  const d = SIZE_DATA[result.size];

  // Derive confidence display from match % for UI consistency (Problem 13)
  const displayConfidence: 'Alta' | 'Media' | 'Baja' =
    result.match >= 90 ? 'Alta' :
    result.match >= 70 ? 'Media' : 'Baja';

  // Confidence color mapping
  const confidenceColors = {
    'Alta': { bg: '#dcfce7', border: '#16a34a', text: '#166534', bar: '#22c55e' },
    'Media': { bg: '#fef3c7', border: '#d97706', text: '#92400e', bar: '#fbbf24' },
    'Baja': { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', bar: '#ef4444' },
  };

  const conf = confidenceColors[displayConfidence];

  const confidenceMessages = {
    'Alta': 'Recomendación precisa — tus medidas coinciden bien con esta talla',
    'Media': 'Recomendación aproximada — considera agregar marca de referencia',
    'Baja': 'Recomendación con limitaciones — proporciona más datos para mayor precisión',
  };

  // Holgura description based on fitStyle
  const holguraDescriptions = {
    'Muy Justo': 'La prenda se ajustará al cuerpo sin holgura adicional.',
    'Justo': 'La prenda seguirá tu forma corporal sin apretar.',
    'Oversize Moderado': 'La prenda tendrá 6-8 cm de holgura en el pecho. Los hombros caen 2 cm hacia afuera.',
    'Oversize Extremo': 'La prenda tendrá 10-12 cm de holgura máxima. Los hombros caen 4 cm hacia afuera para un look dramático.',
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: C.black, margin: '0 0 6px', textAlign: 'center' }}>
        Tu Talla Ideal
      </h3>
      <p style={{ fontSize: 12, color: C.gray, margin: '0 0 20px', textAlign: 'center' }}>
        Basado en tus medidas y preferencia {fitStyle.toLowerCase()}
      </p>

      {/* Talla grande */}
      <div style={{ textAlign: 'center', padding: '16px 0 12px' }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            fontStyle: 'italic',
            color: C.black,
            lineHeight: 1,
            marginBottom: 10,
          }}
        >
          {result.size}
        </div>
        <MatchBadge pct={result.match} />
      </div>

      {/* Barra de confianza */}
      <div style={{
        backgroundColor: conf.bg,
        border: `2px solid ${conf.border}`,
        borderRadius: 8,
        padding: '12px 14px',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: conf.text, letterSpacing: '0.5px' }}>
            CONFIANZA: {displayConfidence.toUpperCase()}
          </span>
          <span style={{ fontSize: 20 }}>
            {displayConfidence === 'Alta' ? '✅' : displayConfidence === 'Media' ? '⚠️' : '❗'}
          </span>
        </div>
        <div style={{
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.5)',
          borderRadius: 3,
          overflow: 'hidden',
          marginBottom: 8,
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, Math.max(10, result.match))}%`,
            backgroundColor: conf.bar,
            borderRadius: 3,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <p style={{ fontSize: 11, color: conf.text, margin: 0, lineHeight: 1.4 }}>
          {confidenceMessages[displayConfidence]}
        </p>
      </div>

      {/* Visualización del entalle */}
      <div style={{
        backgroundColor: '#f9fafb',
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: '14px 16px',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.black, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📐</span> Visualización del Entalle
        </div>
        <p style={{ fontSize: 11, color: C.gray, margin: '0 0 10px', lineHeight: 1.5 }}>
          {holguraDescriptions[fitStyle]}
        </p>

        {/* Medidas clave */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
          {[
            { l: 'Ancho',   v: `${d.ancho} cm`, icon: '↔️' },
            { l: 'Largo',   v: `${d.largo} cm`, icon: '↕️' },
            { l: 'Holgura', v: d.holgura,       icon: '📦' },
          ].map((m) => (
            <div key={m.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.gray, letterSpacing: '0.3px' }}>{m.l}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.black }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onApply}
        style={{
          width: '100%',
          height: 52,
          backgroundColor: C.red,
          color: C.white,
          border: 'none',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.8px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        AGREGAR TALLA {result.size} AL CARRITO →
      </button>

      <button
        onClick={onApply}
        style={{
          width: '100%',
          height: 44,
          backgroundColor: 'transparent',
          color: C.gray,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.3px',
          fontFamily: 'Inter, sans-serif',
          marginTop: 8,
        }}
      >
        Ver otras tallas
      </button>
    </div>
  );
}

/* ── Main Wizard Modal ──────────────────────────────────────────── */
interface PrefillData {
  altura?: string;
  peso?: string;
  pecho?: string;
  complexion?: string;
  fitStyle?: string;
}

interface WizardModalProps {
  open: boolean;
  onClose: () => void;
  onSizeSelected: (size: SizeName, match: number, wizardData?: PrefillData) => void;
  shirtColor?: string;
  productName?: string;
  price?: string;
  onProcederAlPago?: (confeccionSize: SizeName) => void;
  onAddToCartConfeccion?: (size: SizeName, fitStyle?: string, complexion?: string, altura?: string, peso?: string, pecho?: string) => void;
  prefillData?: PrefillData;
}

export function WizardModal({ open, onClose, onSizeSelected, shirtColor = '#ffffff', productName, price, onProcederAlPago, onAddToCartConfeccion, prefillData }: WizardModalProps) {
  const { isMobile } = useResponsive();
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState<WizardData>({
    altura: '', peso: '', pecho: '', complexion: '',
    fitStyle: 'Oversize Moderado',
    marca: '', tallaHabitual: '',
  });
  const [loading,         setLoading]         = useState(false);
  const [result,          setResult]          = useState<{ size: SizeName; match: number; needsConfeccion: boolean; confidence: 'Alta' | 'Media' | 'Baja' } | null>(null);
  const [showConfeccion,  setShowConfeccion]  = useState(false);
  const [confeccionSize,  setConfeccionSize]  = useState<SizeName>('XXL');
  const [triedAdvance,    setTriedAdvance]    = useState(false);
  const [showDisabledMsg, setShowDisabledMsg] = useState(false);
  const seedRef = useRef(Math.floor(Math.random() * 100));
  const msgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset on open — pre-fill saved measurements when available
  useEffect(() => {
    if (open) {
      setStep(0);
      setData({
        altura:       prefillData?.altura      ?? '',
        peso:         prefillData?.peso        ?? '',
        pecho:        prefillData?.pecho       ?? '',
        complexion:   (prefillData?.complexion as Complexion) ?? '',
        fitStyle:     (prefillData?.fitStyle   as FitStyle)   ?? 'Oversize Moderado',
        marca:        '',
        tallaHabitual: '',
      });
      setResult(null);
      setLoading(false);
      setShowConfeccion(false);
      setConfeccionSize('XXL');
      setTriedAdvance(false);
      setShowDisabledMsg(false);
      seedRef.current = Math.floor(Math.random() * 100);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live recommendation (updates instantly on every selection)
  const liveRec  = computeRecommendation(data, seedRef.current);
  const liveSize : SizeName = liveRec.size;
  const liveFit  = getFitValue(liveSize, data.fitStyle);

  // ── Step 0 validation ──────────────────────────────────────────
  const alturaVal = parseFloat(data.altura);
  const pesoVal   = parseFloat(data.peso);
  const pechoVal  = parseFloat(data.pecho);

  const alturaError: string | null =
    triedAdvance && !data.altura ? 'Este campo es obligatorio' :
    data.altura
      ? alturaVal > ALTURA_MAX ? `Máximo ${ALTURA_MAX} cm — supera el estándar humano`
        : alturaVal < ALTURA_MIN ? `Verifica tu altura — debe estar entre ${ALTURA_MIN} y ${ALTURA_MAX} cm`
        : null
      : null;

  const pesoError: string | null =
    triedAdvance && !data.peso ? 'Este campo es obligatorio' :
    data.peso
      ? pesoVal > PESO_MAX ? `Máximo ${PESO_MAX} kg — supera el estándar humano`
        : pesoVal < PESO_MIN ? `Mínimo ${PESO_MIN} kg`
        : null
      : null;

  const pechoError: string | null =
    triedAdvance && !data.pecho ? 'Este campo es obligatorio' :
    data.pecho
      ? pechoVal > PECHO_MAX ? `Máximo ${PECHO_MAX} cm — supera el estándar`
        : pechoVal < PECHO_MIN ? `Mínimo ${PECHO_MIN} cm`
        : null
      : null;

  // Step 0 is blocked when required fields are empty or have range errors
  const step0HasErrors = !!alturaError || !!pesoError || !!pechoError;
  const step0RequiredEmpty = !data.altura || !data.peso || !data.pecho;
  const step0Blocked = step === 0 && (step0HasErrors || step0RequiredEmpty);

  // Step 3: brand selected but no talla chosen
  const step3MarcaError = step === 2 && !result && !!data.marca && !data.tallaHabitual && triedAdvance;

  function update(field: keyof WizardData, val: string) {
    setData((prev) => ({ ...prev, [field]: val }));
  }

  async function handleNext() {
    if (step === 0 && step0Blocked) {
      setTriedAdvance(true);
      setShowDisabledMsg(true);
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
      msgTimerRef.current = setTimeout(() => setShowDisabledMsg(false), 3000);
      return;
    }
    if (step === 2 && !result && data.marca && !data.tallaHabitual) {
      setTriedAdvance(true);
      return;
    }
    if (step < 2) {
      setTriedAdvance(false);
      setStep((s) => s + 1);
    } else {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1800));
      setLoading(false);
      const rec = computeRecommendation(data, seedRef.current);
      if (rec.needsConfeccion) {
        setConfeccionSize(rec.size);
        setShowConfeccion(true);
      } else {
        setResult(rec);
      }
    }
  }

  function handleApply() {
    if (result) {
      onSizeSelected(result.size, result.match, {
        altura:     data.altura,
        peso:       data.peso,
        pecho:      data.pecho,
        complexion: data.complexion,
        fitStyle:   data.fitStyle,
      });
      onClose();
    }
  }

  if (!open) return null;

  const isLastStep    = step === 2;
  const progressWidth = `${((step + 1) / 3) * 100}%`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(3px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(255,255,255,0.97)',
              borderRadius: 8,
              padding: isMobile ? '24px 20px' : '30px 40px',
              textAlign: 'center',
              zIndex: 20,
              width: isMobile ? '88%' : undefined,
              minWidth: isMobile ? undefined : 360,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 14 }}>⏳</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.black, marginBottom: 8 }}>
              Analizando anatomía y biometría…
            </div>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 4 }}>
              Procesando modelo de Machine Learning…
            </div>
            <div style={{ fontSize: 13, color: C.gray }}>
              Simulando caída de tela (gramaje)…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: isMobile ? '98vw' : 'min(1050px, 96vw)',
          height: isMobile ? 'min(700px, 95vh)' : 'min(580px, 92vh)',
          backgroundColor: C.white,
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showConfeccion && (
          <ConfeccionModal
            onClose={() => { setShowConfeccion(false); onClose(); }}
            onProcederAlPago={() => {
              setShowConfeccion(false);
              onClose();
              onProcederAlPago?.(confeccionSize);
            }}
            onAddToCart={() => {
              onAddToCartConfeccion?.(confeccionSize, data.fitStyle, data.complexion, data.altura, data.peso, data.pecho);
              setShowConfeccion(false);
              onClose();
            }}
            productName={productName}
            price={price}
            confeccionSize={confeccionSize}
          />
        )}

        {/* ══════ MOBILE: compact preview strip (shown ABOVE form) ══════ */}
        {isMobile && (
          <div style={{
            backgroundColor: '#111111', flexShrink: 0,
            display: 'flex', alignItems: 'center',
            padding: '10px 16px', gap: 14,
          }}>
            {/* Close on mobile */}
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: '#666', cursor: 'pointer', lineHeight: 1, flexShrink: 0 }}>✕</button>
            {/* Compact mannequin */}
            <div style={{ backgroundColor: '#1a1a1a', borderRadius: 6, padding: '6px 10px', flexShrink: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${liveSize}-${data.fitStyle}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18 }}
                  style={{ width: 52, height: 84 }}
                >
                  <Mannequin size={liveSize} shirtColor={shirtColor} dark className="w-full h-full" />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Size + progress info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#666', letterSpacing: '1px' }}>TALLA ESTIMADA</div>
              <AnimatePresence mode="wait">
                <motion.div key={`${liveSize}-${data.fitStyle}`}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <span style={{ fontSize: 28, fontWeight: 800, fontStyle: 'italic', color: '#fff', lineHeight: 1.1 }}>{liveSize}</span>
                  {liveRec.needsConfeccion && (
                    <div style={{ fontSize: 8, color: '#c49b1a', fontWeight: 700, letterSpacing: '0.5px' }}>✂ CONFECCIÓN</div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Step indicator */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: '#666', fontWeight: 600 }}>PASO</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{step + 1}<span style={{ fontSize: 12, color: '#555' }}>/3</span></div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ LEFT PANEL */}
        <div
          style={{
            flex: isMobile ? 1 : '0 0 62%',
            backgroundColor: C.white,
            padding: isMobile ? '20px 18px' : '32px 36px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Header — desktop only (mobile has the strip above) */}
          {!isMobile && (
            <div style={{ marginBottom: 6 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: C.black, margin: 0 }}>
                Talla Personalizada
              </h2>
              <p style={{ fontSize: 13, color: C.gray, margin: '5px 0 0' }}>
                Encontremos o creemos el ajuste perfecto para ti.
              </p>
            </div>
          )}
          {isMobile && (
            <div style={{ marginBottom: 10 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: C.black, margin: 0 }}>Talla Personalizada</h2>
            </div>
          )}

          {/* Progress bar */}
          <div style={{ margin: isMobile ? '10px 0 16px' : '16px 0 22px' }}>
            <div style={{ height: 4, backgroundColor: C.border, borderRadius: 2, overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', backgroundColor: C.black, borderRadius: 2 }}
                animate={{ width: progressWidth }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Step content */}
          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.18 }}
              >
                {step === 0 && <StepMedidas data={data} onChange={update} errors={{ altura: alturaError, peso: pesoError, pecho: pechoError }} />}
                {step === 1 && <StepEstiloAjuste data={data} onChange={update} />}
                {step === 2 && (
                  result ? (
                    <StepResult result={result} onApply={handleApply} fitStyle={data.fitStyle} />
                  ) : (
                    <StepMarcaReferencia data={data} onChange={update} step2FitStyle={data.fitStyle} marcaError={step3MarcaError} />
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {!result && (
            <div style={{ marginTop: 16 }}>
              {/* Disabled message flash */}
              <AnimatePresence>
                {showDisabledMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      backgroundColor: '#fff5f5',
                      border: '1.5px solid #C00000',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: 12,
                      color: '#C00000',
                      fontWeight: 600,
                      marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>⚠</span>
                    Completa todos los campos para continuar
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <button
                  onClick={() => { setStep((s) => Math.max(0, s - 1)); setTriedAdvance(false); }}
                  disabled={step === 0}
                  style={{
                    height: 44,
                    flex: isMobile ? 1 : undefined,
                    padding: isMobile ? '0' : '0 22px',
                    backgroundColor: C.white,
                    color: step === 0 ? C.gray : C.black,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 6, fontSize: 13, fontWeight: 600,
                    cursor: step === 0 ? 'default' : 'pointer',
                    opacity: step === 0 ? 0.4 : 1,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Atrás
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    height: 44,
                    flex: isMobile ? 2 : undefined,
                    padding: isMobile ? '0' : '0 28px',
                    backgroundColor: (step === 0 && step0Blocked) ? '#cccccc' : isLastStep ? C.greenPrimary : C.black,
                    color: C.white, border: 'none', borderRadius: 6,
                    fontSize: 13, fontWeight: 600,
                    cursor: (step === 0 && step0Blocked) ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.2px',
                    transition: 'background-color 0.2s',
                    opacity: (step === 0 && step0Blocked) ? 0.7 : 1,
                  }}
                >
                  {isLastStep ? 'Calcular Talla' : 'Siguiente'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════ RIGHT PANEL (desktop only) */}
        {!isMobile && <div
          style={{
            flex: '0 0 38%',
            backgroundColor: '#111111',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              background: 'none',
              border: 'none',
              fontSize: 18,
              color: '#666666',
              cursor: 'pointer',
              lineHeight: 1,
              zIndex: 2,
            }}
          >
            ✕
          </button>

          {/* Panel title */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#888888',
              letterSpacing: '1.2px',
              textAlign: 'center',
              paddingTop: 18,
              paddingBottom: 10,
            }}
          >
            VISTA PREVIA EN TIEMPO REAL
          </div>

          {/* Mannequin area */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${liveSize}-${data.fitStyle}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22 }}
                style={{ width: 130, height: 200 }}
              >
                <Mannequin size={liveSize} shirtColor={shirtColor} dark className="w-full h-full" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats + Talla estimada */}
          <div style={{ padding: '14px 18px 18px' }}>
            {/* Stat rows */}
            <StatRow
              icon="📏"
              label="Altura"
              value={data.altura ? `${data.altura} cm` : '—'}
              filled={!!data.altura}
            />
            <StatRow
              icon="⚖️"
              label="Peso"
              value={data.peso ? `${data.peso} kg` : '—'}
              filled={!!data.peso}
            />
            <StatRow
              icon="📐"
              label="Pecho"
              value={data.pecho ? `${data.pecho} cm` : '—'}
              filled={!!data.pecho}
            />
            <StatRow
              icon="🧍"
              label="Complexión"
              value={data.complexion || '—'}
              filled={!!data.complexion}
            />
            <StatRow
              icon="👕"
              label="Estilo"
              value={data.fitStyle}
              filled={true}
            />
            {data.marca && (
              <StatRow
                icon="🏷️"
                label="Marca Ref."
                value={`${data.marca} ${data.tallaHabitual || ''}`}
                filled={true}
              />
            )}

            {/* Talla estimada */}
            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', color: '#c49b1a', marginBottom: 2 }}>
                TALLA ESTIMADA
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={liveSize}
                  initial={{ opacity: 0, y: -6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0,  scale: 1  }}
                  exit={{ opacity: 0, y: 6,    scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  style={{ lineHeight: 1.1 }}
                >
                  <span style={{ fontSize: 36, fontWeight: 800, fontStyle: 'italic', color: '#ffffff' }}>
                    {liveSize}
                  </span>
                  {liveRec.needsConfeccion && (
                    <div style={{
                      marginTop: 4, fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.8px', color: '#c49b1a',
                    }}>
                      ✂ CONFECCIÓN ARTESANAL
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fit slider */}
            <div style={{ marginTop: 12 }}>
              <div style={{ position: 'relative', marginBottom: 4 }}>
                {/* Track */}
                <div
                  style={{
                    height: 4,
                    backgroundColor: '#333333',
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: 0,
                      height: '100%',
                      backgroundColor: '#ffffff',
                      borderRadius: 2,
                    }}
                    animate={{ width: `${liveFit}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Dot */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: -5,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: '2px solid #111111',
                      boxShadow: '0 0 0 2px #555555',
                    }}
                    animate={{ left: `calc(${liveFit}% - 7px)` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 10, color: '#666666' }}>Ajustado</span>
                <span style={{ fontSize: 10, color: '#666666' }}>Oversize</span>
              </div>
            </div>
          </div>
        </div>}
      </motion.div>
    </div>
  );
}