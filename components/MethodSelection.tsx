import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { CameraIcon, UploadIcon, PrinterIcon, PencilIcon, ArrowLeftIcon, SparklesIcon } from './icons/UtilIcons';
import { RulerIcon, RingIcon } from './icons/MethodIcons';
import { FadeIn } from './animations/FadeIn';

interface MethodSelectionProps {
  onSelectMethod: (method: 'camera' | 'ruler' | 'existing-ring' | 'upload' | 'print' | 'manual') => void;
  onBack: () => void;
}

interface Method {
  id: 'camera' | 'ruler' | 'existing-ring' | 'upload' | 'print' | 'manual';
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  recommended?: boolean;
  badge: string;
  badgeColor?: string;
}

export const MethodSelection = ({ onSelectMethod, onBack }: MethodSelectionProps) => {
  const methods: Method[] = [
    {
      id: 'camera',
      title: 'AI Finger Scan',
      description: 'Our most popular method. Uses advanced computer vision for high precision.',
      icon: CameraIcon,
      recommended: true,
      badge: '±0.3mm Accuracy',
      badgeColor: 'bg-green-500/20 text-green-300 border-green-500/30',
    },
    {
      id: 'ruler',
      title: 'Ruler Calibration',
      description: 'Calibrate your screen with a standard card or ruler for exact measurements.',
      icon: RulerIcon,
      badge: '±0.4mm Accuracy',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'existing-ring',
      title: 'Measure Ring',
      description: 'Have a ring that fits? Place it on the screen to find its size.',
      icon: RingIcon,
      badge: '±0.5mm Accuracy',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'upload',
      title: 'Photo Upload',
      description: 'Upload a photo of a hand or ring for AI analysis. Perfect for gifts.',
      icon: UploadIcon,
      badge: 'Experimental',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    },
    {
      id: 'print',
      title: 'Printable Sizer',
      description: 'Download and print our verified sizing tool.',
      icon: PrinterIcon,
      badge: 'Standard',
      badgeColor: 'bg-white/10 text-silver-400 border-white/10',
    },
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Already know the diameter or circumference? Enter it here.',
      icon: PencilIcon,
      badge: 'Input',
      badgeColor: 'bg-white/10 text-silver-400 border-white/10',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-midnight-600 relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-bronze-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow flex flex-col max-w-6xl">
        <FadeIn direction="down">
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-silver-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
            </button>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white mb-1 md:mb-2">Choose a Method</h1>
              <p className="text-silver-400 text-base md:text-lg">Select how you would like to find your perfect fit.</p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((method, idx) => (
            <FadeIn key={method.id} delay={idx * 0.1} direction="up">
              <Card
                onClick={() => onSelectMethod(method.id)}
                className={`h-[280px] flex flex-col p-8 group hover:bg-white/10 transition-all duration-300 ${method.recommended ? 'border-bronze-500/50 shadow-[0_0_30px_rgba(201,166,104,0.15)]' : ''}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-bronze-400/20 transition-colors duration-300 ${method.recommended ? 'text-bronze-400' : 'text-silver-300'}`}>
                    <method.icon className="h-8 w-8" />
                  </div>
                  {method.recommended && (
                    <span className="bg-bronze-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-lg">
                      Recommended
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-display text-white mb-3 group-hover:text-bronze-100 transition-colors">{method.title}</h3>
                <p className="text-silver-400 text-sm leading-relaxed mb-6 flex-grow">{method.description}</p>

                <div className="mt-auto flex items-center justify-between">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${method.badgeColor || 'bg-white/10 text-silver-400 border-white/10'}`}>
                    {method.badge}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    <ArrowLeftIcon className="h-4 w-4 text-white rotate-180" />
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.6} direction="up">
          <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <SparklesIcon className="h-6 w-6 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Virtual AR Try-On</h3>
                <p className="text-silver-400 text-sm">Visualize rings on your hand after measurement.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-indigo-200 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Coming Soon
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
