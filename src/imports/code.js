// ================================================================
// ROMEFIT DESIGN SYSTEM BUILDER — Figma Plugin
// Genera Color Styles, Text Styles, Variables y 3 páginas de UI
// Basado en: app.js + styles.css del repositorio
// github.com/airzraimbow6799-oss/RomeFit
// ================================================================

// ── TOKENS DE COLOR (styles.css :root) ──────────────────────────
const C = {
  black:         '#000000',
  darkGray:      '#111111',
  gray:          '#666666',
  lightGray:     '#f5f5f5',
  border:        '#dddddd',
  white:         '#ffffff',
  red:           '#ff0000',
  greenPrimary:  '#008000',
  greenDark:     '#006400',
  matchGreen:    '#10b981',
  chipSuccessBg: '#e6f4ea',
  chipSuccessFg: '#2d7a3c',
  chipWarningBg: '#fff3e0',
  chipWarningFg: '#b45309',
  transparent:   '#ffffff',
  // PDF dark mode (aspiracional)
  darkBg:        '#0f172a',
  darkSurface:   '#1e293b',
  darkAccent:    '#38bdf8',
  darkText:      '#f1f5f9',
};

// ── SIZE_DATA (app.js — constante SIZE_DATA) ─────────────────────
// widthMod / lengthMod controlan update() del Mannequin3D
// fitPos controla la barra de fit visual (0–100%)
const SIZE_DATA = {
  XS: { wm: 0.00, lm: 0.00, ancho: 42, largo: 66, holgura: 'Slim',    fit: 5  },
  S:  { wm: 0.20, lm: 0.20, ancho: 46, largo: 69, holgura: 'Regular', fit: 22 },
  M:  { wm: 0.38, lm: 0.35, ancho: 50, largo: 71, holgura: 'Regular', fit: 38 },
  L:  { wm: 0.55, lm: 0.50, ancho: 54, largo: 74, holgura: 'Amplio',  fit: 55 },
  XL: { wm: 0.72, lm: 0.65, ancho: 58, largo: 76, holgura: 'Amplio',  fit: 72 },
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

// ── HELPERS ──────────────────────────────────────────────────────
function rgb(hex) {
  const v = hex.replace('#', '');
  return {
    r: parseInt(v.slice(0, 2), 16) / 255,
    g: parseInt(v.slice(2, 4), 16) / 255,
    b: parseInt(v.slice(4, 6), 16) / 255,
  };
}

function solid(hex, opacity = 1) {
  return [{ type: 'SOLID', color: rgb(hex), opacity }];
}

// Crea un TextNode y lo agrega al padre
function txt(parent, chars, size, style, color, x, y, w, align = 'LEFT') {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = solid(color);
  t.textAutoResize = 'HEIGHT';
  t.resize(w, 20);
  t.textAlignHorizontal = align;
  t.x = x;
  t.y = y;
  parent.appendChild(t);
  return t;
}

// Crea un Frame simple
function frame(parent, name, w, h, x, y, fill, radius = 0) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.x = x;
  f.y = y;
  f.fills = fill ? solid(fill) : [{ type: 'SOLID', color: rgb(C.white), opacity: 0 }];
  if (radius) f.cornerRadius = radius;
  if (parent) parent.appendChild(f);
  return f;
}

// Crea un rect
function rect(parent, w, h, x, y, fill, radius = 0) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.x = x; r.y = y;
  r.fills = solid(fill);
  if (radius) r.cornerRadius = radius;
  parent.appendChild(r);
  return r;
}

// Crea un círculo
function circle(parent, size, x, y, fill, strokeColor, strokeW = 0) {
  const e = figma.createEllipse();
  e.resize(size, size);
  e.x = x; e.y = y;
  e.fills = solid(fill);
  if (strokeColor) {
    e.strokes = solid(strokeColor);
    e.strokeWeight = strokeW;
    e.strokeAlign = 'INSIDE';
  }
  parent.appendChild(e);
  return e;
}

