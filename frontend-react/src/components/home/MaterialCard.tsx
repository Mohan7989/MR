import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, isImageFile, isPdfFile } from '@/utils';
import { materialsApi } from '@/api/javaApiClient';

const typeColors: Record<string, string> = {
  'Question Paper': 'from-violet-500 to-purple-500',
  'Notes': 'from-emerald-500 to-teal-500',
  'Lab Material': 'from-orange-500 to-amber-500',
  'Internship': 'from-rose-500 to-pink-500',
  'Other': 'from-slate-500 to-slate-600',
};

const groupColors: Record<string, string> = {
  'B.A': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'B.Sc': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'B.Com': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'B.B.A': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'All': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

interface MaterialCardProps {
  material: any;
  index: number;
  onPreview: (material: any) => void;
}

export default function MaterialCard({ material, index, onPreview }: MaterialCardProps) {
  const handleDownload = async () => {
    try {
      await materialsApi.incrementDownload(material.id);
      window.open(material.file_url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      window.open(material.file_url, '_blank');
    }
  };

  const handlePreview = () => {
    onPreview(material);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 backdrop-blur-xl overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
        {/* Top Accent */}
        <div className={`h-1 bg-gradient-to-r ${typeColors[material.material_type] || typeColors['Other']}`} />
        
        <CardContent className="p-4">
          {/* Type & Group */}
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${groupColors[material.group] || groupColors['All']} text-xs`}>
              {material.group}
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              {material.material_type}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm mb-3 line-clamp-2 group-hover:text-violet-300 transition-colors">
            {material.title}
          </h3>

          {/* Meta Info */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{material.subject}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>{material.semester}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                <span>{material.year}</span>
              </div>
            </div>
          </div>

          {/* Upload Date */}
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-4">
            <Sparkles className="h-3 w-3" />
            <span>Uploaded {material.created_date ? formatDate(material.created_date) : ''}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs"
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}