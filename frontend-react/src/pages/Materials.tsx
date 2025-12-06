import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { materialsApi } from '@/api/javaApiClient';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, FileText, Download, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function Materials() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await materialsApi.getAllMaterials();
        setMaterials(response.data);
      } catch (err) {
        console.error("Failed to fetch materials", err);
        setError("Failed to load materials. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleDownload = async (fileUrl: string) => {
    // Basic download handler - simplified for now
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-24 md:pt-28 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Study Materials
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Access question papers, notes, and study resources shared by the community.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-rose-400 py-12">
              {error}
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              No materials found. Be the first to upload!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material, index) => (
                <motion.div
                  key={material.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-violet-500/50 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-violet-500/10 text-violet-300 hover:bg-violet-500/20">
                          {material.subject}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {material.year}
                        </span>
                      </div>
                      <CardTitle className="text-white mt-2 line-clamp-2">{material.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {material.semester} Semester • {material.group}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <FileText className="h-4 w-4" />
                        {material.material_type}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        onClick={() => handleDownload(material.file_url)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}