// ── MAIN ─────────────────────────────────────────────────────────
async function run() {
  // Cargar todas las variantes de Inter que usaremos
  const fontVariants = [
    'Regular', 'Medium', 'SemiBold', 'Bold',
    'ExtraBold', 'Italic', 'ExtraBold Italic',
  ];
  await Promise.all(
    fontVariants.map(style => figma.loadFontAsync({ family: 'Inter', style }))
  );

  figma.notify('🎨 Creando Color Styles…', { timeout: 1200 });
  buildColorStyles();

  figma.notify('✍️ Creando Text Styles…', { timeout: 1200 });
  buildTextStyles();

  figma.notify('📐 Creando Variables…', { timeout: 1200 });
  buildVariables();

  figma.notify('🖼️ Construyendo páginas…', { timeout: 3000 });
  buildPages();

  figma.notify('✅ RomeFit Design System listo — 3 páginas creadas', { timeout: 5000 });
  figma.closePlugin();
}

// ── COLOR STYLES ─────────────────────────────────────────────────
function buildColorStyles() {
  const defs = [
    // Light mode (CSS real)
    ['RomeFit/Black',          C.black],
    ['RomeFit/DarkGray',       C.darkGray],
    ['RomeFit/Gray',           C.gray],
    ['RomeFit/LightGray',      C.lightGray],
    ['RomeFit/Border',         C.border],
    ['RomeFit/White',          C.white],
    ['RomeFit/Red',            C.red],
    ['RomeFit/Green/Primary',  C.greenPrimary],
    ['RomeFit/Green/Dark',     C.greenDark],
    ['RomeFit/Match',          C.matchGreen],
    ['RomeFit/Chip/SuccessBg', C.chipSuccessBg],
    ['RomeFit/Chip/SuccessFg', C.chipSuccessFg],
    ['RomeFit/Chip/WarningBg', C.chipWarningBg],
    ['RomeFit/Chip/WarningFg', C.chipWarningFg],
    // Dark mode (PDF spec)
    ['Dark/Background',        C.darkBg],
    ['Dark/Surface',           C.darkSurface],
    ['Dark/Accent',            C.darkAccent],
    ['Dark/Text',              C.darkText],
  ];
  defs.forEach(([name, color]) => {
    const s = figma.createPaintStyle();
    s.name = name;
    s.paints = solid(color);
  });
}

// ── TEXT STYLES ──────────────────────────────────────────────────
function buildTextStyles() {
  const defs = [
    // name, size, style, letterSpacing
    ['RomeFit/Logo',      24, 'ExtraBold Italic', -1.0],
    ['RomeFit/H1',        28, 'Medium',            -0.5],
    ['RomeFit/H2',        22, 'SemiBold',           0.0],
    ['RomeFit/H3',        16, 'SemiBold',           0.0],
    ['RomeFit/Nav',       11, 'SemiBold',           0.5],
    ['RomeFit/Body',      14, 'Regular',            0.0],
    ['RomeFit/Label',     13, 'Regular',            0.0],
    ['RomeFit/Caption',   11, 'SemiBold',           0.8],
    ['RomeFit/Micro',     10, 'SemiBold',           0.3],
    ['RomeFit/Badge',     11, 'Bold',               0.5],
    ['RomeFit/SizeBtn',   13, 'SemiBold',           0.3],
    ['RomeFit/Predicted', 28, 'ExtraBold Italic',   0.0],
  ];
  defs.forEach(([name, size, style, ls]) => {
    const s = figma.createTextStyle();
    s.name = name;
    s.fontSize = size;
    s.fontName = { family: 'Inter', style };
    s.letterSpacing = { unit: 'PIXELS', value: ls };
  });
}

