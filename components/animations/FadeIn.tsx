import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
    className?: string;
    fullWidth?: boolean;
}

export const FadeIn = ({
    children,
    delay = 0,
    direction = 'up',
    duration = 0.5,
    className = '',
    fullWidth = false
}: FadeInProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    const getInitial = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 40 };
            case 'down': return { opacity: 0, y: -40 };
            case 'left': return { opacity: 0, x: 40 };
            case 'right': return { opacity: 0, x: -40 };
            case 'none': return { opacity: 0 };
            default: return { opacity: 0, y: 40 };
        }
    };

    const getAnimate = () => {
        switch (direction) {
            case 'up': return { opacity: 1, y: 0 };
            case 'down': return { opacity: 1, y: 0 };
            case 'left': return { opacity: 1, x: 0 };
            case 'right': return { opacity: 1, x: 0 };
            case 'none': return { opacity: 1 };
            default: return { opacity: 1, y: 0 };
        }
    };

    return (
        <div ref={ref} className={`${className} ${fullWidth ? 'w-full' : ''}`}>
            <motion.div
                initial={getInitial()}
                animate={isInView ? getAnimate() : getInitial()}
                transition={{
                    duration: duration,
                    delay: delay,
                    ease: [0.21, 0.47, 0.32, 0.98] // Luma-style smooth easing
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};
