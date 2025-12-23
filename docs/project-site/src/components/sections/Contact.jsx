import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const form = e.target;
    const data = new FormData(form);

    data.append("access_key", "03a09ca6-caa6-4db6-8979-f64bd372198a");
    data.append("subject", `New DM from ${data.get("name")} on Epic Switcher`);
    data.append("from_name", data.get("name"));

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        form.reset();
      } else {
        console.error("Web3Forms Error:", result);
        setStatus('error');
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="pt-0 pb-20 bg-background dark:bg-[#0A0A0A] scroll-mt-20">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Slide into my DMs</h2>
            <p className="text-muted-foreground text-lg">
              No cap, if you found a bug or just wanna vibe about the project, drop a message below. I gotchu. 🤙
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card dark:bg-[#121212] border dark:border-white/5 rounded-3xl p-8 md:p-12 shadow-sm"
        >
          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">I'll get back to you soon.</p>
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => setStatus(null)}
              >
                Send another?
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder=""
                  required
                  className="bg-background/50 dark:bg-black/40 border-input focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=""
                  required
                  className="bg-background/50 dark:bg-black/40 border-input focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">What's the tea?</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder=""
                  required
                  className="min-h-[150px] bg-background/50 dark:bg-black/40 border-input focus-visible:ring-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold rounded-md transition-all active:scale-[0.98]"
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
                    Send
                  </>
                )}
              </Button>

              {status === 'error' && (
                <p className="text-destructive text-center text-sm font-medium">
                  Oof, something went wrong. Try again?
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
