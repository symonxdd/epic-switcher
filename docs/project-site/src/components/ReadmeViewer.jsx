import React, { useState, useEffect, useMemo } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MarkdownRenderer } from './MarkdownRenderer';
import { FileText, Monitor, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import rootReadmeRaw from "../../../../README.md?raw";
import siteReadmeRaw from "../../README.md?raw";

export const ReadmeViewer = ({ isOpen, onOpenChange, initialTab = 'app' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevTab, setPrevTab] = useState(initialTab);

  // Sync activeTab with initialTab when the sheet opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setPrevTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const filteredRootReadme = useMemo(() => {
    // Extract Windows Warning section
    const warningMatch = rootReadmeRaw.match(/<details>[\s\S]*?⚠️ Windows SmartScreen Warning[\s\S]*?<\/details>/);
    const warningText = warningMatch ? warningMatch[0] : "";

    // Extract Project Layout onwards
    const layoutIndex = rootReadmeRaw.indexOf("## 🗂️ Project Layout");
    const layoutText = layoutIndex !== -1 ? rootReadmeRaw.substring(layoutIndex) : "";

    let combined = `${warningText}\n\n${layoutText}`;
    return combined.replace(/\.\/docs\/screens\//g, 'https://raw.githubusercontent.com/symonxdd/epic-switcher/main/docs/screens/');
  }, []);

  const filteredSiteReadme = useMemo(() => {
    const techStackIndex = siteReadmeRaw.indexOf("## Tech Stack");
    return techStackIndex !== -1 ? siteReadmeRaw.substring(techStackIndex) : siteReadmeRaw;
  }, []);

  const tabs = [
    {
      id: 'app',
      label: 'Epic Switcher',
      icon: Monitor,
      content: filteredRootReadme,
      description: 'Technical core & security documentation'
    },
    {
      id: 'site',
      label: 'Project Site',
      icon: Globe,
      content: filteredSiteReadme,
      description: 'Site architecture & development details'
    },
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const prevIndex = tabs.findIndex(t => t.id === prevTab);
  const direction = activeIndex > prevIndex ? 1 : -1;

  const currentTab = tabs.find(t => t.id === activeTab);
  const currentContent = currentTab?.content || '';

  const handleTabChange = (id) => {
    setPrevTab(activeTab);
    setActiveTab(id);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto pt-10 sm:px-12 selection:bg-primary selection:text-primary-foreground">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold tracking-tight">Documentation Viewer</SheetTitle>
          <SheetDescription className="text-sm">
            Explore the technical details of the Epic Switcher project.
          </SheetDescription>
        </SheetHeader>

        {/* Minimalist Tab Switcher */}
        <div className="flex w-fit mx-auto p-1 bg-muted/50 rounded-xl mb-8 border border-border/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-center gap-2 py-2 px-6 text-sm font-medium transition-all rounded-lg ${activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="pb-20 relative overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="mb-6 px-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 bg-muted/30 px-2 py-1 rounded-md">
                  Source: {currentTab?.description}
                </span>
              </div>
              <MarkdownRenderer content={currentContent} />
            </motion.div>
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};
