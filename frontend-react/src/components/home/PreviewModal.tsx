import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, X } from 'lucide-react';
import { isImageFile, isPdfFile } from '@/utils';

interface PreviewModalProps {
  material: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ material, isOpen, onClose }: PreviewModalProps) {
  if (!material) return null;

  const isImage = isImageFile(material.file_url);
  const isPdf = isPdfFile(material.file_url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-white text-lg mb-2">{material.title}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                  {material.group}
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-400">
                  {material.semester}
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-400">
                  {material.subject}
                </Badge>
                <Badge variant="outline" className="border-slate-600 text-slate-400">
                  {material.year}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {isPdf ? (
            <iframe
              src={material.file_url}
              className="w-full h-[60vh] rounded-lg border border-slate-700"
              title="PDF Preview"
            />
          ) : isImage ? (
            <img
              src={material.file_url}
              alt={material.title}
              className="max-w-full h-auto mx-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <p className="mb-4">Preview not available for this file type</p>
              <Button
                onClick={() => window.open(material.file_url, '_blank')}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 pt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
            Close
          </Button>
          <Button
            onClick={() => window.open(material.file_url, '_blank')}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}