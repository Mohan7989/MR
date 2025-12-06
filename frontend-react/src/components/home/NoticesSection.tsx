import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { noticesApi } from '@/api/javaApiClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/utils';

const defaultNotices = [
  { id: 1, title: "Internal exams postponed", description: "Due to holiday, internal exams are postponed to next week.", is_urgent: true, created_date: new Date().toISOString() },
  { id: 2, title: "Internship registration deadline", description: "Last date for internship registration is 20-10-2025.", is_urgent: false, created_date: new Date().toISOString() },
  { id: 3, title: "Lab manual submission", description: "Submit lab manuals before semester exams start.", is_urgent: false, created_date: new Date().toISOString() },
];

export default function NoticesSection() {
  const { data: notices } = useQuery({
    queryKey: ['notices'],
    queryFn: () => noticesApi.getRecentNotices(5).then(res => res.data),
  });

  const displayNotices = notices?.length > 0 ? notices : defaultNotices;

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl overflow-hidden h-full">
      <CardHeader className="border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-white text-lg">Important Notices</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayNotices.map((notice: any, index: number) => (
            <motion.div
              key={notice.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                notice.is_urgent 
                  ? 'bg-gradient-to-r from-rose-900/30 to-pink-900/30 border-rose-500/30 hover:border-rose-500/50' 
                  : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50'
              }`}
              onClick={() => window.open('#', '_blank')}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${notice.is_urgent ? 'bg-rose-500/20' : 'bg-slate-600/30'}`}>
                  {notice.is_urgent ? (
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                  ) : (
                    <Info className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium text-sm truncate">{notice.title}</h4>
                    {notice.is_urgent && (
                      <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px] px-1.5 py-0">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-2">{notice.description}</p>
                  <p className="text-slate-500 text-[10px] mt-1.5">
                    {notice.created_date ? formatDate(notice.created_date) : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}