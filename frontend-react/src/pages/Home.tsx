import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

// Java API
import { materialsApi, noticesApi, examsApi, llmApi } from '../api/javaApiClient';

// Components
import Header from '../components/home/Header';
import HeroSlider from '../components/home/HeroSlider';
import UpdatesTicker from '../components/home/UpdatesTicker';
import ResultSection from '../components/home/ResultSection';
import ExamTimetable from '../components/home/ExamTimetable';
import NoticesSection from '../components/home/NoticesSection';
import MaterialsFilter from '../components/home/MaterialsFilter';
import MaterialsList from '../components/home/MaterialsList';
import UploadCTA from '../components/home/UploadCTA';
import Footer from '../components/home/Footer';

export default function Home() {
  const [filters, setFilters] = useState({
    semester: 'All',
    group: 'All',
    material_type: 'All',
    year: 'All',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Fetch materials using Java API
  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: () => materialsApi.getAllMaterials().then(res => res.data),
  });

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    
    return materials.filter((m: any) => {
      const semesterMatch = appliedFilters.semester === 'All' || m.semester === appliedFilters.semester;
      const groupMatch = appliedFilters.group === 'All' || m.group === appliedFilters.group || m.group === 'All';
      const typeMatch = appliedFilters.material_type === 'All' || m.material_type === appliedFilters.material_type;
      const yearMatch = appliedFilters.year === 'All' || m.year === appliedFilters.year;
      return semesterMatch && groupMatch && typeMatch && yearMatch;
    });
  }, [materials, appliedFilters]);

  const handleSubmit = () => setAppliedFilters(filters);
  const handleReset = () => {
    const resetFilters = { semester: 'All', group: 'All', material_type: 'All', year: 'All' };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <main className="pt-16 md:pt-20">
        <HeroSlider />
        <UpdatesTicker />

        {/* Result Section */}
        <ResultSection />

        {/* Timetable & Notices Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <ExamTimetable />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <NoticesSection />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Materials Section */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-slate-900 via-slate-800/50 to-slate-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Study Materials
              </h2>
              <p className="text-slate-400">
                Question papers, notes, and more for all semesters
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <MaterialsFilter
                filters={filters}
                setFilters={setFilters}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </motion.div>

            <MaterialsList materials={filteredMaterials} isLoading={isLoading} />
          </div>
        </section>

        {/* Upload CTA Section */}
        <UploadCTA />
      </main>

      <Footer />
    </div>
  );
}