import { ringDatabase, type RingData } from './ringData';
import type { RingSize } from '../types';

/**
 * Provides a curated list of ring recommendations based on the user's ring size.
 * 
 * The heuristic is based on a common jewelry styling principle:
 * - Smaller finger sizes (below 7) are often complemented by more delicate bands.
 * - Larger finger sizes (above 9) can beautifully support more prominent, statement pieces.
 * - Mid-range sizes are versatile and suit classic styles well.
 * 
 * @param userSize The RingSize object obtained from measurement.
 * @returns An array of recommended RingData objects.
 */
export const getRecommendations = (userSize: RingSize): RingData[] => {
    const size = Number(userSize.us);
    if (isNaN(size)) {
        // If size is not a number (e.g., 'Too large'), return a default list
        return ringDatabase.filter(ring => ring.style === 'classic');
    }

    let preferredStyles: RingData['style'][] = [];

    if (size < 7.0) {
        preferredStyles = ['delicate', 'classic'];
    } else if (size > 9.0) {
        preferredStyles = ['statement', 'classic'];
    } else {
        preferredStyles = ['classic', 'statement', 'delicate'];
    }

    // Sort the database to prioritize preferred styles, then return the full list
    const recommendations = [...ringDatabase].sort((a, b) => {
        const aScore = preferredStyles.indexOf(a.style);
        const bScore = preferredStyles.indexOf(b.style);

        // If both are in the preferred list, sort by their order in the list
        if (aScore > -1 && bScore > -1) {
            return aScore - bScore;
        }
        // If only A is preferred, it comes first
        if (aScore > -1) {
            return -1;
        }
        // If only B is preferred, it comes first
        if (bScore > -1) {
            return 1;
        }
        // Otherwise, maintain original order
        return 0;
    });

    return recommendations;
};
