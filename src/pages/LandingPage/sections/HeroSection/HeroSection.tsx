import React from 'react';
import { HeroContent } from './HeroContent';
import { HeroDemo } from './HeroDemo';
import { HeroStats } from './HeroStats';

interface Props {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-black/5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <div className="relative w-full pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <HeroContent onGetStarted={onGetStarted} />
            <HeroDemo />
          </div>
          <HeroStats />
        </div>
      </div>
    </section>
  );
}