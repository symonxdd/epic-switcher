import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Carousel } from './Carousel';
import { useLatestRelease } from '../../hooks/useLatestRelease';

export const Hero = () => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const { downloadUrl } = useLatestRelease();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="home" className="pt-24 pb-0 overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto mb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 pb-4 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Switch Epic Accounts <br className="hidden md:block" /> Seamlessly
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-4">
              Epic Switcher is designed to facilitate switching between accounts in the Epic Games Launcher. Minimalist, fast, and secure.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center relative z-20 mt-8"
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="mt-12 mb-10"
              style={{ perspective: 1200 }}
              onClick={() => setIsImageOpen(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.img
                src="/screenshots/accounts-page-no-bg.png"
                alt="Epic Switcher Accounts Page"
                className="max-w-[750px] w-full mx-auto rounded-lg border border-border select-none pointer-events-none"
                draggable="false"
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              />
            </motion.div>

            <AnimatePresence>
              {isImageOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsImageOpen(false)}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-12"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-7xl w-full flex items-center justify-center"
                  >
                    <img
                      src="/screenshots/accounts-page-no-bg.png"
                      alt="Epic Switcher Accounts Page Full"
                      className="w-full h-auto max-h-[85vh] object-contain mx-auto pointer-events-none rounded-lg select-none"
                      draggable="false"
                    />
                    <button
                      className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                      onClick={() => setIsImageOpen(false)}
                    >
                      <X size={32} />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          id="screens"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-20 scroll-mt-24"
        >
          <Carousel />
        </motion.div>
      </div>
    </section>
  );
};
