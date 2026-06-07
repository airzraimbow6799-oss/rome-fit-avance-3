import React, { useState } from 'react';
import { C, SizeName } from './components/romefit/tokens';
import { ProductPage } from './pages/ProductPage';
import { ProfilePage } from './pages/ProfilePage';
import { HomePage } from './pages/HomePage';
import { AccessibleView } from './components/romefit/AccessibleView';
import { LoginModal } from './components/romefit/LoginModal';
import { CheckoutModal } from './components/romefit/CheckoutModal';
import { useResponsive } from './hooks/useResponsive';

type ActivePage = 'home' | 'product' | 'profile';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  size: SizeName;
  quantity: number;
  customLabel?: string;
  wizardInfo?: { fitStyle?: string; complexion?: string; altura?: string; peso?: string; pecho?: string };
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

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [accessibleMode, setAccessibleMode] = useState(false);
  const [accModalOpen, setAccModalOpen] = useState(false);
  const [accBannerVisible, setAccBannerVisible] = useState(true);
  // When "Calcular Talla" is clicked, navigate to product and auto-open wizard
  const [autoOpenWizard, setAutoOpenWizard] = useState(false);
  const [accTooltipVisible, setAccTooltipVisible] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const { isMobile } = useResponsive();

  // ── Global auth & cart state ──
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('essential-regular');

  function handleAccButtonClick() {
    if (accessibleMode) {
      setAccessibleMode(false);
      setAccBannerVisible(true);
    } else {
      setAccModalOpen(true);
    }
  }

  function handleAccActivate() {
    setAccessibleMode(true);
    setAccModalOpen(false);
    setAccBannerVisible(true);
  }

  function handleNavClick(id: string) {
    if (id === 'calcular') {
      setActivePage('product');
      setAutoOpenWizard(true);
    } else {
      setActivePage(id as ActivePage);
    }
  }

  function handleLoginSuccess(email: string) {
    setIsLoggedIn(true);
    setUserEmail(email);
    setLoginModalOpen(false);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserEmail('');
    setCart([]);
  }

  function addToCart(item: CartItem) {
    setCart(prev => {
      const key = (i: CartItem) => `${i.id}|${i.size}|${i.customLabel || ''}`;
      const existing = prev.find(i => key(i) === key(item));
      if (existing) {
        return prev.map(i => key(i) === key(item) ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  }

  function addToCartAndOpen(item: CartItem) {
    setCart(prev => {
      const key = (i: CartItem) => `${i.id}|${i.size}|${i.customLabel || ''}`;
      const existing = prev.find(i => key(i) === key(item));
      if (existing) {
        return prev.map(i => key(i) === key(item) ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    setCartModalOpen(true);
  }

  function removeFromCart(id: string, size: SizeName, customLabel?: string) {
    setCart(prev => prev.filter(i => !(i.id === id && i.size === size && (i.customLabel || '') === (customLabel || ''))));
  }

  function updateCartQuantity(id: string, size: SizeName, quantity: number, customLabel?: string) {
    if (quantity <= 0) {
      removeFromCart(id, size, customLabel);
    } else {
      setCart(prev => prev.map(i =>
        i.id === id && i.size === size && (i.customLabel || '') === (customLabel || '') ? { ...i, quantity } : i
      ));
    }
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const NAV_ITEMS: { id: string; label: string; icon: string }[] = [
    { id: 'home',     label: 'Inicio',         icon: '🏠' },
    { id: 'calcular', label: 'Calcular Talla',  icon: '📏' },
    { id: 'profile',  label: 'Mi Perfil',       icon: '👤' },
  ];

  // ── Accessible mode: render completely separate accessible UI ──
  if (accessibleMode) {
    return (
      <AccessibleView onDisable={() => setAccessibleMode(false)} />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: isMobile ? 72 : 80,
      backgroundColor: undefined,
    }}>
      {/* ── Accessibility banner (top of page when mode is ON) ── */}
      {accessibleMode && accBannerVisible && (
        <div style={{
          backgroundColor: '#C8E6C9',
          fontSize: 12,
          fontWeight: 600,
          color: '#1B5E20',
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          position: 'sticky',
          top: 0,
          zIndex: 10002,
          letterSpacing: '0.2px',
        }}>
          ✓ Modo Accesible Activado — Mayor contraste y tamaño de texto habilitados
          <button
            onClick={() => setAccBannerVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1B5E20',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Accessibility toggle (top right corner) ── */}
      <div
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 10001 }}
        onMouseEnter={() => {
          const t = setTimeout(() => setAccTooltipVisible(true), 800);
          setTooltipTimer(t);
        }}
        onMouseLeave={() => {
          if (tooltipTimer) clearTimeout(tooltipTimer);
          setAccTooltipVisible(false);
        }}
      >
        <button
          onClick={handleAccButtonClick}
          style={{
            minWidth: 44,
            minHeight: 44,
            backgroundColor: accessibleMode ? '#000000' : '#4CAF50',
            color: '#ffffff',
            border: `2px solid ${accessibleMode ? '#000000' : '#2E7D32'}`,
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            letterSpacing: '0.5px',
            transition: 'background-color 0.2s, border-color 0.2s',
          }}
          aria-label={accessibleMode ? 'Desactivar modo accesible' : 'Activar modo accesible'}
        >
          <span style={{ fontSize: 18 }}>♿</span>
          {accessibleMode ? '✓ ON' : ''}
        </button>

        {/* Tooltip */}
        {accTooltipVisible && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 6,
            backgroundColor: '#000000',
            color: '#ffffff',
            fontSize: 12,
            padding: '6px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}>
            {accessibleMode ? 'Desactivar modo accesible' : 'Activar modo accesible'}
          </div>
        )}
      </div>

      {/* ── Accessibility confirmation modal (Problem 7) ── */}
      {accModalOpen && (
        <div
          onClick={() => setAccModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20000,
            backdropFilter: 'blur(4px)',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              maxWidth: 380,
              width: '100%',
              padding: '32px 28px 28px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}
          >
            {/* Icon */}
            <div style={{ fontSize: 44, marginBottom: 14, lineHeight: 1 }}>♿</div>

            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#000000',
              margin: '0 0 12px',
            }}>
              Activar Modo Accesible
            </h3>
            <p style={{
              fontSize: 14,
              color: '#444444',
              margin: '0 0 28px',
              lineHeight: 1.6,
            }}>
              Aumenta el contraste, el tamaño del texto y la compatibilidad con lectores de pantalla.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setAccModalOpen(false)}
                style={{
                  flex: 1,
                  height: 44,
                  backgroundColor: 'transparent',
                  color: '#666666',
                  border: '2px solid #999999',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAccActivate}
                style={{
                  flex: 1,
                  height: 44,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.3px',
                }}
              >
                Activar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation Bar (Mobile) ── */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9998,
            backgroundColor: accessibleMode ? '#000000' : '#ffffff',
            borderTop: `${accessibleMode ? 2 : 1}px solid ${accessibleMode ? '#333333' : C.border}`,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: `${accessibleMode ? 10 : 8}px 0 12px`,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === 'calcular'
              ? activePage === 'product'
              : activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: accessibleMode ? '8px 14px' : '6px 12px',
                  fontFamily: 'Inter, sans-serif',
                  minHeight: accessibleMode ? 52 : 44,
                }}
              >
                <span style={{
                  fontSize: accessibleMode ? 26 : 22,
                  filter: isActive ? 'none' : 'grayscale(1) opacity(0.5)',
                  transition: 'filter 0.2s',
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize: accessibleMode ? 12 : 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? (accessibleMode ? '#ffffff' : C.black)
                    : (accessibleMode ? '#aaaaaa' : C.gray),
                  letterSpacing: '0.3px',
                }}>
                  {item.label}
                </span>
                {/* Active indicator dot */}
                {isActive && (
                  <div style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: accessibleMode ? '#ffffff' : C.red,
                    marginTop: -2,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Prototype Nav Bar (Desktop) ── */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: accessibleMode ? '#000000' : 'rgba(15,15,15,0.92)',
            backdropFilter: accessibleMode ? 'none' : 'blur(12px)',
            borderRadius: 40,
            display: 'flex',
            gap: 2,
            padding: '6px 8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            border: `1px solid ${accessibleMode ? '#333333' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === 'calcular'
              ? activePage === 'product'
              : activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  padding: accessibleMode ? '10px 22px' : '8px 18px',
                  borderRadius: 32,
                  border: 'none',
                  backgroundColor: isActive ? C.white : 'transparent',
                  color: isActive ? C.black : 'rgba(255,255,255,0.6)',
                  fontSize: accessibleMode ? 13 : 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: accessibleMode ? 52 : 36,
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Page Content (kept mounted for instant transitions) ── */}
      <div style={{ display: activePage === 'home' ? 'block' : 'none' }}>
        <HomePage
          accessibleMode={accessibleMode}
          onStartWizard={() => { setActivePage('product'); setAutoOpenWizard(true); }}
          onGoToProfile={() => setActivePage('profile')}
          onGoToProduct={(productId) => {
            if (productId) setSelectedProductId(productId);
            setActivePage('product');
          }}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onLoginClick={() => setLoginModalOpen(true)}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          onProductSelect={(id) => {
            if (id === 'home') { setActivePage('home'); }
            else { setSelectedProductId(id); setActivePage('product'); }
          }}
          cartItemCount={cartItemCount}
          onCartClick={() => setCartModalOpen(true)}
        />
      </div>
      <div style={{ display: activePage === 'product' ? 'block' : 'none' }}>
        <ProductPage
          accessibleMode={accessibleMode}
          autoOpenWizard={autoOpenWizard}
          onWizardOpened={() => setAutoOpenWizard(false)}
          selectedProductId={selectedProductId}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onLoginClick={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
          onGoToProfile={() => setActivePage('profile')}
          onProductSelect={(id) => {
            if (id === 'home') { setActivePage('home'); }
            else { setSelectedProductId(id); setActivePage('product'); }
          }}
          cartItemCount={cartItemCount}
          onCartClick={() => setCartModalOpen(true)}
          onAddToCart={addToCart}
          onAddToCartAndOpen={addToCartAndOpen}
        />
      </div>
      <div style={{ display: activePage === 'profile' ? 'block' : 'none' }}>
        <ProfilePage
          accessibleMode={accessibleMode}
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onLoginClick={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
          onGoToProfile={() => setActivePage('profile')}
          onProductSelect={(id) => {
            if (id === 'home') { setActivePage('home'); }
            else { setSelectedProductId(id); setActivePage('product'); }
          }}
          cartItemCount={cartItemCount}
          onCartClick={() => setCartModalOpen(true)}
          orders={orders}
        />
      </div>

      {/* ── Global Login Modal ── */}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        contextHint={isLoggedIn ? 'Gestiona tu cuenta' : 'Inicia sesión para acceder a todas las funciones'}
        onSuccess={(email) => handleLoginSuccess(email || 'usuario@rome.com')}
      />

      {/* ── Cart Modal ── */}
      {cartModalOpen && (
        <div
          onClick={() => setCartModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            zIndex: 20000,
            backdropFilter: 'blur(4px)',
            padding: isMobile ? 0 : 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: C.white,
              borderRadius: isMobile ? '16px 16px 0 0' : 12,
              width: isMobile ? '100%' : 'min(520px, 90vw)',
              maxHeight: isMobile ? '85vh' : '80vh',
              overflowY: 'auto',
              boxShadow: '0 28px 90px rgba(0,0,0,0.4)',
              fontFamily: 'Inter, sans-serif',
              padding: isMobile ? '24px 20px 32px' : '32px 28px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: C.black, margin: 0 }}>
                Carrito de compras ({cartItemCount})
              </h2>
              <button
                onClick={() => setCartModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#999',
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: 4,
                }}
              >✕</button>
            </div>

            {/* Cart items */}
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: C.gray }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
                <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${item.size}-${item.customLabel || ''}-${idx}`} style={{
                      display: 'flex',
                      gap: 14,
                      padding: 14,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                    }}>
                      <img src={item.image} alt={item.name} style={{ width: 70, height: 84, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.black, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                        {item.customLabel ? (
                          <div style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: '#111', color: '#fff', borderRadius: 4, padding: '2px 7px', marginRight: 6, letterSpacing: '0.4px' }}>
                              ✂ {item.customLabel}
                            </span>
                            <span style={{ fontSize: 11, color: C.gray }}>Talla {item.size}</span>
                            {item.wizardInfo?.fitStyle && (
                              <div style={{ fontSize: 11, color: C.gray, marginTop: 3 }}>
                                Corte: <strong style={{ color: C.black }}>{item.wizardInfo.fitStyle}</strong>
                                {item.wizardInfo.complexion && <> · Complexión: <strong style={{ color: C.black }}>{item.wizardInfo.complexion}</strong></>}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: 12, color: C.gray, marginBottom: 6 }}>Talla: {item.size}</div>
                        )}
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.black }}>{item.price}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1, item.customLabel)}
                            style={{
                              width: 28,
                              height: 28,
                              border: `1px solid ${C.border}`,
                              borderRadius: 4,
                              background: 'none',
                              cursor: 'pointer',
                              fontSize: 16,
                              fontWeight: 700,
                              color: C.black,
                            }}
                          >−</button>
                          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1, item.customLabel)}
                            style={{
                              width: 28,
                              height: 28,
                              border: `1px solid ${C.border}`,
                              borderRadius: 4,
                              background: 'none',
                              cursor: 'pointer',
                              fontSize: 16,
                              fontWeight: 700,
                              color: C.black,
                            }}
                          >+</button>
                          <button
                            onClick={() => removeFromCart(item.id, item.size, item.customLabel)}
                            style={{
                              marginLeft: 'auto',
                              background: 'none',
                              border: 'none',
                              color: C.red,
                              cursor: 'pointer',
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 16,
                  marginBottom: 20,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color: C.gray }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.black }}>
                      S/. {cart.reduce((sum, item) => {
                        const price = parseFloat(item.price.replace('S/. ', ''));
                        return sum + (price * item.quantity);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, color: C.gray }}>Envío</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#22c55e' }}>Gratis</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: C.black }}>Total</span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: C.black }}>
                      S/. {cart.reduce((sum, item) => {
                        const price = parseFloat(item.price.replace('S/. ', ''));
                        return sum + (price * item.quantity);
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setCartModalOpen(false);
                      setLoginModalOpen(true);
                    } else {
                      setCartModalOpen(false);
                      setCheckoutModalOpen(true);
                    }
                  }}
                  style={{
                    width: '100%',
                    height: isMobile ? 50 : 54,
                    backgroundColor: C.black,
                    color: C.white,
                    border: 'none',
                    borderRadius: 8,
                    fontSize: isMobile ? 14 : 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {isLoggedIn ? 'PROCEDER AL PAGO' : 'INICIAR SESIÓN PARA COMPRAR'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Cart Checkout Modal ── */}
      <CheckoutModal
        open={checkoutModalOpen}
        onClose={() => {
          setCheckoutModalOpen(false);
          // Clear cart and create orders after successful checkout
          if (cart.length > 0) {
            const newOrders: Order[] = cart.map(item => {
              const orderNum = `RF-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
              const isCustom = !!item.customLabel;
              const now = new Date();
              const dateStr = `${now.getDate()} ${['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][now.getMonth()]} ${now.getFullYear()}`;

              return {
                id: `order-${Date.now()}-${Math.random()}`,
                orderNum,
                date: dateStr,
                productName: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                isCustom,
                customLabel: item.customLabel,
                wizardInfo: item.wizardInfo,
                status: 'processing' as const,
                trackingSteps: isCustom ? [
                  { label: 'Pago confirmado', sublabel: 'Hace un momento', completed: true },
                  { label: 'Solicitud en confección', sublabel: 'Patronaje iniciado', completed: true },
                  { label: 'En confección artesanal', sublabel: '5–7 días hábiles', completed: false },
                  { label: 'Preparando envío', sublabel: 'Control de calidad', completed: false },
                  { label: 'Enviado a domicilio', sublabel: 'Express', completed: false },
                ] : [
                  { label: 'Pago confirmado', sublabel: 'Hace un momento', completed: true },
                  { label: 'Pedido registrado', sublabel: 'En preparación', completed: true },
                  { label: 'En camino a tu dirección', sublabel: '1–3 días hábiles', completed: false },
                ],
              };
            });
            setOrders(prev => [...prev, ...newOrders]);
            setCart([]);
          }
        }}
        cartMode={true}
        cartItems={cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          customLabel: item.customLabel,
          wizardInfo: item.wizardInfo,
        }))}
      />
    </div>
  );
}
