import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Github, ShieldCheck, Zap } from 'lucide-react';

export const Downloads = () => {
  const latestReleaseUrl = "https://github.com/symonxdd/epic-switcher/releases/latest";

  return (
    <section id="downloads" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-primary text-primary-foreground p-12 md:p-20 relative overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to simplify your Epic Gaming?</h2>
              <p className="text-primary-foreground/80 text-lg mb-10 leading-relaxed">
                Download the latest version of Epic Switcher and start managing your sessions like a pro. No installation required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <a href={latestReleaseUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    Download for Windows
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-semibold bg-white/5 border-white/20 hover:bg-white/10 text-white"
                  asChild
                >
                  <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Zap, title: "Zero Install", desc: "Just run the .exe" },
                { icon: ShieldCheck, title: "Open Source", desc: "Transparency by default" },
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                  <feature.icon className="w-8 h-8 mb-4 opacity-80" />
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-sm opacity-70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
