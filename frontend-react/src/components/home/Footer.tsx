import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  GraduationCap, Home, Upload, BookOpen, Calendar, Bell, 
  FileText, Shield, Mail, Instagram, Youtube, Send,
  Heart, ExternalLink
} from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', icon: Home, href: createPageUrl('Home') },
    { name: 'Upload', icon: Upload, href: createPageUrl('Upload') },
    { name: 'Materials', icon: BookOpen, href: createPageUrl('Materials') },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', icon: FileText, href: createPageUrl('Terms') },
    { name: 'Privacy Policy', icon: Shield, href: createPageUrl('Privacy') },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-400' },
    { name: 'Telegram', icon: Send, href: '#', color: 'hover:text-blue-400' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-40 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">MRCA Students Hub</h3>
                <p className="text-slate-400 text-xs">Only for Students</p>
              </div>
            </motion.div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your one-stop destination for academic materials, question papers, notes, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors text-sm"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-colors text-sm"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <Mail className="h-4 w-4" />
              <span>support@mrcastudentshub.com</span>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`p-2.5 rounded-xl bg-slate-800/50 text-slate-400 ${link.color} transition-all duration-300 hover:bg-slate-700/50`}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © 2025 MRCA Students Hub. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-slate-500 text-sm">
              Made with <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> for students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}