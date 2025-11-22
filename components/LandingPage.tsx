

import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon, CameraIcon } from './icons/UtilIcons';
import { CreditCardIcon, HandIcon, RingIcon } from './icons/MethodIcons';
import { FadeIn } from './animations/FadeIn';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="w-full bg-midnight-600 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4 py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-bronze-400/20 rounded-full blur-[120px] animate-float opacity-60 mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-float opacity-50 mix-blend-screen" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px] animate-pulse opacity-30 mix-blend-screen" style={{ animationDuration: '4s' }}></div>
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

        <div className="relative z-20 flex flex-col items-center max-w-5xl mx-auto">
          <FadeIn delay={0.1} direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-lg hover:bg-white/10 transition-colors cursor-default">
              <SparklesIcon className="w-4 h-4 text-bronze-400" />
              <span className="text-sm font-medium text-silver-200 tracking-wide uppercase">The Future of Jewelry Fitting</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white via-silver-100 to-silver-400 leading-[1.1] tracking-tight mb-8 drop-shadow-sm">
              Find Your Perfect <br />
              <span className="italic text-bronze-100 font-light">Ring Size</span> in Seconds
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} direction="up">
            <p className="text-lg md:text-2xl text-silver-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              AI-powered precision. No guesswork. No returns. <br className="hidden md:block" />
              The confidence to buy jewelry online, gifted by LUNE.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} direction="up">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center w-full max-w-lg mx-auto">
              <Button
                id="get-started-btn"
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl shadow-bronze-glow"
                icon={<ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />}
              >
                Measure My Size
              </Button>
              <Button
                variant="secondary"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl"
              >
                How It Works
              </Button>
            </div>
          </FadeIn>

          {/* Social Proof / Trust Indicators */}
          <FadeIn delay={0.6} direction="up">
            <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/5 w-full max-w-3xl">
              <p className="text-xs md:text-sm text-silver-500 mb-4 uppercase tracking-widest font-medium">Trusted by Jewelers & Shoppers</p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos - using text for now with premium font */}
                <span className="font-display text-lg md:text-xl text-silver-300">VOGUE</span>
                <span className="font-display text-lg md:text-xl text-silver-300">Cartier</span>
                <span className="font-display text-lg md:text-xl text-silver-300">TIFFANY & Co.</span>
                <span className="font-display text-lg md:text-xl text-silver-300">BVLGARI</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-container mx-auto px-4 md:px-6">
          <FadeIn direction="up">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-silver-100 mb-4 md:mb-6">Engineered for Confidence</h2>
              <p className="text-lg md:text-xl text-silver-400 max-w-2xl mx-auto px-4">
                We combine advanced computer vision with simple, intuitive design to give you the most accurate measurements possible.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                icon: <CreditCardIcon className="h-8 w-8 text-bronze-400" />,
                title: "AI Precision",
                desc: "99% accuracy using computer vision calibrated with standard objects."
              },
              {
                icon: <HandIcon className="h-8 w-8 text-bronze-400" />,
                title: "AR Try-On",
                desc: "Visualize how different rings look on your hand in real-time."
              },
              {
                icon: <RingIcon className="h-8 w-8 text-bronze-400" />,
                title: "Multi-Method",
                desc: "Choose from AI scan, existing ring measure, or manual entry."
              },
              {
                icon: <CheckCircleIcon className="h-8 w-8 text-bronze-400" />,
                title: "Privacy First",
                desc: "All processing happens locally. Your images never leave your device."
              }
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={0.1 * idx} direction="up">
                <Card className="h-full min-h-[280px] flex flex-col hover:bg-white/10 transition-colors duration-300 group">
                  <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-bronze-400/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-silver-100 mb-3">{feature.title}</h3>
                  <p className="text-base text-silver-400 leading-relaxed flex-grow">{feature.desc}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-midnight-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-container-narrow mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div>
                <h2 className="font-display text-4xl md:text-5xl text-silver-100 mb-8">Simplicity in <br /><span className="text-bronze-400">Three Steps</span></h2>
                <div className="space-y-12">
                  {[
                    {
                      step: "01",
                      title: "Capture",
                      desc: "Take a photo of your hand next to a standard card for scale."
                    },
                    {
                      step: "02",
                      title: "Analyze",
                      desc: "Our AI instantly calculates your precise ring size."
                    },
                    {
                      step: "03",
                      title: "Discover",
                      desc: "See your size and virtually try on rings before you buy."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="font-display text-4xl text-white/20 group-hover:text-bronze-400 transition-colors duration-300">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-2xl font-medium text-silver-200 mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                        <p className="text-silver-400 text-lg">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12">
                  <Button onClick={onGetStarted} icon={<ArrowRightIcon className="w-5 h-5" />}>
                    Start Measuring
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-bronze-500/20 to-indigo-500/20 rounded-3xl blur-2xl transform rotate-6"></div>
                <div className="relative bg-midnight-800 border border-white/10 rounded-3xl p-2 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                  <img
                    src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Ring sizing demo"
                    className="rounded-2xl w-full h-auto opacity-90 hover:opacity-100 transition-opacity"
                  />
                  {/* Floating UI Element Mockup */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-lg flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircleIcon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-silver-400 uppercase tracking-wider">Size Detected</div>
                        <div className="text-lg font-semibold text-white">US Size 7</div>
                      </div>
                    </div>
                    <div className="text-bronze-400 font-medium">99% Match</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FadeIn direction="up">
            <div className="mb-12">
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-bronze-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <blockquote className="font-display text-3xl md:text-5xl text-silver-100 leading-tight mb-8">
                "I was so hesitant to buy my engagement ring online, but LUNE made it foolproof. The sizing was dead-on accurate."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img src="https://i.pravatar.cc/100?u=a042581f4e29026704d" alt="Jessica L." className="w-14 h-14 rounded-full border-2 border-bronze-400" />
                <div className="text-left">
                  <div className="font-semibold text-white text-lg">Jessica L.</div>
                  <div className="text-silver-400 text-sm">Verified Buyer</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up">
            <div className="relative bg-gradient-to-br from-midnight-500 to-midnight-800 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-bronze-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h2 className="font-display text-5xl md:text-6xl text-white mb-8">Find Your Perfect Fit Today</h2>
                <p className="text-xl text-silver-300 max-w-2xl mx-auto mb-12">
                  The most accurate, easy-to-use ring sizer is just a click away. <br />
                  Join thousands of happy shoppers.
                </p>
                <div className="flex justify-center">
                  <Button onClick={onGetStarted} className="px-12 py-6 text-xl" icon={<ArrowRightIcon className="w-6 h-6" />}>
                    Measure Your Ring Size
                  </Button>
                </div>
                <p className="mt-6 text-sm text-silver-500">No app download required. Works on all devices.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

