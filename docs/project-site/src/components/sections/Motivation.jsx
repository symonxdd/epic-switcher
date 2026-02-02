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
        <div className="max-w-3xl mx-auto">
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

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Epic Switcher started the same way most of my projects do: <span className="text-foreground font-medium">I, or people around me needed it.</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Not too long ago, my siblings and I used to play Fortnite together. At some point, I gave her my main Fortnite account since I wasn't playing much anymore, which meant I had to make a separate account to play with them.

              Aside from Fortnite (which I don't really play anymore), I'm really into Rocket League, and that's on my main account — the one I gave her. So I was constantly switching between Epic Games accounts, and the official launcher makes that way slower and more annoying than it should be. Logging out, logging back in, re-entering credentials, and dealing with 2FA almost every time got frustrating fast.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Existing solutions were either over-engineered, had outdated UIs, or were bundled with features I didn't want. I just wanted something:
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8"
            >
              {points.map((point, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-muted/50 rounded-2xl border border-border/50 shadow-sm transition-all hover:shadow-md"
                >
                  <point.icon className="w-8 h-8 mb-3 text-primary" />
                  <span className="font-semibold text-foreground">{point.text}</span>
                </div>
              ))}
            </motion.div>

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
      </div>
    </section>
  );
};
