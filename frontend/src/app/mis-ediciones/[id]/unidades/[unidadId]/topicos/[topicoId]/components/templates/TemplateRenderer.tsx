// components/templates/TemplateRenderer.tsx
'use client';
import React from 'react';
import LinearLayout from './layouts/LinearLayout';
import TwoColumnsLayout from './layouts/TwoColumnsLayout';
import TwoColumnsInverseLayout from './layouts/TwoColumnsInverseLayout';
import FeaturedVideoLayout from './layouts/FeaturedVideoLayout';
import Gallery3Layout from './layouts/Gallery3Layout';
import VideoSidebarLayout from './layouts/VideoSidebarLayout';
import CarouselLayout from './layouts/CarouselLayout';
import ThreeColumnsLayout from './layouts/ThreeColumnsLayout';
import LargeImageLayout from './layouts/LargeImageLayout';
import VideoGalleryTextLayout from './layouts/VideoGalleryTextLayout';
import AccordionLayout from './layouts/AccordionLayout';
import ComparativeLayout from './layouts/ComparativeLayout';
import { TemplateProps } from '../../types/content';

interface TemplateRendererProps extends TemplateProps {
  templateId: number;
}

const TEMPLATE_MAP: Record<number, React.ComponentType<TemplateProps>> = {
  1: LinearLayout,
  2: TwoColumnsLayout,
  3: TwoColumnsInverseLayout,
  4: FeaturedVideoLayout,
  5: Gallery3Layout,
  6: VideoSidebarLayout,
  7: CarouselLayout,
  8: ThreeColumnsLayout,
  9: LargeImageLayout,
  10: VideoGalleryTextLayout,
  11: AccordionLayout,
  12: ComparativeLayout,
};

export default function TemplateRenderer({ 
  templateId, 
  contenidos, 
  editable, 
  onActualizar, 
  onEliminar 
}: TemplateRendererProps) {
  const TemplateComponent = TEMPLATE_MAP[templateId] || LinearLayout;
  
  return (
    <TemplateComponent
      contenidos={contenidos}
      editable={editable}
      onActualizar={onActualizar}
      onEliminar={onEliminar}
    />
  );
}