import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Hero from './Home.jsx';
import Features from './Features.jsx';
import About from './About.jsx';
import Services from './Services.jsx';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';

export default function LandingPage() {
  const location = useLocation();

  // Navbar links from other pages navigate here with { state: { scrollTo: 'about' } }
  useEffect(() => {
    const id = location.state?.scrollTo;
    if (!id) return undefined;

    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.state]);

  return (
    <div className="min-h-screen bg-lp-bg text-lp-fg antialiased">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}