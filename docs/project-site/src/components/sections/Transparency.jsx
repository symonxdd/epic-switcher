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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 max-w-lg mx-auto lg:mx-0"
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
              className="bg-white dark:bg-[#141414] text-black dark:text-white/90 rounded-3xl p-8 border border-border/50 relative overflow-hidden max-w-xl mx-auto lg:ml-auto shadow-sm"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
                <FaShieldAlt className="w-6 h-6 text-black dark:text-white" />
                <span className="leading-none">Verify with AI</span>
              </h3>
              <p className="text-muted-foreground mb-2 leading-relaxed text-sm">
                We encourage using an AI code editor like <span className="relative group inline-block cursor-default underline decoration-dotted decoration-current/40 hover:decoration-current/80 underline-offset-4 transition-all">
                  <span className="font-medium text-foreground">Google Antigravity</span>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#1A1A1A] dark:bg-[#FFFFFF] text-white dark:text-black text-[10px] shadow-2xl leading-snug opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 rounded-xl border border-white/10 dark:border-black/10 z-[100] text-center italic">
                    Independent recommendation — not sponsored by Google
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1A1A1A] dark:border-t-white"></span>
                  </span>
                </span> (free) to review the codebase, if you're cautious about running open-source code (this project included).
              </p>
              <p className="text-muted-foreground mb-2 leading-relaxed text-sm dark:text-white/70">
                It's a great way to verify security and learn exactly how the project works under the hood, regardless of your technical experience.
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
                          Note: Epic Switcher release binaries are always built directly from <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline underline-offset-4 decoration-current/20 hover:decoration-current/50 transition-all">source</a> (see <a href="https://github.com/symonxdd/epic-switcher#-release-workflow" target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline underline-offset-4 decoration-current/20 hover:decoration-current/50 transition-all">README → Release Workflow</a>).
                        </span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm leading-none">1</div>
                  <span className="leading-none">Download <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline underline-offset-4 decoration-current/20 hover:decoration-current/50 transition-all inline-flex items-center gap-1">Antigravity <ExternalLink className="w-3 h-3" /></a></span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm leading-none">2</div>
                  <span className="leading-none">Get the source from <a href="https://github.com/symonxdd/epic-switcher" target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline underline-offset-4 decoration-current/20 hover:decoration-current/50 transition-all inline-flex items-center gap-1">GitHub <ExternalLink className="w-3 h-3" /></a> & load it into Antigravity</span>
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm leading-none">3</div>
                    <span className="leading-none">Ask something like:</span>
                  </div>
                  <div
                    className="ml-9 px-3 py-2 rounded-xl border font-mono text-[11px] text-black/70 dark:text-white/70 leading-relaxed italic"
                    style={{
                      backgroundColor: 'var(--prompt-bg)',
                      borderColor: 'var(--prompt-border)'
                    }}
                  >
                    "Analyze this project for malicious or suspicious code, including any internet connectivity"
                  </div>
                  <style dangerouslySetInnerHTML={{
                    __html: `
                    :root { --prompt-bg: #F2F2F2; --prompt-border: #E5E5E5; }
                    .dark { --prompt-bg: #1C1C1C; --prompt-border: #262626; }
                  `}} />
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
                    className="text-muted-foreground/60 hover:text-primary transition-colors font-medium underline underline-offset-4 decoration-current/20 hover:decoration-current/50 transition-all"
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
