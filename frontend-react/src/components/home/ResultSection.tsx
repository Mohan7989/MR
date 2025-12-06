import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { examsApi, llmApi } from '@/api/javaApiClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Search, ExternalLink, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResultSection() {
  const [rollNumber, setRollNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: settings } = useQuery({
    queryKey: ['resultSettings'],
    queryFn: () => examsApi.getSetting('result_url').then(res => res.data),
  });

  // Don't render if disabled
  const { data: enabledSetting } = useQuery({
    queryKey: ['resultEnabled'],
    queryFn: () => examsApi.getSetting('result_section_enabled').then(res => res.data),
  });

  if (enabledSetting && enabledSetting.is_enabled === false) {
    return null;
  }

  const handleSearch = async () => {
    if (!rollNumber.trim()) {
      setError('Please enter your roll number');
      return;
    }

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const response = await llmApi.checkResult(rollNumber, settings?.setting_value);
      setResult(response.data);
    } catch (err) {
      setError('Failed to check result. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCheckOfficial = () => {
    window.open(settings?.setting_value || 'https://mracollegevzm.com/exam-results/', '_blank');
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-emerald-900/30 via-slate-800/80 to-teal-900/30 border-emerald-500/30 backdrop-blur-xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl" />
            </div>

            <CardContent className="p-6 md:p-8 relative">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Left Side - Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 mb-4">
                    <GraduationCap className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Check Your Results
                  </h2>
                  <p className="text-slate-400 mb-4">
                    Enter your roll number to check your exam results instantly
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleCheckOfficial}
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Official Result Page
                  </Button>
                </div>

                {/* Right Side - Search Form */}
                <div className="flex-1 w-full max-w-md">
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="Enter your Roll Number"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 h-12 pr-12 text-lg"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="h-5 w-5 mr-2" />
                            Check Result
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {/* Result Display */}
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-emerald-400 font-semibold mb-2">Result Found!</h4>
                            <div className="space-y-1 text-sm">
                              <p className="text-white"><span className="text-slate-400">Roll No:</span> {result.roll_number}</p>
                              {result.student_name && (
                                <p className="text-white"><span className="text-slate-400">Name:</span> {result.student_name}</p>
                              )}
                              {result.exam_name && (
                                <p className="text-white"><span className="text-slate-400">Exam:</span> {result.exam_name}</p>
                              )}
                              <p className="text-white"><span className="text-slate-400">Status:</span> {result.result_status}</p>
                              {result.message && (
                                <p className="text-slate-300 mt-2">{result.message}</p>
                              )}
                            </div>
                            {result.result_link && (
                              <Button
                                size="sm"
                                className="mt-3 bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => window.open(result.result_link, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Full Result
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-rose-400 mt-0.5" />
                          <div>
                            <h4 className="text-rose-400 font-semibold mb-1">Result Not Found</h4>
                            <p className="text-slate-300 text-sm">{error}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-3 border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                              onClick={handleCheckOfficial}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Check Official Website
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}