// ── VARIABLES ────────────────────────────────────────────────────
function buildVariables() {
  try {
    // Colección con un modo por talla
    const col = figma.variables.createCollection('RomeFit/SizeSystem');
    col.renameMode(col.modes[0].modeId, 'XS');
    const modeIds = { XS: col.modes[0].modeId };
    ['S', 'M', 'L', 'XL'].forEach(s => { modeIds[s] = col.addMode(s); });

    // Variables numéricas (mapean directamente a SIZE_DATA)
    [
      ['talla/widthMod',   'wm'],
      ['talla/lengthMod',  'lm'],
      ['talla/fitPos',     'fit'],
      ['medidas/ancho_cm', 'ancho'],
      ['medidas/largo_cm', 'largo'],
    ].forEach(([name, key]) => {
      const v = figma.variables.createVariable(name, col, 'FLOAT');
      SIZES.forEach(s => v.setValueForMode(modeIds[s], SIZE_DATA[s][key]));
    });

    // Variable string para holgura label
    const hv = figma.variables.createVariable('talla/holgura', col, 'STRING');
    SIZES.forEach(s => hv.setValueForMode(modeIds[s], SIZE_DATA[s].holgura));

    // Colección UI (estado global de la app)
    const ui = figma.variables.createCollection('RomeFit/UI');
    const uiMode = ui.modes[0].modeId;
    const colorV = figma.variables.createVariable('ui/color_activo', ui, 'STRING');
    colorV.setValueForMode(uiMode, 'white');
    const matchV = figma.variables.createVariable('ui/match_pct', ui, 'FLOAT');
    matchV.setValueForMode(uiMode, 94);
    const tallaV = figma.variables.createVariable('ui/talla_activa', ui, 'STRING');
    tallaV.setValueForMode(uiMode, 'M');
  } catch (e) {
    // Variables API requiere plan Professional o superior
    console.warn('Variables API no disponible:', e.message);
    figma.notify('⚠️ Variables requieren plan Professional de Figma', { timeout: 4000 });
  }
}

// ── PÁGINAS ──────────────────────────────────────────────────────
function buildPages() {
  // Página 1: Design System (components)
  const dsPage = figma.createPage();
  dsPage.name = '🎨 Design System';
  figma.currentPage = dsPage;
  buildDesignSystemPage(dsPage);

  // Página 2: Product Page
  const ppPage = figma.createPage();
  ppPage.name = '🛍️ Product Page';
  figma.currentPage = ppPage;
  buildProductPage(ppPage);

  // Página 3: Wizard Modal
  const wzPage = figma.createPage();
  wzPage.name = '⚙️ Wizard Personalizado';
  figma.currentPage = wzPage;
  buildWizardPage(wzPage);

  // Activar Product Page al terminar
  figma.currentPage = ppPage;
}

