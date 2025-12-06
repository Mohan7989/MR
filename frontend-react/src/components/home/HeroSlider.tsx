import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { examsApi } from '@/api/javaApiClient';
import { useQuery } from '@tanstack/react-query';

const defaultImages = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=600&fit=crop',
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: sliderImages } = useQuery({
    queryKey: ['sliderImages'],
    queryFn: () => examsApi.getActiveSliders().then(res => res.data),
  });

  const images = sliderImages?.length > 0
    ? sliderImages.map((s: any) => s.image_url)
    : defaultImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goTo = (index: number) => setCurrentIndex(index);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden bg-slate-900">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-transparent to-slate-900/30 z-10" />

      {/* Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'w-8 bg-gradient-to-r from-violet-500 to-indigo-500'
                : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-10" />
    </section>
  );
}