import React, { useState } from 'react';
import { C } from './tokens';
import { useResponsive } from '../../hooks/useResponsive';

export function Footer() {
  const { isMobile, isTablet } = useResponsive();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
    }
  }

  const colStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: C.white,
    letterSpacing: '1.2px',
    marginBottom: 14,
  };

  const linkStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#999999',
    textDecoration: 'none',
    lineHeight: 1,
    display: 'block',
    marginBottom: 10,
    transition: 'color 0.15s',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontFamily: 'Inter, sans-serif',
    textAlign: 'left',
  };

  return (
    <footer style={{ backgroundColor: '#111111', color: C.white, fontFamily: 'Inter, sans-serif' }}>

      {/* ── Main grid ── */}
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: isMobile
          ? '40px 20px 32px'
          : isTablet
          ? '52px 24px 40px'
          : '56px 40px 44px',
        display: 'grid',
        gridTemplateColumns: isMobile
          ? '1fr 1fr'
          : isTablet
          ? '1.4fr 1fr 1fr'
          : '1.6fr 0.9fr 0.9fr 1.4fr',
        gap: isMobile ? '32px 24px' : 40,
      }}>

        {/* ── Column 1: Brand / CEO bio ── */}
        <div style={{
          ...colStyle,
          gridColumn: isMobile ? '1 / -1' : undefined,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 10 }}>
            Gonzalo Santisteban CEO de ROME
          </div>
          <p style={{
            fontSize: 13,
            color: '#999999',
            lineHeight: 1.65,
            margin: '0 0 20px',
            maxWidth: 280,
          }}>
            Lo que comenzó como un arduo trabajo desde cero, se ha convertido en una carrera exponencial y presencia importante dentro de la moda peruana.
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 0 }}>
            {/* Facebook */}
            <button
              title="Facebook"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: C.white, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                padding: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </button>
            {/* Instagram */}
            <button
              title="Instagram"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: C.white, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                padding: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </button>
            {/* TikTok */}
            <button
              title="TikTok"
              style={{
                width: 34, height: 34, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: C.white, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                padding: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.76a4.86 4.86 0 01-1.02-.07z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Column 2: AYUDA ── */}
        <div style={colStyle}>
          <div style={headingStyle}>AYUDA</div>
          {['Contacto', 'Libro de Reclamaciones'].map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={linkStyle}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.white; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#999999'; }}
            >
              {link}
            </a>
          ))}

          {/* Direcciones — shown in mobile below AYUDA, in desktop same column */}
          {!isMobile && (
            <div style={{ marginTop: 24 }}>
              <div style={headingStyle}>DIRECCIONES</div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={linkStyle}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.white; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#999999'; }}
              >
                Direcciones
              </a>
            </div>
          )}
        </div>

        {/* ── Column 3: INFORMACIÓN ── */}
        <div style={colStyle}>
          <div style={headingStyle}>INFORMACIÓN</div>
          {['Preguntas Frecuentes', 'Políticas del Servicio'].map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={linkStyle}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.white; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#999999'; }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* ── Column 4: Newsletter ── */}
        <div style={{
          ...colStyle,
          gridColumn: isMobile ? '1 / -1' : undefined,
        }}>
          <div style={headingStyle}>SUSCRIBETE PARA RECIBIR ACTUALIZACIONES</div>

          {subscribed ? (
            <div style={{
              backgroundColor: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.4)',
              borderRadius: 4,
              padding: '12px 14px',
              fontSize: 13,
              color: '#4ade80',
            }}>
              ✓ ¡Suscrito exitosamente! Revisa tu correo.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #444', marginBottom: 0 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Su correo electrónico"
                  required
                  style={{
                    flex: 1,
                    height: 40,
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: '0 8px 0 0',
                    fontSize: 13,
                    color: C.white,
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    height: 40,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: C.white,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                    paddingLeft: 12,
                    paddingRight: 0,
                  }}
                >
                  SUSCRÍBASE A
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Mobile: DIRECCIONES */}
        {isMobile && (
          <div style={colStyle}>
            <div style={headingStyle}>DIRECCIONES</div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={linkStyle}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = C.white; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#999999'; }}
            >
              Direcciones
            </a>
          </div>
        )}
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: isMobile ? '16px 20px 20px' : '16px 40px',
        maxWidth: 1300,
        margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 14 : 0,
      }}>
        {/* Copyright */}
        <div style={{ fontSize: 12, color: '#666666', lineHeight: 1.5 }}>
          Copyright © 2026, Rome Store. Todos los derechos reservados.{' '}
          <a href="#" onClick={(e) => e.preventDefault()}
            style={{ color: '#666666', textDecoration: 'underline', cursor: 'pointer' }}>
            Consulte nuestras condiciones de uso y el aviso de privacidad.
          </a>
        </div>

        {/* Payment methods */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {/* American Express */}
          <div style={{
            width: 40, height: 26, borderRadius: 4,
            backgroundColor: '#016FD0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: 7, fontWeight: 800, fontFamily: 'Arial, sans-serif', letterSpacing: '0px' }}>AMEX</span>
          </div>
          {/* Diners */}
          <div style={{
            width: 40, height: 26, borderRadius: 4,
            backgroundColor: '#004A97',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <span style={{ color: '#fff', fontSize: 5.5, fontWeight: 700, lineHeight: 1 }}>DINERS</span>
              <span style={{ color: '#fff', fontSize: 5.5, fontWeight: 700, lineHeight: 1 }}>CLUB</span>
            </div>
          </div>
          {/* Mastercard */}
          <div style={{
            width: 40, height: 26, borderRadius: 4,
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#EB001B' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: -7 }} />
            </div>
          </div>
          {/* Visa */}
          <div style={{
            width: 40, height: 26, borderRadius: 4,
            backgroundColor: '#1A1F71',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.5px' }}>VISA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
