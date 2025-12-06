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
import { Plus, Pencil, Trash2, Loader2, Calendar, PlusCircle, X } from 'lucide-react';

export default function ManageTimetables() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    batch: '',
    is_active: true,
    schedule: [] as any[]
  });

  const { data: timetables, isLoading } = useQuery({
    queryKey: ['adminTimetables'],
    queryFn: () => adminApi.getAllTimetables().then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.createTimetable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimetables'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi.updateTimetable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimetables'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteTimetable(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminTimetables'] }),
  });

  const openDialog = (timetable: any = null) => {
    if (timetable) {
      setEditingTimetable(timetable);
      setFormData({
        title: timetable.title || '',
        subtitle: timetable.subtitle || '',
        batch: timetable.batch || '',
        is_active: timetable.is_active,
        schedule: timetable.schedule || []
      });
    } else {
      setEditingTimetable(null);
      setFormData({
        title: '',
        subtitle: '',
        batch: '',
        is_active: true,
        schedule: []
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTimetable(null);
    setFormData({ title: '', subtitle: '', batch: '', is_active: true, schedule: [] });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    if (editingTimetable) {
      updateMutation.mutate({ id: editingTimetable.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleActive = (timetable: any) => {
    updateMutation.mutate({ id: timetable.id, data: { is_active: !timetable.is_active } });
  };

  const addScheduleRow = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { date: '', day: '', ba_subject: '', bsc_subject: '', bcom_subject: '', bba_subject: '' }]
    });
  };

  const removeScheduleRow = (index: number) => {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index)
    });
  };

  const updateScheduleRow = (index: number, field: string, value: string) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Exam Timetables</h3>
        </div>
        <Button onClick={() => openDialog()} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Timetable
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
        </div>
      ) : timetables?.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-8 text-center text-slate-400">
            No timetables found. Add your first timetable!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {timetables?.map((timetable: any) => (
              <motion.div
                key={timetable.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className={`border-slate-700 ${timetable.is_active ? 'bg-slate-800/50' : 'bg-slate-800/20 opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium">{timetable.title}</h4>
                        <p className="text-slate-400 text-sm">{timetable.subtitle}</p>
                        <p className="text-amber-400 text-xs mt-1">{timetable.batch}</p>
                        <p className="text-slate-500 text-xs mt-1">
                          {timetable.schedule?.length || 0} exam dates
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={timetable.is_active}
                          onCheckedChange={() => toggleActive(timetable)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => openDialog(timetable)} className="text-slate-400 hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(timetable.id)} className="text-slate-400 hover:text-rose-400">
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
        <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTimetable ? 'Edit Timetable' : 'Add New Timetable'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., III B.A., B.Sc., B.Com & B.B.A. FIFTH SEMESTER"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Subtitle</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Examinations OCTOBER 2025"
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Timing</Label>
                <Input
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  placeholder="e.g., 10 A.M. to 12.30 P.M."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                />
                <Label className="text-slate-300">Active (show on website)</Label>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Exam Schedule</Label>
                <Button type="button" variant="outline" size="sm" onClick={addScheduleRow} className="border-slate-600 text-slate-300">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>

              {formData.schedule.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 px-2 text-slate-400">Date</th>
                        <th className="text-left py-2 px-2 text-slate-400">Day</th>
                        <th className="text-left py-2 px-2 text-violet-400">B.A</th>
                        <th className="text-left py-2 px-2 text-emerald-400">B.Sc</th>
                        <th className="text-left py-2 px-2 text-amber-400">B.Com</th>
                        <th className="text-left py-2 px-2 text-rose-400">B.B.A</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.schedule.map((row: any, index: number) => (
                        <tr key={index} className="border-b border-slate-700/50">
                          <td className="py-2 px-1">
                            <Input
                              value={row.date}
                              onChange={(e) => updateScheduleRow(index, 'date', e.target.value)}
                              placeholder="DD-MM-YYYY"
                              className="bg-slate-800 border-slate-700 text-white text-xs h-8"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              value={row.day}
                              onChange={(e) => updateScheduleRow(index, 'day', e.target.value)}
                              placeholder="Day"
                              className="bg-slate-800 border-slate-700 text-white text-xs h-8"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              value={row.ba_subject}
                              onChange={(e) => updateScheduleRow(index, 'ba_subject', e.target.value)}
                              placeholder="B.A Subject"
                              className="bg-slate-800 border-slate-700 text-white text-xs h-8"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              value={row.bsc_subject}
                              onChange={(e) => updateScheduleRow(index, 'bsc_subject', e.target.value)}
                              placeholder="B.Sc Subject"
                              className="bg-slate-800 border-slate-700 text-white text-xs h-8"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              value={row.bcom_subject}
                              onChange={(e) => updateScheduleRow(index, 'bcom_subject', e.target.value)}
                              placeholder="B.Com Subject"
                              className="bg-slate-800 border-slate-700 text-white text-xs h-8"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Input
                              value={row.bba_subject}
                              onChange={(e) => updateScheduleRow(index, 'bba_subject', e.target.value)}
                              placeholder="B.B.A Subject"
                              className="bg-slate-800 border-slate-700 text-white text-xs h-8"
                            />
                          </td>
                          <td className="py-2 px-1">
                            <Button variant="ghost" size="icon" onClick={() => removeScheduleRow(index)} className="h-8 w-8 text-slate-400 hover:text-rose-400">
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {formData.schedule.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">No schedule rows. Click "Add Row" to add exam dates.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="bg-orange-600 hover:bg-orange-700">
              {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingTimetable ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}