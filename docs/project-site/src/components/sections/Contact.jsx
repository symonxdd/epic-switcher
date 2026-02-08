import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle2, Copy, Check } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const Contact = () => {
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef();

  const getEmail = () => {
    try {
      return atob('c3ltb24uYmxhQGdtYWlsLmNvbQ==');
    } catch {
      return 'contact@epicswitcher.com'; // Fallback
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(getEmail());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Replace these with your actual EmailJS IDs
    const SERVICE_ID = 'service_13egeae';
    const TEMPLATE_ID = 'template_n3mitbh';
    const PUBLIC_KEY = '9ejsBf5CkiWAzPOM8';

    try {
      const result = await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      );

      if (result.text === 'OK') {
        setStatus('success');
        formRef.current.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-16 bg-background dark:bg-[#0A0A0A] scroll-mt-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">Slide into my DMs</h2>
            <p className="text-muted-foreground text-lg">
              No cap, if you found a bug or just wanna vibe about the project, drop a message below. I gotchu. 🤙
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card dark:bg-[#121212] border dark:border-white/5 rounded-3xl p-6 md:py-8 md:px-8 shadow-sm"
        >
          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">Message Sent!</h3>
              <p className="text-muted-foreground">I'll get back to you soon.</p>
              <Button
                variant="outline"
                className="mt-8 rounded-full"
                onClick={() => setStatus(null)}
              >
                Send another?
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="user_name" className="text-sm font-medium ml-1">Your name</Label>
                  <Input
                    id="user_name"
                    name="user_name"
                    placeholder=""
                    required
                    className="bg-background/50 dark:bg-black/40 border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50 h-11 rounded-xl transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_email" className="text-sm font-medium ml-1">Email address</Label>
                  <Input
                    id="user_email"
                    name="user_email"
                    type="email"
                    placeholder=""
                    required
                    className="bg-background/50 dark:bg-black/40 border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50 h-11 rounded-xl transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium ml-1">What's the tea?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder=""
                    required
                    className="min-h-[140px] bg-background/50 dark:bg-black/40 border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50 resize-none rounded-xl p-4 transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium rounded-full transition-all active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground shadow-none border-none"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                      />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>

                {status === 'error' && (
                  <p className="text-destructive text-center text-sm font-medium pt-2">
                    Oof, something went wrong. Try again?
                  </p>
                )}
              </form>
              <div className="mt-6 pt-6 border-t border-border/40 text-center">
                <button
                  onClick={handleCopyEmail}
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-muted/60 dark:bg-muted/40 hover:bg-muted border border-border/50 dark:border-transparent font-medium transition-all cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-xs text-emerald-500">Email Copied!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        Or copy my email address
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section >
  );
};
