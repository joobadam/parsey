"use client";

import { GrainGradient } from '@paper-design/shaders-react';

export default function GrainBackground() {
  return (
    <GrainGradient
      colors={['#FF6B35', '#e55a2b', '#171717', '#6b6b6f']}
      grainScale={0.5}
      style={{ position: "fixed", inset: 0, zIndex: -10 }}
    />
  );
}

