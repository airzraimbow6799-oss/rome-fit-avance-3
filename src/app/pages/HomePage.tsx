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
    tag: 'LIMITADA',
  },
  {
    id: 'essential-regular',
    name: 'ESSENTIAL REGULAR TEE',
    price: 'S/. 89.90',
    image: imgEssential,
    tag: 'BESTSELLER',
  },
];

/* ── Tag colour lookup ───────────────────────────────────────── */
const TAG_BG: Record<string, string> = {
  BESTSELLER: '#000000',
  LIMITADA:   '#7c3aed',
};
const TAG_LABEL: Record<string, string> = {
  LIMITADA: 'EDICIÓN LIMITADA',
};
function tagBg(tag: string): string { return TAG_BG[tag] ?? '#e00'; }
function tagLabel(tag: string): string { return TAG_LABEL[tag] ?? tag; }

function ProductTag({ tag }: Readonly<{ tag: string }>) {
  return (
    <div style={{
      position: 'absolute', top: 10, left: 10,
      backgroundColor: tagBg(tag),
      color: '#ffffff',
      fontSize: 9, fontWeight: 700, letterSpacing: '0.8px',
      padding: '4px 10px', borderRadius: 20,
    }}>
      {tagLabel(tag)}
    </div>
  );
}

/* ── Collection filter helpers ───────────────────────────────── */
type Collection = 'nuevos' | 'bestsellers' | 'limitada' | null;

const COLLECTION_LABEL: Record<NonNullable<Collection>, string> = {
  nuevos:      'NUEVOS LANZAMIENTOS',
  bestsellers: 'BESTSELLERS',
  limitada:    'EDICIÓN LIMITADA',
};

function productMatchesCollection(product: Product, col: Collection): boolean {
  if (!col) return true;
  if (col === 'nuevos')      return product.tag === 'NEW';
  if (col === 'bestsellers') return product.tag === 'BESTSELLER';
  if (col === 'limitada')    return product.tag === 'LIMITADA';
  return true;
}

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
          <ProductTag tag={product.tag} />
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
interface WizardProfileData {
  altura: string; peso: string; pecho: string;
  complexion: string; fitStyle: string; lastSize: SizeName;
}

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
  onWizardProfileSave?: (data: WizardProfileData) => void;
  savedProfile?: { altura?: string; peso?: string; pecho?: string; complexion?: string; fitStyle?: string } | null;
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
  onWizardProfileSave,
  savedProfile,
}: HomePageProps) {
  const { isMobile, isTablet } = useResponsive();

  const [loginOpen, setLoginOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [wizardSize, setWizardSize] = useState<SizeName>('M');
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [activeCollection, setActiveCollection] = useState<Collection>(null);

  const filteredProducts = PRODUCTS.filter(p => productMatchesCollection(p, activeCollection));
  const sectionTitle = activeCollection ? COLLECTION_LABEL[activeCollection] : 'NEW ARRIVALS';

  /* After wizard completes → save measurements to profile + show product picker */
  function handleWizardDone(size: SizeName, _match: number, wizardData?: { altura?: string; peso?: string; pecho?: string; complexion?: string; fitStyle?: string }) {
    setWizardSize(size);
    setWizardOpen(false);
    setPickerOpen(true);
    if (wizardData) {
      onWizardProfileSave?.({
        altura:     wizardData.altura    ?? '',
        peso:       wizardData.peso      ?? '',
        pecho:      wizardData.pecho     ?? '',
        complexion: wizardData.complexion ?? '',
        fitStyle:   wizardData.fitStyle   ?? '',
        lastSize:   size,
      });
    }
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
        onViewAllClick={() => setActiveCollection(null)}
        onCollectionClick={(col) => setActiveCollection(col as Collection)}
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
            {sectionTitle}
          </h2>
          <button
            onClick={() => setActiveCollection(null)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: activeCollection ? C.red : C.black,
              fontWeight: 600, letterSpacing: '0.3px', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, padding: 0,
            }}
          >
            VER TODO →
          </button>
        </div>

        {/* 4-column grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 12 : 20,
        }}>
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuyNow={handleBuyNow}
              isMobile={isMobile}
            />
          )) : (
            <div style={{ gridColumn: '1 / -1', padding: '48px 0', textAlign: 'center', color: '#888', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
              No hay productos en esta colección.
            </div>
          )}
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
        prefillData={savedProfile ?? undefined}
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
