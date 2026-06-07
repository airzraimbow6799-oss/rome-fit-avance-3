import React, { useState, useEffect, useRef } from 'react';
import { C, SizeName, ALL_SIZES } from './tokens';

/* ── Products ─────────────────────────────────────────────────── */
import img20 from '../../../imports/image-20.png';
import img21 from '../../../imports/image-21.png';
import img23 from '../../../imports/image-23.png';
import imgEssential from '../../../imports/image-10.png';

const PRODUCTS = [
  { id: 'feather-thunder',    name: 'FEATHER & THUNDER BOXY LONG SLEEVE', price: 'S/. 139.90', image: img20, desc: 'Polera manga larga estilo boxy oversize. Tela gruesa premium.' },
  { id: 'second-revelation',  name: 'SECOND REVELATION RELAX',            price: 'S/. 119.90', image: img21, desc: 'Polo relaxed fit con diseño gráfico en el pecho.' },
  { id: 'strong-legacy',      name: 'STRONG LEGACY RELAX TEE',            price: 'S/. 79.00',  image: img23, desc: 'Polo relaxed clásico con bordado lateral.' },
  { id: 'essential-tee',      name: 'ESSENTIAL REGULAR TEE',               price: 'S/. 89.90',  image: imgEssential, desc: 'Polo básico de corte regular. El más vendido de Rome Store.' },
];

/* ── Size computation (same logic as WizardModal) ─────────────── */
type FitStyle = 'Muy Justo' | 'Justo' | 'Oversize Moderado' | 'Oversize Extremo';
interface WizardData {
  altura: string; peso: string; pecho: string;
  fitStyle: FitStyle; marca: string; tallaHabitual: string;
}

function computeSize(data: WizardData): { size: SizeName; confidence: string } {
  const peso   = parseFloat(data.peso);
  const altura = parseFloat(data.altura);
  const pecho  = parseFloat(data.pecho);
  let idx = 2;
  let conf = 'Media';

  if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
    const bmi = peso / Math.pow(altura / 100, 2);
    if      (bmi < 18.5) idx = 0;
    else if (bmi < 21.5) idx = 1;
    else if (bmi < 24.5) idx = 2;
    else if (bmi < 27.5) idx = 3;
    else if (bmi < 30.0) idx = 4;
    else                 idx = 5;
    conf = 'Media';
  }
  if (!isNaN(pecho)) {
    if      (pecho < 86)  idx = 0;
    else if (pecho < 91)  idx = 1;
    else if (pecho < 96)  idx = 2;
    else if (pecho < 101) idx = 3;
    else if (pecho < 106) idx = 4;
    else                  idx = 5;
    conf = 'Alta';
  }
  if (data.fitStyle === 'Muy Justo'        && idx > 0) idx--;
  if (data.fitStyle === 'Oversize Moderado' && idx < 6) idx++;
  if (data.fitStyle === 'Oversize Extremo') idx = Math.min(6, idx + 2);
  if (data.marca && data.tallaHabitual) conf = 'Alta';

  return { size: ALL_SIZES[Math.max(0, Math.min(6, idx))], confidence: conf };
}

/* ── Shared styles ────────────────────────────────────────────── */
const S = {
  focusRing: {
    outline: '3px solid #000000',
    outlineOffset: 3,
  } as React.CSSProperties,

  h1: {
    fontSize: 32, fontWeight: 800, color: '#000000',
    margin: '0 0 12px', lineHeight: 1.2,
    fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,

  h2: {
    fontSize: 26, fontWeight: 700, color: '#000000',
    margin: '0 0 10px', lineHeight: 1.25,
    fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,

  h3: {
    fontSize: 22, fontWeight: 700, color: '#000000',
    margin: '0 0 8px', lineHeight: 1.3,
    fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,

  body: {
    fontSize: 18, color: '#111111', lineHeight: 1.6,
    fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,

  label: {
    display: 'block' as const,
    fontSize: 18, fontWeight: 700, color: '#000000',
    marginBottom: 8, fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,

  input: {
    width: '100%', height: 56, fontSize: 20,
    border: '3px solid #000000', borderRadius: 8,
    padding: '0 16px', color: '#000000',
    backgroundColor: '#ffffff', boxSizing: 'border-box' as const,
    fontFamily: 'Inter, sans-serif', outline: 'none',
  } as React.CSSProperties,

  btnPrimary: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', minHeight: 60,
    backgroundColor: '#000000', color: '#ffffff',
    border: '3px solid #000000', borderRadius: 8,
    fontSize: 20, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.3px', padding: '0 20px',
    transition: 'background-color 0.15s',
  } as React.CSSProperties,

  btnSecondary: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', minHeight: 60,
    backgroundColor: '#ffffff', color: '#000000',
    border: '3px solid #000000', borderRadius: 8,
    fontSize: 20, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.3px', padding: '0 20px',
    transition: 'background-color 0.15s',
  } as React.CSSProperties,

  btnGreen: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', minHeight: 60,
    backgroundColor: '#2E7D32', color: '#ffffff',
    border: '3px solid #2E7D32', borderRadius: 8,
    fontSize: 20, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.3px', padding: '0 20px',
  } as React.CSSProperties,

  card: {
    backgroundColor: '#ffffff',
    border: '3px solid #000000',
    borderRadius: 12, padding: '24px',
    marginBottom: 20,
  } as React.CSSProperties,

  hint: {
    fontSize: 16, color: '#444444', fontStyle: 'italic' as const,
    lineHeight: 1.5, fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,

  statusBar: {
    backgroundColor: '#000000', color: '#ffffff',
    padding: '10px 24px', fontSize: 16, fontWeight: 600,
    fontFamily: 'Inter, sans-serif', letterSpacing: '0.2px',
  } as React.CSSProperties,
};

/* ── Focus visible helper ─────────────────────────────────────── */
function useFocusVisible() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => { if (el) el.style.outline = '3px solid #000000'; el.style.outlineOffset = '3px'; };
    const hide = () => { if (el) { el.style.outline = ''; el.style.outlineOffset = ''; } };
    el.addEventListener('focus', show);
    el.addEventListener('blur',  hide);
    return () => { el.removeEventListener('focus', show); el.removeEventListener('blur', hide); };
  }, []);
  return ref;
}

