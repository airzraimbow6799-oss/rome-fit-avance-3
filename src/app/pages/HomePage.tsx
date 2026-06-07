import React, { useState } from 'react';
import { C, SizeName } from '../components/romefit/tokens';
import { WizardModal } from '../components/romefit/WizardModal';
import { LoginModal } from '../components/romefit/LoginModal';
import { Footer } from '../components/romefit/Footer';
import { Header } from '../components/romefit/Header';
import { useResponsive } from '../hooks/useResponsive';

import img17 from '../../imports/image-17.png';
import img19 from '../../imports/image-19.png';
import img20 from '../../imports/image-20.png';
import img21 from '../../imports/image-21.png';
import img23 from '../../imports/image-23.png';
import imgEssential from '../../imports/image-10.png';

/* ── Product catalogue ───────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'feather-thunder',
    name: 'FEATHER & THUNDER BOXY LONG SLEEVE',
    price: 'S/. 139.90',
    image: img20,
    tag: 'NEW',
  },
  {
    id: 'second-revelation',
    name: 'SECOND REVELATION RELAX',
    price: 'S/. 119.90',
    image: img21,
    tag: 'NEW',
  },
  {
    id: 'strong-legacy',
    name: 'STRONG LEGACY RELAX TEE',
    price: 'S/. 79.00',
    image: img23,
  },
  {
    id: 'essential-regular',
    name: 'ESSENTIAL REGULAR TEE',
    price: 'S/. 89.90',
    image: imgEssential,
    tag: 'BESTSELLER',
  },
];

/* ── Product Card (sin selector de tallas) ──────────────────── */
function ProductCard({
  product,
  onBuyNow,
  isMobile,
}: {
  product: Product;
  onBuyNow: (product: Product) => void;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.22s, transform 0.22s',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.14)' : '0 1px 4px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        height: isMobile ? 220 : 320,
        backgroundColor: '#f2f2f2',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
            transition: 'transform 0.38s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {product.tag && (
          <div style={{
            position: 'absolute',
            top: 10, left: 10,
            backgroundColor: product.tag === 'BESTSELLER' ? C.black : C.red,
            color: C.white,
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.8px',
            padding: '4px 10px',
            borderRadius: 20,
          }}>
            {product.tag}
          </div>
        )}
      </div>

      {/* Info + CTA */}
      <div style={{
        padding: isMobile ? '14px 12px 16px' : '18px 16px 20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div>
          <div style={{
            fontSize: isMobile ? 12 : 13,
            fontWeight: 700,
            color: C.black,
            letterSpacing: '0.1px',
            lineHeight: 1.35,
            marginBottom: 5,
          }}>
            {product.name}
          </div>
          <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: C.black }}>
            {product.price}
          </div>
        </div>

        {/* Single CTA: COMPRAR AHORA */}
        <button
          onClick={() => onBuyNow(product)}
          style={{
            marginTop: 'auto',
            height: isMobile ? 40 : 44,
            backgroundColor: C.black,
            color: C.white,
            border: 'none',
            borderRadius: 4,
            fontSize: isMobile ? 11 : 12,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.6px',
            fontFamily: 'Inter, sans-serif',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = '#222'; }}
          onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = C.black; }}
        >
          COMPRAR AHORA
        </button>
      </div>
    </div>
  );
}

