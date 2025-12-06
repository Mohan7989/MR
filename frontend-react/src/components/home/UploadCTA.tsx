import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, Sparkles, Users, FileUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadCTA() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-violet-900/40 via-slate-800/80 to-indigo-900/40 border-violet-500/30 backdrop-blur-xl overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />
            </div>

            <CardContent className="p-6 md:p-10 relative">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                    <span className="text-violet-400 text-sm font-medium">Contribute to the Community</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Have Study Materials?
                  </h2>
                  <p className="text-slate-400 text-lg mb-6 max-w-lg">
                    Share your question papers, notes, and study materials with fellow students. No login required!
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-violet-500/20">
                        <FileUp className="h-5 w-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Easy Upload</p>
                        <p className="text-slate-500 text-xs">No registration needed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-indigo-500/20">
                        <Users className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Help Others</p>
                        <p className="text-slate-500 text-xs">Support fellow students</p>
                      </div>
                    </div>
                  </div>

                  <Link to={createPageUrl('Upload')}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/20">
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Materials
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                {/* Right Illustration */}
                <div className="hidden lg:flex flex-shrink-0">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center">
                      <Upload className="h-20 w-20 text-violet-400" />
                    </div>
                    {/* Floating elements */}
                    <motion.div
                      animate={{ y: [0, -5, 0], x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -top-4 -right-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30"
                    >
                      <FileUp className="h-6 w-6 text-emerald-400" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 5, 0], x: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -bottom-4 -left-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/30"
                    >
                      <Sparkles className="h-6 w-6 text-amber-400" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}