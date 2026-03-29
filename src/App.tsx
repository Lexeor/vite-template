import Footer from '@/components/Footer.tsx';
import Header from '@/components/Header.tsx';
import ClientsPage from '@/pages/ClientsPage.tsx';
import CareerPage from '@/pages/CareerPage.tsx';
import ContactsPage from '@/pages/ContactsPage.tsx';
import TeamPage from '@/pages/TeamPage.tsx';
import { Route, Routes } from 'react-router-dom';

function HomePage() {
  return (
    <main>
      {/* Сюда будет добавляться контент главной страницы */}
    </main>
  );
}

function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground"
         style={{ paddingBottom: 'calc(var(--footer-height, 0px) - 1.5rem)' }}>
      <Header />
      <div className="relative z-10 rounded-b-3xl overflow-clip">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