// ── PÁGINA 1: DESIGN SYSTEM ───────────────────────────────────────
function buildDesignSystemPage(page) {
  let cursorX = 0;

  // ── Sección: Color Palette ──
  addSectionTitle(page, 'Color Palette — styles.css :root', cursorX, -60);
  const colorNames = [
    ['Black',      C.black,      C.white],
    ['DarkGray',   C.darkGray,   C.white],
    ['Gray',       C.gray,       C.white],
    ['LightGray',  C.lightGray,  C.black],
    ['Border',     C.border,     C.black],
    ['White',      C.white,      C.black],
    ['Red',        C.red,        C.white],
    ['Green',      C.greenPrimary, C.white],
    ['Match',      C.matchGreen, C.white],
  ];
  colorNames.forEach(([name, bg, fg], i) => {
    const swatch = frame(page, `Swatch/${name}`, 100, 60, cursorX + i * 110, 0, bg, 6);
    txt(swatch, name, 10, 'SemiBold', fg, 8, 8, 84);
    txt(swatch, bg, 9, 'Regular', fg, 8, 38, 84);
  });

  cursorX = 0;
  let cursorY = 120;

  // ── Sección: Size Buttons ──
  addSectionTitle(page, 'Size Buttons — app.js sizeBtns', cursorX, cursorY - 30);
  SIZES.forEach((size, i) => {
    // Default
    const def = sizeBtn(page, size, false);
    def.x = cursorX + i * 62; def.y = cursorY;
    // Active
    const act = sizeBtn(page, size, true);
    act.x = cursorX + i * 62; act.y = cursorY + 52;
  });
  // Custom button
  const custBtn = frame(page, 'SizeBtn/Personalizado', 320, 42, cursorX, cursorY + 104, C.lightGray, 4);
  custBtn.strokes = solid('#aaaaaa');
  custBtn.strokeWeight = 1.5;
  custBtn.strokeAlign = 'INSIDE';
  txt(custBtn, '⚙  Personalizado — Ingresa tus medidas', 12, 'SemiBold', C.darkGray, 0, 12, 320, 'CENTER');

  // ── Sección: Fit Bars ──
  cursorX = 400;
  addSectionTitle(page, 'Fit Bar — SIZE_DATA fitPos', cursorX, cursorY - 30);
  SIZES.forEach((size, i) => {
    buildFitBarWidget(page, size, cursorX, cursorY + i * 34);
  });

  // ── Sección: Size Preview Panels ──
  cursorX = 700;
  addSectionTitle(page, 'Size Preview Panel — renderMainTshirt()', cursorX, cursorY - 30);
  SIZES.forEach((size, i) => {
    const panel = buildPreviewPanel(size);
    panel.x = cursorX;
    panel.y = cursorY + i * 180;
    page.appendChild(panel);
  });

  // ── Sección: Chips ──
  cursorX = 1080;
  addSectionTitle(page, 'Chips — size-chips', cursorX, cursorY - 30);
  const chipDefs = [
    ['✓ Disponible',   C.chipSuccessBg, C.chipSuccessFg],
    ['Fit ajustado',   '#eeeeee',       '#444444'],
    ['Fit amplio',     '#eeeeee',       '#444444'],
    ['⚙ Talla a medida', C.darkGray,   C.white],
    ['91% Match',      C.matchGreen,    C.white],
  ];
  chipDefs.forEach(([label, bg, fg], i) => {
    const ch = frame(page, `Chip/${label}`, 140, 24, cursorX, cursorY + i * 36, bg, 20);
    txt(ch, label, 10, 'SemiBold', fg, 10, 6, 120);
  });

  // ── Sección: Buttons ──
  cursorX = 1280;
  addSectionTitle(page, 'CTA Buttons', cursorX, cursorY - 30);
  const btnDefs = [
    ['AGREGAR AL CARRITO', C.white,   C.black, C.black],
    ['COMPRAR AHORA',      C.black,   C.white, C.black],
    ['CALCULAR MI TALLA',  C.greenPrimary, C.white, C.greenPrimary],
  ];
  btnDefs.forEach(([label, bg, fg, border], i) => {
    const b = frame(page, `Btn/${label}`, 240, 50, cursorX, cursorY + i * 62, bg);
    b.strokes = solid(border);
    b.strokeWeight = 1;
    txt(b, label, 12, 'SemiBold', fg, 0, 16, 240, 'CENTER');
  });

  // ── Match Badge ──
  cursorX = 1280;
  cursorY = cursorY + 220;
  addSectionTitle(page, 'Match Badge — finishBtn (91–98%)', cursorX, cursorY - 30);
  const badge = frame(page, 'MatchBadge', 110, 28, cursorX, cursorY, C.matchGreen, 14);
  txt(badge, '94% Match', 12, 'Bold', C.white, 0, 7, 110, 'CENTER');
}

