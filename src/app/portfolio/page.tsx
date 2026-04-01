import React from 'react';
import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
  title: 'Animesh | Portfolio',
  description: 'Animesh - Software Engineer',
};

export default function PortfolioReplica() {
  return <PortfolioClient />;
}
