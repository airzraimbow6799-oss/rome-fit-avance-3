import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { C } from './tokens';
import { useResponsive } from '../../hooks/useResponsive';

/* ── Districts ───────────────────────────────────────────────────── */
const DISTRITOS = [
  'Ate', 'Barranco', 'Bellavista', 'Breña', 'Callao', 'Chorrillos',
  'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina',
  'La Perla', 'La Victoria', 'Lince', 'Los Olivos', 'Magdalena del Mar',
  'Miraflores', 'Pueblo Libre', 'Rímac', 'San Borja', 'San Isidro',
  'San Juan de Lurigancho', 'San Martín de Porres', 'San Miguel',
  'Santiago de Surco', 'Villa El Salvador', 'Villa María del Triunfo',
];

/* ── Types ───────────────────────────────────────────────────────── */
type EntregaType = 'tienda' | 'delivery';
type PagoType    = 'plin'   | 'yape' | 'tarjeta' | 'contra';
type ModalStep   = 'form'   | 'processing' | 'completed';

interface CartLineItem {
  id: string;
  name: string;
  price: string;
  size: string;
  quantity: number;
  customLabel?: string;
}

export interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
  price?: string;
  size?: string;
  qty?: number;
  isConfeccion?: boolean;
  cartMode?: boolean;
  cartItems?: CartLineItem[];
}

