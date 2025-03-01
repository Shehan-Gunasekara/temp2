import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { DemoVideo } from '../../components/DemoVideo';

export function HeroDemo() {
  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-64 h-64 bg-gradient-to-br from-black/[0.02] to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-black/[0.02] to-transparent rounded-full blur-3xl" />
      
      {/* Video demo */}
      <Card className="relative overflow-hidden">
        <DemoVideo />
      </Card>
    </div>
  );
}