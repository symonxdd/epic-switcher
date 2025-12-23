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
    const form = e.target;
    const data = new FormData(form);

    // Web3Forms public access key - FREE for 250/mo
    data.append("access_key", "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 bg-background">
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
          className="bg-card border rounded-3xl p-8 md:p-12 shadow-sm"
        >
          {status === 'success' ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">Bet. I'll get back to you soon.</p>
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
                  placeholder="John Doe"
                  required
                  className="bg-background/50 border-muted focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="bg-background/50 border-muted focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">What's the tea?</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Hey, I noticed that..."
                  required
                  className="min-h-[150px] bg-background/50 border-muted focus-visible:ring-primary resize-none"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold rounded-full">
                <Send className="mr-2 h-4 w-4" />
                Send It
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