// ── PÁGINA 2: PRODUCT PAGE ────────────────────────────────────────
function buildProductPage(page) {
  const root = frame(page, 'RomeFit — Product Page', 1440, 960, 0, 0, C.white);

  // Top banner
  const banner = frame(root, 'TopBanner', 1440, 36, 0, 0, C.black);
  txt(banner, 'ENVÍO GRATIS EN PEDIDOS MAYORES A S/. 150  ·  NUEVA COLECCIÓN DISPONIBLE', 11, 'Medium', C.white, 0, 10, 1440, 'CENTER');

  // Header
  const header = frame(root, 'Header', 1440, 70, 0, 36, C.black);
  txt(header, 'ROME', 24, 'ExtraBold Italic', C.white, 40, 21, 80);
  ['NUEVA COLECCIÓN', 'BESTSELLERS', 'SOBRE NOSOTROS'].forEach((item, i) => {
    txt(header, item, 11, 'SemiBold', C.white, 380 + i * 165, 28, 140);
  });
  const rsBtn = frame(header, 'RomeStoreBtn', 116, 28, 880, 21, C.red, 20);
  txt(rsBtn, 'ROME STORE', 11, 'Bold', C.white, 0, 7, 116, 'CENTER');
  txt(header, '♡   ⊕   🛒', 16, 'Regular', C.white, 1340, 26, 80);

  // Breadcrumb
  txt(root, 'Inicio  >  Colección  >  Polo Oversized Premium', 11, 'Regular', C.gray, 40, 130, 500);

  // ── Visor 3D (izquierda) ──
  const viewer = frame(root, 'Viewer3D [Three.js Canvas]', 580, 700, 80, 165, '#f0f0f0', 4);
  txt(viewer, '[ Three.js Canvas ]', 15, 'Medium', C.gray, 0, 290, 580, 'CENTER');
  txt(viewer, 'male_human_a_pose.glb', 12, 'Regular', '#aaaaaa', 0, 318, 580, 'CENTER');
  txt(viewer, 'oversized_t-shirt.glb', 12, 'Regular', '#aaaaaa', 0, 338, 580, 'CENTER');
  txt(viewer, 'OrbitControls  ·  FOV 45°  ·  Alpha background  ·  AmbientLight 0.6', 10, 'Regular', '#bbbbbb', 0, 368, 580, 'CENTER');
  // Simulación de maniquí (figura simplificada)
  circle(viewer, 60, 260, 80, '#333333', null);  // cabeza
  rect(viewer, 120, 180, 230, 148, '#222222', 4); // torso
  rect(viewer, 50, 160, 200, 160, '#222222');     // brazo izq
  rect(viewer, 50, 160, 330, 160, '#222222');     // brazo der
  rect(viewer, 56, 200, 234, 324, '#222222');     // pierna izq
  rect(viewer, 56, 200, 290, 324, '#222222');     // pierna der
  // camiseta oversized encima
  rect(viewer, 160, 185, 210, 144, '#dddddd', 4); // camiseta blanca
  rect(viewer, 70, 155, 214, 155, '#dddddd');      // manga izq
  rect(viewer, 70, 155, 296, 155, '#dddddd');      // manga der

  // ── Panel de detalles (derecha) ──
  const DX = 740;

  // Título y precio
  txt(root, 'Polo Oversized Premium', 28, 'Medium', C.black, DX, 165, 420);
  txt(root, 'S/. 89.90', 16, 'SemiBold', C.black, DX, 210, 150);

  // Color
  txt(root, 'COLOR: BLANCO', 13, 'Regular', C.gray, DX, 262, 200);
  circle(root, 30, DX, 286, C.white, C.black, 1.5);   // blanco activo
  circle(root, 30, DX + 40, 286, C.black, C.border, 1); // negro

  // Talla
  txt(root, 'TALLA: M', 13, 'Regular', C.gray, DX, 342, 200);

  // Grid de botones de talla
  SIZES.forEach((s, i) => {
    const b = sizeBtn(root, s, s === 'M');
    b.x = DX + i * 62; b.y = 368;
  });

  // Botón personalizado
  const custB = frame(root, 'Btn/Personalizado', 320, 42, DX, 420, '#f8f8f8', 4);
  custB.strokes = solid('#aaaaaa');
  custB.strokeWeight = 1.5;
  custB.strokeAlign = 'INSIDE';
  txt(custB, '⚙  Personalizado — Ingresa tus medidas', 12, 'SemiBold', C.darkGray, 0, 12, 320, 'CENTER');

  // Size Preview Panel (talla M por defecto)
  const panel = buildPreviewPanel('M');
  panel.x = DX; panel.y = 476;
  root.appendChild(panel);

  // Cantidad
  const qty = frame(root, 'Quantity', 140, 50, DX, 656, null);
  qty.strokes = solid(C.border);
  qty.strokeWeight = 1;
  txt(qty, '−', 18, 'Regular', C.gray, 14, 14, 20);
  txt(qty, '1', 14, 'Medium', C.black, 60, 15, 20, 'CENTER');
  txt(qty, '+', 18, 'Regular', C.gray, 106, 14, 20);
  txt(root, 'Guía de tallas', 12, 'Regular', C.gray, DX + 160, 673, 120);

  // Botones CTA
  const cartBtn = frame(root, 'Btn/AddToCart', 320, 50, DX, 726, C.white);
  cartBtn.strokes = solid(C.black); cartBtn.strokeWeight = 1;
  txt(cartBtn, 'AGREGAR AL CARRITO', 12, 'SemiBold', C.black, 0, 16, 320, 'CENTER');

  const buyBtn = frame(root, 'Btn/BuyNow', 320, 50, DX, 786, C.black);
  txt(buyBtn, 'COMPRAR AHORA', 12, 'SemiBold', C.white, 0, 16, 320, 'CENTER');

  // Secure payment
  const sepLine = rect(root, 320, 1, DX, 854, C.border);
  txt(root, '🔒  Pago 100% seguro', 14, 'Medium', C.black, DX, 866, 220);
  txt(root, 'Aceptamos Bitcoin, Ethereum y criptomonedas', 12, 'Regular', C.gray, DX, 890, 320);
  txt(root, '💳  🅿️  ₿', 22, 'Regular', C.black, DX, 914, 120);

  page.appendChild(root);
}

