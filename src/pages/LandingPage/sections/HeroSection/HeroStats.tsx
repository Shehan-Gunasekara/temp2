import React from 'react';

const stats = [
  { value: '100K+', label: 'AI Actors Created' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '10x', label: 'Faster Creation' }
];

export function HeroStats() {
  return (
    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-4xl font-semibold mb-2 bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className="text-black/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}