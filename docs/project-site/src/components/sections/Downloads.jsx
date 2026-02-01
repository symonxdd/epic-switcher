import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ShieldCheck, Zap, ExternalLink } from 'lucide-react';
import { useLatestRelease } from '../../hooks/useLatestRelease';
import { SiGithub } from '@icons-pack/react-simple-icons';

export const Downloads = () => {
  const { downloadUrl } = useLatestRelease();

  return (
    <section id="downloads" className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto rounded-[32px] bg-primary text-primary-foreground px-8 py-12 md:px-16 md:py-16 relative overflow-hidden shadow-none selection:bg-primary-foreground/20 selection:text-primary-foreground">
          {/* Decorative elements - Subtle Glow */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary-foreground/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Ready to switch?</h2>
              <p className="text-primary-foreground/70 text-lg mb-12 leading-relaxed max-w-lg">
                Download the latest version of Epic Switcher. No installation required.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Button
                  size="lg"
                  className="h-14 px-10 text-lg font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all rounded-full shadow-none border-none"
                  asChild
                >
                  <a href={downloadUrl}>
                    <Download className="mr-2 h-5 w-5" />
                    Download for Windows
                  </a>
                </Button>

                <Button
                  size="lg"
                  className="h-14 px-10 text-lg font-semibold bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all rounded-full shadow-none"
                  asChild
                >
                  <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer">
                    <SiGithub className="mr-2 h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[400px] w-full">
                {[
                  { icon: Zap, title: "Zero Install", desc: "Just run the .exe" },
                  { icon: ShieldCheck, title: "Open Source", desc: "Transparency by default" },
                ].map((feature, i) => (
                  <div key={i} className="aspect-square flex flex-col items-center justify-center text-center p-6 bg-background rounded-[24px] text-foreground shadow-sm">
                    <feature.icon className="w-8 h-8 mb-4 text-foreground/80" />
                    <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                    <p className="text-xs opacity-80 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