/* ── Product Picker Modal (post-wizard) ─────────────────────── */
function ProductPickerModal({
  open,
  recommendedSize,
  onClose,
  onSelectProduct,
  isMobile,
}: {
  open: boolean;
  recommendedSize: SizeName;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  isMobile: boolean;
}) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 20000,
        backdropFilter: 'blur(4px)',
        padding: isMobile ? '0' : '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: C.white,
          borderRadius: isMobile ? '16px 16px 0 0' : 12,
          width: isMobile ? '100%' : 'min(720px, 96vw)',
          maxHeight: isMobile ? '82vh' : '85vh',
          overflowY: 'auto',
          position: isMobile ? 'fixed' : 'relative',
          bottom: isMobile ? 0 : undefined,
          left: isMobile ? 0 : undefined,
          right: isMobile ? 0 : undefined,
          boxShadow: '0 28px 90px rgba(0,0,0,0.35)',
          fontFamily: 'Inter, sans-serif',
          padding: isMobile ? '24px 16px 32px' : '36px 32px',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 20,
            background: 'none', border: 'none',
            fontSize: 22, color: '#999', cursor: 'pointer', lineHeight: 1,
          }}
        >✕</button>

        {/* Header */}
        <div style={{ marginBottom: 24, paddingRight: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: '1px', marginBottom: 6 }}>
            ROMEFIT — RESULTADO
          </div>
          <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: C.black, margin: '0 0 6px' }}>
            Tu talla recomendada es{' '}
            <span style={{
              display: 'inline-block',
              backgroundColor: C.black, color: C.white,
              borderRadius: 6, padding: '2px 12px',
              fontStyle: 'italic',
            }}>{recommendedSize}</span>
          </h2>
          <p style={{ fontSize: 13, color: C.gray, margin: 0, lineHeight: 1.5 }}>
            Selecciona una prenda para proceder con la compra en talla {recommendedSize}.
          </p>
        </div>

        {/* Product grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 12 : 16,
        }}>
          {PRODUCTS.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelectProduct(product)}
              style={{
                backgroundColor: C.white,
                border: `1.5px solid ${C.border}`,
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer',
                textAlign: 'left',
                padding: 0,
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget).style.borderColor = C.black;
                (e.currentTarget).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget).style.borderColor = C.border;
                (e.currentTarget).style.boxShadow = 'none';
              }}
            >
              <div style={{ height: isMobile ? 120 : 160, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                />
              </div>
              <div style={{ padding: '10px 10px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.black, lineHeight: 1.3, marginBottom: 4 }}>
                  {product.name}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.black }}>{product.price}</div>
                <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: C.red }}>
                  TALLA {recommendedSize} →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── HomePage props ──────────────────────────────────────────── */
interface HomePageProps {
  accessibleMode?: boolean;
  onStartWizard?: () => void;
  onGoToProfile?: () => void;
  onGoToProduct?: (productId?: string) => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLoginClick?: () => void;
  onLoginSuccess?: (email: string) => void;
  onLogout?: () => void;
  onProductSelect?: (productId: string) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
}

/* ── HomePage ─────────────────────────────────────────────────── */
export function HomePage({
  accessibleMode = false,
  onStartWizard,
  onGoToProduct,
  onGoToProfile,
  isLoggedIn = false,
  userEmail = '',
  onLoginClick,
  onLoginSuccess,
  onLogout,
  onProductSelect,
  cartItemCount = 0,
  onCartClick,
}: HomePageProps) {
  const { isMobile, isTablet } = useResponsive();

  const [loginOpen, setLoginOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [wizardSize, setWizardSize] = useState<SizeName>('M');
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  /* After wizard completes → show product picker */
  function handleWizardDone(size: SizeName) {
    setWizardSize(size);
    setWizardOpen(false);
    setPickerOpen(true);
  }

  /* Product picked from picker → go directly to ProductPage (login happens at purchase) */
  function handlePickerProduct(product: Product) {
    setPickerOpen(false);
    onGoToProduct?.(product.id);
  }

  /* Card "COMPRAR AHORA" → always go to ProductPage, login happens at purchase */
  function handleBuyNow(product: Product) {
    onGoToProduct?.(product.id);
  }

  /* After successful login → update global auth, then navigate if pending product */
  function handleLocalLoginSuccess(email: string) {
    setLoginOpen(false);
    onLoginSuccess?.(email || 'usuario@rome.com');
    if (pendingProduct) {
      onGoToProduct?.(pendingProduct.id);
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', backgroundColor: C.white }}>

      {/* ── Header ── */}
      <Header
        onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onLoginClick={() => { setPendingProduct(null); setLoginOpen(true); }}
        onCartClick={() => onCartClick?.()}
        cartItemCount={cartItemCount}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onGoToProfile={() => onGoToProfile?.()}
        onLogout={onLogout}
        onProductSelect={(id) => { onProductSelect?.(id); }}
        onSearch={(query) => { console.log('Buscando:', query); }}
        onViewAllClick={() => { console.log('Ver todo'); }}
        onCollectionClick={(collection) => { console.log('Colección:', collection); }}
      />

      {/* ── Hero: image-17 as full-width banner (4 personas) ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#111',
        lineHeight: 0,
      }}>
        <img
          src={img17}
          alt="Rome Store — Nueva Colección"
          style={{
            width: '100%',
            display: 'block',
            objectFit: 'cover',
            maxHeight: isMobile ? 340 : isTablet ? 460 : 600,
            objectPosition: 'center center',
          }}
        />
      </div>

      {/* ── NEW ARRIVALS section ── */}
      <section style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: isMobile ? '40px 16px 0' : isTablet ? '56px 24px 0' : '72px 40px 0',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? 20 : 32,
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: isMobile ? 14 : 20,
        }}>
          <h2 style={{
            fontSize: isMobile ? 22 : 30,
            fontWeight: 800,
            color: C.black,
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            NEW ARRIVALS
          </h2>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              fontSize: 12, color: C.black, fontWeight: 600,
              textDecoration: 'none', letterSpacing: '0.3px',
              display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            }}
          >
            VER TODO →
          </a>
        </div>

        {/* 4-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 12 : 20,
        }}>
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuyNow={handleBuyNow}
              isMobile={isMobile}
            />
          ))}
        </div>
      </section>

      {/* ── RomeFit CTA ── */}
      <section style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: isMobile ? '36px 16px' : isTablet ? '48px 24px' : '56px 40px',
      }}>
        <div style={{
          backgroundColor: C.black,
          borderRadius: 10,
          padding: isMobile ? '28px 22px' : '36px 48px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}>
          <div>
            <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 700, color: C.red, letterSpacing: '1.5px', marginBottom: 8 }}>
              TECNOLOGÍA ROMEFIT AI
            </div>
            <div style={{ fontSize: isMobile ? 20 : 28, fontWeight: 800, color: C.white, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              ¿No sabes tu talla?<br />
              <span style={{ color: '#b0b0b0', fontStyle: 'italic', fontWeight: 700 }}>
                Te ayudamos a encontrarla.
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#777', margin: '10px 0 0', lineHeight: 1.5 }}>
              Ingresa tus medidas y RomeFit calculará tu talla perfecta. Luego selecciona tu prenda favorita.
            </p>
          </div>
          <button
            onClick={() => setWizardOpen(true)}
            style={{
              backgroundColor: C.white,
              color: C.black,
              border: 'none',
              borderRadius: 6,
              padding: isMobile ? '12px 24px' : '14px 36px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, sans-serif',
              flexShrink: 0,
            }}
          >
            ⚙️ CALCULAR MI TALLA
          </button>
        </div>
      </section>

      {/* ── Rome Kids section (sin botón) ── */}
      <div style={{
        position: 'relative',
        height: isMobile ? 260 : isTablet ? 360 : 460,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
      }}>
        <img
          src={img19}
          alt="Rome Kids 2026"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 20%',
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.02) 50%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: isMobile ? 28 : 44,
          left: 0, right: 0,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isMobile ? 9 : 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '2.5px', marginBottom: 6 }}>
            ROME STUDIOS
          </div>
          <div style={{
            fontSize: isMobile ? 28 : 44,
            fontWeight: 800,
            fontStyle: 'italic',
            color: C.white,
            letterSpacing: '-1px',
          }}>
            ROME KIDS 2026
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Wizard Modal ── */}
      <WizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSizeSelected={handleWizardDone}
        shirtColor="#111111"
        productName="Selecciona una prenda"
        price=""
      />

      {/* ── Product Picker (post-wizard) ── */}
      <ProductPickerModal
        open={pickerOpen}
        recommendedSize={wizardSize}
        onClose={() => setPickerOpen(false)}
        onSelectProduct={handlePickerProduct}
        isMobile={isMobile}
      />

      {/* ── Login Modal ── */}
      <LoginModal
        open={loginOpen}
        onClose={() => { setLoginOpen(false); setPendingProduct(null); }}
        contextHint="Para continuar con tu compra necesitas iniciar sesión."
        onSuccess={handleLocalLoginSuccess}
      />
    </div>
  );
}
