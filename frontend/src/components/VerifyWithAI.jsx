import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaExternalLinkAlt, FaChevronDown } from 'react-icons/fa';
import { BrowserOpenURL } from '../../wailsjs/runtime';

const VerifyWithAI = ({ className }) => {
  const [showPrecaution, setShowPrecaution] = useState(false);

  const handleOpenURL = (url) => {
    try {
      BrowserOpenURL(url);
    } catch (err) {
      console.error('Failed to open link:', err);
    }
  };

  return (
    <div className={`rounded-[24px] p-8 border border-border/50 relative overflow-hidden mx-auto bg-[#141414] text-white/90 dark:bg-white dark:text-black ${className}`} style={{ maxWidth: '488px' }}>
      <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
        <FaShieldAlt className="w-6 h-6 text-white dark:text-black" />
        <span className="leading-none">Verify with AI</span>
      </h3>

      <p className="opacity-80 mb-2 leading-relaxed text-sm">
        We encourage using an AI code editor like <span className="font-semibold text-white dark:text-black">Google Antigravity</span> (free) to review the codebase, if you're cautious about running open-source code (this project included).
      </p>
      <p className="opacity-80 mb-2 leading-relaxed text-sm">
        It's a great way to verify security and learn exactly how the project works under the hood, regardless of your technical experience.
      </p>

      <span className="block text-[11px] opacity-60 italic my-4 text-center">
        Independent recommendation — not sponsored by Google
      </span>

      <div className="mb-6">
        <button
          onClick={() => setShowPrecaution(!showPrecaution)}
          className="opacity-60 text-xs hover:opacity-100 transition-opacity inline-flex items-center gap-1"
        >
          {showPrecaution ? 'Hide precaution' : 'General open-source precaution'}
          <FaChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${showPrecaution ? 'rotate-180' : ''}`} />
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
              <div className="text-xs text-left leading-relaxed mt-2 pt-2 border-t border-white/10 dark:border-black/10">
                <span className="opacity-80">It's worth noting that release binaries for any project aren't always guaranteed to be built directly from the visible source code. For absolute confidence, building from source yourself is always the recommended approach.</span>
                <div className="mt-2 font-medium">
                  <span className="opacity-80">Note: Epic Switcher release binaries are always built directly from </span>
                  <span className="text-white/90 dark:text-black/90 font-medium underline underline-offset-4 decoration-current/25 hover:decoration-current/60 cursor-pointer" onClick={() => handleOpenURL('https://github.com/symonxdd/epic-switcher')}>source</span>
                  <span className="opacity-80"> (see </span>
                  <span className="text-white/90 dark:text-black/90 font-medium underline underline-offset-4 decoration-current/25 hover:decoration-current/60 cursor-pointer" onClick={() => handleOpenURL('https://github.com/symonxdd/epic-switcher#release-workflow')}>README → Release Workflow</span>
                  <span className="opacity-80">).</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-[0.4rem]">
        <div className="flex items-center gap-3 text-sm">
          <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm">1</div>
          <p>
            Download <span className="text-white/90 dark:text-black/90 font-medium underline underline-offset-4 decoration-current/25 hover:decoration-current/60 cursor-pointer inline-flex items-center gap-1" onClick={() => handleOpenURL('https://antigravity.google/')}>
              Antigravity <FaExternalLinkAlt className="w-2.5 h-2.5" />
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm">2</div>
          <p>
            Get the source from <span className="text-white/90 dark:text-black/90 font-medium underline underline-offset-4 decoration-current/25 hover:decoration-current/60 cursor-pointer inline-flex items-center gap-1" onClick={() => handleOpenURL('https://github.com/symonxdd/epic-switcher')}>
              GitHub <FaExternalLinkAlt className="w-2.5 h-2.5" />
            </span> & load it into Antigravity
          </p>
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center font-bold text-[10px] text-primary-foreground shadow-sm">3</div>
            <p>Ask something like:</p>
          </div>
          <div className="ml-9 px-3 py-2 bg-white/5 dark:bg-black/5 rounded-xl border border-white/10 dark:border-black/10 font-mono text-[11px] opacity-70 leading-relaxed italic">
            "Analyze this project for malicious or suspicious code, including any internet connectivity"
          </div>
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-white/10 dark:border-black/10">
        <p className="text-[11px] text-center leading-relaxed italic">
          <span className="opacity-60">For further guidance, feel free to </span>
          <span
            className="text-white/70 dark:text-black/70 underline underline-offset-4 decoration-current/25 hover:decoration-current/60 transition-colors cursor-pointer font-medium"
            onClick={() => handleOpenURL('https://epic-switcher.vercel.app/#contact')}
          >message me</span>
          <span className="opacity-60"> or consult ChatGPT.</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyWithAI;
