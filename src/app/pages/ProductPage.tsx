import React, { useState, useEffect } from 'react';
import { C, SizeName, SIZES } from '../components/romefit/tokens';
import { SizeButton, SizePreviewPanel, MatchBadge } from '../components/romefit/SharedComponents';
import { Mannequin } from '../components/romefit/Mannequin';
import { WizardModal } from '../components/romefit/WizardModal';
import { SizeGuideModal } from '../components/romefit/SizeGuideModal';
import { CheckoutModal } from '../components/romefit/CheckoutModal';
import { SizeComparisonModal } from '../components/romefit/SizeComparisonModal';
import { Header } from '../components/romefit/Header';
import { useResponsive } from '../hooks/useResponsive';

// ── Gallery images ───────────────────────────────────────────────
import imgE1 from '../../imports/image-10.png';
import imgE2 from '../../imports/image-11.png';
import imgE3 from '../../imports/image-12.png';
import imgE4 from '../../imports/image-13.png';

import imgF1 from '../../imports/image-20.png';

import imgS1 from '../../imports/image-21.png';

import imgL1 from '../../imports/image-23.png';

// ── Product catalog ──────────────────────────────────────────────
interface ProductColor { name: string; hex: string; border: string }
interface MeasLabel { icon: string; label: string }

interface ProductConfig {
  id: string;
  name: string;
  brand: string;
  price: string;
  priceNum: number;
  hasLongSleeves: boolean;
  fit: string;
  fitRange: [string, string];
  colors: ProductColor[];
  gallery: string[];
  rating: number;
  reviewCount: number;
  measurementLabels: MeasLabel[];
  tag?: string;
  collection: string;
}

interface SavedProfile {
  altura: string;
  peso: string;
  pecho: string;
  complexion: string;
  fitStyle: string;
  lastSize: SizeName;
  wasCustom: boolean;
}

const PRODUCTS: Record<string, ProductConfig> = {
  'essential-regular': {
    id: 'essential-regular',
    name: 'ESSENTIAL REGULAR TEE',
    brand: 'ROME FIT',
    price: 'S/. 89.90',
    priceNum: 89.90,
    hasLongSleeves: false,
    fit: 'Regular',
    fitRange: ['Ajustado', 'Regular'],
    colors: [
      { name: 'NEGRO', hex: '#111111', border: '#111111' },
      { name: 'BLANCO', hex: '#f9f9f9', border: '#cccccc' },
    ],
    gallery: [imgE1, imgE3, imgE2, imgE4],
    rating: 4.8,
    reviewCount: 312,
    measurementLabels: [
      { icon: '↔', label: 'Hombros: caen 2 cm' },
      { icon: '↕', label: 'Pecho: +8 cm holgura' },
      { icon: '📏', label: 'Largo: hasta cadera' },
    ],
    tag: 'BESTSELLER',
    collection: 'Colección',
  },
  'feather-thunder': {
    id: 'feather-thunder',
    name: 'FEATHER & THUNDER BOXY LONG SLEEVE',
    brand: 'FEATHER & THUNDER',
    price: 'S/. 139.90',
    priceNum: 139.90,
    hasLongSleeves: true,
    fit: 'Boxy Oversize',
    fitRange: ['Estructurado', 'Oversize'],
    colors: [
      { name: 'NEGRO', hex: '#111111', border: '#111111' },
      { name: 'CARBÓN', hex: '#2e2e2e', border: '#444444' },
    ],
    gallery: [imgF1],
    rating: 4.9,
    reviewCount: 87,
    measurementLabels: [
      { icon: '↔', label: 'Hombros: caen 5 cm' },
      { icon: '↕', label: 'Pecho: +18 cm holgura' },
      { icon: '📏', label: 'Manga: cubre la muñeca' },
    ],
    tag: 'NUEVO',
    collection: 'Nueva Colección',
  },
  'second-revelation': {
    id: 'second-revelation',
    name: 'SECOND REVELATION RELAX',
    brand: 'SECOND REVELATION',
    price: 'S/. 119.90',
    priceNum: 119.90,
    hasLongSleeves: false,
    fit: 'Relax',
    fitRange: ['Ajustado', 'Relax'],
    colors: [
      { name: 'NEGRO', hex: '#111111', border: '#111111' },
      { name: 'NAVY', hex: '#1a2744', border: '#1a2744' },
    ],
    gallery: [imgS1],
    rating: 4.7,
    reviewCount: 145,
    measurementLabels: [
      { icon: '↔', label: 'Hombros: caen 3 cm' },
      { icon: '↕', label: 'Pecho: +12 cm holgura' },
      { icon: '📏', label: 'Largo: hasta cadera' },
    ],
    tag: 'NUEVO',
    collection: 'Nueva Colección',
  },
  'strong-legacy': {
    id: 'strong-legacy',
    name: 'STRONG LEGACY RELAX TEE',
    brand: 'STRONG LEGACY',
    price: 'S/. 79.00',
    priceNum: 79.00,
    hasLongSleeves: false,
    fit: 'Relax',
    fitRange: ['Ajustado', 'Relax'],
    colors: [
      { name: 'NEGRO', hex: '#111111', border: '#111111' },
      { name: 'BLANCO', hex: '#f9f9f9', border: '#cccccc' },
    ],
    gallery: [imgL1],
    rating: 4.6,
    reviewCount: 203,
    measurementLabels: [
      { icon: '↔', label: 'Hombros: caen 3 cm' },
      { icon: '↕', label: 'Pecho: +10 cm holgura' },
      { icon: '📏', label: 'Largo: hasta cadera' },
    ],
    tag: undefined,
    collection: 'Colección',
  },
};

