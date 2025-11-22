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

/**
 * Analyze hand landmarks to determine hand characteristics
 */
export function analyzeHand(
    landmarks: HandLandmark[],
    imageWidth: number,
    imageHeight: number
): HandAnalysisResult {
    // Ring finger base to tip (landmarks 13-16)
    const ringFingerBase = landmarks[13];
    const ringFingerTip = landmarks[16];

    // Calculate finger width (approximate from knuckle width)
    const knuckle1 = landmarks[14];
    const knuckle2 = landmarks[15];
    const fingerWidth = calculateDistance(knuckle1, knuckle2) * imageWidth;

    // Determine hand size based on finger proportions
    const fingerLength = calculateDistance(ringFingerBase, ringFingerTip) * imageHeight;
    const ratio = fingerLength / fingerWidth;

    let handSize: 'xs' | 's' | 'm' | 'l' | 'xl';
    if (ratio < 3.5) handSize = 'xs';
    else if (ratio < 4.0) handSize = 's';
    else if (ratio < 4.5) handSize = 'm';
    else if (ratio < 5.0) handSize = 'l';
    else handSize = 'xl';

    // Extract all finger data
    const fingers = extractFingerData(landmarks);

    return {
        fingerWidth,
        handSize,
        confidence: 85,
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
