import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { C } from './tokens';
import { useResponsive } from '../../hooks/useResponsive';

type LoginView = 'login' | 'register' | 'forgot';

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (email?: string) => void;
  /** Context hint shown below the title */
  contextHint?: string;
}

/* ── Email regex ─────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate_email(v: string): string | null {
  if (!v) return 'El correo es requerido';
  if (!v.includes('@')) return 'El correo debe contener "@"';
  if (!EMAIL_RE.test(v)) return 'Ingresa un correo válido (ej: nombre@dominio.com)';
  return null;
}

function validate_password(v: string, min = 6): string | null {
  if (!v) return 'La contraseña es requerida';
  if (v.length < min) return `Mínimo ${min} caracteres`;
  return null;
}

/* ── Underline Input ─────────────────────────────────────────────── */
function UnderlineInput({
  label, type = 'text', value, onChange, error, placeholder, autoComplete,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string | null;
  placeholder?: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasVal = value.length > 0;
  return (
    <div style={{ marginBottom: 24, position: 'relative' }}>
      {/* Floating label */}
      <label style={{
        display: 'block', marginBottom: 6,
        fontSize: 12, fontWeight: 600, letterSpacing: '0.4px',
        color: error ? '#dc2626' : focused ? C.black : '#888888',
        fontFamily: 'Inter, sans-serif',
        transition: 'color 0.15s',
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          height: 44, padding: '0 0 8px',
          border: 'none', borderBottom: `2px solid ${error ? '#dc2626' : focused ? C.black : '#dddddd'}`,
          outline: 'none', fontSize: 15,
          color: C.black, backgroundColor: 'transparent',
          fontFamily: 'Inter, sans-serif',
          transition: 'border-color 0.15s',
        }}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.16 }}
            style={{
              overflow: 'hidden', marginTop: 5,
              fontSize: 11, color: '#dc2626',
              fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
      style={{ display: 'inline-block', fontSize: 16, lineHeight: 1 }}
    >⏳</motion.span>
  );
}

/* ── Main Component ──────────────────────────────────────────────── */
export function LoginModal({ open, onClose, onSuccess, contextHint }: LoginModalProps) {
  const [view, setView] = useState<LoginView>('login');

  /* Login state */
  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginEmailErr, setLoginEmailErr] = useState<string | null>(null);
  const [loginPassErr,  setLoginPassErr]  = useState<string | null>(null);
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginGenErr,   setLoginGenErr]   = useState<string | null>(null);

  /* Register state */
  const [regName,      setRegName]      = useState('');
  const [regEmail,     setRegEmail]     = useState('');
  const [regPassword,  setRegPassword]  = useState('');
  const [regConfirm,   setRegConfirm]   = useState('');
  const [regNameErr,   setRegNameErr]   = useState<string | null>(null);
  const [regEmailErr,  setRegEmailErr]  = useState<string | null>(null);
  const [regPassErr,   setRegPassErr]   = useState<string | null>(null);
  const [regConfErr,   setRegConfErr]   = useState<string | null>(null);
  const [regLoading,   setRegLoading]   = useState(false);

  /* Forgot state */
  const [forgotEmail,   setForgotEmail]   = useState('');
  const [forgotEmailErr,setForgotEmailErr]= useState<string | null>(null);
  const [forgotSent,    setForgotSent]    = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  /* Reset all on open/close */
  useEffect(() => {
    if (open) {
      setView('login');
      setLoginEmail(''); setLoginPassword('');
      setLoginEmailErr(null); setLoginPassErr(null); setLoginGenErr(null); setLoginLoading(false);
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirm('');
      setRegNameErr(null); setRegEmailErr(null); setRegPassErr(null); setRegConfErr(null); setRegLoading(false);
      setForgotEmail(''); setForgotEmailErr(null); setForgotSent(false); setForgotLoading(false);
    }
  }, [open]);

  /* ── Login submit ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const eErr = validate_email(loginEmail);
    const pErr = validate_password(loginPassword, 4);
    setLoginEmailErr(eErr);
    setLoginPassErr(pErr);
    setLoginGenErr(null);
    if (eErr || pErr) return;

    setLoginLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoginLoading(false);
    onSuccess(loginEmail);
  }

  /* ── Register submit ── */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const nErr = regName.trim().length < 2 ? 'Ingresa tu nombre completo' : null;
    const eErr = validate_email(regEmail);
    const pErr = validate_password(regPassword, 6);
    const cErr = regConfirm !== regPassword ? 'Las contraseñas no coinciden' : null;
    setRegNameErr(nErr); setRegEmailErr(eErr); setRegPassErr(pErr); setRegConfErr(cErr);
    if (nErr || eErr || pErr || cErr) return;

    setRegLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setRegLoading(false);
    onSuccess(regEmail);
  }

  /* ── Forgot submit ── */
  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    const eErr = validate_email(forgotEmail);
    setForgotEmailErr(eErr);
    if (eErr) return;
    setForgotLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setForgotLoading(false);
    setForgotSent(true);
  }

  const { isMobile } = useResponsive();

  if (!open) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        zIndex: 25000, backdropFilter: 'blur(4px)',
        padding: isMobile ? '0' : '16px',
      }}
    >
      <motion.div
        initial={isMobile ? { opacity: 1, y: '100%' } : { opacity: 0, scale: 0.96, y: 14 }}
        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
        exit={isMobile ? { opacity: 1, y: '100%' } : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: isMobile ? '16px 16px 0 0' : 12,
          width: '100%', maxWidth: isMobile ? '100%' : 440,
          maxHeight: isMobile ? '92vh' : '92vh',
          overflowY: 'auto',
          boxShadow: '0 32px 100px rgba(0,0,0,0.40)',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
        }}
      >
        {/* Mobile drag handle */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d1d5db' }} />
          </div>
        )}

        {/* ── Header ── */}
        <div style={{
          backgroundColor: C.black,
          borderRadius: isMobile ? 0 : '12px 12px 0 0',
          padding: isMobile ? '16px 20px 14px' : '22px 28px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, fontStyle: 'italic', color: '#ffffff', letterSpacing: '-1px' }}>ROME</div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 20, color: '#888888', cursor: 'pointer', lineHeight: 1 }}
          >✕</button>
        </div>

        <div style={{ padding: isMobile ? '24px 20px 28px' : '32px 36px 36px' }}>

          <AnimatePresence mode="wait">

            {/* ════════════════════════ LOGIN ════════════════════════ */}
            {view === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <h2 style={{ fontSize: 26, fontWeight: 700, color: C.black, textAlign: 'center', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
                  INGRESA EN
                </h2>

                {contextHint && (
                  <p style={{ fontSize: 13, color: '#888888', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>
                    {contextHint}
                  </p>
                )}

                {/* Generic error */}
                <AnimatePresence>
                  {loginGenErr && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        marginBottom: 16, padding: '10px 14px',
                        backgroundColor: '#fff5f5', border: '1.5px solid #fca5a5',
                        borderRadius: 8, fontSize: 13, color: '#dc2626',
                      }}
                    >
                      {loginGenErr}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} noValidate>
                  <UnderlineInput
                    label="Correo Electrónico"
                    type="email"
                    value={loginEmail}
                    onChange={(v) => { setLoginEmail(v); setLoginEmailErr(null); setLoginGenErr(null); }}
                    error={loginEmailErr}
                    placeholder="nombre@correo.com"
                    autoComplete="email"
                  />
                  <UnderlineInput
                    label="Contraseña"
                    type="password"
                    value={loginPassword}
                    onChange={(v) => { setLoginPassword(v); setLoginPassErr(null); setLoginGenErr(null); }}
                    error={loginPassErr}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />

                  <button
                    type="submit"
                    disabled={loginLoading}
                    style={{
                      width: '100%', height: 52, marginTop: 8,
                      backgroundColor: loginLoading ? '#444444' : C.black,
                      color: '#ffffff', border: 'none', borderRadius: 6,
                      fontSize: 13, fontWeight: 700, letterSpacing: '1.2px',
                      cursor: loginLoading ? 'wait' : 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {loginLoading ? <><Spinner /> VERIFICANDO…</> : 'INICIAR SESIÓN'}
                  </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18, fontSize: 13, color: '#888888' }}>
                  <button
                    onClick={() => setView('forgot')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#555555', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}
                  >
                    ¿Olvidó su contraseña?
                  </button>
                  <span style={{ color: '#cccccc' }}>/</span>
                  <button
                    onClick={() => setView('register')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#555555', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}
                  >
                    Crear una cuenta
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════ REGISTER ════════════════════════ */}
            {view === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                <h2 style={{ fontSize: 24, fontWeight: 700, color: C.black, textAlign: 'center', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
                  CREAR CUENTA
                </h2>
                {contextHint && (
                  <p style={{ fontSize: 13, color: '#888888', textAlign: 'center', margin: '0 0 22px', lineHeight: 1.5 }}>
                    {contextHint}
                  </p>
                )}

                <form onSubmit={handleRegister} noValidate>
                  <UnderlineInput
                    label="Nombre Completo"
                    value={regName}
                    onChange={(v) => { setRegName(v); setRegNameErr(null); }}
                    error={regNameErr}
                    placeholder="Tu nombre"
                    autoComplete="name"
                  />
                  <UnderlineInput
                    label="Correo Electrónico"
                    type="email"
                    value={regEmail}
                    onChange={(v) => { setRegEmail(v); setRegEmailErr(null); }}
                    error={regEmailErr}
                    placeholder="nombre@correo.com"
                    autoComplete="email"
                  />
                  <UnderlineInput
                    label="Contraseña"
                    type="password"
                    value={regPassword}
                    onChange={(v) => { setRegPassword(v); setRegPassErr(null); }}
                    error={regPassErr}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                  />
                  <UnderlineInput
                    label="Confirmar Contraseña"
                    type="password"
                    value={regConfirm}
                    onChange={(v) => { setRegConfirm(v); setRegConfErr(null); }}
                    error={regConfErr}
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                  />

                  <button
                    type="submit"
                    disabled={regLoading}
                    style={{
                      width: '100%', height: 52, marginTop: 4,
                      backgroundColor: regLoading ? '#444444' : C.black,
                      color: '#ffffff', border: 'none', borderRadius: 6,
                      fontSize: 13, fontWeight: 700, letterSpacing: '1.2px',
                      cursor: regLoading ? 'wait' : 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {regLoading ? <><Spinner /> CREANDO CUENTA…</> : 'CREAR Y CONTINUAR'}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 18 }}>
                  <button
                    onClick={() => setView('login')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#555555', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}
                  >
                    ← Volver a iniciar sesión
                  </button>
                </div>
              </motion.div>
            )}

            {/* ════════════════════════ FORGOT PASSWORD ════════════════════════ */}
            {view === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
              >
                {!forgotSent ? (
                  <>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: C.black, textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
                      RECUPERAR CONTRASEÑA
                    </h2>
                    <p style={{ fontSize: 13, color: '#888888', textAlign: 'center', margin: '0 0 26px', lineHeight: 1.55 }}>
                      Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                    </p>

                    <form onSubmit={handleForgot} noValidate>
                      <UnderlineInput
                        label="Correo Electrónico"
                        type="email"
                        value={forgotEmail}
                        onChange={(v) => { setForgotEmail(v); setForgotEmailErr(null); }}
                        error={forgotEmailErr}
                        placeholder="nombre@correo.com"
                        autoComplete="email"
                      />
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        style={{
                          width: '100%', height: 52, marginTop: 4,
                          backgroundColor: forgotLoading ? '#444' : C.black,
                          color: '#ffffff', border: 'none', borderRadius: 6,
                          fontSize: 13, fontWeight: 700, letterSpacing: '1px',
                          cursor: forgotLoading ? 'wait' : 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                          transition: 'background-color 0.2s',
                        }}
                      >
                        {forgotLoading ? <><Spinner /> ENVIANDO…</> : 'ENVIAR ENLACE'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.black, margin: '0 0 10px' }}>¡Correo enviado!</h3>
                    <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px', lineHeight: 1.6 }}>
                      Revisa tu bandeja de entrada en <strong style={{ color: C.black }}>{forgotEmail}</strong>. El enlace expira en 15 minutos.
                    </p>
                  </div>
                )}

                <div style={{ textAlign: 'center', marginTop: forgotSent ? 0 : 18 }}>
                  <button
                    onClick={() => setView('login')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#555555', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}
                  >
                    ← Volver a iniciar sesión
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Bottom trust badges */}
          <div style={{
            marginTop: 28, paddingTop: 20, borderTop: '1px solid #f0f0f0',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20,
          }}>
            {['🔒 SSL Seguro', '🛡 Datos protegidos', '✔ Compra garantizada'].map((t) => (
              <span key={t} style={{ fontSize: 10, color: '#aaaaaa', fontFamily: 'Inter, sans-serif' }}>{t}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
