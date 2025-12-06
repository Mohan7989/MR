import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { filesApi, materialsApi } from '@/api/javaApiClient';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload as UploadIcon, FileUp, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
const groups = ['B.A', 'B.Sc', 'B.Com', 'B.B.A', 'All'];
const materialTypes = ['Question Paper', 'Notes', 'Lab Material', 'Internship', 'Other'];
const years = ['2025', '2024', '2023', '2022', '2021', '2020'];

export default function Upload() {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    group: '',
    semester: '',
    year: '',
    material_type: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null); // 'success' | 'error' | null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !formData.title || !formData.subject || !formData.group || !formData.semester || !formData.material_type) {
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // 1. Upload file
      const fileResponse = await filesApi.uploadFile(file);
      // Assuming backend returns the file URL or path in the response data
      // Adjust 'fileUrl' based on actual backend response structure
      const file_url = fileResponse.data.fileUrl || fileResponse.data.url || fileResponse.data;

      // 2. Create material record
      await materialsApi.uploadMaterial({
        ...formData,
        file_url,
        status: 'pending',
      });

      setIsUploading(false);
      setUploadStatus('success');
      setFormData({
        title: '',
        subject: '',
        group: '',
        semester: '',
        year: '',
        material_type: '',
      });
      setFile(null);
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      setUploadStatus('error');
    }
  };



  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="pt-24 md:pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-violet-400 text-sm">Contribute to the community</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Upload Materials
            </h1>
            <p className="text-slate-400">
              Share your study materials with fellow students
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="text-white flex items-center gap-2">
                  <UploadIcon className="h-5 w-5 text-violet-400" />
                  Upload Form
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Fill in the details and upload your file. No login required!
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {uploadStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6"
                  >
                    <Alert className="bg-emerald-500/10 border-emerald-500/30">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <AlertTitle className="text-emerald-400">Upload Successful!</AlertTitle>
                      <AlertDescription className="text-slate-300">
                        Your material has been submitted. Within 2 hours, your material will be live on the website after admin approval.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {uploadStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6"
                  >
                    <Alert className="bg-rose-500/10 border-rose-500/30">
                      <AlertCircle className="h-5 w-5 text-rose-400" />
                      <AlertTitle className="text-rose-400">Error</AlertTitle>
                      <AlertDescription className="text-slate-300">
                        Please fill all required fields and select a file.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., 5th Semester Economics Question Paper 2024"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Subject *</Label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g., Economics, Physics, English"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Group *</Label>
                      <Select value={formData.group} onValueChange={(val: string) => setFormData({ ...formData, group: val })}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {groups.map(g => (
                            <SelectItem key={g} value={g} className="text-white hover:bg-slate-700">{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Semester *</Label>
                      <Select value={formData.semester} onValueChange={(val: string) => setFormData({ ...formData, semester: val })}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {semesters.map(s => (
                            <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">{s} Semester</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Material Type *</Label>
                      <Select value={formData.material_type} onValueChange={(val: string) => setFormData({ ...formData, material_type: val })}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {materialTypes.map(t => (
                            <SelectItem key={t} value={t} className="text-white hover:bg-slate-700">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Year</Label>
                      <Select value={formData.year} onValueChange={(val: string) => setFormData({ ...formData, year: val })}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {years.map(y => (
                            <SelectItem key={y} value={y} className="text-white hover:bg-slate-700">{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Upload File (PDF or Image) *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-violet-500/50 hover:bg-slate-700/20 transition-all duration-300"
                      >
                        <FileUp className="h-8 w-8 text-slate-400" />
                        <div className="text-center">
                          <p className="text-white font-medium">
                            {file ? file.name : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-slate-500 text-sm">PDF, JPG, PNG (max 10MB)</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      disabled={isUploading}
                      className="w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/20"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="h-5 w-5 mr-2" />
                          Submit Material
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}