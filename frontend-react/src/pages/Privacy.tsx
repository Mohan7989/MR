import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { Shield, Lock, Eye, Database, Bell, UserCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: "We collect minimal information necessary to provide our services. This may include uploaded files, material metadata (title, subject, semester), and basic usage analytics to improve user experience."
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: "Information is used solely to provide and improve our services, display uploaded materials to students, and maintain the platform. We do not sell or share personal information with third parties for marketing purposes."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your data. All file uploads are stored securely, and we regularly update our security protocols to ensure data protection."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, modify, or delete your uploaded content. Contact us if you wish to remove any materials you have uploaded to our platform."
    },
    {
      icon: Bell,
      title: "Cookies & Tracking",
      content: "We use essential cookies to ensure the website functions properly. We may use analytics tools to understand how users interact with our platform and improve the user experience."
    },
    {
      icon: Shield,
      title: "Third-Party Services",
      content: "We may use third-party services like Google AdSense for advertising. These services may collect their own data according to their privacy policies. We encourage you to review their policies."
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
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 mb-4">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Privacy Policy
            </h1>
            <p className="text-slate-400">
              Last updated: January 2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                <p className="text-slate-300 leading-relaxed mb-6">
                  At MRCA Students Hub, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                </p>
                <p className="text-slate-400 text-sm">
                  By using our service, you consent to the collection and use of information in accordance with this policy.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-4 md:gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl hover:border-emerald-500/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20">
                          <section.icon className="h-5 w-5 text-emerald-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{section.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-violet-900/30 to-indigo-900/30 border-violet-500/30">
              <CardContent className="p-6 text-center">
                <h3 className="text-white font-semibold mb-2">Questions About Privacy?</h3>
                <p className="text-slate-400 text-sm">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:support@mrcastudentshub.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                    support@mrcastudentshub.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}