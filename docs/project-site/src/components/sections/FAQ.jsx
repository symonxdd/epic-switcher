import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from 'framer-motion';

const faqItems = [
  {
    question: "What is Epic Switcher?",
    answer: "Epic Switcher is a minimalist Windows application designed to help you quickly switch between multiple Epic Games Launcher accounts with a single click, without manually re-entering credentials every time."
  },
  {
    question: "Is it safe to use?",
    answer: "Yes. Epic Switcher works by managing your local session files entirely on your device. It does not store your passwords or modify the actual Epic Games Launcher code. It's an open-source project, so you can inspect the code yourself!"
  },
  {
    question: "Why do I see a Windows SmartScreen warning?",
    answer: "This is a common warning for new open-source apps that haven't built 'reputation' with Microsoft yet. You can safely dismiss it by clicking 'More info' and then 'Run anyway'."
  },
  {
    question: "Does it require installation?",
    answer: "No, Epic Switcher is a portable 'Zero-Install' application. Just download the .exe and run it."
  },
  {
    question: "Can I use it on Mac?",
    answer: "Currently, Epic Switcher targets Windows due to its use of Windows-specific Epic Games Launcher paths. Adding macOS support would be straightforward and would primarily require confirmation of the default Epic Games Launcher installation directory on macOS, which I'm unable to verify myself as I don't have access to a macOS device."
  }
];

export const FAQ = () => {
  return (
    <section id="faq" className="pt-0 pb-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know about Epic Switcher.</p>
          </motion.div>
        </div>

        <Accordion type="single" collapsible className="w-full bg-background rounded-xl border p-6 shadow-sm">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
