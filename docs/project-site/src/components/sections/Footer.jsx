import React from 'react';
import { Heart } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

export const Footer = () => {
  return (
    <footer id="contact" className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-1.5 order-2 md:order-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> by Symon
          </div>
          <div className="flex items-center gap-8 order-1 md:order-2">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-border md:hidden" />
              Powered by Wails & React
            </span>
            <a
              href="https://github.com/symonxdd/epic-switcher"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-all flex items-center gap-1.5 group"
            >
              <SiGithub className="w-4 h-4" />
              <span className="border-b border-transparent group-hover:border-foreground/20">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
