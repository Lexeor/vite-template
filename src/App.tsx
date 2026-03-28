import { Route, Routes } from 'react-router-dom';
import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';
import TeamPage from '@/pages/TeamPage.tsx';

function HomePage() {
  return (
    <main>
      {/* Сюда будет добавляться контент главной страницы */}
    </main>
  );
}

function App() {
  return (
    <div className="relative min-h-screen bg-background text-foreground" style={{ paddingBottom: 'calc(var(--footer-height, 0px) - 1.5rem)' }}>
      <Header />
      <div className="relative z-10 rounded-b-2xl overflow-clip">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
