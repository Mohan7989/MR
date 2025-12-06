import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi, filesApi } from '@/api/javaApiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Image, Upload } from 'lucide-react';

export default function ManageSliders() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any>(null);
  const [formData, setFormData] = useState({ image_url: '', order: 0, is_active: true });
  const [isUploading, setIsUploading] = useState(false);

  const { data: sliders, isLoading } = useQuery({
    queryKey: ['adminSliders'],
    queryFn: () => adminApi.getAllSliders().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createSlider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSliders'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateSlider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSliders'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteSlider(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminSliders'] }),
  });

  const openDialog = (slider: any = null) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData({
        image_url: slider.image_url,
        order: slider.order || 0,
        is_active: slider.is_active,
      });
    } else {
      setEditingSlider(null);
      setFormData({ image_url: '', order: (sliders?.length || 0), is_active: true });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingSlider(null);
    setFormData({ image_url: '', order: 0, is_active: true });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const response = await filesApi.uploadFile(file);
        setFormData({ ...formData, image_url: response.data.file_url });
      } catch (error) {
        console.error('File upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.image_url.trim()) return;
    if (editingSlider) {
      updateMutation.mutate({ id: editingSlider.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleActive = (slider: any) => {
    updateMutation.mutate({ id: slider.id, data: { is_active: !slider.is_active } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Hero Slider Images</h3>
        </div>
        <Button onClick={() => openDialog()} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
        </div>
      ) : sliders?.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-8 text-center text-slate-400">
            No slider images found. Add your first image!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {sliders?.map((slider: any) => (
              <motion.div
                key={slider.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className={`border-slate-700 overflow-hidden ${slider.is_active ? 'bg-slate-800/50' : 'bg-slate-800/20 opacity-60'}`}>
                  <div className="aspect-video relative">
                    <img
                      src={slider.image_url}
                      alt={`Slider ${slider.order}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                      #{slider.order + 1}
                    </div>
                  </div>
                  <CardContent className="p-3 flex items-center justify-between">
                    <Switch
                      checked={slider.is_active}
                      onCheckedChange={() => toggleActive(slider)}
                    />
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDialog(slider)} className="h-8 w-8 text-slate-400 hover:text-white">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(slider.id)} className="h-8 w-8 text-slate-400 hover:text-rose-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingSlider ? 'Edit Slider Image' : 'Add New Slider Image'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Image</Label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="slider-upload"
                />
                <label
                  htmlFor="slider-upload"
                  className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-slate-400" />
                  )}
                  <span className="text-slate-400">Upload Image</span>
                </label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Or paste image URL"
                  className="bg-slate-800 border-slate-700 text-white"
                />
                {formData.image_url && (
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-700">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Display Order</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
              />
              <Label className="text-slate-300">Active (show in slider)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending || isUploading} className="bg-indigo-600 hover:bg-indigo-700">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingSlider ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}