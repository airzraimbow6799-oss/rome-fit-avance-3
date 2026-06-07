import React, { useState, useEffect } from 'react';
import { C, SizeName } from '../components/romefit/tokens';
import { Header } from '../components/romefit/Header';
import { useResponsive } from '../hooks/useResponsive';
import { motion, AnimatePresence } from 'motion/react';

interface ProfilePageProps {
  accessibleMode?: boolean;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onGoToProfile?: () => void;
  onProductSelect?: (productId: string) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  orders?: Order[];
}

interface SavedMeasures {
  altura: string;
  peso: string;
  pecho: string;
  complexion: string;
  fitStyle: string;
}

interface RecommendationHistory {
  id: string;
  productName: string;
  recommendedSize: SizeName;
  date: string;
}

interface BrandReference {
  brand: string;
  size: SizeName;
}

interface Order {
  id: string;
  orderNum: string;
  date: string;
  productName: string;
  size: SizeName;
  quantity: number;
  price: string;
  isCustom: boolean;
  customLabel?: string;
  wizardInfo?: { fitStyle?: string; complexion?: string; altura?: string; peso?: string; pecho?: string };
  status: 'paid' | 'processing' | 'crafting' | 'shipping' | 'delivered';
  trackingSteps: TrackingStep[];
}

interface TrackingStep {
  label: string;
  sublabel: string;
  completed: boolean;
}

type TabView = 'recomendaciones' | 'marcas' | 'pedidos';

const BRAND_COLOR = '#C00000';
const BRAND_DARK = '#8B0000';

