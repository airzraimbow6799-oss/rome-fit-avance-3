import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { C, SIZE_DATA, SIZES } from './tokens';

type TabId = 'descripcion' | 'materiales' | 'tallas' | 'resenas';

const TABS: { id: TabId; label: string }[] = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'materiales',  label: 'Materiales & Cuidados' },
  { id: 'tallas',      label: 'Guía de Tallas' },
  { id: 'resenas',     label: 'Reseñas (312)' },
];

/* ── Descripción ─────────────────────────────────────────────── */
function DescripcionTab() {
  const features = [
    ['🧵', 'Algodón Pima Peruano',      '100% natural, suave al tacto y transpirable'],
    ['⚖️', '240 g/m² de gramaje',        'Caída perfecta, sin transparencias'],
    ['📏', 'Corte oversized calibrado',   'Silueta estudiada talla por talla con SIZE_DATA'],
    ['🎨', 'Tinte reactivo premium',      'Colores vivos que no destiñen con el lavado'],
    ['✂️', 'Costuras dobles reforzadas',  'Resistentes al uso intensivo diario'],
    ['🌿', 'Producción responsable',      'Confeccionado artesanalmente en Lima, Perú'],
  ];

  return (
    <div>
      <p style={{ fontSize: 14, color: '#444', lineHeight: 1.8, marginBottom: 24, maxWidth: 720 }}>
        El <strong style={{ color: C.black }}>Polo Oversized Premium</strong> de ROME redefine el street style contemporáneo. Confeccionado con algodón pima peruano de 240 g/m², ofrece una silueta holgada calibrada para cada talla: hombros caídos, cuerpo alargado y cuello redondo reforzado que mantiene su forma lavado tras lavado.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 10,
          marginBottom: 24,
        }}
      >
        {features.map(([icon, title, desc]) => (
          <div
            key={title as string}
            style={{
              display: 'flex',
              gap: 12,
              padding: 14,
              backgroundColor: C.lightGray,
              borderRadius: 6,
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.black, marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chip row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Hecho en Perú', 'Envío en 24–48 h', 'Devolución gratis', 'Garantía de ajuste'].map((chip) => (
          <span
            key={chip}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.chipSuccessFg,
              backgroundColor: C.chipSuccessBg,
              padding: '5px 12px',
              borderRadius: 20,
            }}
          >
            ✓ {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Materiales & Cuidados ───────────────────────────────────── */
function MaterialesTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.black, marginBottom: 14 }}>Composición de la tela</h3>
        <div style={{ backgroundColor: C.lightGray, borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
          {[
            ['Material',  '100% Algodón Pima Peruano'],
            ['Gramaje',   '240 g/m²'],
            ['Tejido',    'Jersey simple peinado'],
            ['Acabado',   'Suavizado enzimático'],
            ['Origen',    'Lima, Perú 🇵🇪'],
          ].map(([label, value], idx, arr) => (
            <div
              key={label as string}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '11px 16px',
                borderBottom: idx < arr.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <span style={{ fontSize: 13, color: C.gray }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Composition bar */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.black }}>Algodón Pima</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.black }}>100%</span>
          </div>
          <div style={{ height: 8, backgroundColor: C.border, borderRadius: 4 }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: C.black, borderRadius: 4 }} />
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: C.black, marginBottom: 14 }}>Instrucciones de cuidado</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['🌊', 'Lavado a máquina a 30°C máximo'],
            ['🚫', 'No usar blanqueador ni cloro'],
            ['♨️', 'Plancha a temperatura media-baja'],
            ['🚿', 'No centrifugar con alta velocidad'],
            ['☁️', 'Secar en sombra, tendido horizontalmente'],
            ['❌', 'No usar secadora'],
            ['🧴', 'Usar detergente suave para colores'],
          ].map(([icon, text]) => (
            <div
              key={text as string}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '10px 14px',
                backgroundColor: C.lightGray,
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 17, width: 26, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: 13, color: C.black }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Guía de Tallas ──────────────────────────────────────────── */
function TallasTab({ onOpenWizard }: { onOpenWizard?: () => void }) {
  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 6,
          padding: '12px 16px',
          fontSize: 13,
          color: '#0369a1',
        }}
      >
        💡 Las medidas indican las <strong>dimensiones de la prenda</strong>, no del cuerpo. Para corte oversized estándar, usa tu talla habitual. Utiliza el <strong>Wizard de Talla</strong> para una recomendación personalizada con 94%+ de precisión.
      </div>

      {/* Size table */}
      <div style={{ overflow: 'auto', borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 28 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', minWidth: 600 }}>
          <thead>
            <tr style={{ backgroundColor: C.black }}>
              {['Talla', 'Ancho prenda', 'Largo prenda', 'Holgura', 'Fit visual'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 18px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.white,
                    letterSpacing: '0.5px',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((s, idx) => {
              const d = SIZE_DATA[s];
              const hChip = {
                Slim:    { bg: '#e8e8e8', fg: '#444444' },
                Regular: { bg: C.chipSuccessBg, fg: C.chipSuccessFg },
                Amplio:  { bg: C.chipWarningBg, fg: C.chipWarningFg },
              }[d.holgura];
              return (
                <tr
                  key={s}
                  style={{
                    backgroundColor: idx % 2 === 0 ? C.white : '#fafafa',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <td style={{ padding: '12px 18px' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 13,
                        color: C.black,
                        backgroundColor: C.black,
                        color: C.white,
                        padding: '2px 10px',
                        borderRadius: 20,
                        fontSize: 11,
                      }}
                    >
                      {s}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: C.black, fontWeight: 500 }}>
                    {d.ancho} cm
                  </td>
                  <td style={{ padding: '12px 18px', fontSize: 13, color: C.black, fontWeight: 500 }}>
                    {d.largo} cm
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 20,
                        backgroundColor: hChip.bg,
                        color: hChip.fg,
                      }}
                    >
                      {d.holgura}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: C.gray, width: 22 }}>Slim</span>
                      <div
                        style={{
                          width: 100,
                          height: 6,
                          backgroundColor: C.border,
                          borderRadius: 3,
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            width: `${d.fit}%`,
                            height: '100%',
                            backgroundColor: C.black,
                            borderRadius: 3,
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: `calc(${d.fit}% - 6px)`,
                            top: -3,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: C.black,
                            border: '2px solid white',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 10, color: C.gray, width: 42 }}>Oversize</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Measuring guide */}
      <div>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: C.black, marginBottom: 12 }}>
          ¿Cómo medir la prenda?
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['📏', 'Ancho de pecho', 'Extiende la prenda sobre superficie plana. Mide de una axila a la otra.'],
            ['📐', 'Largo total', 'Desde la costura del hombro hasta el borde inferior frontal.'],
          ].map(([icon, title, desc]) => (
            <div
              key={title as string}
              style={{ backgroundColor: C.lightGray, borderRadius: 6, padding: 14 }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{title}</span>
              </div>
              <p style={{ fontSize: 12, color: C.gray, margin: 0, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom size CTA */}
      {onOpenWizard && (
        <div
          style={{
            marginTop: 24,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            padding: '16px 20px',
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: C.gray,
              margin: '0 0 12px',
              textAlign: 'center',
              lineHeight: 1.5,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ¿No encuentras una talla que se adapte perfectamente a ti?
          </p>
          <button
            onClick={onOpenWizard}
            style={{
              width: '100%',
              height: 48,
              backgroundColor: C.black,
              color: C.white,
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 15 }}>🔧</span>
            Crear talla Personalizada
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Reseñas ─────────────────────────────────────────────────── */
const REVIEWS = [
  {
    id: 1,
    name: 'Rodrigo M.',
    rating: 5,
    date: '12 Abr 2026',
    talla: 'L',
    color: 'Blanco',
    text: 'La calidad es increíble. El algodón pima es súper suave y el corte es exactamente como esperaba. El wizard me recomendó L con 96% de match y quedó perfecto. Definitivamente compraré más colores.',
    helpful: 24,
  },
  {
    id: 2,
    name: 'Camila V.',
    rating: 5,
    date: '28 Mar 2026',
    talla: 'S',
    color: 'Negro',
    text: 'Usé el wizard y me sorprendió lo preciso que fue. La S me queda exactamente como me dijeron: ajustado en hombros con caída oversized característica. El material es definitivamente premium, nada que ver con otras marcas.',
    helpful: 18,
  },
  {
    id: 3,
    name: 'Alejandro P.',
    rating: 4,
    date: '15 Mar 2026',
    talla: 'M',
    color: 'Blanco',
    text: 'Muy buena calidad. El polo llega bien empaquetado y el blanco es uniforme sin transparencias. Los 240g/m² se notan al tacto. Le doy 4 estrellas porque la entrega tardó un par de días más de lo indicado.',
    helpful: 11,
  },
  {
    id: 4,
    name: 'Daniela K.',
    rating: 5,
    date: '02 Mar 2026',
    talla: 'XS',
    color: 'Negro',
    text: 'Compré el XS y quedó perfecto. La herramienta personalizada es una genialidad, nunca había tenido una recomendación tan precisa en una tienda online. El polo se ve igual al visor 3D, increíble.',
    helpful: 31,
  },
];

const RATING_DIST = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 22 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 2 },
];

function StarsRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : C.border, fontSize: size }}>★</span>
      ))}
    </div>
  );
}

