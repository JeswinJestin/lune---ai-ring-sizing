
import type { RingSize } from '../types';

export const RING_SIZE_TABLE: RingSize[] = [
  { us: 3, uk: 'F', eu: 44, diameter_mm: 14.0, circumference_mm: 44.0 },
  { us: 3.5, uk: 'G', eu: 45, diameter_mm: 14.4, circumference_mm: 45.2 },
  { us: 4, uk: 'H', eu: 47, diameter_mm: 14.9, circumference_mm: 46.8 },
  { us: 4.5, uk: 'I', eu: 48, diameter_mm: 15.3, circumference_mm: 48.0 },
  { us: 5, uk: 'J', eu: 49, diameter_mm: 15.7, circumference_mm: 49.3 },
  { us: 5.5, uk: 'K', eu: 51, diameter_mm: 16.1, circumference_mm: 50.6 },
  { us: 6, uk: 'L', eu: 52, diameter_mm: 16.5, circumference_mm: 51.9 },
  { us: 6.5, uk: 'M', eu: 53, diameter_mm: 16.9, circumference_mm: 53.1 },
  { us: 7, uk: 'N', eu: 54, diameter_mm: 17.3, circumference_mm: 54.4 },
  { us: 7.5, uk: 'O', eu: 56, diameter_mm: 17.7, circumference_mm: 55.7 },
  { us: 8, uk: 'P', eu: 57, diameter_mm: 18.1, circumference_mm: 57.0 },
  { us: 8.5, uk: 'Q', eu: 58, diameter_mm: 18.5, circumference_mm: 58.3 },
  { us: 9, uk: 'R', eu: 60, diameter_mm: 19.0, circumference_mm: 59.5 },
  { us: 9.5, uk: 'S', eu: 61, diameter_mm: 19.4, circumference_mm: 60.8 },
  { us: 10, uk: 'T', eu: 62, diameter_mm: 19.8, circumference_mm: 62.1 },
  { us: 10.5, uk: 'U', eu: 64, diameter_mm: 20.2, circumference_mm: 63.4 },
  { us: 11, uk: 'V', eu: 65, diameter_mm: 20.6, circumference_mm: 64.6 },
  { us: 11.5, uk: 'W', eu: 66, diameter_mm: 21.0, circumference_mm: 65.9 },
  { us: 12, uk: 'X', eu: 68, diameter_mm: 21.4, circumference_mm: 67.2 },
  { us: 12.5, uk: 'Y', eu: 69, diameter_mm: 21.8, circumference_mm: 68.5 },
  { us: 13, uk: 'Z', eu: 70, diameter_mm: 22.2, circumference_mm: 69.7 },
];

export function circumferenceToSize(circumference_mm: number): RingSize | null {
  if (RING_SIZE_TABLE.length === 0) return null;

  let closest = RING_SIZE_TABLE[0];
  let minDiff = Math.abs(circumference_mm - closest.circumference_mm);

  for (const size of RING_SIZE_TABLE) {
    const diff = Math.abs(circumference_mm - size.circumference_mm);
    if (diff < minDiff) {
      minDiff = diff;
      closest = size;
    }
  }

  if (minDiff > 5) return null; // Measurement likely invalid if diff is too large

  return closest;
}

export function diameterToSize(diameter_mm: number): RingSize | null {
  const circumference = diameter_mm * Math.PI;
  return circumferenceToSize(circumference);
}

/**
 * Find ring size by US size number
 */
export function findByUSSize(usSize: number): RingSize | null {
  return RING_SIZE_TABLE.find(size => size.us === usSize) || null;
}

/**
 * Find ring size by UK size letter
 */
export function findByUKSize(ukSize: string): RingSize | null {
  return RING_SIZE_TABLE.find(size => size.uk === ukSize.toUpperCase()) || null;
}

/**
 * Find ring size by EU size number
 */
export function findByEUSize(euSize: number): RingSize | null {
  return RING_SIZE_TABLE.find(size => size.eu === euSize) || null;
}

/**
 * Adjust ring size based on band width
 * Wider bands typically require a slightly larger size
 */
export function adjustSizeForBandWidth(baseUSSize: number, bandWidth: number): number {
  // Rule of thumb: for every 2mm of width above 2mm, go up 0.25 size
  if (bandWidth <= 2) return baseUSSize;

  const widthDiff = bandWidth - 2;
  const sizeAdjustment = (widthDiff / 2) * 0.25;

  return Math.round((baseUSSize + sizeAdjustment) * 2) / 2; // Round to nearest 0.5
}

/**
 * Get recommended size adjustment message based on band width
 */
export function getBandWidthRecommendation(bandWidth: number): string {
  if (bandWidth <= 2) {
    return 'Thin bands (≤2mm) typically fit true to size.';
  } else if (bandWidth <= 4) {
    return 'Medium bands may require going up 0.25 size for comfort.';
  } else if (bandWidth <= 6) {
    return 'Wide bands often need 0.25-0.5 size larger.';
  } else {
    return 'Very wide bands (>6mm) may need 0.5-1 full size larger.';
  }
}

/**
 * Validate if a diameter is within realistic bounds
 */
export function validateDiameter(diameter: number): boolean {
  return diameter >= 14 && diameter <= 23;
}

/**
 * Validate if a circumference is within realistic bounds
 */
export function validateCircumference(circumference: number): boolean {
  return circumference >= 44 && circumference <= 72;
}

/**
 * Validate if a US size is within realistic bounds
 */
export function validateUSSize(size: number): boolean {
  return size >= 3 && size <= 13;
}

/**
 * Validate if an EU size is within realistic bounds
 */
export function validateEUSize(size: number): boolean {
  return size >= 44 && size <= 70;
}