/* ── QR Code SVG placeholder ─────────────────────────────────────── */
function QRCode({ color }: { color: string }) {
  /* A 19×19 module pattern that looks like a real QR */
  const pattern: number[][] = [
    [1,1,1,1,1,1,1,0,0,1,0,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,0,0,1,1,1,1,0,1,0,0,1,1,0,1,0,1],
    [0,1,0,1,1,0,0,0,0,1,0,1,1,0,0,1,0,1,0],
    [1,0,1,0,0,1,1,0,1,0,1,0,0,1,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,0,1],
  ];

  const cs = 8; // cell size
  const pad = 6;
  const total = pattern.length * cs + pad * 2;

  return (
    <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`}>
      <rect width={total} height={total} rx="8" fill="white" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cs + pad}
              y={r * cs + pad}
              width={cs - 1}
              height={cs - 1}
              rx="1.2"
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* ── Radio Option Button ─────────────────────────────────────────── */
function RadioOption({
  selected, onClick, children,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 14px',
        border: `1.5px solid ${selected ? C.black : '#dddddd'}`,
        borderRadius: 8,
        backgroundColor: selected ? '#f9f9f9' : '#ffffff',
        cursor: 'pointer', textAlign: 'left', flex: 1,
        fontFamily: 'Inter, sans-serif', transition: 'all 0.14s',
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${selected ? C.black : '#bbbbbb'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'border-color 0.14s',
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.black }} />}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </button>
  );
}

/* ── Input Field ─────────────────────────────────────────────────── */
function Field({
  label, value, onChange, placeholder, type = 'text', required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 5, fontFamily: 'Inter, sans-serif' }}>
        {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', height: 42,
          border: '1.5px solid #dddddd', borderRadius: 6,
          padding: '0 12px', fontSize: 13, color: C.black,
          outline: 'none', fontFamily: 'Inter, sans-serif',
          boxSizing: 'border-box', backgroundColor: '#ffffff',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = C.black)}
        onBlur={(e)  => (e.currentTarget.style.borderColor = '#dddddd')}
      />
    </div>
  );
}

/* ── Section Title ───────────────────────────────────────────────── */
function SectionTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', backgroundColor: C.black,
        color: '#ffffff', fontSize: 11, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontFamily: 'Inter, sans-serif',
      }}>{n}</div>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.black, fontFamily: 'Inter, sans-serif' }}>{children}</span>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export function CheckoutModal({
  open, onClose,
  productName = 'Polo RomeFit Classic',
  price = 'S/. 79.90',
  size = 'M',
  qty = 1,
  isConfeccion = false,
  cartMode = false,
  cartItems = [],
}: CheckoutModalProps) {
  const { isMobile } = useResponsive();

  /* ── Derive effective display values from cart when in cartMode ── */
  const effItems      = cartMode && cartItems.length > 0 ? cartItems : null;
  const effConfeccion = effItems ? effItems.some(i => !!i.customLabel) : isConfeccion;
  const effName       = effItems
    ? (effItems.length === 1 ? effItems[0].name : `${effItems.length} productos`)
    : productName;
  const effSize       = effItems && effItems.length === 1 ? effItems[0].size : size;
  const effQty        = effItems ? effItems.reduce((s, i) => s + i.quantity, 0) : qty;

  /* ── State ── */
  // Confección siempre requiere delivery — no se puede recoger en tienda
  const [entrega,  setEntrega]  = useState<EntregaType>(effConfeccion ? 'delivery' : 'tienda');
  const [pago,     setPago]     = useState<PagoType>('plin');
  const [step,     setStep]     = useState<ModalStep>('form');

  /* Delivery fields */
  const [distrito,   setDistrito]   = useState('');
  const [direccion,  setDireccion]  = useState('');
  const [referencia, setReferencia] = useState('');

  /* Card fields */
  const [cardNum,    setCardNum]    = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv,    setCardCvv]    = useState('');

  /* QR flow */
  const [verifying,    setVerifying]    = useState(false);
  const [qrVerified,   setQrVerified]   = useState(false);
  const [showSuccess,  setShowSuccess]  = useState(false);

  /* Reset on open */
  useEffect(() => {
    if (open) {
      setEntrega(effConfeccion ? 'delivery' : 'tienda');
      setPago('plin'); setStep('form');
      setDistrito(''); setDireccion(''); setReferencia('');
      setCardNum(''); setCardName(''); setCardExpiry(''); setCardCvv('');
      setVerifying(false); setQrVerified(false); setShowSuccess(false);
    }
  }, [open, effConfeccion]);

  /* Reset QR state when payment changes */
  function changePago(p: PagoType) {
    setPago(p);
    setQrVerified(false);
    setShowSuccess(false);
  }

  /* ── Helpers ── */
  const isQrPago   = pago === 'plin' || pago === 'yape';
  const plinColor  = '#0066CC';
  const yapeColor  = '#820AD1';
  const qrColor    = pago === 'plin' ? plinColor : yapeColor;

  /* Card number formatter */
  function formatCard(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }

  /* Expiry formatter */
  function formatExpiry(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  /* ── Verify QR payment ── */
  async function handleVerify() {
    setVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setVerifying(false);
    setQrVerified(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  /* ── Complete payment ── */
  async function handleCompletarPago() {
    setStep('processing');
    await new Promise(r => setTimeout(r, 1800));
    setStep('completed');
  }

  /* ── Can proceed? ── */
  const canProceed = isQrPago ? qrVerified : true;

  const baseAmount   = effItems
    ? effItems.reduce((s, i) => s + parseFloat(i.price.replace('S/. ', '')) * i.quantity, 0)
    : parseFloat(price.replace('S/. ', '')) * qty;
  const envioAmount  = effConfeccion ? 20.00 : (entrega === 'delivery' ? 8.00 : 0);
  const totalAmount  = baseAmount + envioAmount;
  const totalPrice   = `S/. ${totalAmount.toFixed(2)}`;
  const orderNum     = `RF-${Date.now().toString().slice(-6)}`;

  /* Display label for size */
  const sizeLabel    = effConfeccion ? `${effSize} — Confección Artesanal` : effSize;
  /* Delivery time label */
  const deliveryTime = effConfeccion
    ? '7–10 días hábiles (confección + envío)'
    : entrega === 'delivery' ? '1–3 días hábiles' : '24–48h';

  if (!open) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.60)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: 20000, backdropFilter: 'blur(4px)',
        padding: isMobile ? '0' : '16px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.22 }}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: isMobile ? '16px 16px 0 0' : 12,
          width: '100%', maxWidth: isMobile ? '100%' : 500,
          maxHeight: isMobile ? '96vh' : '92vh',
          overflowY: 'auto',
          boxShadow: '0 28px 90px rgba(0,0,0,0.35)',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          marginTop: isMobile ? 'auto' : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">

          {/* ════════════════════════ FORM STEP ════════════════════════ */}
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Mobile drag handle */}
              {isMobile && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#dddddd' }} />
                </div>
              )}

              {/* Header */}
              <div style={{
                padding: isMobile ? '14px 18px 14px' : '22px 24px 16px',
                borderBottom: '1px solid #eeeeee',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: C.black, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    🔒 Checkout Seguro
                  </h2>
                  <p style={{ fontSize: 12, color: '#888888', margin: 0 }}>
                    Finaliza tu compra seleccionando el método de entrega y pago.
                  </p>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#999', cursor: 'pointer', lineHeight: 1, padding: 0, marginTop: 2 }}>✕</button>
              </div>

              {/* Order summary mini */}
              <div style={{
                margin: '14px 24px', padding: '12px 14px',
                backgroundColor: effConfeccion ? '#f5f0ff' : '#f8f8f8',
                border: effConfeccion ? '1.5px solid #ddd0ff' : 'none',
                borderRadius: 8,
              }}>
                {effItems && effItems.length > 1 ? (
                  /* Multi-item cart list */
                  <div>
                    {effItems.map((item, i) => (
                      <div key={item.id + i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: i < effItems.length - 1 ? 8 : 0 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{item.name}</div>
                          <div style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>
                            Talla <strong style={{ color: C.black }}>{item.size}</strong>
                            {item.customLabel && <span style={{ marginLeft: 4, backgroundColor: '#111', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, letterSpacing: '0.5px' }}>ARTESANAL</span>}
                            {' '}· Cant. {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.black, flexShrink: 0 }}>
                          S/. {(parseFloat(item.price.replace('S/. ', '')) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {effConfeccion && (
                      <div style={{ fontSize: 10, color: '#7c3aed', marginTop: 6, fontWeight: 600 }}>✂ Incluye envío express S/. 20.00</div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingTop: 8, borderTop: '1px solid #e0e0e0' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.black }}>{totalPrice}</div>
                    </div>
                  </div>
                ) : (
                  /* Single item */
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{effName}</div>
                      <div style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>
                        Talla <strong style={{ color: C.black }}>{effSize}</strong>
                        {effConfeccion && <span style={{ marginLeft: 4, backgroundColor: '#111', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, letterSpacing: '0.5px' }}>ARTESANAL</span>}
                        {' '}· Cant. {effQty}
                      </div>
                      {effConfeccion && (
                        <div style={{ fontSize: 10, color: '#7c3aed', marginTop: 4, fontWeight: 600 }}>
                          ✂ Incluye envío express S/. 20.00
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.black, flexShrink: 0 }}>{totalPrice}</div>
                  </div>
                )}
              </div>

              <div style={{ padding: isMobile ? '0 16px 24px' : '0 24px 24px' }}>

                {/* ── 1. Método de Entrega ── */}
                <div style={{ marginBottom: 20 }}>
                  <SectionTitle n={1}>Método de Entrega</SectionTitle>

                  {/* Aviso confección: solo delivery */}
                  {effConfeccion && (
                    <div style={{
                      marginBottom: 10, padding: '10px 14px',
                      backgroundColor: '#fffbeb', border: '1.5px solid #fbbf24',
                      borderRadius: 8, fontSize: 12, color: '#92400e',
                      display: 'flex', alignItems: 'flex-start', gap: 7,
                    }}>
                      <span>✂</span>
                      <span>
                        <strong>Prenda a confección</strong> — solo disponible con envío a domicilio.
                        El proceso toma <strong>7–10 días hábiles</strong> (5–7 días confección + envío express).
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    {/* Tienda — deshabilitado si es confección */}
                    <div style={{ flex: 1, opacity: effConfeccion ? 0.4 : 1, pointerEvents: effConfeccion ? 'none' : 'auto' }}>
                      <RadioOption selected={entrega === 'tienda'} onClick={() => setEntrega('tienda')}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: entrega === 'tienda' ? 600 : 400, color: C.black }}>
                            🏪 Recoger en tienda
                          </div>
                          <div style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>Gratis · 24–48h</div>
                          {effConfeccion && <div style={{ fontSize: 10, color: '#dc2626', marginTop: 2 }}>No disponible para confección</div>}
                        </div>
                      </RadioOption>
                    </div>
                    <RadioOption selected={entrega === 'delivery'} onClick={() => setEntrega('delivery')}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: entrega === 'delivery' ? 600 : 400, color: C.black }}>
                          🛵 {effConfeccion ? 'Envío Express' : 'Delivery'}
                        </div>
                        <div style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>
                          {effConfeccion ? 'S/. 20.00 · 7–10 días hábiles' : 'S/. 8.00 · 1–3 días'}
                        </div>
                      </div>
                    </RadioOption>
                  </div>

                  {/* Delivery address form */}
                  <AnimatePresence>
                    {entrega === 'delivery' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ marginTop: 14, padding: '14px 16px', border: '1.5px solid #eeeeee', borderRadius: 8, backgroundColor: '#fafafa' }}>
                          <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 5 }}>
                              Distrito <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <select
                              value={distrito}
                              onChange={(e) => setDistrito(e.target.value)}
                              style={{
                                width: '100%', height: 42,
                                border: '1.5px solid #dddddd', borderRadius: 6,
                                padding: '0 12px', fontSize: 13, color: distrito ? C.black : '#aaaaaa',
                                outline: 'none', fontFamily: 'Inter, sans-serif',
                                boxSizing: 'border-box', backgroundColor: '#ffffff',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="">Seleccione un distrito</option>
                              {DISTRITOS.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>
                          <Field
                            label="Dirección completa"
                            required
                            value={direccion}
                            onChange={setDireccion}
                            placeholder="Av. / Calle / Jr."
                          />
                          <div style={{ marginBottom: 0 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 5 }}>
                              Casa, Lote, Depto <span style={{ fontSize: 11, fontWeight: 400, color: '#aaaaaa' }}>(Opcional)</span>
                            </label>
                            <input
                              type="text"
                              value={referencia}
                              onChange={(e) => setReferencia(e.target.value)}
                              placeholder="Ej. Dpto 301, Torre B"
                              style={{
                                width: '100%', height: 42,
                                border: '1.5px solid #dddddd', borderRadius: 6,
                                padding: '0 12px', fontSize: 13, color: C.black,
                                outline: 'none', fontFamily: 'Inter, sans-serif',
                                boxSizing: 'border-box', backgroundColor: '#ffffff',
                              }}
                              onFocus={(e) => (e.currentTarget.style.borderColor = C.black)}
                              onBlur={(e)  => (e.currentTarget.style.borderColor = '#dddddd')}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── 2. Método de Pago ── */}
                <div style={{ marginBottom: 20 }}>
                  <SectionTitle n={2}>Método de Pago</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>

                    {/* Plin */}
                    <RadioOption selected={pago === 'plin'} onClick={() => changePago('plin')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 18, backgroundColor: plinColor, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 8, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>PLIN</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: pago === 'plin' ? 600 : 400, color: plinColor }}>Plin</span>
                      </div>
                    </RadioOption>

                    {/* Yape */}
                    <RadioOption selected={pago === 'yape'} onClick={() => changePago('yape')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 18, backgroundColor: yapeColor, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 8, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>YAPE</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: pago === 'yape' ? 600 : 400, color: yapeColor }}>Yape</span>
                      </div>
                    </RadioOption>

                    {/* Tarjeta */}
                    <RadioOption selected={pago === 'tarjeta'} onClick={() => changePago('tarjeta')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#1A1F71', letterSpacing: '-0.5px' }}>VISA</span>
                        <span style={{ fontSize: 8, color: '#aaaaaa' }}>/</span>
                        <div style={{ display: 'flex' }}>
                          <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#EB001B' }} />
                          <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: -4 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: pago === 'tarjeta' ? 600 : 400, color: C.black }}>Tarjeta</span>
                      </div>
                    </RadioOption>

                    {/* Contra entrega */}
                    <RadioOption selected={pago === 'contra'} onClick={() => changePago('contra')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>📦</span>
                        <span style={{ fontSize: 13, fontWeight: pago === 'contra' ? 600 : 400, color: C.black }}>Contra entrega</span>
                      </div>
                    </RadioOption>
                  </div>

                  {/* ── QR Section ── */}
                  <AnimatePresence>
                    {isQrPago && (
                      <motion.div
                        key={pago}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          marginTop: 14, padding: '18px 16px',
                          border: `1.5px solid ${qrColor}22`,
                          borderRadius: 10,
                          backgroundColor: `${qrColor}08`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                        }}>
                          {/* Brand header */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 32, height: 22, backgroundColor: qrColor, borderRadius: 4,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <span style={{ fontSize: 9, fontWeight: 800, color: '#ffffff' }}>
                                {pago === 'plin' ? 'PLIN' : 'YAPE'}
                              </span>
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: qrColor }}>
                              Pagar con {pago === 'plin' ? 'Plin' : 'Yape'}
                            </span>
                          </div>

                          <p style={{ fontSize: 11, color: '#888888', margin: 0, textAlign: 'center' }}>
                            Escanea el código QR con tu app{' '}
                            <strong style={{ color: qrColor }}>{pago === 'plin' ? 'Plin' : 'Yape'}</strong>{' '}
                            y paga <strong style={{ color: C.black }}>{totalPrice}</strong>
                          </p>

                          {/* QR code */}
                          <div style={{
                            padding: 12,
                            border: `2px solid ${qrColor}33`,
                            borderRadius: 10,
                            backgroundColor: '#ffffff',
                            boxShadow: `0 4px 20px ${qrColor}22`,
                          }}>
                            <QRCode color={qrColor} />
                          </div>

                          {/* Amount label */}
                          <div style={{
                            fontSize: 22, fontWeight: 800, color: qrColor,
                            letterSpacing: '-0.5px',
                          }}>
                            {totalPrice}
                          </div>

                          {/* QR verified success banner */}
                          <AnimatePresence>
                            {showSuccess && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 8,
                                  padding: '10px 18px',
                                  backgroundColor: '#f0fdf4', border: '1.5px solid #22c55e',
                                  borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#15803d',
                                }}
                              >
                                ✅ ¡Pago verificado exitosamente!
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Already verified badge */}
                          {qrVerified && !showSuccess && (
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              fontSize: 12, color: '#15803d', fontWeight: 600,
                            }}>
                              ✅ Pago verificado — listo para completar
                            </div>
                          )}

                          {/* Verify button */}
                          {!qrVerified && (
                            <button
                              onClick={handleVerify}
                              disabled={verifying}
                              style={{
                                height: 44, padding: '0 28px',
                                backgroundColor: qrColor,
                                color: '#ffffff', border: 'none', borderRadius: 7,
                                fontSize: 13, fontWeight: 700,
                                cursor: verifying ? 'wait' : 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                letterSpacing: '0.2px',
                                display: 'flex', alignItems: 'center', gap: 8,
                                opacity: verifying ? 0.8 : 1,
                                transition: 'opacity 0.15s',
                              }}
                            >
                              {verifying ? (
                                <>
                                  <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                                    style={{ display: 'inline-block', fontSize: 15 }}
                                  >⏳</motion.span>
                                  Verificando pago…
                                </>
                              ) : (
                                <>✔ Presionar a verificar pago</>
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Card Form ── */}
                  <AnimatePresence>
                    {pago === 'tarjeta' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          marginTop: 14, padding: '16px',
                          border: '1.5px solid #eeeeee', borderRadius: 10,
                          backgroundColor: '#fafafa',
                        }}>
                          {/* Card visual indicator */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1F71', letterSpacing: '-0.5px' }}>VISA</span>
                            <div style={{ display: 'flex' }}>
                              <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#EB001B' }} />
                              <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: -6, opacity: 0.9 }} />
                            </div>
                            <span style={{ fontSize: 11, color: '#888888' }}>Débito o Crédito</span>
                          </div>

                          {/* Card number */}
                          <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 5 }}>
                              Número de tarjeta <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={cardNum}
                              onChange={(e) => setCardNum(formatCard(e.target.value))}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              style={{
                                width: '100%', height: 42,
                                border: '1.5px solid #dddddd', borderRadius: 6,
                                padding: '0 12px', fontSize: 14, color: C.black,
                                outline: 'none', fontFamily: 'monospace',
                                boxSizing: 'border-box', backgroundColor: '#ffffff',
                                letterSpacing: '2px',
                              }}
                              onFocus={(e) => (e.currentTarget.style.borderColor = C.black)}
                              onBlur={(e)  => (e.currentTarget.style.borderColor = '#dddddd')}
                            />
                          </div>

                          {/* Name on card */}
                          <Field
                            label="Nombre en la tarjeta"
                            required
                            value={cardName}
                            onChange={(v) => setCardName(v.toUpperCase())}
                            placeholder="TAL COMO APARECE EN LA TARJETA"
                          />

                          {/* Expiry + CVV */}
                          <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1, marginBottom: 0 }}>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 5 }}>
                                Vencimiento <span style={{ color: '#dc2626' }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                placeholder="MM/AA"
                                maxLength={5}
                                style={{
                                  width: '100%', height: 42,
                                  border: '1.5px solid #dddddd', borderRadius: 6,
                                  padding: '0 12px', fontSize: 14, color: C.black,
                                  outline: 'none', fontFamily: 'Inter, sans-serif',
                                  boxSizing: 'border-box', backgroundColor: '#ffffff',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = C.black)}
                                onBlur={(e)  => (e.currentTarget.style.borderColor = '#dddddd')}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555555', marginBottom: 5 }}>
                                CVV <span style={{ color: '#dc2626' }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="•••"
                                maxLength={4}
                                style={{
                                  width: '100%', height: 42,
                                  border: '1.5px solid #dddddd', borderRadius: 6,
                                  padding: '0 12px', fontSize: 14, color: C.black,
                                  outline: 'none', fontFamily: 'monospace',
                                  boxSizing: 'border-box', backgroundColor: '#ffffff',
                                  letterSpacing: '4px',
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = C.black)}
                                onBlur={(e)  => (e.currentTarget.style.borderColor = '#dddddd')}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Contra entrega note ── */}
                  <AnimatePresence>
                    {pago === 'contra' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          marginTop: 12, padding: '12px 14px',
                          backgroundColor: '#fffbeb', border: '1.5px solid #fbbf24',
                          borderRadius: 8, fontSize: 12, color: '#92400e',
                        }}>
                          💡 Pagarás al recibir tu pedido. Solo disponible con Delivery.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Desglose total ── */}
                <div style={{
                  marginBottom: 16, padding: '12px 14px',
                  backgroundColor: '#f8f8f8', borderRadius: 8,
                  fontSize: 13, fontFamily: 'Inter, sans-serif',
                }}>
                  {effItems && effItems.length > 1 ? (
                    effItems.map((item, i) => (
                      <div key={item.id + i} style={{ display: 'flex', justifyContent: 'space-between', color: '#555', marginBottom: 6 }}>
                        <span>{item.name} × {item.quantity}</span>
                        <span>S/. {(parseFloat(item.price.replace('S/. ', '')) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', marginBottom: 6 }}>
                      <span>{effName} × {effQty}</span>
                      <span>S/. {baseAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {(effConfeccion || entrega === 'delivery') && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', marginBottom: 6 }}>
                      <span>{effConfeccion ? 'Envío Express (confección)' : 'Envío delivery'}</span>
                      <span>S/. {envioAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: C.black, borderTop: '1px solid #e5e5e5', paddingTop: 8, marginTop: 4 }}>
                    <span>TOTAL</span>
                    <span>{totalPrice}</span>
                  </div>
                </div>

                {/* ── PAGO COMPLETADO button ── */}
                <button
                  onClick={handleCompletarPago}
                  disabled={!canProceed}
                  title={isQrPago && !qrVerified ? 'Verifica tu pago QR primero' : undefined}
                  style={{
                    width: '100%', height: 52,
                    backgroundColor: canProceed ? C.black : '#cccccc',
                    color: '#ffffff', border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 700,
                    cursor: canProceed ? 'pointer' : 'not-allowed',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background-color 0.2s',
                    opacity: canProceed ? 1 : 0.65,
                  }}
                >
                  ✅ PAGO COMPLETADO
                </button>

                {/* Security note */}
                <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#aaaaaa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  🔒 Pago 100% seguro y cifrado · SSL
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════ PROCESSING ════════════════════════ */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '60px 40px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                style={{ fontSize: 48, lineHeight: 1 }}
              >
                ⏳
              </motion.div>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.black }}>Procesando tu pago…</div>
              <div style={{ fontSize: 13, color: '#888888', textAlign: 'center' }}>
                Estamos confirmando tu pedido.<br />Esto solo tarda unos segundos.
              </div>
            </motion.div>
          )}

          {/* ════════════════════════ COMPLETED ════════════════════════ */}
          {step === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {/* Green header */}
              <div style={{
                backgroundColor: '#16a34a',
                borderRadius: '12px 12px 0 0',
                padding: '32px 24px',
                textAlign: 'center',
                color: '#ffffff',
              }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, margin: '0 auto 14px',
                    border: '2.5px solid rgba(255,255,255,0.5)',
                  }}
                >
                  ✅
                </motion.div>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>¡Pedido Confirmado!</h2>
                <p style={{ fontSize: 13, margin: 0, opacity: 0.85 }}>Tu compra fue procesada exitosamente</p>
              </div>

              {/* Order details */}
              <div style={{ padding: '20px 24px 24px' }}>
                {/* Order number */}
                <div style={{
                  textAlign: 'center', marginBottom: 20,
                  padding: '10px', backgroundColor: '#f0fdf4',
                  borderRadius: 8, border: '1px solid #bbf7d0',
                }}>
                  <span style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>N° DE PEDIDO</span>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#15803d', letterSpacing: '1px' }}>{orderNum}</div>
                </div>

                {/* Detail rows */}
                {[
                  { icon: '👕', label: 'Producto',  value: effName },
                  { icon: '📐', label: 'Talla',     value: effItems && effItems.length > 1 ? effItems.map(i => i.size).join(', ') : sizeLabel },
                  { icon: '📦', label: 'Cantidad',  value: `${effQty} unidad${effQty > 1 ? 'es' : ''}` },
                  { icon: '🛵', label: 'Entrega', value: entrega === 'delivery' ? `Delivery${distrito ? ` a ${distrito}` : ''}` : 'Recojo en tienda' },
                  { icon: '⏱', label: 'Tiempo estimado', value: deliveryTime },
                  { icon: '💳', label: 'Método de pago', value: pago === 'plin' ? 'Plin' : pago === 'yape' ? 'Yape' : pago === 'tarjeta' ? 'Tarjeta débito/crédito' : 'Contra entrega' },
                  { icon: '💰', label: 'Total pagado', value: totalPrice },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0', borderBottom: '1px solid #f0f0f0',
                    fontSize: 13,
                  }}>
                    <span style={{ color: '#666666', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {icon} {label}
                    </span>
                    <span style={{ fontWeight: 600, color: C.black }}>{value}</span>
                  </div>
                ))}

                {/* Timeline */}
                <div style={{ marginTop: 18, marginBottom: 20, padding: '14px', backgroundColor: '#f8f8f8', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#888888', letterSpacing: '0.8px', marginBottom: 12 }}>
                    ESTADO DEL PEDIDO
                  </div>
                  {(effConfeccion ? [
                    { done: true,  label: 'Pago confirmado',         sub: 'Hace un momento' },
                    { done: true,  label: 'Solicitud en confección',  sub: 'Patronaje iniciado' },
                    { done: false, label: 'En confección artesanal',  sub: '5–7 días hábiles' },
                    { done: false, label: 'Preparando envío',         sub: 'Control de calidad' },
                    { done: false, label: 'Enviado a domicilio',      sub: `Express${distrito ? ` a ${distrito}` : ''}` },
                  ] : [
                    { done: true,  label: 'Pago confirmado',    sub: 'Hace un momento' },
                    { done: true,  label: 'Pedido registrado',  sub: 'En preparación' },
                    { done: false, label: entrega === 'delivery' ? 'En camino a tu dirección' : 'Listo para recoger', sub: entrega === 'delivery' ? '1–3 días hábiles' : '24–48h' },
                  ]).map(({ done, label, sub }, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < arr.length - 1 ? 10 : 0 }}>
                      {/* Dot + connector */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                          backgroundColor: done ? '#16a34a' : '#e5e7eb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10,
                        }}>
                          {done ? <span style={{ color: '#ffffff' }}>✓</span> : <span style={{ color: '#9ca3af', fontSize: 8 }}>●</span>}
                        </div>
                        {i < arr.length - 1 && (
                          <div style={{ width: 2, height: 18, backgroundColor: done ? '#16a34a' : '#e5e7eb', marginTop: 2 }} />
                        )}
                      </div>
                      <div style={{ paddingTop: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: done ? 600 : 400, color: done ? C.black : '#9ca3af' }}>{label}</div>
                        <div style={{ fontSize: 10, color: '#aaaaaa' }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{
                    width: '100%', height: 50,
                    backgroundColor: C.black, color: '#ffffff',
                    border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.5px',
                  }}
                >
                  VOLVER A LA TIENDA
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