/* ── Screen: Catalog ──────────────────────────────────────────── */
function CatalogScreen({
  onBuyProduct,
  onStartWizard,
}: {
  onBuyProduct: (id: string) => void;
  onStartWizard: () => void;
}) {
  const skipRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      {/* Skip to content */}
      <a
        href="#main-content"
        onClick={(e) => { e.preventDefault(); skipRef.current?.focus(); }}
        style={{
          position: 'absolute', top: -999, left: -999,
          backgroundColor: '#000000', color: '#ffffff',
          padding: '12px 20px', borderRadius: 6,
          fontSize: 18, fontWeight: 700, zIndex: 99999,
          fontFamily: 'Inter, sans-serif', textDecoration: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.top = '10px'; e.currentTarget.style.left = '10px'; }}
        onBlur={(e)  => { e.currentTarget.style.top = '-999px'; e.currentTarget.style.left = '-999px'; }}
      >
        Saltar al contenido principal
      </a>

      {/* Current location */}
      <div role="status" style={S.statusBar} aria-label="Ubicación actual: Catálogo de productos">
        Estás en: Inicio — Catálogo de productos de Rome Store
      </div>

      <main id="main-content" ref={skipRef as React.RefObject<HTMLDivElement>} tabIndex={-1}
        role="main" aria-label="Catálogo de productos"
        style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}
      >
        <h1 style={S.h1}>Rome Store — Nueva Colección</h1>
        <p style={{ ...S.body, marginBottom: 32 }}>
          Selecciona una prenda para comprarla. Si no sabes tu talla,
          usa el botón "Calcular mi talla con RomeFit" que aparece más abajo.
        </p>

        {/* RomeFit CTA — top */}
        <div style={{
          backgroundColor: '#f5f5f5', border: '3px solid #000000',
          borderRadius: 12, padding: '24px', marginBottom: 36,
        }}>
          <h2 style={{ ...S.h2, marginBottom: 8 }}>¿No sabes tu talla?</h2>
          <p style={{ ...S.body, marginBottom: 20 }}>
            RomeFit calcula tu talla exacta en 3 pasos usando tus medidas corporales.
            Solo necesitas saber tu altura, peso y medida de pecho.
          </p>
          <button
            onClick={onStartWizard}
            style={S.btnPrimary}
            aria-label="Abrir RomeFit para calcular tu talla ideal (3 pasos)"
            onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
            onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
          >
            Calcular mi talla con RomeFit
          </button>
        </div>

        {/* Products */}
        <h2 style={S.h2}>Prendas disponibles ({PRODUCTS.length})</h2>
        <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PRODUCTS.map((p, i) => (
            <li key={p.id} style={S.card} role="listitem">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                {/* Product image with alt */}
                <img
                  src={p.image}
                  alt={`Fotografía de ${p.name}`}
                  style={{ width: 100, height: 120, objectFit: 'cover', objectPosition: 'top', borderRadius: 6, border: '2px solid #ddd', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#666', margin: '0 0 4px', fontFamily: 'Inter, sans-serif' }}>
                    PRENDA {i + 1} DE {PRODUCTS.length}
                  </p>
                  <h3 style={{ ...S.h3, marginBottom: 6 }}>{p.name}</h3>
                  <p style={{ ...S.body, marginBottom: 6 }}>{p.desc}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: '#000000', margin: '0 0 16px', fontFamily: 'Inter, sans-serif' }}>
                    Precio: {p.price}
                  </p>
                  <button
                    onClick={() => onBuyProduct(p.id)}
                    style={S.btnPrimary}
                    aria-label={`Comprar ${p.name} por ${p.price}`}
                    onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
                    onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
                  >
                    Comprar {p.name} — {p.price}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

/* ── Screen: Wizard ───────────────────────────────────────────── */
function WizardScreen({
  onComplete,
  onBack,
}: {
  onComplete: (size: SizeName, confidence: string) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    altura: '', peso: '', pecho: '',
    fitStyle: 'Oversize Moderado', marca: '', tallaHabitual: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [announcement, setAnnouncement] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Announce step changes to screen readers
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  function announce(msg: string) {
    setAnnouncement('');
    setTimeout(() => setAnnouncement(msg), 50);
  }

  function validateStep0(): boolean {
    const e: Record<string, string> = {};
    const h = parseFloat(data.altura);
    const p = parseFloat(data.peso);
    const pc = parseFloat(data.pecho);
    if (!data.altura) e.altura = 'La altura es obligatoria';
    else if (isNaN(h) || h < 100 || h > 210) e.altura = 'Ingresa una altura válida entre 100 y 210 centímetros';
    if (!data.peso) e.peso = 'El peso es obligatorio';
    else if (isNaN(p) || p < 20 || p > 200) e.peso = 'Ingresa un peso válido entre 20 y 200 kilogramos';
    if (!data.pecho) e.pecho = 'La medida de pecho es obligatoria';
    else if (isNaN(pc) || pc < 60 || pc > 150) e.pecho = 'Ingresa una medida de pecho válida entre 60 y 150 centímetros';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      announce(`Hay ${Object.keys(e).length} error(es) en el formulario. ${Object.values(e).join('. ')}`);
      return false;
    }
    return true;
  }

  function handleNext() {
    if (step === 0) {
      if (!validateStep0()) return;
      announce(`Medidas guardadas. Altura: ${data.altura} centímetros, Peso: ${data.peso} kilogramos, Pecho: ${data.pecho} centímetros. Pasando al paso 2.`);
      setStep(1);
    } else if (step === 1) {
      announce(`Estilo de ajuste seleccionado: ${data.fitStyle}. Pasando al paso 3.`);
      setStep(2);
    } else {
      const result = computeSize(data);
      announce(`Cálculo completado. Tu talla recomendada es ${result.size}. Confianza: ${result.confidence}.`);
      onComplete(result.size, result.confidence);
    }
  }

  const FIT_OPTIONS: { value: FitStyle; label: string; desc: string }[] = [
    { value: 'Muy Justo',          label: 'Muy Justo',          desc: 'La prenda se ajusta al cuerpo completamente sin holgura adicional.' },
    { value: 'Justo',              label: 'Justo',              desc: 'La prenda sigue la forma del cuerpo sin apretar.' },
    { value: 'Oversize Moderado',  label: 'Oversize Moderado',  desc: 'Hombros ligeramente caídos, con 6 a 8 centímetros de holgura en el pecho. Recomendado.' },
    { value: 'Oversize Extremo',   label: 'Oversize Extremo',   desc: 'Muy amplio, caída dramática, 10 a 12 centímetros de holgura.' },
  ];

  const MARCAS = ['Nike', 'Adidas', 'Zara', 'H&M', 'Supreme', 'Off-White', 'Local Peruano', 'Otra'];
  const TALLAS: SizeName[] = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div>
      {/* ARIA live region for announcements */}
      <div role="status" aria-live="polite" aria-atomic="true"
        style={{ position: 'absolute', left: -9999, top: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        {announcement}
      </div>

      {/* Status bar */}
      <div role="status" style={S.statusBar}>
        Estás en: RomeFit — Calculadora de talla — Paso {step + 1} de 3
      </div>

      <main role="main" aria-label={`RomeFit paso ${step + 1} de 3`}
        style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}
      >
        {/* Progress */}
        <div aria-label={`Progreso: paso ${step + 1} de 3`} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                flex: 1, height: 10, borderRadius: 5,
                backgroundColor: i <= step ? '#000000' : '#cccccc',
              }} aria-hidden="true" />
            ))}
          </div>
          <p style={{ ...S.hint, margin: 0 }}>Paso {step + 1} de 3</p>
        </div>

        {/* ── STEP 0: Medidas ── */}
        {step === 0 && (
          <div>
            <h1 ref={headingRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} style={S.h1}>
              Paso 1 de 3: Ingresa tus medidas
            </h1>
            <p style={{ ...S.body, marginBottom: 28 }}>
              Necesitamos tres medidas: tu altura en centímetros, tu peso en kilogramos
              y la medida de tu pecho en centímetros. Los tres campos son obligatorios.
            </p>

            {/* Altura */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="acc-altura" style={S.label}>
                Altura (en centímetros) — Campo obligatorio
              </label>
              <p style={{ ...S.hint, marginBottom: 8 }}>
                Ejemplo: si mides 1 metro 75 centímetros, escribe 175
              </p>
              <input
                id="acc-altura"
                type="number"
                value={data.altura}
                onChange={e => setData(d => ({ ...d, altura: e.target.value }))}
                style={{ ...S.input, borderColor: errors.altura ? '#C00000' : '#000000' }}
                aria-required="true"
                aria-invalid={!!errors.altura}
                aria-describedby={errors.altura ? 'err-altura' : 'hint-altura'}
                placeholder="Ej: 175"
                min={100} max={210}
              />
              <span id="hint-altura" style={{ ...S.hint, display: 'block', marginTop: 6 }}>
                {data.altura ? `Has ingresado: ${data.altura} centímetros` : 'Sin dato aún'}
              </span>
              {errors.altura && (
                <p id="err-altura" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Error: {errors.altura}
                </p>
              )}
            </div>

            {/* Peso */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="acc-peso" style={S.label}>
                Peso (en kilogramos) — Campo obligatorio
              </label>
              <p style={{ ...S.hint, marginBottom: 8 }}>
                Ejemplo: si pesas 70 kilogramos, escribe 70
              </p>
              <input
                id="acc-peso"
                type="number"
                value={data.peso}
                onChange={e => setData(d => ({ ...d, peso: e.target.value }))}
                style={{ ...S.input, borderColor: errors.peso ? '#C00000' : '#000000' }}
                aria-required="true"
                aria-invalid={!!errors.peso}
                aria-describedby={errors.peso ? 'err-peso' : 'hint-peso'}
                placeholder="Ej: 70"
                min={20} max={200}
              />
              <span id="hint-peso" style={{ ...S.hint, display: 'block', marginTop: 6 }}>
                {data.peso ? `Has ingresado: ${data.peso} kilogramos` : 'Sin dato aún'}
              </span>
              {errors.peso && (
                <p id="err-peso" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Error: {errors.peso}
                </p>
              )}
            </div>

            {/* Pecho */}
            <div style={{ marginBottom: 32 }}>
              <label htmlFor="acc-pecho" style={S.label}>
                Medida de pecho (en centímetros) — Campo obligatorio
              </label>
              <p style={{ ...S.hint, marginBottom: 8 }}>
                Cómo medirte: pasa una cinta métrica alrededor del punto más ancho de tu pecho,
                sobre los brazos. Ejemplo: 95 centímetros.
              </p>
              <input
                id="acc-pecho"
                type="number"
                value={data.pecho}
                onChange={e => setData(d => ({ ...d, pecho: e.target.value }))}
                style={{ ...S.input, borderColor: errors.pecho ? '#C00000' : '#000000' }}
                aria-required="true"
                aria-invalid={!!errors.pecho}
                aria-describedby={errors.pecho ? 'err-pecho' : 'hint-pecho'}
                placeholder="Ej: 95"
                min={60} max={150}
              />
              <span id="hint-pecho" style={{ ...S.hint, display: 'block', marginTop: 6 }}>
                {data.pecho ? `Has ingresado: ${data.pecho} centímetros` : 'Sin dato aún'}
              </span>
              {errors.pecho && (
                <p id="err-pecho" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Error: {errors.pecho}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 1: Estilo de ajuste ── */}
        {step === 1 && (
          <div>
            <h1 ref={headingRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} style={S.h1}>
              Paso 2 de 3: ¿Cómo te gusta que te quede la ropa?
            </h1>
            <p style={{ ...S.body, marginBottom: 28 }}>
              Selecciona uno de los cuatro estilos de ajuste. Usa las teclas de flecha o
              Tab para navegar, y Enter o Espacio para seleccionar.
            </p>
            <div role="radiogroup" aria-label="Estilo de ajuste preferido" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {FIT_OPTIONS.map(opt => {
                const selected = data.fitStyle === opt.value;
                return (
                  <button
                    key={opt.value}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setData(d => ({ ...d, fitStyle: opt.value }));
                      announce(`Seleccionado: ${opt.label}. ${opt.desc}`);
                    }}
                    style={{
                      textAlign: 'left', padding: '20px 24px',
                      border: `3px solid ${selected ? '#000000' : '#cccccc'}`,
                      borderRadius: 10, cursor: 'pointer',
                      backgroundColor: selected ? '#000000' : '#ffffff',
                      color: selected ? '#ffffff' : '#000000',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
                    onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                      {selected ? '● ' : '○ '}{opt.label}
                      {opt.value === 'Oversize Moderado' && (
                        <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 700, backgroundColor: selected ? '#ffffff' : '#000000', color: selected ? '#000000' : '#ffffff', borderRadius: 4, padding: '2px 8px' }}>
                          RECOMENDADO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 17, opacity: selected ? 0.85 : 0.7 }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Marca de referencia (opcional) ── */}
        {step === 2 && (
          <div>
            <h1 ref={headingRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} style={S.h1}>
              Paso 3 de 3: ¿En qué marca compras normalmente? (Opcional)
            </h1>
            <p style={{ ...S.body, marginBottom: 28 }}>
              Este paso es opcional. Si nos dices tu marca y talla habitual,
              la recomendación será más precisa. Si prefieres omitirlo,
              presiona el botón "Calcular talla ahora" directamente.
            </p>

            <div style={{ marginBottom: 24 }}>
              <p style={{ ...S.label, display: 'block', marginBottom: 12 }}>
                Selecciona tu marca habitual (opcional):
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {MARCAS.map(m => {
                  const sel = data.marca === m;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        const newMarca = sel ? '' : m;
                        setData(d => ({ ...d, marca: newMarca, tallaHabitual: '' }));
                        announce(sel ? `Marca ${m} deseleccionada` : `Marca ${m} seleccionada. Ahora elige tu talla habitual en ${m}.`);
                      }}
                      aria-pressed={sel}
                      style={{
                        padding: '14px 10px', fontSize: 18, fontWeight: sel ? 700 : 500,
                        border: `3px solid ${sel ? '#000000' : '#cccccc'}`,
                        borderRadius: 8, cursor: 'pointer',
                        backgroundColor: sel ? '#000000' : '#ffffff',
                        color: sel ? '#ffffff' : '#000000',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
                      onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
                    >
                      {sel ? '✓ ' : ''}{m}
                    </button>
                  );
                })}
              </div>

              {data.marca && (
                <div style={{ backgroundColor: '#f5f5f5', border: '3px solid #000000', borderRadius: 10, padding: 20 }}>
                  <p style={{ ...S.label, marginBottom: 12 }}>
                    ¿Cuál es tu talla habitual en {data.marca}?
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {TALLAS.map(t => {
                      const sel = data.tallaHabitual === t;
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            setData(d => ({ ...d, tallaHabitual: sel ? '' : t }));
                            announce(sel ? `Talla ${t} deseleccionada` : `Talla ${t} en ${data.marca} seleccionada.`);
                          }}
                          aria-pressed={sel}
                          style={{
                            width: 60, height: 60, fontSize: 20, fontWeight: 700,
                            border: `3px solid ${sel ? '#000000' : '#cccccc'}`,
                            borderRadius: 8, cursor: 'pointer',
                            backgroundColor: sel ? '#000000' : '#ffffff',
                            color: sel ? '#ffffff' : '#000000',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
                          onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  {data.tallaHabitual && (
                    <p style={{ ...S.hint, marginTop: 10 }}>
                      Talla seleccionada: {data.tallaHabitual} en {data.marca}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Summary before calculating */}
            <div style={{ backgroundColor: '#f5f5f5', border: '2px solid #cccccc', borderRadius: 10, padding: 20, marginBottom: 24 }}>
              <p style={{ ...S.label, marginBottom: 8 }}>Resumen de tus datos:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ ...S.body, marginBottom: 4 }}>Altura: {data.altura} cm</li>
                <li style={{ ...S.body, marginBottom: 4 }}>Peso: {data.peso} kg</li>
                <li style={{ ...S.body, marginBottom: 4 }}>Pecho: {data.pecho} cm</li>
                <li style={{ ...S.body, marginBottom: 4 }}>Estilo: {data.fitStyle}</li>
                {data.marca && <li style={{ ...S.body, marginBottom: 4 }}>Marca: {data.marca} — Talla {data.tallaHabitual || 'no seleccionada'}</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button
            onClick={step === 0 ? onBack : () => setStep(s => s - 1)}
            style={{ ...S.btnSecondary, flex: 1 }}
            aria-label={step === 0 ? 'Volver al catálogo de productos' : `Volver al paso ${step}`}
            onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
            onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
          >
            {step === 0 ? '← Volver al catálogo' : `← Volver al paso ${step}`}
          </button>
          <button
            onClick={handleNext}
            style={{ ...S.btnPrimary, flex: 2 }}
            aria-label={step === 2 ? 'Calcular mi talla ahora' : `Continuar al paso ${step + 2}`}
            onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
            onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
          >
            {step === 2 ? 'Calcular talla ahora →' : `Siguiente: Paso ${step + 2} →`}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ── Screen: Wizard Result + Product Picker ───────────────────── */
function ResultScreen({
  size,
  confidence,
  onPickProduct,
  onBack,
}: {
  size: SizeName;
  confidence: string;
  onPickProduct: (id: string) => void;
  onBack: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  return (
    <div>
      <div role="status" style={S.statusBar}>
        Estás en: Resultado de RomeFit — Selecciona tu prenda
      </div>
      <main role="main" aria-label="Resultado de RomeFit y selección de prenda"
        style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}
      >
        {/* Result announcement */}
        <div role="status" aria-live="assertive" aria-atomic="true"
          style={{ ...S.card, backgroundColor: '#f0fdf4', border: '3px solid #2E7D32', textAlign: 'center' }}>
          <h1 ref={headingRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} style={{ ...S.h1, color: '#2E7D32', textAlign: 'center' }}>
            ¡Tu talla recomendada es {size}!
          </h1>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#000000', margin: '16px 0 8px', fontFamily: 'Inter, sans-serif' }}>
            TALLA: {size}
          </p>
          <p style={{ ...S.body, marginBottom: 8 }}>
            Nivel de confianza: {confidence}
          </p>
          <p style={{ ...S.hint, margin: 0 }}>
            {confidence === 'Alta'
              ? 'Tus medidas coinciden perfectamente con esta talla.'
              : 'Recomendación aproximada. Si tienes dudas, elige la talla superior.'}
          </p>
        </div>

        <h2 style={{ ...S.h2, marginTop: 32, marginBottom: 12 }}>
          ¿Qué prenda quieres comprar en talla {size}?
        </h2>
        <p style={{ ...S.body, marginBottom: 24 }}>
          Selecciona la prenda que deseas. Se añadirá al carrito en tu talla {size}.
        </p>

        <ul role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PRODUCTS.map((p, i) => (
            <li key={p.id} style={S.card} role="listitem">
              <p style={{ fontSize: 14, fontWeight: 600, color: '#666', margin: '0 0 4px', fontFamily: 'Inter, sans-serif' }}>
                PRENDA {i + 1} DE {PRODUCTS.length}
              </p>
              <h3 style={{ ...S.h3, marginBottom: 4 }}>{p.name}</h3>
              <p style={{ ...S.body, marginBottom: 4 }}>{p.desc}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#000000', margin: '0 0 16px', fontFamily: 'Inter, sans-serif' }}>
                Precio: {p.price} — Talla {size}
              </p>
              <button
                onClick={() => onPickProduct(p.id)}
                style={S.btnPrimary}
                aria-label={`Comprar ${p.name} en talla ${size} por ${p.price}`}
                onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
                onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
              >
                Comprar {p.name} en talla {size} — {p.price}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={onBack}
          style={{ ...S.btnSecondary, marginTop: 8 }}
          aria-label="Volver a la calculadora de talla"
          onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
          onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
        >
          ← Volver a la calculadora
        </button>
      </main>
    </div>
  );
}

/* ── Screen: Login ────────────────────────────────────────────── */
function LoginScreen({
  productName,
  productPrice,
  size,
  onSuccess,
  onBack,
}: {
  productName: string;
  productPrice: string;
  size: SizeName | null;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'El correo electrónico es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Ingresa un correo electrónico válido. Ejemplo: nombre@correo.com';
    if (!password) e.password = 'La contraseña es obligatoria';
    else if (password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onSuccess();
  }

  return (
    <div>
      <div role="status" style={S.statusBar}>
        Estás en: Inicio de sesión — Paso previo al pago
      </div>
      <main role="main" aria-label="Formulario de inicio de sesión"
        style={{ maxWidth: 600, margin: '0 auto', padding: '32px 24px' }}
      >
        <h1 ref={headingRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} style={S.h1}>
          Inicia sesión para completar tu compra
        </h1>

        {/* Order summary */}
        <div style={{ ...S.card, backgroundColor: '#f5f5f5', marginBottom: 32 }}>
          <p style={{ ...S.label, marginBottom: 8 }}>Resumen de tu pedido:</p>
          <p style={{ ...S.body, marginBottom: 4 }}>Prenda: {productName}</p>
          {size && <p style={{ ...S.body, marginBottom: 4 }}>Talla: {size}</p>}
          <p style={{ fontSize: 22, fontWeight: 800, color: '#000000', margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Total a pagar: {productPrice}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">
          {/* Email */}
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="acc-email" style={S.label}>
              Correo electrónico — Campo obligatorio
            </label>
            <input
              id="acc-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ ...S.input, borderColor: errors.email ? '#C00000' : '#000000' }}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : 'hint-email'}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
            />
            <span id="hint-email" style={{ ...S.hint, display: 'block', marginTop: 6 }}>
              {email ? `Correo ingresado: ${email}` : 'Sin dato aún'}
            </span>
            {errors.email && (
              <p id="err-email" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Error: {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 32 }}>
            <label htmlFor="acc-password" style={S.label}>
              Contraseña — Campo obligatorio
            </label>
            <p style={{ ...S.hint, marginBottom: 8 }}>Mínimo 6 caracteres</p>
            <input
              id="acc-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...S.input, borderColor: errors.password ? '#C00000' : '#000000' }}
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'err-password' : undefined}
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />
            {errors.password && (
              <p id="err-password" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Error: {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1, marginBottom: 16 }}
            aria-label={loading ? 'Iniciando sesión, espera un momento' : 'Iniciar sesión y continuar al pago'}
            onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
            onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
          >
            {loading ? 'Verificando credenciales…' : 'Iniciar sesión y continuar →'}
          </button>

          {loading && (
            <div role="status" aria-live="polite" style={{ ...S.hint, textAlign: 'center' }}>
              Iniciando sesión, por favor espera…
            </div>
          )}
        </form>

        <button
          onClick={onBack}
          style={S.btnSecondary}
          aria-label="Volver a la selección de prenda"
          onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
          onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
        >
          ← Volver a la selección de prenda
        </button>
      </main>
    </div>
  );
}

/* ── Screen: Checkout ─────────────────────────────────────────── */
function CheckoutScreen({
  productName,
  productPrice,
  size,
  onConfirm,
  onBack,
}: {
  productName: string;
  productPrice: string;
  size: SizeName | null;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [name,    setName]    = useState('');
  const [address, setAddress] = useState('');
  const [phone,   setPhone]   = useState('');
  const [cardNum, setCardNum] = useState('');
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  const basePrice = parseFloat(productPrice.replace('S/. ', '')) || 89.90;
  const envio = 0;
  const total = basePrice + envio;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name    = 'El nombre es obligatorio';
    if (!address.trim()) e.address = 'La dirección de envío es obligatoria';
    if (!phone.trim())   e.phone   = 'El número de teléfono es obligatorio';
    if (!cardNum.trim()) e.cardNum = 'El número de tarjeta es obligatorio';
    else if (cardNum.replace(/\s/g,'').length < 16) e.cardNum = 'El número de tarjeta debe tener 16 dígitos';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    onConfirm();
  }

  return (
    <div>
      <div role="status" style={S.statusBar}>
        Estás en: Checkout — Completa tu pedido
      </div>
      <main role="main" aria-label="Formulario de pago y envío"
        style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}
      >
        <h1 ref={headingRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1} style={S.h1}>
          Completa tu pedido
        </h1>

        {/* Order summary */}
        <div style={{ ...S.card, backgroundColor: '#f5f5f5' }}>
          <p style={{ ...S.label, marginBottom: 10 }}>Resumen del pedido:</p>
          <p style={{ ...S.body, marginBottom: 4 }}>{productName}</p>
          {size && <p style={{ ...S.body, marginBottom: 4 }}>Talla: {size}</p>}
          <p style={{ ...S.body, marginBottom: 4 }}>Precio: {productPrice}</p>
          <p style={{ ...S.body, marginBottom: 4 }}>Envío: Gratis</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#000000', margin: '12px 0 0', fontFamily: 'Inter, sans-serif' }}>
            Total a pagar: S/. {total.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleConfirm} noValidate aria-label="Formulario de pago">

          <h2 style={{ ...S.h2, marginTop: 28 }}>Datos de envío</h2>

          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="acc-name" style={S.label}>Nombre completo — Obligatorio</label>
            <input id="acc-name" type="text" value={name} onChange={e => setName(e.target.value)}
              style={{ ...S.input, borderColor: errors.name ? '#C00000' : '#000000' }}
              aria-required="true" aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'err-name' : undefined}
              placeholder="Ej: Juan García Pérez" autoComplete="name"
            />
            {errors.name && <p id="err-name" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Error: {errors.name}</p>}
          </div>

          {/* Address */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="acc-address" style={S.label}>Dirección de envío — Obligatoria</label>
            <input id="acc-address" type="text" value={address} onChange={e => setAddress(e.target.value)}
              style={{ ...S.input, borderColor: errors.address ? '#C00000' : '#000000' }}
              aria-required="true" aria-invalid={!!errors.address}
              aria-describedby={errors.address ? 'err-address' : undefined}
              placeholder="Ej: Av. Javier Prado 1234, Miraflores, Lima"
              autoComplete="street-address"
            />
            {errors.address && <p id="err-address" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Error: {errors.address}</p>}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 28 }}>
            <label htmlFor="acc-phone" style={S.label}>Teléfono — Obligatorio</label>
            <input id="acc-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              style={{ ...S.input, borderColor: errors.phone ? '#C00000' : '#000000' }}
              aria-required="true" aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'err-phone' : undefined}
              placeholder="Ej: 987654321" autoComplete="tel"
            />
            {errors.phone && <p id="err-phone" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Error: {errors.phone}</p>}
          </div>

          <h2 style={{ ...S.h2 }}>Datos de pago</h2>
          <p style={{ ...S.hint, marginBottom: 20 }}>
            Aceptamos Visa, Mastercard, AMEX y Diners Club.
            Ingresa los datos de tu tarjeta de crédito o débito.
          </p>

          {/* Card */}
          <div style={{ marginBottom: 32 }}>
            <label htmlFor="acc-card" style={S.label}>Número de tarjeta (16 dígitos) — Obligatorio</label>
            <input id="acc-card" type="text" value={cardNum}
              onChange={e => setCardNum(e.target.value.replace(/[^0-9\s]/g, '').slice(0, 19))}
              style={{ ...S.input, borderColor: errors.cardNum ? '#C00000' : '#000000' }}
              aria-required="true" aria-invalid={!!errors.cardNum}
              aria-describedby={errors.cardNum ? 'err-card' : 'hint-card'}
              placeholder="1234 5678 9012 3456"
              inputMode="numeric" autoComplete="cc-number"
            />
            <span id="hint-card" style={{ ...S.hint, display: 'block', marginTop: 6 }}>
              {cardNum ? `Has ingresado: ${cardNum.length} dígitos` : 'Sin dato aún'}
            </span>
            {errors.cardNum && <p id="err-card" role="alert" style={{ color: '#C00000', fontSize: 18, marginTop: 6, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Error: {errors.cardNum}</p>}
          </div>

          <button type="submit" disabled={loading}
            style={{ ...S.btnGreen, fontSize: 22, minHeight: 68, marginBottom: 16, opacity: loading ? 0.7 : 1 }}
            aria-label={loading ? 'Procesando tu pago, espera un momento' : `Confirmar compra y pagar S/. ${total.toFixed(2)}`}
            onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
            onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
          >
            {loading ? 'Procesando pago…' : `Confirmar compra — Pagar S/. ${total.toFixed(2)} →`}
          </button>

          {loading && (
            <div role="status" aria-live="polite" style={{ ...S.hint, textAlign: 'center', marginBottom: 16 }}>
              Procesando tu pago de forma segura, por favor espera…
            </div>
          )}
        </form>

        <button onClick={onBack} style={S.btnSecondary}
          aria-label="Volver al inicio de sesión"
          onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
          onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
        >
          ← Volver al inicio de sesión
        </button>
      </main>
    </div>
  );
}

/* ── Screen: Confirmation ─────────────────────────────────────── */
function ConfirmationScreen({
  productName,
  size,
  onReturnHome,
}: {
  productName: string;
  size: SizeName | null;
  onReturnHome: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);

  return (
    <div>
      <div role="status" style={{ ...S.statusBar, backgroundColor: '#2E7D32' }}>
        Estás en: Confirmación de compra — ¡Pedido exitoso!
      </div>
      <main role="main" aria-label="Confirmación de compra exitosa"
        style={{ maxWidth: 700, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}
      >
        <div role="alert" aria-live="assertive" aria-atomic="true">
          <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }} aria-hidden="true">✅</div>
          <h1 ref={headingRef as React.RefObject<HTMLHeadingElement>} tabIndex={-1}
            style={{ ...S.h1, color: '#2E7D32', textAlign: 'center', fontSize: 36 }}>
            ¡Compra realizada con éxito!
          </h1>
          <p style={{ ...S.body, textAlign: 'center', marginBottom: 8 }}>
            Tu pedido ha sido confirmado.
          </p>
          <p style={{ ...S.body, textAlign: 'center', marginBottom: 8 }}>
            Prenda: {productName}
          </p>
          {size && (
            <p style={{ ...S.body, textAlign: 'center', marginBottom: 8 }}>
              Talla: {size}
            </p>
          )}
          <p style={{ ...S.body, textAlign: 'center', marginBottom: 32 }}>
            Recibirás un correo electrónico con el seguimiento de tu pedido.
            El tiempo de entrega es de 3 a 5 días hábiles.
          </p>
        </div>

        <button
          onClick={onReturnHome}
          style={{ ...S.btnPrimary, maxWidth: 480, margin: '0 auto' }}
          aria-label="Volver al inicio de Rome Store"
          onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
          onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
        >
          Volver al inicio de Rome Store
        </button>
      </main>
    </div>
  );
}

/* ── Main AccessibleView component ───────────────────────────── */
type Screen = 'catalog' | 'wizard' | 'result' | 'login' | 'checkout' | 'confirmation';

export function AccessibleView({ onDisable }: { onDisable: () => void }) {
  const [screen,      setScreen]      = useState<Screen>('catalog');
  const [wizardSize,  setWizardSize]  = useState<SizeName | null>(null);
  const [wizardConf,  setWizardConf]  = useState('Media');
  const [selectedId,  setSelectedId]  = useState<string | null>(null);
  const [fromWizard,  setFromWizard]  = useState(false);

  const selectedProduct = PRODUCTS.find(p => p.id === selectedId) ?? PRODUCTS[3];

  function handleBuyProduct(id: string) {
    setSelectedId(id);
    setFromWizard(false);
    setScreen('login');
  }

  function handleWizardComplete(size: SizeName, conf: string) {
    setWizardSize(size);
    setWizardConf(conf);
    setScreen('result');
  }

  function handlePickProduct(id: string) {
    setSelectedId(id);
    setFromWizard(true);
    setScreen('login');
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: 80,
    }}>
      {/* Global header */}
      <header role="banner" style={{
        backgroundColor: '#000000', padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, fontStyle: 'italic', color: '#ffffff', letterSpacing: '-1px', fontFamily: 'Inter, sans-serif' }}>
          ROME STORE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 16, color: '#aaaaaa', fontFamily: 'Inter, sans-serif' }}>
            ♿ Modo Accesible activo
          </span>
          <button
            onClick={onDisable}
            style={{
              backgroundColor: '#444444', color: '#ffffff',
              border: '2px solid #ffffff', borderRadius: 6,
              padding: '8px 16px', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
            aria-label="Desactivar modo accesible y volver a la vista normal"
            onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
            onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
          >
            Desactivar modo accesible
          </button>
        </div>
      </header>

      {/* Global nav */}
      <nav role="navigation" aria-label="Navegación principal" style={{
        backgroundColor: '#f5f5f5', borderBottom: '2px solid #000000',
        padding: '8px 24px', display: 'flex', gap: 8, flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setScreen('catalog')}
          aria-current={screen === 'catalog' ? 'page' : undefined}
          style={{
            padding: '10px 20px', fontSize: 18, fontWeight: 700,
            border: '3px solid #000000', borderRadius: 6,
            backgroundColor: screen === 'catalog' ? '#000000' : '#ffffff',
            color: screen === 'catalog' ? '#ffffff' : '#000000',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
          aria-label="Ir al catálogo de productos"
          onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
          onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
        >
          🏠 Inicio / Catálogo
        </button>
        <button
          onClick={() => setScreen('wizard')}
          aria-current={screen === 'wizard' ? 'page' : undefined}
          style={{
            padding: '10px 20px', fontSize: 18, fontWeight: 700,
            border: '3px solid #000000', borderRadius: 6,
            backgroundColor: screen === 'wizard' ? '#000000' : '#ffffff',
            color: screen === 'wizard' ? '#ffffff' : '#000000',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
          aria-label="Abrir RomeFit para calcular tu talla"
          onFocus={(e) => { Object.assign(e.currentTarget.style, S.focusRing); }}
          onBlur={(e)  => { e.currentTarget.style.outline = ''; }}
        >
          📏 Calcular mi talla
        </button>
      </nav>

      {/* Screens */}
      {screen === 'catalog' && (
        <CatalogScreen
          onBuyProduct={handleBuyProduct}
          onStartWizard={() => setScreen('wizard')}
        />
      )}
      {screen === 'wizard' && (
        <WizardScreen
          onComplete={handleWizardComplete}
          onBack={() => setScreen('catalog')}
        />
      )}
      {screen === 'result' && wizardSize && (
        <ResultScreen
          size={wizardSize}
          confidence={wizardConf}
          onPickProduct={handlePickProduct}
          onBack={() => setScreen('wizard')}
        />
      )}
      {screen === 'login' && (
        <LoginScreen
          productName={selectedProduct.name}
          productPrice={selectedProduct.price}
          size={fromWizard ? wizardSize : null}
          onSuccess={() => setScreen('checkout')}
          onBack={() => setScreen(fromWizard ? 'result' : 'catalog')}
        />
      )}
      {screen === 'checkout' && (
        <CheckoutScreen
          productName={selectedProduct.name}
          productPrice={selectedProduct.price}
          size={fromWizard ? wizardSize : null}
          onConfirm={() => setScreen('confirmation')}
          onBack={() => setScreen('login')}
        />
      )}
      {screen === 'confirmation' && (
        <ConfirmationScreen
          productName={selectedProduct.name}
          size={fromWizard ? wizardSize : null}
          onReturnHome={() => {
            setScreen('catalog');
            setWizardSize(null);
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}
