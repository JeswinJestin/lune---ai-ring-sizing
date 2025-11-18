
import type { AnalysisResult, Landmark, ReferenceObject } from '../../types';
import { diameterToSize } from '../sizeConversion';

interface AiResponseData {
    referenceObject?: {
        type: ReferenceObject['type'];
        knownWidthMM: number;
        measuredWidthPX: number;
    };
    finger: {
        measuredWidthPX: number;
        estimatedWidthMM?: number;
    };
}

/**
 * Calculates the ring size from the structured data returned by the Gemini AI.
 * It uses the reference object for a high-confidence calculation if available,
 * otherwise it falls back to a lower-confidence estimation based on the finger alone.
 * @param aiData The parsed JSON response from the Gemini API call.
 * @returns A detailed AnalysisResult object.
 */
export const calculateRingSizeFromAI = (aiData: AiResponseData): AnalysisResult => {
    
    // --- Method 1: High-Confidence Calculation with Reference Object ---
    if (aiData.referenceObject && aiData.referenceObject.knownWidthMM > 0 && aiData.referenceObject.measuredWidthPX > 0) {
        const { knownWidthMM, measuredWidthPX, type } = aiData.referenceObject;
        const fingerWidthPx = aiData.finger.measuredWidthPX;

        const pixelToMmRatio = knownWidthMM / measuredWidthPX;
        const fingerWidthMm = fingerWidthPx * pixelToMmRatio;
        
        const size = diameterToSize(fingerWidthMm);
        if (!size) {
            throw new Error(`Calculated finger size (${fingerWidthMm.toFixed(2)}mm) is outside the standard range. Please retake the photo.`);
        }

        return {
            size,
            confidence: 95, // High confidence due to a physical reference
            method: 'reference_object',
            debugInfo: {
                pixelToMmRatio,
                fingerWidthPx,
                referenceObject: type,
            }
        };
    }
    
    // --- Method 2: Fallback to AI's Direct Estimation ---
    if (aiData.finger.estimatedWidthMM && aiData.finger.estimatedWidthMM > 0) {
        const fingerWidthMm = aiData.finger.estimatedWidthMM;

        const size = diameterToSize(fingerWidthMm);
        if (!size) {
            throw new Error(`AI-estimated finger size (${fingerWidthMm.toFixed(2)}mm) is outside the standard range. Please retake the photo, preferably with a reference object.`);
        }

        return {
            size,
            confidence: 70, // Confidence is lower as it's an estimation
            method: 'no_reference_fallback',
            debugInfo: {
                fingerWidthPx: aiData.finger.measuredWidthPX,
            }
        };
    }
    
    // --- Final Fallback: If AI provides neither reference nor estimate ---
    throw new Error("Could not determine size. A reference object (like a credit card) is required for an accurate measurement. Please try again.");
};

// --- This function can be kept for other potential uses or future features, but is no longer the primary AI Scan method ---

const getDistance = (p1: Landmark, p2: Landmark): number => {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) +
        Math.pow(p1.y - p2.y, 2)
    );
};

/**
 * Estimates the ring size using MediaPipe hand landmarks.
 * This method uses the palm width as an internal reference scale.
 * @param landmarks The array of detected hand landmarks from MediaPipe.
 * @returns A detailed AnalysisResult object.
 */
export const calculateRingSizeFromLandmarks = (landmarks: Landmark[]): AnalysisResult => {
  const PALM_INDEX = 5;
  const PALM_PINKY = 17;
  const RING_FINGER_KNUCKLE = 13;
  const RING_FINGER_PIP = 14;

  const palmWidthPx = getDistance(landmarks[PALM_INDEX], landmarks[PALM_PINKY]);
  const AVG_PALM_WIDTH_MM = 79.0;
    
  if (palmWidthPx < 10) {
    throw new Error("Could not determine palm width from landmarks.");
  }

  const pixelToMmRatio = AVG_PALM_WIDTH_MM / palmWidthPx;
  const knuckleLengthPx = getDistance(landmarks[RING_FINGER_KNUCKLE], landmarks[RING_FINGER_PIP]);
  const fingerWidthPx = knuckleLengthPx * 0.8;
  let fingerWidthMm = fingerWidthPx * pixelToMmRatio;
  const MIN_MM = 14.0;
  const MAX_MM = 22.2;
  let clamped = false;
  if (fingerWidthMm < MIN_MM) { fingerWidthMm = MIN_MM; clamped = true; }
  if (fingerWidthMm > MAX_MM) { fingerWidthMm = MAX_MM; clamped = true; }
    
  const size = diameterToSize(fingerWidthMm);
   if (!size) {
        throw new Error("Calculated finger size from hand geometry is outside the standard range.");
   }

  return {
    size,
    confidence: clamped ? 65 : 75,
    method: 'no_reference_fallback',
    debugInfo: {
      pixelToMmRatio,
      fingerWidthPx: fingerWidthPx,
    }
  };
};