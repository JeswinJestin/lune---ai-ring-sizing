export interface RingData {
  id: number;
  name: string;
  image: string;
  description: string;
  style: 'delicate' | 'classic' | 'statement';
}

export const ringDatabase: RingData[] = [
  { 
    id: 1, 
    name: 'Solitaire Diamond', 
    image: '/1_RING.png', 
    description: 'A timeless classic, this solitaire features a brilliant-cut diamond on a simple, elegant band of pure platinum.',
    style: 'classic',
  },
  { 
    id: 2, 
    name: 'Emerald Cut', 
    image: '/2_RING.png', 
    description: 'Make a statement with this stunning emerald-cut diamond, flanked by tapered baguettes on a polished gold band.',
    style: 'statement',
  },
  { 
    id: 3, 
    name: 'Vintage Halo', 
    image: '/3_RING.png', 
    description: 'Exuding romance, this vintage-inspired ring showcases a central diamond surrounded by a sparkling halo of smaller gems.',
    style: 'statement',
  },
  { 
    id: 4, 
    name: 'Sapphire Band', 
    image: '/4_RING.png', 
    description: 'A deep blue sapphire takes center stage, complemented by a delicate band of pavé-set diamonds for a touch of color.',
    style: 'classic',
  },
  { 
    id: 5, 
    name: 'Classic Gold Band', 
    image: '/5_RING.png', 
    description: 'For the minimalist, this classic wedding band is crafted from solid 18k gold with a comfortable, polished finish.',
    style: 'delicate',
  },
   { 
    id: 6, 
    name: 'Twisted Vine', 
    image: '/6_RING.png', 
    description: 'Nature-inspired, this delicate band features an intricate twisted vine design, symbolizing intertwined lives.',
    style: 'delicate',
  },
  { 
    id: 7, 
    name: 'Modern Bezel', 
    image: '/7_RING.png', 
    description: 'A sleek and contemporary design, this ring features a round diamond set in a secure and stylish bezel setting.',
    style: 'classic',
  },
  { 
    id: 8, 
    name: 'Rose Gold Pearl', 
    image: '/8_RING.png', 
    description: 'A luminous pearl is the centerpiece of this warm rose gold ring, offering a soft and romantic alternative.',
    style: 'delicate',
  },
    { 
    id: 9, 
    name: 'Art Deco Emerald', 
    image: '/9_RING.png', 
    description: 'This bold ring features a geometric arrangement of emeralds and diamonds, inspired by the glamour of the Art Deco era.',
    style: 'statement',
  },
];
