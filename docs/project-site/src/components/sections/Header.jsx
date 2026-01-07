import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLatestRelease } from '../../hooks/useLatestRelease';
import { ThemeToggle } from '../ThemeToggle';
import { SiGithub } from '@icons-pack/react-simple-icons';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Downloads', href: '#downloads' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const Header = () => {
  const { downloadUrl } = useLatestRelease();
  const scrollTo = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for a smooth, premium feel
      }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src="/favicon.png" alt="Epic Switcher" className="w-8 h-8" />
          <span className="text-lg font-semibold tracking-tight">Epic Switcher</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          ))}
          <a
            href="https://github.com/symonxdd/epic-switcher"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
          >
            <SiGithub className="w-5 h-5" />
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={downloadUrl}>
              Download
            </a>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
