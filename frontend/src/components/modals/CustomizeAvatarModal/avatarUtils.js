import { STORAGE_KEYS } from '../../../constants/storageKeys';

// Default gradient color
export const DEFAULT_GRADIENT = 'linear-gradient(135deg, #FBBB03, #E21F0A)';

// Available gradient options
export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #FBBB03, #E21F0A)',
  'linear-gradient(135deg, #A855F7, #3B82F6)',
  'linear-gradient(135deg, #10B981, #3B82F6)',
  'linear-gradient(135deg, #EC4899, #EF4444)',
  'linear-gradient(135deg, #F59E0B, #D97706)',
  'linear-gradient(135deg, #6B7280, #374151)'
];

/**
 * Extract filename without query string for proper comparison
 */
export function getBaseFilename(filenameWithQuery) {
  if (!filenameWithQuery) return filenameWithQuery;
  return filenameWithQuery.split('?')[0];
}

/**
 * Build thumbnail URL with optional cache busting
 */
export function getThumbnailUrl(filename, cacheBust) {
  if (!filename) return null;
  const base = getBaseFilename(filename);
  return `/avatar-thumb/${base}${cacheBust ? `?v=${cacheBust}` : ''}`;
}

/**
 * Build full-resolution URL with optional cache busting
 */
export function getFullUrl(filename, cacheBust) {
  if (!filename) return null;
  const base = getBaseFilename(filename);
  return `/avatar-full/${base}${cacheBust ? `?v=${cacheBust}` : ''}`;
}

/**
 * Get the first visible character (handles emoji properly)
 */
export function getFirstVisibleChar(str) {
  if (!str) return "";
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const firstSegment = [...segmenter.segment(str)][0]?.segment || "";
  const isEmoji = /\p{Emoji}/u.test(firstSegment);
  return isEmoji ? firstSegment : firstSegment.toUpperCase();
}

/**
 * Get border visibility preference from localStorage
 */
export function getBorderPreference() {
  const stored = localStorage.getItem(STORAGE_KEYS.SHOW_AVATAR_BORDER);
  return stored !== null ? stored === 'true' : true;
}

/**
 * Save border visibility preference to localStorage
 */
export function saveBorderPreference(showBorder) {
  localStorage.setItem(STORAGE_KEYS.SHOW_AVATAR_BORDER, showBorder);
  // Notify other components on the same page
  window.dispatchEvent(new Event('storage'));
}
