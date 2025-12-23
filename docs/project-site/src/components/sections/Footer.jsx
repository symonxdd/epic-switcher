import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="py-12 border-t">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by Symon
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Wails & React</span>
            <a
              href="https://github.com/symonxdd/epic-switcher"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <SiGithub className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
