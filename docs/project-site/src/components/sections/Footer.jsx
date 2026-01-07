import React from 'react';
import { Heart } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

export const Footer = () => {
  return (
    <footer id="contact" className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </div>

          <span className="leading-none">
            Project site powered by{" "}
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-all border-b border-transparent hover:border-foreground/20 leading-none inline-block align-baseline"
            >
              React
            </a>{" "}
            &{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-all border-b border-transparent hover:border-foreground/20 leading-none inline-block align-baseline"
            >
              shadcn/ui
            </a>
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
    </footer>
  );
};
