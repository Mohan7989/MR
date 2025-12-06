import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/api/javaApiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Bell, Sparkles } from 'lucide-react';

export default function ManageUpdates() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<any>(null);
  const [formData, setFormData] = useState({ message: '', is_active: true });

  const { data: updates, isLoading } = useQuery({
    queryKey: ['adminUpdates'],
    queryFn: () => adminApi.getAllUpdates().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpdates'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateUpdate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpdates'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteUpdate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUpdates'] }),
  });

  const openDialog = (update: any = null) => {
    if (update) {
      setEditingUpdate(update);
      setFormData({ message: update.message, is_active: update.is_active });
    } else {
      setEditingUpdate(null);
      setFormData({ message: '', is_active: true });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingUpdate(null);
    setFormData({ message: '', is_active: true });
  };

  const handleSubmit = () => {
    if (!formData.message.trim()) return;
    if (editingUpdate) {
      updateMutation.mutate({ id: editingUpdate.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleActive = (update: any) => {
    updateMutation.mutate({ id: update.id, data: { is_active: !update.is_active } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Ticker Updates</h3>
        </div>
        <Button onClick={() => openDialog()} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Update
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
        </div>
      ) : updates?.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-8 text-center text-slate-400">
            No updates found. Add your first update!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {updates?.map((update: any) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className={`border-slate-700 ${update.is_active ? 'bg-slate-800/50' : 'bg-slate-800/20 opacity-60'}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Bell className="h-4 w-4 text-violet-400 flex-shrink-0" />
                      <p className="text-white truncate">{update.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={update.is_active}
                        onCheckedChange={() => toggleActive(update)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => openDialog(update)} className="text-slate-400 hover:text-white">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(update.id)} className="text-slate-400 hover:text-rose-400">
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
              {editingUpdate ? 'Edit Update' : 'Add New Update'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Message</Label>
              <Input
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="e.g., 📚 New question papers uploaded"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
              />
              <Label className="text-slate-300">Active (show in ticker)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="bg-violet-600 hover:bg-violet-700">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingUpdate ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}