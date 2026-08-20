import { Scissors, Sparkles, Leaf, Star, Palette, Droplet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  scissors: Scissors,
  sparkles: Sparkles,
  leaf: Leaf,
  star: Star,
  palette: Palette,
  droplet: Droplet,
};

export const SERVICE_ICON_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'scissors', label: 'Tijeras' },
  { key: 'sparkles', label: 'Sparkle' },
  { key: 'star', label: 'Estrella' },
  { key: 'leaf', label: 'Hoja' },
  { key: 'palette', label: 'Paleta' },
  { key: 'droplet', label: 'Gota' },
];

export const SERVICE_COLORS: Record<string, { label: string; color: string; bg: string }> = {
  navy: { label: 'Navy', color: '#121e6c', bg: '#EEF0FB' },
  coral: { label: 'Coral', color: '#FF2947', bg: '#FFF0F3' },
  morado: { label: 'Morado', color: '#7C3AED', bg: '#F5F3FF' },
  verde: { label: 'Verde', color: '#15803D', bg: '#F0FDF4' },
  ambar: { label: 'Ámbar', color: '#B45309', bg: '#FFFBEB' },
  teal: { label: 'Teal', color: '#0D9488', bg: '#F0FDFA' },
};

export const SERVICE_CATEGORIES: string[] = ['Corte', 'Color', 'Tratamientos', 'Uñas'];

// Fallback bucket for services with a missing/blank category, so the filter
// chip always has a visible label instead of rendering empty.
export const UNCATEGORIZED_LABEL = 'Otros';

/** Normalizes a raw category value against SERVICE_CATEGORIES (case/whitespace
 * insensitive) so persisted or hand-edited data can't desync from the canonical casing. */
export function normalizeServiceCategory(raw: string | null | undefined): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return UNCATEGORIZED_LABEL;
  const canonical = SERVICE_CATEGORIES.find(c => c.toLowerCase() === trimmed.toLowerCase());
  return canonical ?? trimmed;
}

export function getServiceIcon(key: string): LucideIcon {
  return SERVICE_ICONS[key] ?? Star;
}

export function getServiceColor(key: string): { label: string; color: string; bg: string } {
  return SERVICE_COLORS[key] ?? SERVICE_COLORS.navy;
}
