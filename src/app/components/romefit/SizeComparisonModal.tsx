import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { C, SizeName, SIZE_DATA, SIZES } from './tokens';
import { useResponsive } from '../../hooks/useResponsive';
import { Mannequin3D } from './Mannequin3D';

interface SizeComparisonModalProps {
  open: boolean;
  onClose: () => void;
  currentSize: SizeName;
  shirtColor?: string;
}

export function SizeComparisonModal({ open, onClose, currentSize, shirtColor = '#ffffff' }: SizeComparisonModalProps) {
  const { isMobile } = useResponsive();

  if (!open) return null;

  // Get the index of current size
  const currentIdx = SIZES.indexOf(currentSize);

  // Show 3 sizes: one before, current, one after
  const displaySizes: SizeName[] = [
    SIZES[Math.max(0, currentIdx - 1)],
    currentSize,
    SIZES[Math.min(SIZES.length - 1, currentIdx + 1)],
  ];

  function getFitLabel(size: SizeName, isCurrent: boolean): { label: string; color: string } {
    if (isCurrent) return { label: 'TU TALLA', color: '#22c55e' };

    const idx = SIZES.indexOf(size);
    const currIdx = SIZES.indexOf(currentSize);

    if (idx < currIdx) return { label: 'Demasiado justo', color: '#ef4444' };
    return { label: 'Muy holgado', color: '#f59e0b' };
  }

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
        padding: isMobile ? '16px' : '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          width: '100%',
          maxWidth: isMobile ? '100%' : 900,
          maxHeight: isMobile ? '90vh' : '85vh',
          overflowY: 'auto',
          boxShadow: '0 28px 90px rgba(0,0,0,0.35)',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          padding: isMobile ? '24px 16px' : '32px 28px',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 20,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#999999',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Title */}
        <h2 style={{
          fontSize: isMobile ? 20 : 24,
          fontWeight: 700,
          color: C.black,
          textAlign: 'center',
          margin: '0 0 8px',
        }}>
          Comparar Tallas en Esta Prenda
        </h2>
        <p style={{
          fontSize: isMobile ? 12 : 13,
          color: C.gray,
          textAlign: 'center',
          margin: '0 0 28px',
          lineHeight: 1.5,
        }}>
          Compara cómo te quedarían diferentes tallas basándote en las medidas de la prenda
        </p>

        {/* Size comparison grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 20,
          marginBottom: 24,
        }}>
          {displaySizes.map((size) => {
            const isCurrent = size === currentSize;
            const data = SIZE_DATA[size];
            const fitInfo = getFitLabel(size, isCurrent);

            return (
              <div
                key={size}
                style={{
                  backgroundColor: isCurrent ? '#f0fdf4' : '#f9fafb',
                  border: `2px solid ${isCurrent ? '#22c55e' : C.border}`,
                  borderRadius: 12,
                  padding: isMobile ? '16px 14px' : '20px 18px',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.2s',
                }}
              >
                {/* Badge */}
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#22c55e',
                    color: C.white,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    padding: '4px 12px',
                    borderRadius: 12,
                  }}>
                    RECOMENDADA
                  </div>
                )}

                {/* Size name */}
                <div style={{
                  fontSize: isMobile ? 40 : 48,
                  fontWeight: 800,
                  fontStyle: 'italic',
                  color: isCurrent ? '#166534' : C.black,
                  lineHeight: 1,
                  marginBottom: 12,
                }}>
                  {size}
                </div>

                {/* Mannequin preview */}
                <div style={{
                  backgroundColor: isCurrent ? '#dcfce7' : '#e5e7eb',
                  borderRadius: 8,
                  padding: '16px 0',
                  marginBottom: 14,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <div style={{ width: isMobile ? 70 : 90, height: isMobile ? 120 : 150 }}>
                    <Mannequin3D size={size} shirtColor={shirtColor} interactive={false} className="w-full h-full" />
                  </div>
                </div>

                {/* Fit label */}
                <div style={{
                  backgroundColor: isCurrent ? '#dcfce7' : '#ffffff',
                  border: `1px solid ${fitInfo.color}`,
                  borderRadius: 6,
                  padding: '6px 10px',
                  marginBottom: 14,
                }}>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: fitInfo.color,
                    letterSpacing: '0.5px',
                  }}>
                    {fitInfo.label}
                  </div>
                </div>

                {/* Medidas clave */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  textAlign: 'left',
                }}>
                  {[
                    { label: 'Pecho', value: `${data.ancho} cm`, icon: '↔️' },
                    { label: 'Largo', value: `${data.largo} cm`, icon: '↕️' },
                    { label: 'Hombro', value: `${data.hombro} cm`, icon: '📐' },
                  ].map((m) => (
                    <div
                      key={m.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 12,
                        color: C.gray,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 13 }}>{m.icon}</span>
                        {m.label}
                      </span>
                      <strong style={{ color: C.black, fontSize: 13 }}>{m.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: 8,
          padding: isMobile ? '14px 16px' : '16px 18px',
          marginBottom: 20,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#0369a1',
                marginBottom: 4,
              }}>
                Consejo de experto
              </div>
              <p style={{
                fontSize: 12,
                color: '#0c4a6e',
                margin: 0,
                lineHeight: 1.5,
              }}>
                Si estás entre dos tallas, elige la más grande si prefieres un ajuste oversize, o la más pequeña para un look más ajustado. Todas nuestras prendas están hechas con tela de alta calidad que mantiene su forma después de varios lavados.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: 50,
            backgroundColor: C.black,
            color: C.white,
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.5px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          ENTENDIDO
        </button>
      </motion.div>
    </div>
  );
}
