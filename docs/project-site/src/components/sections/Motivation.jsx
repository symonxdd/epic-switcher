import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, MousePointerClick } from 'lucide-react';

export const Motivation = () => {
  const points = [
    { icon: Zap, text: 'Fast' },
    { icon: Target, text: 'Minimal' },
    { icon: MousePointerClick, text: 'One-click' },
  ];

  return (
    <section id="motivation" className="py-16 bg-background scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Motivation</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl md:text-2xl font-semibold text-foreground leading-tight"
              >
                Epic Switcher started the same way most of my projects do: <span className="text-primary italic">I, or people around me needed it.</span>
              </motion.p>

              <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Not too long ago, my siblings and I used to play Fortnite together. At some point, I gave her my main Fortnite account since I wasn't playing much anymore, which meant I had to make a separate account to play with them.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="pl-6 border-l-2 border-primary/30 italic text-muted-foreground/90 py-2"
                >
                  Aside from Fortnite (which I don't really play anymore), I'm really into Rocket League, and that's on my main account — the one I gave her. So I was constantly switching between Epic Games accounts, and the official launcher makes that way slower and more annoying than it should be. Logging out, logging back in, re-entering credentials, and dealing with 2FA almost every time got frustrating fast.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Existing solutions were either over-engineered, had outdated UIs, or were bundled with features I didn't want. I just wanted something fast, minimal, and focused.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  So I built Epic Switcher. Once it proved useful, I open-sourced it in case it helps others with the same problem.
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="lg:col-span-5 xl:col-span-4 bg-muted/30 rounded-3xl p-8 border border-border/50 backdrop-blur-sm space-y-6"
            >
              <h3 className="text-lg font-bold text-foreground">Core Philosophy</h3>
              <div className="space-y-4">
                {points.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-background/60 rounded-2xl border border-border/40 shadow-sm"
                  >
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/10">
                      <point.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">{point.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
