/**
 * Hand Analysis Utilities
 * Provides functions for analyzing hand landmarks and extracting measurements
 */

import type { HandGender } from '../types';

export interface HandLandmark {
    x: number;
    y: number;
    z?: number;
}

export interface FingerData {
    tip: HandLandmark;
    dip?: HandLandmark; // Thumb doesn't have DIP
    pip?: HandLandmark; // Thumb has IP instead
    mcp: HandLandmark;
    cmc?: HandLandmark; // Only relevant for thumb usually, but good to have
    ip?: HandLandmark; // For thumb
}

export interface AllFingersData {
    thumb: FingerData;
    index: FingerData;
    middle: FingerData;
    ring: FingerData;
    pinky: FingerData;
}

export interface HandAnalysisResult {
    fingerWidth: number;
    handSize: 'xs' | 's' | 'm' | 'l' | 'xl';
    confidence: number;
    gender?: HandGender;
    fingers?: AllFingersData; // Added structured finger data
}

/**
 * Calculate the distance between two landmarks
 */
export function calculateDistance(
    point1: HandLandmark,
    point2: HandLandmark
): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Extract structured data for all fingers from landmarks
 */
export function extractFingerData(landmarks: HandLandmark[]): AllFingersData {
    return {
        thumb: {
            cmc: landmarks[1],
            mcp: landmarks[2],
            ip: landmarks[3],
            tip: landmarks[4]
        },
        index: {
            mcp: landmarks[5],
            pip: landmarks[6],
            dip: landmarks[7],
            tip: landmarks[8]
        },
        middle: {
            mcp: landmarks[9],
            pip: landmarks[10],
            dip: landmarks[11],
            tip: landmarks[12]
        },
        ring: {
            mcp: landmarks[13],
            pip: landmarks[14],
            dip: landmarks[15],
            tip: landmarks[16]
        },
        pinky: {
            mcp: landmarks[17],
            pip: landmarks[18],
            dip: landmarks[19],
            tip: landmarks[20]
        }
    };
}

export function analyzeHand(
    landmarks: HandLandmark[],
    imageWidth: number,
    imageHeight: number
): HandAnalysisResult {
    // Ring finger landmarks (13-16)
    const ringFingerBase = landmarks[13]; // MCP (base knuckle)
    const ringFingerPIP = landmarks[14];  // PIP joint
    const ringFingerDIP = landmarks[15];  // DIP joint
    const ringFingerTip = landmarks[16];  // Tip

    // Calculate actual finger width at the base (MCP joint)
    // We'll use the perpendicular distance from the finger axis
    // Get middle finger base for reference
    const middleFingerBase = landmarks[9];
    const pinkyFingerBase = landmarks[17];

    // Calculate the width of the ring finger at its base
    // Using the distance between middle and pinky finger bases as reference
    const knuckleSpacing = calculateDistance(middleFingerBase, pinkyFingerBase);

    // Estimate ring finger width (typically ~60% of knuckle spacing)
    // This is based on anatomical proportions
    const estimatedFingerWidth = knuckleSpacing * 0.6 * imageWidth;

    // More accurate method: measure perpendicular width at MCP
    // Calculate vector along ring finger
    const fingerVector = {
        x: ringFingerTip.x - ringFingerBase.x,
        y: ringFingerTip.y - ringFingerBase.y
    };

    // Normalize the vector
    const fingerLength = Math.sqrt(fingerVector.x * fingerVector.x + fingerVector.y * fingerVector.y);
    const normalizedVector = {
        x: fingerVector.x / fingerLength,
        y: fingerVector.y / fingerLength
    };

    // Perpendicular vector (rotated 90 degrees)
    const perpVector = {
        x: -normalizedVector.y,
        y: normalizedVector.x
    };

    // Sample points perpendicular to finger at MCP
    const sampleDistance = 0.02; // Sample 2% of image width on each side
    const leftPoint = {
        x: ringFingerBase.x + perpVector.x * sampleDistance,
        y: ringFingerBase.y + perpVector.y * sampleDistance
    };
    const rightPoint = {
        x: ringFingerBase.x - perpVector.x * sampleDistance,
        y: ringFingerBase.y - perpVector.y * sampleDistance
    };

    // Calculate actual width in pixels
    const fingerWidthPixels = calculateDistance(leftPoint, rightPoint) * imageWidth;

    // Use the more accurate measurement if available, otherwise use estimate
    const fingerWidth = fingerWidthPixels > 0 ? fingerWidthPixels : estimatedFingerWidth;

    // Calculate finger length for proportions
    const fingerLengthPixels = calculateDistance(ringFingerBase, ringFingerTip) * imageHeight;
    const ratio = fingerLengthPixels / fingerWidth;

    // Determine hand size based on finger proportions
    let handSize: 'xs' | 's' | 'm' | 'l' | 'xl';
    if (ratio < 3.5) handSize = 'xs';
    else if (ratio < 4.0) handSize = 's';
    else if (ratio < 4.5) handSize = 'm';
    else if (ratio < 5.0) handSize = 'l';
    else handSize = 'xl';

    // Calculate confidence based on hand detection quality
    let confidence = 100;

    // Reduce confidence if hand is too small or too large in frame
    const handArea = fingerLengthPixels * fingerWidth;
    const frameArea = imageWidth * imageHeight;
    const handToFrameRatio = handArea / frameArea;

    if (handToFrameRatio < 0.05) confidence -= 20; // Hand too small
    if (handToFrameRatio > 0.4) confidence -= 15;  // Hand too large

    // Reduce confidence if finger appears bent (checking joint angles)
    const pipToBase = calculateDistance(ringFingerPIP, ringFingerBase);
    const dipToPip = calculateDistance(ringFingerDIP, ringFingerPIP);
    const tipToDip = calculateDistance(ringFingerTip, ringFingerDIP);

    // Check if segments are roughly equal (straight finger)
    const avgSegment = (pipToBase + dipToPip + tipToDip) / 3;
    const maxDeviation = Math.max(
        Math.abs(pipToBase - avgSegment),
        Math.abs(dipToPip - avgSegment),
        Math.abs(tipToDip - avgSegment)
    );

    if (maxDeviation / avgSegment > 0.3) confidence -= 15; // Finger is bent

    // Ensure confidence is between 0 and 100
    confidence = Math.max(0, Math.min(100, confidence));

    // Extract all finger data
    const fingers = extractFingerData(landmarks);

    return {
        fingerWidth,
        handSize,
        confidence,
        fingers
    };
}

/**
 * Estimate gender based on hand proportions
 */
export function estimateGender(landmarks: HandLandmark[]): HandGender {
    // Ring finger to index finger ratio (2D:4D ratio)
    const indexFingerLength = calculateDistance(landmarks[5], landmarks[8]);
    const ringFingerLength = calculateDistance(landmarks[13], landmarks[16]);

    const ratio = indexFingerLength / ringFingerLength;

    // Typically, males have lower 2D:4D ratio (< 0.95)
    return ratio < 0.95 ? 'male' : 'female';
}
