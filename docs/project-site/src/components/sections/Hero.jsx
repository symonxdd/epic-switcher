import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Screenshots } from './Screenshots';
import { useLatestRelease } from '../../hooks/useLatestRelease';
import { MilestoneBadge } from '../MilestoneBadge';

export const Hero = () => {
  const { downloadUrl } = useLatestRelease();

  return (
    <section id="home" className="pt-20 pb-0 overflow-hidden">
      <div className="mx-auto text-center px-0 sm:px-6">
        <div className="max-w-4xl mx-auto mb-0 px-6 sm:px-0 relative">
          {/* <MilestoneBadge /> */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 pb-4 pt-12 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Switch Epic Accounts <br className="hidden md:block" /> Seamlessly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
              Epic Switcher is designed to facilitate switching between accounts in the Epic Games Launcher. Minimalist, fast, and secure.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center relative z-20 mt-16 mb-16"
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
          id="screens"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-0 scroll-mt-24 w-full"
        >
          <Screenshots />
        </motion.div>
      </div>
    </section>
  );
};
