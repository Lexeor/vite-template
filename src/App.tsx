import { Route, Routes } from 'react-router-dom';
import Header from '@/components/Header.tsx';
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team" element={<TeamPage />} />
      </Routes>
    </div>
  );
}

export default App;
