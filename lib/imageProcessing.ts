
import type { CalibrationResult } from '../types';

export async function processDiameter(
  diameter_mm: number
): Promise<Pick<CalibrationResult, 'fingerDiameter_mm' | 'confidence'>> {
    return new Promise((resolve) => {
        const processingTime = 1000 + Math.random() * 1000;
        setTimeout(() => {
            resolve({
                fingerDiameter_mm: diameter_mm,
                confidence: 95, // High confidence as it's a direct measurement
            });
        }, processingTime);
    });
}