// ── PÁGINA 3: WIZARD MODAL ────────────────────────────────────────
function buildWizardPage(page) {
  // Background (product page detrás)
  const bg = frame(page, 'Background [ProductPage]', 1440, 900, 0, 0, '#e8e8e8');
  txt(bg, 'Fondo: Product Page (ver página 🛍️)', 14, 'Regular', '#aaaaaa', 0, 430, 1440, 'CENTER');

  // Overlay oscuro
  const overlay = frame(page, 'Overlay', 1440, 900, 0, 0, null);
  overlay.fills = [{ type: 'SOLID', color: rgb(C.black), opacity: 0.6 }];
  page.appendChild(overlay);

  // Modal wide (split layout — modal-wide + modal-split del CSS)
  const modal = frame(page, 'Modal/CustomSize [modal-wide]', 1050, 580, 195, 160, C.white, 8);
  modal.clipsContent = true;
  page.appendChild(modal);

  // ── Lado izquierdo: Wizard ──
  const wiz = frame(modal, 'WizardSide [modal-wizard-side]', 660, 580, 0, 0, C.white);

  // Cerrar
  txt(wiz, '✕', 22, 'Regular', C.gray, 620, 14, 22);

  // Título + subtítulo
  txt(wiz, 'Encuentra tu talla perfecta', 22, 'SemiBold', C.black, 32, 36, 440);
  txt(wiz, 'Completa los pasos para obtener tu recomendación personalizada', 13, 'Regular', C.gray, 32, 68, 520);

  // Progress bar (Paso 1 de 4)
  rect(wiz, 596, 4, 32, 104, C.border, 2);
  rect(wiz, 149, 4, 32, 104, C.black, 2); // 33%

  // Paso 1: Medidas
  txt(wiz, 'Paso 1: Tus medidas', 16, 'SemiBold', C.black, 32, 122, 300);

  const fields = [
    ['Estatura (cm)', 'Ej: 175'],
    ['Peso (kg)',     'Ej: 70'],
    ['Edad (años)',   'Ej: 25'],
  ];
  fields.forEach(([label, ph], i) => {
    txt(wiz, label, 13, 'Regular', C.gray, 32, 158 + i * 74, 200);
    const inp = frame(wiz, `Input/${label}`, 596, 44, 32, 180 + i * 74, C.white, 4);
    inp.strokes = solid(C.border);
    inp.strokeWeight = 1;
    txt(inp, ph, 14, 'Regular', C.border, 12, 12, 200);
  });

  // Botones de navegación
  const prevBtn = frame(wiz, 'Btn/Prev', 100, 44, 32, 510, C.white);
  prevBtn.strokes = solid(C.border); prevBtn.strokeWeight = 1;
  txt(prevBtn, '← Anterior', 13, 'SemiBold', C.black, 0, 13, 100, 'CENTER');

  const nextBtn = frame(wiz, 'Btn/Next', 120, 44, 508, 510, C.black);
  txt(nextBtn, 'Siguiente →', 13, 'SemiBold', C.white, 0, 13, 120, 'CENTER');

  // ── Lado derecho: Preview (dark) ──
  const prev = frame(modal, 'PreviewSide [modal-preview-side]', 390, 580, 660, 0, '#111111');

  txt(prev, 'VISTA PREVIA EN TIEMPO REAL', 10, 'SemiBold', '#888888', 0, 24, 390, 'CENTER');

  // Canvas 3D oscuro (placeholder)
  const darkCanvas = frame(prev, 'Canvas3D [modal-3d-container]', 300, 220, 45, 46, '#1a1a1a', 6);
  txt(darkCanvas, '[ Three.js Canvas ]', 12, 'Regular', '#555555', 0, 90, 300, 'CENTER');
  txt(darkCanvas, 'modal-3d-container', 10, 'Regular', '#444444', 0, 114, 300, 'CENTER');
  txt(darkCanvas, 'modalMannequin.update()', 10, 'Regular', '#444444', 0, 132, 300, 'CENTER');

  // Talla estimada
  txt(prev, 'TALLA ESTIMADA', 10, 'SemiBold', '#888888', 0, 284, 390, 'CENTER');
  txt(prev, '—', 28, 'ExtraBold Italic', C.white, 0, 302, 390, 'CENTER');

  // Live stats (wizardData en tiempo real)
  const statLabels = [
    ['📏', 'Estatura'],
    ['⚖️', 'Peso'],
    ['👕', 'Torso'],
    ['🫁', 'Abdomen'],
    ['🔧', 'Holgura'],
  ];
  statLabels.forEach(([icon, label], i) => {
    const row = frame(prev, `LiveStat/${label}`, 350, 30, 20, 348 + i * 36, null, 6);
    row.fills = [{ type: 'SOLID', color: rgb(C.white), opacity: 0.05 }];
    txt(row, `${icon}  ${label}`, 11, 'Regular', '#999999', 10, 8, 200);
    txt(row, '—', 11, 'Bold', C.white, 300, 8, 40, 'CENTER');
  });

  // Fit bar dark (modal-fit-bar del CSS)
  txt(prev, 'Slim', 10, 'Regular', '#777777', 20, 540, 30);
  txt(prev, 'Oversize', 10, 'Regular', '#777777', 310, 540, 60);
  rect(prev, 260, 6, 60, 543, '#ffffff33', 3);
  const df = rect(prev, 100, 6, 60, 543, C.white, 3); // 38% = M default

  // Match badge (aparece al finalizar el wizard)
  const matchBadge = frame(prev, 'MatchBadge [hidden initially]', 120, 28, 135, 550, C.matchGreen, 14);
  txt(matchBadge, '94% Match', 12, 'Bold', C.white, 0, 7, 120, 'CENTER');

  // ── Loading overlay (se muestra al presionar "Calcular") ──
  const loadingOverlay = frame(page, 'Loading [loading-container]', 500, 200, 470, 350, C.white, 8);
  loadingOverlay.fills = [{ type: 'SOLID', color: rgb(C.white), opacity: 0.95 }];
  txt(loadingOverlay, '⏳', 36, 'Regular', C.black, 0, 30, 500, 'CENTER');
  txt(loadingOverlay, 'Analizando anatomía y biometría…', 14, 'Medium', C.black, 0, 90, 500, 'CENTER');
  txt(loadingOverlay, 'Procesando modelo de Machine Learning…', 13, 'Regular', C.gray, 0, 118, 500, 'CENTER');
  txt(loadingOverlay, 'Simulando caída de tela (gramaje)…', 13, 'Regular', C.gray, 0, 142, 500, 'CENTER');
  page.appendChild(loadingOverlay);

  // ── Modal de Confección (cuando peso >= 120) ──
  const confModal = frame(page, 'Modal/Confeccion [confeccion-modal]', 500, 440, 470, 230, C.white, 8);
  txt(confModal, '✕', 22, 'Regular', C.gray, 462, 14, 22);
  txt(confModal, '✂️', 40, 'Regular', C.black, 0, 40, 500, 'CENTER');
  txt(confModal, 'Confección Artesanal', 22, 'SemiBold', C.black, 0, 96, 500, 'CENTER');
  txt(confModal, 'Tu talla requiere confección personalizada.\nNuestros artesanos crearán tu polo a medida.', 14, 'Regular', C.gray, 40, 132, 420, 'CENTER');
  const infoBox = frame(confModal, 'InfoBox', 420, 80, 40, 196, C.lightGray, 4);
  txt(infoBox, 'Tiempo de entrega: 7–10 días hábiles', 13, 'Regular', C.black, 16, 12, 388);
  txt(infoBox, 'Costo adicional: S/. 30.00', 13, 'Regular', C.black, 16, 36, 388);
  txt(infoBox, 'Garantía de ajuste perfecto', 13, 'Regular', C.black, 16, 58, 388);
  const confBuyBtn = frame(confModal, 'Btn/ConfeccionBuy', 420, 50, 40, 296, C.black);
  txt(confBuyBtn, 'SOLICITAR CONFECCIÓN — S/. 119.90', 12, 'SemiBold', C.white, 0, 16, 420, 'CENTER');
  page.appendChild(confModal);
}

