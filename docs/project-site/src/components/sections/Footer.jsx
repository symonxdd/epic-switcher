import React from 'react';
import { Heart, Github, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="py-12 border-t">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Epic Switcher" className="w-6 h-6 grayscale opacity-50" />
            <span className="font-semibold text-muted-foreground">Epic Switcher</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer" className="hover:text-foreground inline-flex items-center gap-1">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <a href="#downloads" className="hover:text-foreground">Downloads</a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/symonxdd/epic-switcher"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Github className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by Symon from Belgium
          </div>
          <div className="flex items-center gap-6">
            <span>v1.0.0</span>
            <span>Powered by Wails & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
