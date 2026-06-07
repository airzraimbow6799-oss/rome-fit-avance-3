export const C = {
  black:         '#000000',
  darkGray:      '#1a1a1a',
  gray:          '#666666',
  lightGray:     '#f5f5f5',
  border:        '#dddddd',
  white:         '#ffffff',
  red:           '#C00000',  // Rome Store primary brand color (dark red)
  redDark:       '#8B0000',  // Darker variant
  greenPrimary:  '#2E7D32',  // Success/confirmation color
  greenDark:     '#1B5E20',
  matchGreen:    '#10b981',
  yellow:        '#F57C00',  // Warning color
  chipSuccessBg: '#e6f4ea',
  chipSuccessFg: '#2d7a3c',
  chipWarningBg: '#fff3e0',
  chipWarningFg: '#b45309',
  darkBg:        '#0f172a',
  darkSurface:   '#1e293b',
  darkAccent:    '#38bdf8',
  darkText:      '#f1f5f9',
} as const;

export type SizeName = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

export interface SizeInfo {
  wm: number;
  lm: number;
  ancho: number;
  largo: number;
  hombro: number; // añadido para la pantalla de comparación
  holgura: 'Slim' | 'Regular' | 'Amplio';
  fit: number;
}

export const SIZE_DATA: Record<SizeName, SizeInfo> = {
  XS:   { wm: 0.00, lm: 0.00, ancho: 42, largo: 66, hombro: 42, holgura: 'Slim',    fit: 5  },
  S:    { wm: 0.20, lm: 0.20, ancho: 46, largo: 69, hombro: 45, holgura: 'Regular', fit: 22 },
  M:    { wm: 0.38, lm: 0.35, ancho: 50, largo: 71, hombro: 48, holgura: 'Regular', fit: 38 },
  L:    { wm: 0.55, lm: 0.50, ancho: 54, largo: 74, hombro: 51, holgura: 'Amplio',  fit: 55 },
  XL:   { wm: 0.72, lm: 0.65, ancho: 58, largo: 76, hombro: 54, holgura: 'Amplio',  fit: 72 },
  XXL:  { wm: 0.86, lm: 0.80, ancho: 62, largo: 78, hombro: 57, holgura: 'Amplio',  fit: 88 },
  XXXL: { wm: 0.96, lm: 0.92, ancho: 66, largo: 80, hombro: 60, holgura: 'Amplio',  fit: 96 },
};

/** Tallas disponibles en stock (botones en la página de producto) */
export const SIZES: SizeName[] = ['XS', 'S', 'M', 'L', 'XL'];

/** Tallas que requieren confección artesanal */
export const CONFECCION_SIZES: SizeName[] = ['XXL', 'XXXL'];

/** Todas las tallas en orden ascendente */
export const ALL_SIZES: SizeName[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
