import React from 'react';
import { Heart, Github, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="py-12 border-t">
      <div className="container mx-auto px-6">
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by Symon from Belgium
          </div>
          <div className="flex items-center gap-6">
            <span>Powered by Wails & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