// ── HELPERS DE COMPONENTES ────────────────────────────────────────

// Botón de talla (Default o Active)
function sizeBtn(parent, size, isActive) {
  const f = frame(parent, `SizeBtn/${size}/${isActive ? 'Active' : 'Default'}`, 52, 42, 0, 0, isActive ? C.black : C.white, 4);
  f.strokes = solid(isActive ? C.black : C.border);
  f.strokeWeight = 1.5;
  f.strokeAlign = 'INSIDE';
  txt(f, size, 13, 'SemiBold', isActive ? C.white : C.black, 0, 12, 52, 'CENTER');
  return f;
}

// Widget de Fit Bar
function buildFitBarWidget(parent, size, x, y) {
  const data = SIZE_DATA[size];
  const fw = Math.max(4, (data.fit / 100) * 200);
  const container = frame(parent, `FitBar/${size}`, 280, 20, x, y, null);
  rect(container, 200, 6, 0, 7, C.border, 3);
  rect(container, fw, 6, 0, 7, C.black, 3);
  circle(container, 14, fw - 7, 3, C.black, C.white, 2);
  txt(container, `${size}  ${data.fit}%  |  ${data.ancho}cm × ${data.largo}cm`, 10, 'SemiBold', C.gray, 218, 4, 60);
  return container;
}

