import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileX, Loader2 } from 'lucide-react';
import MaterialCard from './MaterialCard';
import PreviewModal from './PreviewModal';

interface MaterialsListProps {
  materials: any[];
  isLoading: boolean;
}

export default function MaterialsList({ materials, isLoading }: MaterialsListProps) {
  const [previewMaterial, setPreviewMaterial] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading materials...</p>
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="p-6 rounded-full bg-slate-800/50 mb-6">
          <FileX className="h-16 w-16 text-slate-500" />
        </div>
        <h3 className="text-white text-xl font-semibold mb-2">No Materials Found</h3>
        <p className="text-slate-400 text-center max-w-md">
          No materials available for the selected filters. Try adjusting your filters or check back later!
        </p>
        <p className="text-violet-400 text-sm mt-4">Coming soon...</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {materials.map((material, index) => (
            <MaterialCard
              key={material.id}
              material={material}
              index={index}
              onPreview={setPreviewMaterial}
            />
          ))}
        </AnimatePresence>
      </div>

      <PreviewModal
        material={previewMaterial}
        isOpen={!!previewMaterial}
        onClose={() => setPreviewMaterial(null)}
      />
    </>
  );
}