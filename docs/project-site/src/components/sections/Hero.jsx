import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Carousel } from './Carousel';

export const Hero = () => {
  const latestReleaseUrl = "https://github.com/symonxdd/epic-switcher/releases/latest";

  return (
    <section id="home" className="pt-32 pb-16 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 pb-4 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Switch Epic Accounts <br className="hidden md:block" /> Seamlessly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Epic Switcher is designed to facilitate switching between accounts in the Epic Games Launcher. Minimalist, fast, and secure.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all rounded-full group"
                asChild
              >
                <a href={latestReleaseUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                  Download for Windows
                </a>
              </Button>
            </motion.div>
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
