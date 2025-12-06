import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/javaApiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Loader2, Save, ExternalLink } from 'lucide-react';

export default function ManageResultSettings() {
  const queryClient = useQueryClient();
  const [isEnabled, setIsEnabled] = useState(true);
  const [resultUrl, setResultUrl] = useState('https://mracollegevzm.com/exam-results/');
  const [isSaving, setIsSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['resultSettingsAdmin'],
    queryFn: () => adminApi.getAllSettings().then(res => res.data),
  });

  useEffect(() => {
    if (settings) {
      const enabledSetting = settings.find((s: any) => s.setting_key === 'result_section_enabled');
      const urlSetting = settings.find((s: any) => s.setting_key === 'result_url');
      
      if (enabledSetting) {
        setIsEnabled(enabledSetting.is_enabled);
      }
      if (urlSetting) {
        setResultUrl(urlSetting.setting_value || 'https://mracollegevzm.com/exam-results/');
      }
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: ({ key, data }: { key: string; data: any }) => 
      adminApi.updateSetting(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resultSettingsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['resultSettings'] });
      setIsSaving(false);
    },
  });

  const handleSave = async () => {
    setIsSaving(true);

    // Update enabled setting
    await updateMutation.mutateAsync({
      key: 'result_section_enabled',
      data: { setting_value: 'true', is_enabled: isEnabled }
    });

    // Update URL setting
    await updateMutation.mutateAsync({
      key: 'result_url',
      data: { setting_value: resultUrl, is_enabled: true }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Result Section Settings</h3>
      </div>

      <Card className="bg-slate-800/30 border-slate-700">
        <CardContent className="p-4 space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-700/30 border border-slate-600/50">
            <div>
              <h4 className="text-white font-medium">Enable Result Section</h4>
              <p className="text-slate-400 text-sm">Show or hide the result checker on the home page</p>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>

          {/* Result URL */}
          <div className="space-y-2">
            <Label className="text-slate-300">Official Result Page URL</Label>
            <div className="flex gap-2">
              <Input
                value={resultUrl}
                onChange={(e) => setResultUrl(e.target.value)}
                placeholder="https://mracollegevzm.com/exam-results/"
                className="bg-slate-700/50 border-slate-600 text-white flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(resultUrl, '_blank')}
                className="border-slate-600 text-slate-300"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-slate-500 text-xs">
              This URL will be used to redirect students and search for results
            </p>
          </div>

          {/* Save Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handleSave}
              disabled={isSaving || updateMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving || updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}