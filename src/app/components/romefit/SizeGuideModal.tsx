import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { C, SIZE_DATA, SIZES } from './tokens';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  onOpenWizard: () => void;
}

export function SizeGuideModal({ open, onClose, onOpenWizard }: SizeGuideModalProps) {
  if (!open) return null;

  const columns = ['Talla', 'Ancho (Pecho)', 'Largo', 'Ajuste'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: C.white,
              borderRadius: 12,
              width: '100%',
              maxWidth: 540,
              boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
              overflow: 'hidden',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* ── Header ── */}
            <div style={{ padding: '28px 32px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: C.black,
                      margin: '0 0 6px',
                      lineHeight: 1.2,
                    }}
                  >
                    Guía de Tallas
                  </h2>
                  <p style={{ fontSize: 13, color: C.gray, margin: 0, lineHeight: 1.5 }}>
                    Consulta las medidas exactas de nuestras tallas estándar.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 20,
                    color: C.gray,
                    cursor: 'pointer',
                    lineHeight: 1,
                    padding: '2px 4px',
                    marginLeft: 16,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* ── Table ── */}
            <div style={{ padding: '0 32px' }}>
              <div
                style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr',
                    borderBottom: `1px solid ${C.border}`,
                    backgroundColor: '#fafafa',
                  }}
                >
                  {columns.map((col) => (
                    <div
                      key={col}
                      style={{
                        padding: '11px 16px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: C.black,
                        letterSpacing: '0.1px',
                      }}
                    >
                      {col}
                    </div>
                  ))}
                </div>

                {/* Table rows */}
                {SIZES.map((size, idx) => {
                  const d = SIZE_DATA[size];
                  const isDefault = size === 'M';
                  const isLast = idx === SIZES.length - 1;

                  return (
                    <div
                      key={size}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr',
                        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
                        backgroundColor: isDefault ? '#f8f8f8' : C.white,
                        transition: 'background 0.1s',
                      }}
                    >
                      {/* Talla */}
                      <div
                        style={{
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isDefault ? 700 : 500,
                            color: C.black,
                          }}
                        >
                          {size}
                          {isDefault && (
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color: C.gray,
                                marginLeft: 4,
                              }}
                            >
                              (Predeterminada)
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Ancho (Pecho) */}
                      <div
                        style={{
                          padding: '14px 16px',
                          fontSize: 13,
                          fontWeight: isDefault ? 600 : 400,
                          color: C.black,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {d.ancho} cm
                      </div>

                      {/* Largo */}
                      <div
                        style={{
                          padding: '14px 16px',
                          fontSize: 13,
                          fontWeight: isDefault ? 600 : 400,
                          color: C.black,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {d.largo} cm
                      </div>

                      {/* Ajuste */}
                      <div
                        style={{
                          padding: '14px 16px',
                          fontSize: 13,
                          fontWeight: isDefault ? 600 : 400,
                          color: C.black,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {d.holgura}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Custom CTA ── */}
            <div style={{ padding: '20px 32px 28px' }}>
              <div
                style={{
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
                  }}
                >
                  ¿No encuentras una talla que se adapte perfectamente a ti?
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWizard();
                  }}
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
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <span style={{ fontSize: 15 }}>🔧</span>
                  Crear talla Personalizada
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
