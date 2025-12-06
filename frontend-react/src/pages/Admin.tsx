import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Java API
import { adminApi, filesApi } from '../api/javaApiClient';

// UI Components
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';

// Icons
import {
  Shield, Clock, CheckCircle2, XCircle, Eye, Trash2,
  FileText, Download, Loader2, LogOut, BookOpen,
  Bell, Calendar, Image, Settings, Sparkles
} from 'lucide-react';

// Admin Components
import ManageUpdates from '../components/admin/ManageUpdates';
import ManageNotices from '../components/admin/ManageNotices';
import ManageTimetables from '../components/admin/ManageTimetables';
import ManageSliders from '../components/admin/ManageSliders';
import ManageResultSettings from '../components/admin/ManageResultSettings';

// Utils
import { formatDate } from '../utils';

export default function Admin() {
  const queryClient = useQueryClient();
  const [previewMaterial, setPreviewMaterial] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch data using Java API
  const { data: pendingMaterials, isLoading: loadingPending } = useQuery({
    queryKey: ['pendingMaterials'],
    queryFn: () => adminApi.getPendingMaterials().then(res => res.data),
  });

  const { data: approvedMaterials, isLoading: loadingApproved } = useQuery({
    queryKey: ['approvedMaterials'],
    queryFn: () => adminApi.getApprovedMaterials().then(res => res.data),
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => adminApi.getDashboardStats().then(res => res.data),
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (id: number) => adminApi.approveMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['approvedMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => adminApi.rejectMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/admin';
  };

  const MaterialRow = ({ material, isPending }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate mb-2">{material.title}</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 text-xs">
              {material.group}
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              {material.semester}
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              {material.subject}
            </Badge>
            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
              {material.material_type}
            </Badge>
          </div>
          <p className="text-slate-500 text-xs mt-2">
            Uploaded: {material.created_date ? formatDate(material.created_date) : 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMaterial(material)}
            className="border-slate-600 text-slate-300"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isPending ? (
            <>
              <Button
                size="sm"
                onClick={() => approveMutation.mutate(material.id)}
                disabled={approveMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => rejectMutation.mutate(material.id)}
                disabled={rejectMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteMutation.mutate(material.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400 text-sm">Manage materials, notices, and settings</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Clock className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{dashboardStats?.pendingMaterials || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{dashboardStats?.approvedMaterials || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-violet-500/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <BookOpen className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{dashboardStats?.totalMaterials || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-rose-900/30 to-pink-900/30 border-rose-500/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-500/20">
                <FileText className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Today</p>
                <p className="text-2xl font-bold text-white">
                  {approvedMaterials?.filter((m: any) => {
                    const today = new Date().toDateString();
                    return new Date(m.created_date).toDateString() === today;
                  }).length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border border-slate-700 mb-6 flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="pending" className="data-[state=active]:bg-violet-600">
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-violet-600">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approved
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-violet-600">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Pending Materials Tab */}
            <TabsContent value="pending">
              {loadingPending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
                </div>
              ) : pendingMaterials?.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending materials</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {pendingMaterials?.map((material: any) => (
                      <MaterialRow key={material.id} material={material} isPending={true} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* Approved Materials Tab */}
            <TabsContent value="approved">
              {loadingApproved ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
                </div>
              ) : approvedMaterials?.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No approved materials</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {approvedMaterials?.map((material: any) => (
                      <MaterialRow key={material.id} material={material} isPending={false} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-8">
                {/* Slider Images */}
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6">
                    <ManageSliders />
                  </CardContent>
                </Card>

                {/* Updates Ticker */}
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6">
                    <ManageUpdates />
                  </CardContent>
                </Card>

                {/* Notices */}
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6">
                    <ManageNotices />
                  </CardContent>
                </Card>

                {/* Timetables */}
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6">
                    <ManageTimetables />
                  </CardContent>
                </Card>

                {/* Result Section Settings */}
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-6">
                    <ManageResultSettings />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Preview Dialog */}
        <Dialog open={!!previewMaterial} onOpenChange={() => setPreviewMaterial(null)}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-white">{previewMaterial?.title}</DialogTitle>
            </DialogHeader>
            {previewMaterial && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-violet-500/20 text-violet-400">{previewMaterial.group}</Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">{previewMaterial.semester}</Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">{previewMaterial.subject}</Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">{previewMaterial.material_type}</Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">{previewMaterial.year}</Badge>
                </div>
                {previewMaterial.file_url?.match(/\.pdf$/i) ? (
                  <iframe
                    src={previewMaterial.file_url}
                    className="w-full h-[50vh] rounded-lg border border-slate-700"
                    title="PDF Preview"
                  />
                ) : previewMaterial.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={previewMaterial.file_url}
                    alt={previewMaterial.title}
                    className="max-w-full h-auto mx-auto rounded-lg"
                  />
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>Preview not available</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(previewMaterial?.file_url, '_blank')}
                className="border-slate-600 text-slate-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setPreviewMaterial(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}