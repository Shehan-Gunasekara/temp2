import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { HeroBadge } from './HeroBadge';

interface Props {
  onGetStarted: () => void;
}

export function HeroContent({ onGetStarted }: Props) {
  return (
    <div className="max-w-2xl">
      <HeroBadge />
      
      <h1 className="text-6xl font-semibold leading-[1.1] mb-6">
        Create Synthetic{' '}
        <span className="bg-gradient-to-r from-black to-black/60 bg-clip-text text-transparent">
          AI Actors
        </span>{' '}
        in Minutes
      </h1>

      <p className="text-xl text-black/60 mb-8 leading-relaxed">
        Transform your ideas into lifelike digital humans instantly. Generate custom AI actors that speak and move naturally, perfect for your content creation needs.
      </p>

      <div className="flex items-center space-x-4">
        <Button size="lg" onClick={onGetStarted}>
          Start Designing
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <Button variant="secondary" size="lg" onClick={() => window.location.href = '/gallery'}>
          View Examples
        </Button>
      </div>
    </div>
  );
}