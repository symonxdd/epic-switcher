import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLatestRelease } from '../../hooks/useLatestRelease';
import { ThemeToggle } from '../ThemeToggle';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Screens', href: '#screens' },
  { label: 'Motivation', href: '#motivation' },
  { label: 'Transparency', href: '#transparency' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const Header = () => {
  const { downloadUrl } = useLatestRelease();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // Keep track of all intersecting sections
    const intersectingSections = new Set();

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -45% 0px', // More robust zone for various section sizes
      threshold: 0,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersectingSections.add(entry.target.id);
        } else {
          intersectingSections.delete(entry.target.id);
        }
      });

      // Priority list of sections in order of appearance
      const orderedIds = ['home', 'screens', 'motivation', 'transparency', 'downloads', 'faq', 'contact'];

      // Find the "deepest" intersecting section
      let currentActive = '';
      for (const id of orderedIds) {
        if (intersectingSections.has(id)) {
          currentActive = id;
        }
      }

      if (currentActive) {
        setActiveSection(currentActive);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe all sections
    const allSectionIds = ['#home', ...navItems.map(i => i.href), '#downloads'];
    allSectionIds.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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
        ease: [0.22, 1, 0.36, 1]
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
              className={cn(
                "text-sm font-medium transition-colors",
                activeSection === item.href.replace('#', '')
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
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
