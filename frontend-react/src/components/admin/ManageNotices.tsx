import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/api/javaApiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Bell, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/utils';

export default function ManageNotices() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', is_urgent: false, is_active: true });

  const { data: notices, isLoading } = useQuery({
    queryKey: ['adminNotices'],
    queryFn: () => adminApi.getAllNotices().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotices'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateNotice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNotices'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteNotice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotices'] }),
  });

  const openDialog = (notice: any = null) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        description: notice.description,
        is_urgent: notice.is_urgent,
        is_active: notice.is_active,
      });
    } else {
      setEditingNotice(null);
      setFormData({ title: '', description: '', is_urgent: false, is_active: true });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingNotice(null);
    setFormData({ title: '', description: '', is_urgent: false, is_active: true });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;
    if (editingNotice) {
      updateMutation.mutate({ id: editingNotice.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleActive = (notice: any) => {
    updateMutation.mutate({ id: notice.id, data: { is_active: !notice.is_active } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-white">Important Notices</h3>
        </div>
        <Button onClick={() => openDialog()} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Notice
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-rose-500 animate-spin" />
        </div>
      ) : notices?.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-8 text-center text-slate-400">
            No notices found. Add your first notice!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notices?.map((notice: any) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className={`border-slate-700 ${notice.is_active ? 'bg-slate-800/50' : 'bg-slate-800/20 opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium truncate">{notice.title}</h4>
                          {notice.is_urgent && (
                            <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2">{notice.description}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          {notice.created_date && formatDate(notice.created_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={notice.is_active}
                          onCheckedChange={() => toggleActive(notice)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => openDialog(notice)} className="text-slate-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(notice.id)} className="text-slate-400 hover:text-rose-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
              {editingNotice ? 'Edit Notice' : 'Add New Notice'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notice title"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Notice description"
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_urgent}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_urgent: checked })}
              />
              <Label className="text-slate-300">Mark as Urgent</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
              />
              <Label className="text-slate-300">Active (show on website)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="bg-rose-600 hover:bg-rose-700">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingNotice ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}