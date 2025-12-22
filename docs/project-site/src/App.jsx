import React from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { Downloads } from './components/sections/Downloads';
import { Footer } from './components/sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main>
        <Hero />
        <Downloads />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
