
export interface DeviceScreen {
  name: string;
  width_mm: number;
  height_mm: number;
  diagonal_inches: number;
  pixel_width: number;
  pixel_height: number;
}

export const DEVICE_DATABASE: DeviceScreen[] = [
  // iPhone
  { name: 'iPhone 15 Pro Max', width_mm: 76.7, height_mm: 159.9, diagonal_inches: 6.7, pixel_width: 1290, pixel_height: 2796 },
  { name: 'iPhone 15 Pro', width_mm: 70.6, height_mm: 146.6, diagonal_inches: 6.1, pixel_width: 1179, pixel_height: 2556 },
  { name: 'iPhone 15 Plus', width_mm: 77.8, height_mm: 160.9, diagonal_inches: 6.7, pixel_width: 1290, pixel_height: 2796 },
  { name: 'iPhone 15', width_mm: 71.6, height_mm: 147.6, diagonal_inches: 6.1, pixel_width: 1179, pixel_height: 2556 },
  { name: 'iPhone 14 Pro Max', width_mm: 77.6, height_mm: 160.7, diagonal_inches: 6.7, pixel_width: 1290, pixel_height: 2796 },
  { name: 'iPhone 14 Pro', width_mm: 71.5, height_mm: 147.5, diagonal_inches: 6.1, pixel_width: 1179, pixel_height: 2556 },
  { name: 'iPhone 14', width_mm: 71.5, height_mm: 146.7, diagonal_inches: 6.1, pixel_width: 1170, pixel_height: 2532 },
  { name: 'iPhone SE (3rd gen)', width_mm: 67.3, height_mm: 138.4, diagonal_inches: 4.7, pixel_width: 750, pixel_height: 1334 },
  
  // Samsung Galaxy
  { name: 'Samsung Galaxy S24 Ultra', width_mm: 79.0, height_mm: 162.3, diagonal_inches: 6.8, pixel_width: 1440, pixel_height: 3120 },
  { name: 'Samsung Galaxy S24+', width_mm: 75.9, height_mm: 158.5, diagonal_inches: 6.7, pixel_width: 1440, pixel_height: 3120 },
  { name: 'Samsung Galaxy S24', width_mm: 70.6, height_mm: 147.0, diagonal_inches: 6.2, pixel_width: 1080, pixel_height: 2340 },
  { name: 'Samsung Galaxy S23 Ultra', width_mm: 78.1, height_mm: 163.4, diagonal_inches: 6.8, pixel_width: 1440, pixel_height: 3088 },
  { name: 'Samsung Galaxy S23', width_mm: 70.9, height_mm: 146.3, diagonal_inches: 6.1, pixel_width: 1080, pixel_height: 2340 },
  
  // Google Pixel
  { name: 'Google Pixel 8 Pro', width_mm: 76.5, height_mm: 162.6, diagonal_inches: 6.7, pixel_width: 1344, pixel_height: 2992 },
  { name: 'Google Pixel 8', width_mm: 70.8, height_mm: 150.5, diagonal_inches: 6.2, pixel_width: 1080, pixel_height: 2400 },
  { name: 'Google Pixel 7a', width_mm: 72.9, height_mm: 152.0, diagonal_inches: 6.1, pixel_width: 1080, pixel_height: 2400 },
  { name: 'Google Pixel 7 Pro', width_mm: 76.6, height_mm: 162.9, diagonal_inches: 6.7, pixel_width: 1440, pixel_height: 3120 },
];
