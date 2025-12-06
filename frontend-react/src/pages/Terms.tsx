import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using MRCA Students Hub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials on MRCA Students Hub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
    },
    {
      title: "3. User Contributions",
      content: "Users may upload study materials, question papers, and notes. By uploading content, you warrant that you own the content or have the right to share it. All uploads are subject to admin approval before being published."
    },
    {
      title: "4. Prohibited Uses",
      content: "You may not use the service for any illegal purpose, to solicit others to perform illegal acts, to violate any regulations, to infringe upon intellectual property rights, or to upload any malicious content."
    },
    {
      title: "5. Content Disclaimer",
      content: "The materials on MRCA Students Hub are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all warranties including implied warranties of merchantability and fitness for a particular purpose."
    },
    {
      title: "6. Limitations",
      content: "In no event shall MRCA Students Hub or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website."
    },
    {
      title: "7. Modifications",
      content: "MRCA Students Hub may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms."
    },
    {
      title: "8. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <main className="pt-24 md:pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 mb-4">
              <FileText className="h-8 w-8 text-violet-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Terms & Conditions
            </h1>
            <p className="text-slate-400">
              Last updated: January 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                <div className="space-y-6">
                  {sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle2 className="h-5 w-5 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{section.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{section.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}