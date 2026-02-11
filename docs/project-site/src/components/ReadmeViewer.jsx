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

import rootReadmeRaw from "../../../../README.md?raw";
import siteReadmeRaw from "../../README.md?raw";

export const ReadmeViewer = ({ isOpen, onOpenChange, initialTab = 'app' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab with initialTab when the sheet opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
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
    // Rewrite relative image paths to use public assets
    combined = combined.replace(/\.\/docs\/screens\//g, '/screenshots/');
    return combined;
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

  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full sm:max-w-4xl overflow-hidden pt-0 selection:bg-primary selection:text-primary-foreground !gap-0 flex flex-col"
      >
        {/* Pinned header area — never scrolls */}
        <div className="flex-shrink-0 px-12">
          <SheetHeader className="pt-6 pb-2 mb-0">
            <SheetTitle className="text-2xl font-bold tracking-tight">Documentation Viewer</SheetTitle>
            <SheetDescription className="text-sm">
              Explore the technical details of the Epic Switcher project.
            </SheetDescription>
          </SheetHeader>

          {/* Tab Switcher */}
          <div className="pt-5 pb-3 border-b border-border/50">
            <div className="flex w-fit mx-auto p-1 bg-muted/40 rounded-xl border border-border/50 backdrop-blur-md">
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
          </div>
        </div>

        {/* Content area — each tab has its own independent scroll container */}
        <div className="flex-1 min-h-0 relative">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="absolute inset-0 overflow-y-auto px-12"
              style={{ display: activeTab === tab.id ? 'block' : 'none' }}
            >
              <div className="pb-20 pt-4">
                <div className="mb-8 flex justify-center">
                  <span className="text-xs font-medium tracking-tight text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                    {tab.description}
                  </span>
                </div>
                <MarkdownRenderer content={tab.content} />
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
