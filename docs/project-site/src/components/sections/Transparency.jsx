import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Download, Github, ExternalLink } from 'lucide-react';
import { FaShieldAlt } from 'react-icons/fa';

export const Transparency = () => {
  return (
    <section id="transparency" className="py-16 bg-background scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Trust & Transparency</h2>
            <p className="text-muted-foreground text-lg">
              Because security is non-negotiable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 max-w-md"
            >
              <div className="flex gap-4 text-left">
                <div className="shrink-0 mt-1">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Works Offline</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Epic Switcher functions entirely locally. The only internet connectivity is to check for updates on the Settings page.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-left">
                <div className="shrink-0 mt-1">
                  <FaShieldAlt className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">No Data Collection</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your session keys and User IDs never leave your computer. We don't track, log, or share any of your account data.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 text-left">
                <div className="shrink-0 mt-1">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-1">Open Source</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every line of code is public. We encourage technical users to audit the source on GitHub.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-muted/50 rounded-3xl p-8 border border-border/50 relative overflow-hidden max-w-md md:ml-auto"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                <FaShieldAlt className="w-6 h-6 text-primary" />
                <span className="leading-none">Verify with AI</span>
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                I strongly encourage everyone to use the power of AI to analyze the entire project and check for anything malicious.
                AI tools are perfect for this and can explain code in detail, regardless of your CS knowledge.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-background border border-border/50 flex items-center justify-center font-bold text-[10px]">1</div>
                  <p>Download <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline inline-flex items-center gap-1">Antigravity <ExternalLink className="w-3 h-3" /></a></p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-background border border-border/50 flex items-center justify-center font-bold text-[10px]">2</div>
                  <p>Get the source from <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline inline-flex items-center gap-1">GitHub <ExternalLink className="w-3 h-3" /></a></p>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground italic">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[10px]">3</div>
                  <p>"Analyze this project for any malicious or suspicious code."</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
