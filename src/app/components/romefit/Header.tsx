import React, { useState, useRef, useEffect } from 'react';
import { C } from './tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface HeaderProps {
  onLogoClick: () => void;
  onLoginClick: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  isLoggedIn: boolean;
  userEmail?: string;
  onSearch?: (query: string) => void;
  onViewAllClick?: () => void;
  onCollectionClick?: (collection: string) => void;
  onProductSelect?: (productId: string) => void;
  onGoToProfile?: () => void;
  onLogout?: () => void;
}

export function Header({
  onLogoClick,
  onLoginClick,
  onCartClick,
  cartItemCount,
  isLoggedIn,
  userEmail = '',
  onSearch,
  onViewAllClick,
  onCollectionClick,
  onProductSelect,
  onGoToProfile,
  onLogout,
}: HeaderProps) {
  const { isMobile } = useResponsive();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const closeColTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeUserTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  const ALL_PRODUCTS = [
    { id: 'essential-regular',  name: 'ESSENTIAL REGULAR TEE',               price: 'S/. 89.90',  keywords: 'polo basico essential regular bestseller' },
    { id: 'feather-thunder',    name: 'FEATHER & THUNDER BOXY LONG SLEEVE',  price: 'S/. 139.90', keywords: 'manga larga boxy oversize nuevo feather thunder' },
    { id: 'second-revelation',  name: 'SECOND REVELATION RELAX',             price: 'S/. 119.90', keywords: 'polo relax revelation segundo new navy' },
    { id: 'strong-legacy',      name: 'STRONG LEGACY RELAX TEE',             price: 'S/. 79.00',  keywords: 'polo relax legacy fuerte' },
  ];

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.keywords.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (searchResults.length > 0) {
      selectProduct(searchResults[0].id);
    } else if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      closeSearch();
    }
  }

  function selectProduct(productId: string) {
    closeSearch();
    onProductSelect?.(productId);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }

  function handleCollectionClick(collection: string) {
    setCollectionsOpen(false);
    onCollectionClick?.(collection);
  }

  // Collections hover with delay to avoid gap issue
  function openCollections() {
    if (closeColTimer.current) clearTimeout(closeColTimer.current);
    setCollectionsOpen(true);
  }
  function scheduleCloseCollections() {
    closeColTimer.current = setTimeout(() => setCollectionsOpen(false), 120);
  }

  // User menu hover with delay
  function openUserMenu() {
    if (closeUserTimer.current) clearTimeout(closeUserTimer.current);
    setUserMenuOpen(true);
  }
  function scheduleCloseUserMenu() {
    closeUserTimer.current = setTimeout(() => setUserMenuOpen(false), 150);
  }

  const userName = userEmail ? userEmail.split('@')[0] : '';

  return (
    <>
      <header style={{
        backgroundColor: C.white,
        borderBottom: `1px solid ${C.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: isMobile ? '14px 16px' : '16px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? 12 : 24,
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 32 }}>
            <button
              onClick={onLogoClick}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Inicio"
            >
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, fontStyle: 'italic', color: C.black, letterSpacing: '-1px', lineHeight: 1 }}>
                ROME
              </div>
            </button>

            {/* Desktop nav */}
            {!isMobile && (
              <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {/* Colecciones */}
                <div style={{ position: 'relative' }} onMouseEnter={openCollections} onMouseLeave={scheduleCloseCollections}>
                  <button
                    onClick={() => setCollectionsOpen(v => !v)}
                    style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: C.black, cursor: 'pointer', padding: '6px 0', fontFamily: 'Inter, sans-serif', letterSpacing: '0.2px' }}
                  >
                    COLECCIONES ▾
                  </button>
                  {collectionsOpen && (
                    <div onMouseEnter={openCollections} onMouseLeave={scheduleCloseCollections} style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 4, zIndex: 1001, minWidth: 200 }}>
                      <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
                        {[{ id: 'nuevos', label: 'Nuevos lanzamientos' }, { id: 'bestsellers', label: 'Bestsellers' }, { id: 'limitada', label: 'Edición limitada' }].map((item, i, arr) => (
                          <button
                            key={item.id}
                            onClick={() => handleCollectionClick(item.id)}
                            style={{ width: '100%', display: 'block', textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 500, color: C.black, fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => onViewAllClick?.()} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: C.black, letterSpacing: '0.2px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', padding: 0 }}>
                  VER TODO
                </button>
              </nav>
            )}
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }} aria-label="Buscar">
              <svg width={isMobile ? 20 : 22} height={isMobile ? 20 : 22} viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* User: dropdown when logged in, icon when not */}
            {isLoggedIn ? (
              <div
                ref={userMenuRef}
                style={{ position: 'relative' }}
                onMouseEnter={openUserMenu}
                onMouseLeave={scheduleCloseUserMenu}
              >
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: 20,
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  aria-label="Menú de usuario"
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e', flexShrink: 0 }} />
                  <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: C.black, maxWidth: isMobile ? 80 : 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {userName || userEmail}
                  </span>
                  <span style={{ fontSize: 10, color: C.gray, marginLeft: 2 }}>▾</span>
                </button>

                {userMenuOpen && (
                  <div
                    onMouseEnter={openUserMenu}
                    onMouseLeave={scheduleCloseUserMenu}
                    style={{ position: 'absolute', top: '100%', right: 0, paddingTop: 4, zIndex: 1002, minWidth: 180 }}
                  >
                    <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.14)', overflow: 'hidden' }}>
                      {/* User info header */}
                      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, backgroundColor: '#fafafa' }}>
                        <div style={{ fontSize: 11, color: C.gray, marginBottom: 2, fontFamily: 'Inter, sans-serif' }}>Sesión iniciada como</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.black, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                      </div>
                      {/* Mi Perfil */}
                      <button
                        onClick={() => { setUserMenuOpen(false); onGoToProfile?.(); }}
                        style={{ width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: 13, fontWeight: 500, color: C.black, fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <span style={{ fontSize: 16 }}>👤</span>
                        Mi Perfil
                      </button>
                      {/* Cerrar sesión */}
                      <button
                        onClick={() => { setUserMenuOpen(false); onLogout?.(); }}
                        style={{ width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: 13, fontWeight: 500, color: C.red, fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff5f5'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <span style={{ fontSize: 16 }}>🚪</span>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}
                aria-label="Iniciar sesión"
              >
                <svg width={isMobile ? 20 : 22} height={isMobile ? 20 : 22} viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}

            {/* Cart */}
            <button onClick={onCartClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center', position: 'relative' }} aria-label={`Carrito${cartItemCount > 0 ? ` (${cartItemCount})` : ''}`}>
              <svg width={isMobile ? 20 : 22} height={isMobile ? 20 : 22} viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartItemCount > 0 && (
                <div style={{ position: 'absolute', top: 0, right: 0, minWidth: 18, height: 18, borderRadius: '50%', backgroundColor: C.red, color: C.white, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Mobile sub-nav */}
        {isMobile && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: '8px 16px', display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => setCollectionsOpen(v => !v)} style={{ background: 'none', border: 'none', fontSize: 11, fontWeight: 600, color: C.black, cursor: 'pointer', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px' }}>
              COLECCIONES
            </button>
            <button onClick={() => onViewAllClick?.()} style={{ background: 'none', border: 'none', fontSize: 11, fontWeight: 600, color: C.black, cursor: 'pointer', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px' }}>
              VER TODO
            </button>
          </div>
        )}
      </header>

      {/* Search modal */}
      {searchOpen && (
        <div onClick={closeSearch} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: isMobile ? '80px 16px' : '120px 24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: C.white, borderRadius: 12, width: '100%', maxWidth: 600, padding: isMobile ? 20 : 28, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: C.black, margin: 0, fontFamily: 'Inter, sans-serif' }}>Buscar productos</h3>
              <button onClick={closeSearch} style={{ background: 'none', border: 'none', fontSize: 24, color: '#999', cursor: 'pointer', padding: 4 }}>✕</button>
            </div>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar por nombre, estilo, colección..."
                autoFocus
                style={{ width: '100%', height: isMobile ? 48 : 52, border: `2px solid ${C.border}`, borderRadius: 8, padding: '0 16px', fontSize: isMobile ? 14 : 16, fontFamily: 'Inter, sans-serif', marginBottom: 16, boxSizing: 'border-box' }}
              />
            </form>

            {searchResults.length > 0 ? (
              <div>
                <p style={{ fontSize: 12, color: C.gray, marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => selectProduct(product.id)}
                      style={{ width: '100%', textAlign: 'left', padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', background: C.white, fontFamily: 'Inter, sans-serif', transition: 'background-color 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9f9f9'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.black, marginBottom: 4 }}>{product.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.black }}>{product.price}</div>
                      <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>Ver producto →</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim().length > 0 ? (
              <p style={{ fontSize: 13, color: C.gray, textAlign: 'center', padding: '20px 0', fontFamily: 'Inter, sans-serif' }}>
                No se encontraron productos para "{searchQuery}"
              </p>
            ) : (
              <p style={{ fontSize: 12, color: C.gray, margin: 0, fontFamily: 'Inter, sans-serif' }}>
                Sugerencias: Essential, Oversize, Relax, New arrivals
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
