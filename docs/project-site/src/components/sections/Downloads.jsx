import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ShieldCheck, Zap, ExternalLink } from 'lucide-react';
import { useLatestRelease } from '../../hooks/useLatestRelease';

// Modern SVG for GitHub to avoid lucide deprecation
const GithubIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    stroke="none"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export const Downloads = () => {
  const { downloadUrl } = useLatestRelease();

  return (
    <section id="downloads" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto rounded-[32px] bg-primary text-primary-foreground px-8 py-16 md:px-16 md:py-24 relative overflow-hidden shadow-none selection:bg-primary-foreground/20 selection:text-primary-foreground">
          {/* Decorative elements - Subtle Glow */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary-foreground/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Ready to simplify your Epic Gaming?</h2>
              <p className="text-primary-foreground/70 text-lg mb-12 leading-relaxed max-w-lg">
                Download the latest version of Epic Switcher and start managing your sessions like a pro. No installation required.
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
                    <GithubIcon className="mr-2 h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Zap, title: "Zero Install", desc: "Just run the .exe" },
                { icon: ShieldCheck, title: "Open Source", desc: "Transparency by default" },
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-background rounded-[24px] text-foreground">
                  <feature.icon className="w-10 h-10 mb-6 text-foreground/80" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
