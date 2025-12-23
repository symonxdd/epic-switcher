import React from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { Downloads } from './components/sections/Downloads';
import { Footer } from './components/sections/Footer';
import { SupportCoffee } from './components/sections/SupportCoffee';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="epic-switcher-theme">
      <div className="min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground">
        <Header />
        <main>
          <Hero />
          <Downloads />
          <FAQ />
          <Contact />
        </main>
        <SupportCoffee />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
