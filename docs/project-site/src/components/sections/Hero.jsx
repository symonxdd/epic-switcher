import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Carousel } from './Carousel';
import { useLatestRelease } from '../../hooks/useLatestRelease';

export const Hero = () => {
  const { downloadUrl } = useLatestRelease();

  return (
    <section id="home" className="pt-28 pb-0 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto mb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-10 pb-4 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Switch Epic Accounts <br className="hidden md:block" /> Seamlessly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
              Epic Switcher is designed to facilitate switching between accounts in the Epic Games Launcher. Minimalist, fast, and secure.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-12 mb-16"
            >
              <img
                src="/screenshots/accounts-page.png"
                alt="Epic Switcher Accounts Page"
                className="max-w-[750px] w-full mx-auto rounded-xl shadow-2xl border border-border/50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center relative z-20"
            >
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all rounded-full"
                asChild
              >
                <a href={downloadUrl}>
                  <Download className="mr-2 h-5 w-5" />
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
          className="mt-20"
        >
          <Carousel />
        </motion.div>
      </div>
    </section>
  );
};
