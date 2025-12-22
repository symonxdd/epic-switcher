import React from 'react';
import { motion } from 'framer-motion';
import { Carousel } from './Carousel';

export const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-16 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Switch Epic Accounts <br className="hidden md:block" /> Seamlessly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Epic Switcher is designed to facilitate switching between accounts in the Epic Games Launcher. Minimalist, fast, and secure.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Carousel />
        </motion.div>
      </div>
    </section>
  );
};
