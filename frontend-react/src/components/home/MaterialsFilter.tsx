import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const semesters = ['All', '1st', '2nd', '3rd', '4th', '5th', '6th'];
const groups = ['All', 'B.A', 'B.Sc', 'B.Com', 'B.B.A'];
const materialTypes = ['All', 'Question Paper', 'Notes', 'Lab Material', 'Internship', 'Other'];
const years = ['All', '2025', '2024', '2023', '2022', '2021', '2020'];

interface MaterialsFilterProps {
  filters: {
    semester: string;
    group: string;
    material_type: string;
    year: string;
  };
  setFilters: (filters: any) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export default function MaterialsFilter({ filters, setFilters, onSubmit, onReset }: MaterialsFilterProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/20">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-white font-semibold">Filter Materials</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Select value={filters.semester} onValueChange={(val) => setFilters({...filters, semester: val})}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {semesters.map(s => (
                <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">
                  {s} {s !== 'All' && 'Sem'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.group} onValueChange={(val) => setFilters({...filters, group: val})}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {groups.map(g => (
                <SelectItem key={g} value={g} className="text-white hover:bg-slate-700">{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.material_type} onValueChange={(val) => setFilters({...filters, material_type: val})}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {materialTypes.map(t => (
                <SelectItem key={t} value={t} className="text-white hover:bg-slate-700">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.year} onValueChange={(val) => setFilters({...filters, year: val})}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {years.map(y => (
                <SelectItem key={y} value={y} className="text-white hover:bg-slate-700">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onSubmit}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onReset}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}