// Panel de preview de talla
function buildPreviewPanel(size) {
  const data = SIZE_DATA[size];
  const p = frame(null, `SizePreviewPanel/${size}`, 320, 160, 0, 0, '#f9f9f9', 8);
  p.strokes = solid(C.border);
  p.strokeWeight = 1;
  p.strokeAlign = 'INSIDE';

  // Header
  txt(p, 'MEDIDAS', 11, 'SemiBold', C.gray, 12, 12, 80);

  const badge = frame(p, 'Badge', 34, 22, 274, 10, C.black, 20);
  txt(badge, size, 11, 'Bold', C.white, 0, 5, 34, 'CENTER');

  // Metric cards
  [
    { label: 'ANCHO',   val: `${data.ancho} cm` },
    { label: 'LARGO',   val: `${data.largo} cm` },
    { label: 'HOLGURA', val: data.holgura },
  ].forEach((m, i) => {
    const card = frame(p, `Metric/${m.label}`, 90, 52, 12 + i * 102, 40, C.white, 6);
    card.strokes = solid(C.border); card.strokeWeight = 1;
    txt(card, m.label, 10, 'SemiBold', C.gray, 8, 8, 74);
    txt(card, m.val, 13, 'Bold', C.black, 8, 28, 74);
  });

  // Fit bar
  txt(p, 'Slim', 10, 'Regular', C.gray, 12, 105, 26);
  txt(p, 'Oversize', 10, 'Regular', C.gray, 270, 105, 46);
  const fw = Math.max(4, (data.fit / 100) * 190);
  rect(p, 190, 6, 48, 108, C.border, 3);
  rect(p, fw, 6, 48, 108, C.black, 3);
  circle(p, 14, 48 + fw - 7, 105, C.black, C.white, 2);

  // Chip
  const chipText = ['XS', 'S'].includes(size)
    ? 'Fit ajustado' : ['L', 'XL'].includes(size)
    ? 'Fit amplio' : 'Talla estándar';
  const chip = frame(p, 'Chip/Available', 160, 22, 12, 132, C.chipSuccessBg, 20);
  txt(chip, `✓ Disponible  ·  ${chipText}`, 10, 'SemiBold', C.chipSuccessFg, 8, 5, 144);

  return p;
}

// Título de sección en el canvas
function addSectionTitle(page, text, x, y) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: 'Bold' };
  t.fontSize = 13;
  t.characters = text;
  t.fills = solid(C.gray);
  t.x = x; t.y = y;
  page.appendChild(t);
}

// ── EJECUTAR ──────────────────────────────────────────────────────
run().catch(err => {
  console.error('[RomeFit Plugin]', err);
  figma.notify('❌ Error: ' + err.message, { timeout: 6000 });
  figma.closePlugin();
});
