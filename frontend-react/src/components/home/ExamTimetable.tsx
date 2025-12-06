import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { examsApi } from '@/api/javaApiClient';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const defaultTimetable = {
  title: "III B.A., B.Sc., B.Com & B.B.A. Degree FIFTH SEMESTER - END (Supplementary) 20-22 Series",
  subtitle: "Examinations OCTOBER 2025",
  batch: "10 A.M. to 12.30 P.M.",
  schedule: [
    { date: "28-10-2025", day: "Tuesday", ba_subject: "Economics - VII (Banking)", bsc_subject: "Mathematics - VI", bcom_subject: "Management Accounting", bba_subject: "Global HR Management" },
    { date: "29-10-2025", day: "Wednesday", ba_subject: "History - VII", bsc_subject: "Physics - VI", bcom_subject: "Business Law", bba_subject: "Marketing Strategy" },
    { date: "30-10-2025", day: "Thursday", ba_subject: "Political Science - VII", bsc_subject: "Chemistry - VI", bcom_subject: "Income Tax", bba_subject: "Financial Management" },
    { date: "31-10-2025", day: "Friday", ba_subject: "English Literature", bsc_subject: "Botany - VI", bcom_subject: "Auditing", bba_subject: "Operations Management" },
  ]
};

export default function ExamTimetable() {
  const [currentTable, setCurrentTable] = useState(0);

  const { data: timetables } = useQuery({
    queryKey: ['timetables'],
    queryFn: () => examsApi.getActiveTimetables().then(res => res.data),
  });

  const displayTables = timetables?.length > 0 ? timetables : [defaultTimetable];

  const goNext = () => setCurrentTable((prev) => (prev + 1) % displayTables.length);
  const goPrev = () => setCurrentTable((prev) => (prev - 1 + displayTables.length) % displayTables.length);

  const currentData = displayTables[currentTable];

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl overflow-hidden">
      <CardHeader className="border-b border-slate-700/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-white text-lg">Exam Timetable</CardTitle>
          </div>
          {displayTables.length > 1 && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={goPrev} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goNext} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTable}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Info */}
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20">
              <p className="text-white font-semibold text-sm mb-1">{currentData.title}</p>
              <p className="text-slate-300 text-xs">{currentData.subtitle}</p>
              <div className="flex items-center gap-2 mt-2 text-amber-400 text-xs">
                <Clock className="h-3 w-3" />
                <span>{currentData.batch}</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[500px] text-xs">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-2 text-slate-400 font-medium">Date</th>
                    <th className="text-left py-2 px-2 text-violet-400 font-medium">B.A</th>
                    <th className="text-left py-2 px-2 text-emerald-400 font-medium">B.Sc</th>
                    <th className="text-left py-2 px-2 text-amber-400 font-medium">B.Com</th>
                    <th className="text-left py-2 px-2 text-rose-400 font-medium">B.B.A</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.schedule?.map((row: any, index: number) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-2.5 px-2">
                        <div className="text-white font-medium">{row.date}</div>
                        <div className="text-slate-500 text-[10px]">{row.day}</div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-300">{row.ba_subject}</td>
                      <td className="py-2.5 px-2 text-slate-300">{row.bsc_subject}</td>
                      <td className="py-2.5 px-2 text-slate-300">{row.bcom_subject}</td>
                      <td className="py-2.5 px-2 text-slate-300">{row.bba_subject}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Dots */}
            {displayTables.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {displayTables.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTable(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentTable 
                        ? 'w-6 bg-gradient-to-r from-orange-500 to-amber-500' 
                        : 'w-1.5 bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}