import React from 'react';
import { Heart } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

export const Footer = ({ onOpenReadme }) => {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-1.5 shrink-0">
            Made with <Heart className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
          </div>

          <span className="leading-none text-center md:text-left">
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

          <div className="flex items-center gap-10">
            <button
              onClick={() => onOpenReadme('site')}
              className="hover:text-foreground transition-all border-b border-transparent hover:border-foreground/20 cursor-pointer"
            >
              Technical Documentation
            </button>

            <a
              href="https://github.com/symonxdd/epic-switcher"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-all flex items-center gap-1.5 group shrink-0"
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