export function ProfilePage({
  accessibleMode = false,
  isLoggedIn,
  userEmail,
  onLoginClick,
  onLogout,
  onGoToProfile,
  onProductSelect,
  cartItemCount,
  onCartClick,
  orders = []
}: ProfilePageProps) {
  const { isMobile, isTablet } = useResponsive();
  const [isEditingMeasures, setIsEditingMeasures] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>('recomendaciones');

  const [userName] = useState('Carlos Mendoza');
  const [savedMeasures, setSavedMeasures] = useState<SavedMeasures>({
    altura: '175',
    peso: '70',
    pecho: '95',
    complexion: 'Atlético',
    fitStyle: 'Oversize Moderado',
  });

  // Derived from orders prop — updates automatically when orders change
  const recommendationHistory: RecommendationHistory[] = orders.map((order) => ({
    id: order.id,
    productName: order.productName,
    recommendedSize: order.size,
    date: order.date,
  }));

  // Auto-fill measures from first custom order's wizard data
  useEffect(() => {
    const firstCustom = orders.find(o => o.isCustom && o.wizardInfo);
    if (!firstCustom?.wizardInfo) return;
    const w = firstCustom.wizardInfo;
    setSavedMeasures(prev => ({
      altura:     w.altura     || prev.altura,
      peso:       w.peso       || prev.peso,
      pecho:      w.pecho      || prev.pecho,
      complexion: w.complexion || prev.complexion,
      fitStyle:   w.fitStyle   || prev.fitStyle,
    }));
  }, [orders]);

  const [votes, setVotes] = useState<Record<string, 'yes' | 'no'>>({});
  const [voteToast, setVoteToast] = useState<{ id: string; msg: string } | null>(null);
  const voteTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Extract unique brands from orders
  const brandReferences: BrandReference[] = orders.length > 0
    ? Array.from(new Set(orders.map(o => o.productName.split(' ')[0]))).map((brand, idx) => ({
        brand,
        size: orders.find(o => o.productName.startsWith(brand))?.size ?? 'M',
      }))
    : [];

  function handleVote(id: string, vote: 'yes' | 'no') {
    setVotes((prev) => {
      if (prev[id] === vote) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: vote };
    });
    const msg = vote === 'yes' ? '✓ Talla fue correcta' : '✓ Talla no fue correcta';
    setVoteToast({ id, msg });
    if (voteTimerRef.current) clearTimeout(voteTimerRef.current);
    voteTimerRef.current = setTimeout(() => setVoteToast(null), 2000);
  }

  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
  const contentPad = isMobile ? '0 16px 100px' : isTablet ? '0 24px 80px' : '0 40px 80px';

  const tabs: { id: TabView; label: string; icon: string; count: number }[] = [
    { id: 'recomendaciones', label: 'Recomendaciones', icon: '🧾', count: recommendationHistory.length },
    { id: 'marcas', label: 'Marcas guardadas', icon: '🏷️', count: brandReferences.length },
    { id: 'pedidos', label: 'Pedidos', icon: '📦', count: orders.length },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: '#0f0f0f' }}>
      <Header
        onLogoClick={() => onProductSelect?.('home')}
        onLoginClick={() => onLoginClick?.()}
        onCartClick={() => onCartClick?.()}
        cartItemCount={cartItemCount ?? 0}
        isLoggedIn={isLoggedIn ?? false}
        userEmail={userEmail ?? ''}
        onGoToProfile={() => onGoToProfile?.()}
        onLogout={onLogout}
        onProductSelect={(id) => onProductSelect?.(id)}
      />

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0000 0%, #2d0000 40%, #0f0f0f 100%)',
        borderBottom: `1px solid ${BRAND_DARK}40`,
        padding: isMobile ? '32px 16px 28px' : '44px 40px 36px',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 24 }}>
          {/* Avatar */}
          <div style={{
            width: isMobile ? 72 : 92,
            height: isMobile ? 72 : 92,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${BRAND_COLOR}, ${BRAND_DARK})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? 26 : 34,
            fontWeight: 800,
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: `0 0 0 3px ${BRAND_DARK}60, 0 8px 32px rgba(192,0,0,0.35)`,
            letterSpacing: '-1px',
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND_COLOR, letterSpacing: '2px', marginBottom: 6, textTransform: 'uppercase' }}>
              Mi Perfil
            </div>
            <h1 style={{ fontSize: isMobile ? 22 : 30, fontWeight: 800, color: '#ffffff', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              {userName}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, fontWeight: 400 }}>
              Miembro desde Abril 2026 · {userEmail || 'carlos@romefit.pe'}
            </p>
          </div>
          {/* Member badge */}
          <div style={{
            padding: '8px 14px',
            background: `${BRAND_COLOR}18`,
            border: `1px solid ${BRAND_COLOR}40`,
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            color: BRAND_COLOR,
            letterSpacing: '0.5px',
            flexShrink: 0,
            display: isMobile ? 'none' : 'block',
          }}>
            PREMIUM
          </div>
        </div>
      </div>

      {/* Stats strip with tabs */}
      <div style={{
        backgroundColor: '#161616',
        borderBottom: '1px solid #1f1f1f',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: isMobile ? '16px 12px' : '20px 24px',
                textAlign: 'center',
                backgroundColor: activeTab === tab.id ? `${BRAND_COLOR}10` : 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: i < 2 ? '1px solid #1f1f1f' : 'none',
                borderBottom: activeTab === tab.id ? `3px solid ${BRAND_COLOR}` : '3px solid transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: activeTab === tab.id ? BRAND_COLOR : '#ffffff', letterSpacing: '-0.5px' }}>
                {tab.count}
              </div>
              <div style={{ fontSize: 11, color: activeTab === tab.id ? BRAND_COLOR : 'rgba(255,255,255,0.35)', fontWeight: 500, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: contentPad }}>

        {/* Section: Medidas */}
        <div style={{ marginTop: 28, marginBottom: 20 }}>
          <div style={{
            background: '#161616',
            borderRadius: 16,
            border: '1px solid #1f1f1f',
            overflow: 'hidden',
          }}>
            {/* Section header */}
            <div style={{
              padding: isMobile ? '16px 18px' : '20px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #1f1f1f',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `${BRAND_COLOR}18`,
                  border: `1px solid ${BRAND_COLOR}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                }}>
                  📏
                </div>
                <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px' }}>
                  Mis Medidas
                </span>
              </div>
              <button
                onClick={() => setIsEditingMeasures(!isEditingMeasures)}
                style={{
                  backgroundColor: isEditingMeasures ? '#16a34a' : BRAND_COLOR,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 18px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                  transition: 'opacity 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {isEditingMeasures ? '✓ Guardar' : 'Actualizar'}
              </button>
            </div>

            {/* Measures grid */}
            <div style={{ padding: isMobile ? '16px 18px' : '22px 28px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
                gap: 12,
                marginBottom: 12,
              }}>
                {[
                  { label: 'Altura', key: 'altura', value: savedMeasures.altura, unit: 'cm' },
                  { label: 'Peso', key: 'peso', value: savedMeasures.peso, unit: 'kg' },
                  { label: 'Pecho', key: 'pecho', value: savedMeasures.pecho, unit: 'cm' },
                ].map((m) => (
                  <div key={m.key} style={{
                    padding: '14px 16px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: 10,
                    border: '1px solid #242424',
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                      {m.label}
                    </div>
                    {isEditingMeasures ? (
                      <input
                        type="number"
                        value={m.value}
                        onChange={(e) => setSavedMeasures(prev => ({ ...prev, [m.key]: e.target.value }))}
                        style={{
                          width: '100%',
                          backgroundColor: '#111',
                          border: `1.5px solid ${BRAND_COLOR}60`,
                          borderRadius: 6,
                          padding: '6px 10px',
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#ffffff',
                          outline: 'none',
                          fontFamily: 'Inter, sans-serif',
                          boxSizing: 'border-box',
                        }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>{m.value}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>{m.unit}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Complexion + Fit */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div style={{
                  padding: '14px 16px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: 10,
                  border: '1px solid #242424',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                    Complexión
                  </div>
                  {isEditingMeasures ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['Delgado', 'Regular', 'Atlético', 'Robusto'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSavedMeasures(prev => ({ ...prev, complexion: opt }))}
                          style={{
                            padding: '5px 10px',
                            border: `1.5px solid ${savedMeasures.complexion === opt ? BRAND_COLOR : '#333'}`,
                            borderRadius: 6,
                            backgroundColor: savedMeasures.complexion === opt ? `${BRAND_COLOR}25` : 'transparent',
                            color: savedMeasures.complexion === opt ? '#ffffff' : 'rgba(255,255,255,0.5)',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            transition: 'all 0.15s',
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{savedMeasures.complexion || '—'}</span>
                  )}
                </div>

                <div style={{
                  padding: '14px 16px',
                  backgroundColor: `${BRAND_COLOR}12`,
                  borderRadius: 10,
                  border: `1px solid ${BRAND_COLOR}30`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: BRAND_COLOR, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
                    Preferencia de ajuste
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{savedMeasures.fitStyle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tab: Recomendaciones */}
            {activeTab === 'recomendaciones' && (
              <div style={{ marginBottom: 20 }}>
                {recommendationHistory.length === 0 ? (
                  <div style={{
                    background: '#161616',
                    borderRadius: 16,
                    border: '1px solid #1f1f1f',
                    padding: '60px 20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                      No hay recomendaciones aún
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                      Realiza tu primera compra para ver tus recomendaciones de tallas
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#161616',
                    borderRadius: 16,
                    border: '1px solid #1f1f1f',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: isMobile ? '16px 18px' : '20px 28px',
                      borderBottom: '1px solid #1f1f1f',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${BRAND_COLOR}18`,
                        border: `1px solid ${BRAND_COLOR}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 15,
                      }}>
                        🧾
                      </div>
                      <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px' }}>
                        Historial de Recomendaciones
                      </span>
                    </div>

                    <div style={{ padding: isMobile ? '12px 18px 18px' : '16px 28px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {recommendationHistory.map((item, idx) => {
                          const voted = votes[item.id] ?? null;
                          const toastVisible = voteToast?.id === item.id;
                          return (
                            <div key={item.id} style={{
                              padding: isMobile ? '12px 14px' : '14px 18px',
                              backgroundColor: '#1a1a1a',
                              borderRadius: 10,
                              border: '1px solid #242424',
                              display: 'flex',
                              flexDirection: isMobile ? 'column' : 'row',
                              justifyContent: 'space-between',
                              alignItems: isMobile ? 'flex-start' : 'center',
                              gap: isMobile ? 10 : 0,
                              borderLeft: `3px solid ${idx === 0 ? BRAND_COLOR : '#242424'}`,
                            }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 3 }}>
                                  {item.productName}
                                </div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 8, alignItems: 'center' }}>
                                  <span style={{
                                    backgroundColor: `${BRAND_COLOR}20`,
                                    color: BRAND_COLOR,
                                    borderRadius: 4,
                                    padding: '2px 7px',
                                    fontSize: 11,
                                    fontWeight: 800,
                                  }}>
                                    {item.recommendedSize}
                                  </span>
                                  <span>{item.date}</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center', position: 'relative' }}>
                                {toastVisible && voteToast && (
                                  <div style={{
                                    position: 'absolute',
                                    bottom: 'calc(100% + 6px)',
                                    right: 0,
                                    backgroundColor: '#1a1a1a',
                                    color: '#ffffff',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    padding: '6px 12px',
                                    borderRadius: 8,
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    border: '1px solid #333',
                                    pointerEvents: 'none',
                                    zIndex: 10,
                                  }}>
                                    {voteToast.msg}
                                  </div>
                                )}
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginRight: 4 }}>¿Correcta?</span>
                                <button
                                  onClick={() => handleVote(item.id, 'yes')}
                                  title="Sí, fue correcta"
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 8,
                                    border: `1.5px solid ${voted === 'yes' ? '#22c55e' : '#333'}`,
                                    backgroundColor: voted === 'yes' ? '#14532d' : 'transparent',
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.15s',
                                    transform: voted === 'yes' ? 'scale(1.08)' : 'scale(1)',
                                  }}
                                >👍</button>
                                <button
                                  onClick={() => handleVote(item.id, 'no')}
                                  title="No, no fue correcta"
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 8,
                                    border: `1.5px solid ${voted === 'no' ? '#ef4444' : '#333'}`,
                                    backgroundColor: voted === 'no' ? '#450a0a' : 'transparent',
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.15s',
                                    transform: voted === 'no' ? 'scale(1.08)' : 'scale(1)',
                                  }}
                                >👎</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Marcas guardadas */}
            {activeTab === 'marcas' && (
              <div style={{ marginBottom: 20 }}>
                {brandReferences.length === 0 ? (
                  <div style={{
                    background: '#161616',
                    borderRadius: 16,
                    border: '1px solid #1f1f1f',
                    padding: '60px 20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🏷️</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                      No hay marcas guardadas
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                      Las marcas se agregarán automáticamente según tus compras
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#161616',
                    borderRadius: 16,
                    border: '1px solid #1f1f1f',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      padding: isMobile ? '16px 18px' : '20px 28px',
                      borderBottom: '1px solid #1f1f1f',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: `${BRAND_COLOR}18`,
                          border: `1px solid ${BRAND_COLOR}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                        }}>
                          🏷️
                        </div>
                        <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.2px' }}>
                          Marcas de Referencia
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: isMobile ? '12px 18px 18px' : '16px 28px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {brandReferences.map((ref, i) => (
                          <div key={i} style={{
                            padding: '12px 16px',
                            backgroundColor: '#1a1a1a',
                            borderRadius: 10,
                            border: '1px solid #242424',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #222, #1a1a1a)',
                                border: '1px solid #2f2f2f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                              }}>
                                👕
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>{ref.brand}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                                  Talla habitual:{' '}
                                  <span style={{
                                    backgroundColor: `${BRAND_COLOR}20`,
                                    color: BRAND_COLOR,
                                    borderRadius: 4,
                                    padding: '1px 6px',
                                    fontWeight: 800,
                                    fontSize: 11,
                                  }}>{ref.size}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Pedidos */}
            {activeTab === 'pedidos' && (
              <div style={{ marginBottom: 20 }}>
                {orders.length === 0 ? (
                  <div style={{
                    background: '#161616',
                    borderRadius: 16,
                    border: '1px solid #1f1f1f',
                    padding: '60px 20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                      No hay pedidos aún
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                      Realiza tu primera compra para ver el seguimiento aquí
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.map((order) => (
                      <div key={order.id} style={{
                        background: '#161616',
                        borderRadius: 16,
                        border: '1px solid #1f1f1f',
                        overflow: 'hidden',
                      }}>
                        {/* Order header */}
                        <div style={{
                          padding: isMobile ? '16px 18px' : '20px 28px',
                          borderBottom: '1px solid #1f1f1f',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: 12,
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: '#ffffff' }}>
                                {order.productName}
                              </span>
                              {order.isCustom && (
                                <span style={{
                                  backgroundColor: '#111',
                                  color: '#fff',
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: '3px 8px',
                                  borderRadius: 10,
                                  letterSpacing: '0.5px',
                                }}>
                                  ✂ ARTESANAL
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                              Pedido {order.orderNum} · {order.date}
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                              Talla <strong style={{ color: BRAND_COLOR }}>{order.size}</strong> · Cant. {order.quantity} · {order.price}
                            </div>
                          </div>
                        </div>

                        {/* Tracking timeline */}
                        <div style={{ padding: isMobile ? '16px 18px 20px' : '20px 28px 24px' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
                            SEGUIMIENTO DEL PEDIDO
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {order.trackingSteps.map((step, idx, arr) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                {/* Timeline dot + connector */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                  <div style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    backgroundColor: step.completed ? BRAND_COLOR : '#242424',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 11,
                                    boxShadow: step.completed ? `0 0 0 3px ${BRAND_COLOR}20` : 'none',
                                  }}>
                                    {step.completed ? <span style={{ color: '#ffffff' }}>✓</span> : <span style={{ color: '#555', fontSize: 8 }}>●</span>}
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div style={{
                                      width: 2,
                                      height: 28,
                                      backgroundColor: step.completed ? BRAND_COLOR : '#242424',
                                      marginTop: 2,
                                    }} />
                                  )}
                                </div>
                                {/* Step info */}
                                <div style={{ paddingTop: 2, flex: 1 }}>
                                  <div style={{
                                    fontSize: 14,
                                    fontWeight: step.completed ? 600 : 400,
                                    color: step.completed ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                    marginBottom: 2,
                                  }}>
                                    {step.label}
                                  </div>
                                  <div style={{ fontSize: 11, color: step.completed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)' }}>
                                    {step.sublabel}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
