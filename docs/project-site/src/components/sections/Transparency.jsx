import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, Download, Github, ExternalLink, ChevronDown } from 'lucide-react';
import { FaShieldAlt } from 'react-icons/fa';

export const Transparency = () => {
  const [showPrecaution, setShowPrecaution] = useState(false);
  return (
    <section id="transparency" className="py-16 bg-background scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 max-w-lg"
            >
              <div className="flex gap-4 text-left">
                <div className="shrink-0 mt-1.5">
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
                <div className="shrink-0 mt-1.5">
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
                <div className="shrink-0 mt-1.5">
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
              className="bg-muted/50 rounded-3xl p-8 border border-border/50 relative overflow-hidden max-w-xl md:ml-auto"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                <FaShieldAlt className="w-6 h-6 text-primary" />
                <span className="leading-none">Verify with AI</span>
              </h3>
              <p className="text-muted-foreground mb-2 leading-relaxed text-sm">
                We encourage using an AI code editor like <span className="font-semibold text-foreground">Google Antigravity</span> (free) to review the codebase, if you're cautious about running open-source code (this project included).
              </p>
              <p className="text-muted-foreground mb-2 leading-relaxed text-sm">
                It's a great way to verify security and learn exactly how the project works under the hood, regardless of your technical experience.
                <span className="block opacity-50 italic text-[11px] my-4 text-center">
                  Independent recommendation — not sponsored by Google
                </span>
              </p>

              <div className="mb-6">
                <button
                  onClick={() => setShowPrecaution(!showPrecaution)}
                  className="text-muted-foreground/60 text-xs hover:text-primary transition-colors flex items-center gap-1"
                >
                  {showPrecaution ? 'Hide precaution' : 'General open-source precaution'}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showPrecaution ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showPrecaution && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground/80 text-xs leading-relaxed mt-2 pt-2 border-t border-border/30">
                        It's worth noting that release binaries for any project aren't always guaranteed to be built directly from the visible source code. For absolute confidence, building from source yourself is always the recommended approach.
                        <span className="block mt-2 font-medium">
                          Note: Epic Switcher release binaries are always built directly from <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">source</a> (see <a href="https://github.com/symonxdd/epic-switcher#-release-workflow" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">README → Release Workflow</a>).
                        </span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm">1</div>
                  <p>Download <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline inline-flex items-center gap-1">Antigravity <ExternalLink className="w-3 h-3" /></a></p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm">2</div>
                  <p>Get the source from <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline inline-flex items-center gap-1">GitHub <ExternalLink className="w-3 h-3" /></a> & load it into Antigravity</p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm mt-0.5">3</div>
                  <div className="space-y-2">
                    <p>Ask something like:</p>
                    <div className="px-3 py-2 bg-background/50 rounded-xl border border-border/30 font-mono text-[11px] text-muted-foreground/80 leading-relaxed italic">
                      "Analyze this project for malicious or suspicious code, including any internet connectivity"
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border/10">
                <p className="text-[11px] text-muted-foreground/50 text-center leading-relaxed italic">
                  For further guidance, feel free to <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-primary/60 hover:text-primary transition-colors underline decoration-primary/20 underline-offset-2 font-medium"
                  >message me</a> or consult ChatGPT.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