function ResenasTab() {
  const [helpfulVoted, setHelpfulVoted] = useState<Set<number>>(new Set());

  return (
    <div>
      {/* Summary */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginBottom: 28,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          padding: '20px 24px',
          backgroundColor: C.lightGray,
          borderRadius: 8,
        }}
      >
        <div style={{ textAlign: 'center', minWidth: 100 }}>
          <div
            style={{ fontSize: 56, fontWeight: 800, color: C.black, lineHeight: 1, fontFamily: 'Inter, sans-serif' }}
          >
            4.8
          </div>
          <StarsRow rating={5} size={18} />
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6, fontFamily: 'Inter, sans-serif' }}>
            312 reseñas verificadas
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          {RATING_DIST.map(({ stars, pct }) => (
            <div
              key={stars}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}
            >
              <span style={{ fontSize: 11, color: C.gray, width: 8, textAlign: 'right', fontFamily: 'Inter, sans-serif' }}>
                {stars}
              </span>
              <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: C.border,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: '#f59e0b',
                    borderRadius: 4,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: C.gray,
                  width: 32,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {pct}%
              </span>
            </div>
          ))}
        </div>

        {/* Summary chips */}
        <div style={{ minWidth: 160 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.black, marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>
            Lo más valorado
          </div>
          {['Calidad del material', 'Precisión de la talla', 'Diseño y silueta', 'Tiempo de entrega'].map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 11,
                color: C.chipSuccessFg,
                backgroundColor: C.chipSuccessBg,
                padding: '4px 10px',
                borderRadius: 20,
                marginBottom: 6,
                display: 'inline-block',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ✓ {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            style={{
              padding: '18px 20px',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              backgroundColor: C.white,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: C.black,
                    color: C.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    flexShrink: 0,
                  }}
                >
                  {review.name[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.black,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {review.name}
                  </div>
                  <div style={{ fontSize: 11, color: C.gray, fontFamily: 'Inter, sans-serif' }}>
                    Talla {review.talla} · {review.color} · ✓ Compra verificada
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StarsRow rating={review.rating} size={13} />
                <div
                  style={{
                    fontSize: 11,
                    color: C.gray,
                    marginTop: 3,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {review.date}
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: 13,
                color: '#444',
                lineHeight: 1.7,
                margin: 0,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {review.text}
            </p>

            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={() =>
                  setHelpfulVoted((prev) => {
                    const next = new Set(prev);
                    next.has(review.id) ? next.delete(review.id) : next.add(review.id);
                    return next;
                  })
                }
                style={{
                  fontSize: 11,
                  color: helpfulVoted.has(review.id) ? C.greenPrimary : C.gray,
                  background: 'none',
                  border: `1px solid ${helpfulVoted.has(review.id) ? C.greenPrimary : C.border}`,
                  padding: '4px 12px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                👍 Útil ({review.helpful + (helpfulVoted.has(review.id) ? 1 : 0)})
              </button>
              <span style={{ fontSize: 11, color: C.border }}>|</span>
              <button
                style={{
                  fontSize: 11,
                  color: C.gray,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Reportar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          style={{
            padding: '12px 28px',
            backgroundColor: C.white,
            color: C.black,
            border: `1px solid ${C.black}`,
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Ver las 308 reseñas restantes
        </button>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export function ProductTabs({ onOpenWizard }: { onOpenWizard?: () => void } = {}) {
  const [activeTab, setActiveTab] = useState<TabId>('descripcion');

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Section header */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          marginBottom: 28,
          display: 'flex',
          overflowX: 'auto',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '15px 22px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? C.black : 'transparent'}`,
              marginBottom: -1,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? C.black : C.gray,
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
              letterSpacing: '0.2px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'descripcion' && <DescripcionTab />}
          {activeTab === 'materiales'  && <MaterialesTab />}
          {activeTab === 'tallas'      && <TallasTab onOpenWizard={onOpenWizard} />}
          {activeTab === 'resenas'     && <ResenasTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}