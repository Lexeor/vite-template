import Header from '@/components/Header.tsx';
import Hero from '@/components/Hero.tsx';
import About from '@/components/sections/About.tsx';
import Services from '@/components/sections/Services.tsx';
import Directions from '@/components/sections/Directions.tsx';
import HowItWorks from '@/components/sections/HowItWorks.tsx';
import Contact from '@/components/sections/Contact.tsx';
import Footer from '@/components/sections/Footer.tsx';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Directions />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
