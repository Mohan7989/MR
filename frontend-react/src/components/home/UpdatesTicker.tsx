import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Sparkles } from 'lucide-react';
import { noticesApi } from '@/api/javaApiClient';
import { useQuery } from '@tanstack/react-query';

export default function UpdatesTicker() {
  const { data: updates } = useQuery({
    queryKey: ['updates'],
    queryFn: () => noticesApi.getActiveUpdates().then(res => res.data),
  });

  const defaultUpdates = [
    "📚 New 5th semester question papers uploaded",
    "📅 October 2025 exam timetable released",
    "💼 New internship opportunities added",
    "📝 Study notes for all semesters available",
    "🎓 Previous year papers now accessible",
  ];

  const displayUpdates = updates?.length > 0 
    ? updates.map((u: any) => u.message) 
    : defaultUpdates;

  // Duplicate for seamless loop
  const allUpdates = [...displayUpdates, ...displayUpdates];

  return (
    <section className="relative py-4 bg-gradient-to-r from-violet-900/30 via-slate-800 to-indigo-900/30 border-y border-slate-700/50 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Label */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full">
            <Bell className="h-4 w-4 text-white animate-pulse" />
            <span className="text-white text-sm font-semibold hidden sm:block">Updates</span>
          </div>

          {/* Ticker */}
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-800 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-800 to-transparent z-10" />
            
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {allUpdates.map((update, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span className="text-slate-300 text-sm md:text-base">{update}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}