function CardBadge({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div style={{ width: 44, height: 28, backgroundColor: bg, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.20)', flexShrink: 0 }}>
      {children}
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────
interface ProductPageProps {
  accessibleMode?: boolean;
  autoOpenWizard?: boolean;
  onWizardOpened?: () => void;
  selectedProductId?: string;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onGoToProfile?: () => void;
  onProductSelect?: (productId: string) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onAddToCart?: (item: any) => void;
  onAddToCartAndOpen?: (item: any) => void;
  savedProfile?: SavedProfile | null;
}

export function ProductPage({
  accessibleMode = false,
  autoOpenWizard = false,
  onWizardOpened,
  selectedProductId = 'essential-regular',
  isLoggedIn = false,
  userEmail = '',
  onLoginClick,
  onLogout,
  onGoToProfile,
  onProductSelect,
  cartItemCount = 0,
  onCartClick,
  onAddToCart,
  onAddToCartAndOpen,
  savedProfile,
}: ProductPageProps) {
  const { isMobile, isTablet } = useResponsive();

  const product = PRODUCTS[selectedProductId] ?? PRODUCTS['essential-regular'];

  const [activeSize,          setActiveSize]          = useState<SizeName>('M');
  const [activeColor,         setActiveColor]         = useState(0);
  const [activeImage,         setActiveImage]         = useState(0);
  const [qty,                 setQty]                 = useState(1);
  const [wizardOpen,          setWizardOpen]          = useState(false);
  const [sizeGuideOpen,       setSizeGuideOpen]       = useState(false);
  const [matchResult,         setMatchResult]         = useState<{ size: SizeName; match: number } | null>(null);
  const [addedToCart,         setAddedToCart]         = useState(false);
  const [checkoutOpen,        setCheckoutOpen]        = useState(false);
  const [confeccionInfo,      setConfeccionInfo]      = useState<{ size: SizeName } | null>(null);
  const [pendingConfeccion,   setPendingConfeccion]   = useState<{ size: SizeName } | null>(null);
  const [pendingCartItem,     setPendingCartItem]     = useState<any | null>(null);
  const [sizeComparisonOpen,  setSizeComparisonOpen]  = useState(false);
  const [autoAddedCustom,     setAutoAddedCustom]     = useState(false);

  // Reset state whenever the product changes
  useEffect(() => {
    setActiveSize(savedProfile && !savedProfile.wasCustom ? savedProfile.lastSize : 'M');
    setActiveColor(0);
    setActiveImage(0);
    setQty(1);
    setMatchResult(null);
    setAddedToCart(false);
    setCheckoutOpen(false);
    setConfeccionInfo(null);
    setPendingConfeccion(null);
    setPendingCartItem(null);
    setWizardOpen(false);
    setAutoAddedCustom(false);
  }, [selectedProductId]);

  // Auto-open wizard when requested from outside (e.g. "Calcular Talla" button)
  useEffect(() => {
    if (autoOpenWizard) {
      setWizardOpen(true);
      onWizardOpened?.();
    }
  }, [autoOpenWizard]);

  // When user logs in while a confeccion checkout was pending, proceed
  useEffect(() => {
    if (isLoggedIn && pendingConfeccion) {
      setConfeccionInfo(pendingConfeccion);
      setPendingConfeccion(null);
      setCheckoutOpen(true);
    }
  }, [isLoggedIn, pendingConfeccion]);

  // When user logs in while a wizard cart-add was pending, complete it and open cart
  useEffect(() => {
    if (isLoggedIn && pendingCartItem) {
      onAddToCartAndOpen?.(pendingCartItem);
      setPendingCartItem(null);
    }
  }, [isLoggedIn, pendingCartItem]);

  const shirtColor = product.colors[activeColor].hex;
  const mainPad = isMobile ? '16px 16px 80px' : isTablet ? '20px 24px 80px' : '20px 40px 80px';

  function handleColorChange(i: number) {
    setActiveColor(i);
    // Reset image to show the correct color (first image = color 0, image 2 = color 1 for Essential)
    setActiveImage(i === 0 ? 0 : 2);
  }

  function handleSizeFromWizard(size: SizeName, match: number) {
    setActiveSize(size);
    setMatchResult({ size, match });
  }

  function handleAddToCart() {
    if (savedProfile?.wasCustom) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.gallery[0],
        size: savedProfile.lastSize,
        quantity: qty,
        brand: product.brand,
        customLabel: 'Personalización Artesanal',
        wizardInfo: {
          fitStyle:   savedProfile.fitStyle,
          complexion: savedProfile.complexion,
          altura:     savedProfile.altura,
          peso:       savedProfile.peso,
          pecho:      savedProfile.pecho,
        },
      };
      onAddToCartAndOpen?.(cartItem);
      setAutoAddedCustom(true);
      setTimeout(() => setAutoAddedCustom(false), 3500);
    } else {
      onAddToCart?.({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.gallery[0],
        size: activeSize,
        quantity: qty,
        brand: product.brand,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2200);
    }
  }

  const gallery = product.gallery;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: C.white }}>

      {/* ── Header ── */}
      <Header
        onLogoClick={() => onProductSelect?.('home')}
        onLoginClick={() => onLoginClick?.()}
        onCartClick={() => onCartClick?.()}
        cartItemCount={cartItemCount}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onGoToProfile={() => onGoToProfile?.()}
        onLogout={onLogout}
        onProductSelect={(id) => onProductSelect?.(id)}
        onSearch={(query) => { console.log('Buscando:', query); }}
        onViewAllClick={() => { console.log('Ver todo'); }}
        onCollectionClick={(c) => { console.log('Colección:', c); }}
      />

      {/* ── Top banner ── */}
      <div style={{ backgroundColor: C.black, color: C.white, textAlign: 'center', fontSize: isMobile ? 10 : 11, fontWeight: 500, padding: isMobile ? '7px 12px' : '9px 0', letterSpacing: '0.3px', lineHeight: 1.4 }}>
        ENVÍO GRATIS EN PEDIDOS MAYORES A S/. 150 · {product.collection.toUpperCase()} DISPONIBLE
      </div>

      {/* ── Breadcrumb ── */}
      <div style={{ padding: isMobile ? '10px 16px' : isTablet ? '12px 24px' : '12px 40px', fontSize: 11, color: C.gray }}>
        Inicio &nbsp;›&nbsp; {product.collection} &nbsp;›&nbsp; <strong style={{ color: C.black }}>{product.name}</strong>
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'minmax(320px, 560px) 1fr', gap: isMobile ? 24 : isTablet ? 32 : 48, padding: mainPad, maxWidth: 1300, margin: '0 auto' }}>

        {/* ══ LEFT: Photo gallery ══ */}
        <div>
          {/* Main image */}
          <div style={{ backgroundColor: '#f2f2f2', borderRadius: 6, overflow: 'hidden', height: isMobile ? 320 : isTablet ? 440 : 560, position: 'relative' }}>
            <img
              src={gallery[activeImage]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', transition: 'opacity 0.25s ease' }}
            />
            {/* Color badge */}
            <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.70)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', padding: '4px 10px', borderRadius: 20 }}>
              {product.colors[activeColor].name}
            </div>
            {/* Product tag badge */}
            {product.tag && (
              <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: product.tag === 'NUEVO' ? C.red : C.black, color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '1px', padding: '4px 10px', borderRadius: 20 }}>
                {product.tag}
              </div>
            )}
            {/* Long sleeve badge */}
            {product.hasLongSleeves && (
              <div style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.92)', color: C.black, fontSize: 9, fontWeight: 700, letterSpacing: '0.8px', padding: '4px 10px', borderRadius: 20 }}>
                MANGA LARGA
              </div>
            )}
            {/* Prev/next arrows */}
            {activeImage > 0 && (
              <button onClick={() => setActiveImage(i => i - 1)} style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>‹</button>
            )}
            {activeImage < gallery.length - 1 && (
              <button onClick={() => setActiveImage(i => i + 1)} style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', width: isMobile ? 32 : 36, height: isMobile ? 32 : 36, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.85)', border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>›</button>
            )}
          </div>

          {/* Thumbnails — only show when multiple images */}
          {gallery.length > 1 && <div style={{ display: 'flex', gap: isMobile ? 8 : 10, marginTop: 10 }}>
            {gallery.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} style={{ flex: 1, height: isMobile ? 68 : isTablet ? 80 : 90, borderRadius: 5, overflow: 'hidden', padding: 0, cursor: 'pointer', border: i === activeImage ? `2.5px solid ${C.black}` : `1.5px solid ${C.border}`, backgroundColor: '#f2f2f2', opacity: i === activeImage ? 1 : 0.72, transition: 'all 0.15s' }}>
                <img src={img} alt={`Vista ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
              </button>
            ))}
          </div>}
        </div>

        {/* ══ RIGHT: Product details ══ */}
        <div style={{ paddingTop: isMobile ? 0 : 8 }}>

          {/* Title */}
          <h1 style={{ fontSize: isMobile ? 20 : isTablet ? 22 : 25, fontWeight: 700, color: C.black, margin: 0, lineHeight: 1.2, letterSpacing: '-0.3px' }}>
            {product.name}
          </h1>

          {/* Price + match badge + fit label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: C.black }}>{product.price}</span>
            {matchResult && <MatchBadge pct={matchResult.match} />}
            <span style={{ fontSize: 11, fontWeight: 600, color: C.gray, backgroundColor: C.lightGray, padding: '2px 8px', borderRadius: 12 }}>
              Corte {product.fit}
            </span>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {'★★★★★'.split('').map((s, i) => (
              <span key={i} style={{ color: i < Math.floor(product.rating) ? '#f59e0b' : '#ddd', fontSize: 14 }}>{s}</span>
            ))}
            <span style={{ fontSize: 12, color: C.gray, marginLeft: 4 }}>{product.rating} ({product.reviewCount} reseñas)</span>
          </div>

          {/* Color selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 10 }}>
              COLOR: <strong style={{ color: C.black }}>{product.colors[activeColor].name}</strong>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => handleColorChange(i)}
                  title={c.name}
                  style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: c.hex, border: `${i === activeColor ? 3 : 1.5}px solid ${i === activeColor ? C.black : c.border}`, cursor: 'pointer', outline: i === activeColor ? `2px solid ${C.black}` : 'none', outlineOffset: 2, transition: 'all 0.15s' }}
                />
              ))}
            </div>
          </div>

          {/* Saved profile banner */}
          {savedProfile && (
            <div style={{
              background: savedProfile.wasCustom ? '#fff8f0' : '#f0fdf4',
              border: `1px solid ${savedProfile.wasCustom ? '#f97316' : '#22c55e'}40`,
              borderRadius: 8,
              padding: '9px 14px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{ fontSize: 15 }}>{savedProfile.wasCustom ? '✂️' : '📏'}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: savedProfile.wasCustom ? '#9a3412' : '#166534' }}>
                {savedProfile.wasCustom
                  ? 'Perfil artesanal guardado — se enviará a confección automáticamente'
                  : `Talla guardada de tu perfil: ${savedProfile.lastSize} — pre-seleccionada`}
              </span>
            </div>
          )}

          {/* Size selector */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 10 }}>
              TALLA: <strong style={{ color: C.black }}>{savedProfile && !savedProfile.wasCustom ? savedProfile.lastSize : activeSize}</strong>
            </div>
            <div style={{ display: 'flex', gap: isMobile ? 8 : 10, flexWrap: 'wrap' }}>
              {SIZES.map((s) => (
                <SizeButton key={s} size={s} isActive={activeSize === s} onClick={() => { setActiveSize(s); setMatchResult(null); }} />
              ))}
            </div>
          </div>

          {/* Size preview panel */}
          <div style={{ marginBottom: 14 }}>
            <SizePreviewPanel size={activeSize} />
          </div>

          {/* Compare sizes */}
          <button
            onClick={() => setSizeComparisonOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 44, backgroundColor: 'transparent', border: `1.5px solid #CCCCCC`, borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#444444', cursor: 'pointer', marginBottom: 14, fontFamily: 'Inter, sans-serif', transition: 'background-color 0.15s, border-color 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.borderColor = '#aaaaaa'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#CCCCCC'; }}
          >
            <span style={{ fontSize: 14 }}>📊</span>
            Comparar tallas en esta prenda
            <span style={{ fontSize: 14, marginLeft: 'auto', color: '#888888' }}>›</span>
          </button>

          {/* ── Mannequin preview ── */}
          <div style={{ backgroundColor: '#2C2C2C', borderRadius: 8, overflow: 'hidden', marginBottom: 16, display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center' }}>
            {isMobile ? (
              <>
                <div style={{ backgroundColor: '#2C2C2C', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 64, height: 108 }}>
                    <Mannequin size={activeSize} shirtColor={shirtColor} dark hasLongSleeves={product.hasLongSleeves} className="w-full h-full" />
                  </div>
                </div>
                <div style={{ flex: 1, padding: '12px 16px' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#888', letterSpacing: '1.2px', marginBottom: 4 }}>VISTA PREVIA</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontStyle: 'italic', color: '#fff', lineHeight: 1 }}>{activeSize}</div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>Corte {product.fit}</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#888', letterSpacing: '1.4px', textAlign: 'center', paddingTop: 12, paddingBottom: 6 }}>
                  VISTA PREVIA — TALLA {activeSize} · CORTE {product.fit.toUpperCase()}
                </div>
                <div style={{ backgroundColor: '#2C2C2C', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0', minHeight: 280, position: 'relative' }}>
                  <div style={{ width: 120, height: 200, position: 'relative', zIndex: 1 }}>
                    <Mannequin size={activeSize} shirtColor={shirtColor} dark hasLongSleeves={product.hasLongSleeves} className="w-full h-full" />
                  </div>
                  {/* Measurement annotation labels */}
                  <div style={{ position: 'absolute', right: 14, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', paddingTop: 16, paddingBottom: 16 }}>
                    {product.measurementLabels.map((item) => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 4, padding: '3px 7px' }}>
                        <span style={{ color: '#FFD600', fontSize: 11 }}>{item.icon}</span>
                        <span style={{ color: '#ffffff', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', letterSpacing: '0.2px' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '10px 16px', width: '100%', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#888' }}>{product.fitRange[0]}</span>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#c49b1a', letterSpacing: '0.8px' }}>{activeSize}</div>
                  <span style={{ fontSize: 10, color: '#888' }}>{product.fitRange[1]}</span>
                </div>
              </>
            )}
          </div>

          {/* Personalized wizard button */}
          <button onClick={() => setWizardOpen(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 42, backgroundColor: '#f8f8f8', border: `1.5px solid #aaaaaa`, borderRadius: 4, fontSize: 12, fontWeight: 600, color: C.darkGray, cursor: 'pointer', marginBottom: 14, fontFamily: 'Inter, sans-serif' }}>
            ⚙️&nbsp; Personalizado — Ingresa tus medidas
          </button>

          {/* Quantity + size guide */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden', height: 48 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 42, height: '100%', border: 'none', borderRight: `1px solid ${C.border}`, backgroundColor: C.white, fontSize: 18, color: C.gray, cursor: 'pointer' }}>−</button>
              <span style={{ width: 42, textAlign: 'center', fontSize: 14, fontWeight: 500, color: C.black }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 42, height: '100%', border: 'none', borderLeft: `1px solid ${C.border}`, backgroundColor: C.white, fontSize: 18, color: C.gray, cursor: 'pointer' }}>+</button>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); setSizeGuideOpen(true); }} style={{ fontSize: 12, color: C.gray, textDecoration: 'underline', cursor: 'pointer' }}>
              Guía de tallas
            </a>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleAddToCart} style={{ height: 50, backgroundColor: (addedToCart || autoAddedCustom) ? C.greenPrimary : C.white, color: (addedToCart || autoAddedCustom) ? C.white : C.black, border: `1px solid ${(addedToCart || autoAddedCustom) ? C.greenPrimary : C.black}`, borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
              {autoAddedCustom ? '✓ ENVIADO A CONFECCIÓN' : addedToCart ? '✓ AÑADIDO A LA CESTA' : savedProfile?.wasCustom ? '✂ AÑADIR A CONFECCIÓN ARTESANAL' : 'AÑADIR A LA CESTA'}
            </button>
            <button
              onClick={() => {
                if (isLoggedIn) {
                  if (savedProfile?.wasCustom) {
                    setConfeccionInfo({ size: savedProfile.lastSize });
                  }
                  setCheckoutOpen(true);
                } else {
                  onLoginClick?.();
                }
              }}
              style={{ height: 50, backgroundColor: C.black, color: C.white, border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif' }}
            >
              COMPRAR AHORA
            </button>
          </div>

          {/* Secure payments */}
          <div style={{ marginTop: 22, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <span style={{ fontSize: 15 }}>🛡</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.black }}>Pagos 100% Seguros</span>
            </div>
            <div style={{ fontSize: 12, color: C.gray, marginBottom: 14 }}>Tus datos están protegidos con nosotros.</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <CardBadge bg="#016FD0"><span style={{ color: '#fff', fontSize: 8, fontWeight: 800, fontFamily: 'Arial, sans-serif' }}>AMEX</span></CardBadge>
              <CardBadge bg="#004A97">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <span style={{ color: '#fff', fontSize: 6, fontWeight: 700, lineHeight: 1 }}>DINERS</span>
                  <span style={{ color: '#fff', fontSize: 6, fontWeight: 700, lineHeight: 1 }}>CLUB</span>
                </div>
              </CardBadge>
              <CardBadge bg="#1a1a1a">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#EB001B' }} />
                  <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: -6 }} />
                </div>
              </CardBadge>
              <CardBadge bg="#1A1F71"><span style={{ color: '#fff', fontSize: 12, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.5px' }}>VISA</span></CardBadge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Wizard Modal ── */}
      <WizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSizeSelected={handleSizeFromWizard}
        shirtColor={shirtColor}
        productName={product.name}
        price={product.price}
        prefillData={savedProfile ? {
          altura:     savedProfile.altura,
          peso:       savedProfile.peso,
          pecho:      savedProfile.pecho,
          complexion: savedProfile.complexion,
          fitStyle:   savedProfile.fitStyle,
        } : undefined}
        onProcederAlPago={(size) => {
          if (isLoggedIn) {
            setConfeccionInfo({ size });
            setCheckoutOpen(true);
          } else {
            setPendingConfeccion({ size });
            onLoginClick?.();
          }
        }}
        onAddToCartConfeccion={(size, fitStyle, complexion, altura, peso, pecho) => {
          const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.gallery[0],
            size,
            quantity: qty,
            brand: product.brand,
            customLabel: 'Personalización Artesanal',
            wizardInfo: { fitStyle, complexion, altura, peso, pecho },
          };
          if (!isLoggedIn) {
            setPendingCartItem(cartItem);
            onLoginClick?.();
          } else {
            onAddToCartAndOpen?.(cartItem);
          }
        }}
      />

      {/* ── Size Guide Modal ── */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        onOpenWizard={() => setWizardOpen(true)}
      />

      {/* ── Checkout Modal ── */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => { setCheckoutOpen(false); setConfeccionInfo(null); }}
        productName={product.name}
        price={product.price}
        size={confeccionInfo?.size ?? activeSize}
        qty={qty}
        isConfeccion={!!confeccionInfo}
      />

      {/* ── Size Comparison Modal ── */}
      <SizeComparisonModal
        open={sizeComparisonOpen}
        onClose={() => setSizeComparisonOpen(false)}
        currentSize={activeSize}
        shirtColor={shirtColor}
      />
    </div>
  );
}
