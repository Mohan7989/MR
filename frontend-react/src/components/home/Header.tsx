import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, Search, Home, Upload, BookOpen, FileText, Shield } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from 'framer-motion';
import { materialsApi } from '@/api/javaApiClient';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: Home, href: createPageUrl('Home') },
    { name: 'Upload', icon: Upload, href: createPageUrl('Upload') },
    { name: 'Materials', icon: BookOpen, href: createPageUrl('Materials') },
    { name: 'Terms & Conditions', icon: FileText, href: createPageUrl('Terms') },
    { name: 'Privacy Policy', icon: Shield, href: createPageUrl('Privacy') },
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 2) {
        try {
          const response = await materialsApi.searchMaterials(searchQuery);
          setSuggestions(response.data.slice(0, 5));
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700/50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-slate-900 border-slate-700 w-72">
              <div className="flex flex-col gap-2 mt-8">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-indigo-600/20 transition-all duration-300"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex flex-col items-center">
            <motion.h1 
              className="text-lg md:text-2xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight"
              whileHover={{ scale: 1.02 }}
            >
              MRCA STUDENTS HUB
            </motion.h1>
            <span className="text-[10px] md:text-xs text-slate-400 tracking-[0.3em] uppercase">Only for Students</span>
          </Link>

          {/* Search */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-slate-700/50 md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
              />
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {suggestions.map((item: any) => (
                      <Link
                        key={item.id}
                        to={`${createPageUrl('Materials')}?search=${encodeURIComponent(item.title)}`}
                        className="block px-4 py-3 hover:bg-slate-700/50 transition-colors"
                        onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                      >
                        <p className="text-white text-sm font-medium">{item.title}</p>
                        <p className="text-slate-400 text-xs">{item.subject} • {item.semester}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search Expanded */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden pb-4 overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              {suggestions.length > 0 && (
                <div className="mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                  {suggestions.map((item: any) => (
                    <Link
                      key={item.id}
                      to={`${createPageUrl('Materials')}?search=${encodeURIComponent(item.title)}`}
                      className="block px-4 py-3 hover:bg-slate-700/50"
                      onClick={() => { setSearchQuery(''); setSuggestions([]); setIsSearchOpen(false); }}
                    >
                      <p className="text-white text-sm">{item.title}</p>
                      <p className="text-slate-400 text-xs">{item.subject}</p>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}