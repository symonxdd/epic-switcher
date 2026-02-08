import React from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { Downloads } from './components/sections/Downloads';
import { Footer } from './components/sections/Footer';
import { Motivation } from './components/sections/Motivation';
import { Transparency } from './components/sections/Transparency';
import { SupportCoffee } from './components/sections/SupportCoffee';
import { ScrollToTop } from './components/sections/ScrollToTop';
import { ThemeProvider } from './components/ThemeProvider';
import { EmojiReactions } from './components/EmojiReactions';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="epic-switcher-theme">
      <div className="min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground">
        <Header />
        <main>
          <Hero />
          <Motivation />
          <Transparency />
          <Downloads />
          <FAQ />
          <Contact />
        </main>
        <SupportCoffee />
        <EmojiReactions />
        <ScrollToTop />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
