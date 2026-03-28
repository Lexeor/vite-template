import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Hello from './pages/Hello';
import ArticlesList from './pages/news/ArticlesList';
import ArticleForm from './pages/news/ArticleForm';
import EventsList from './pages/events/EventsList';
import EventForm from './pages/events/EventForm';
import PagesList from './pages/pages/PagesList';
import PageForm from './pages/pages/PageForm';
import StaffList from './pages/staff/StaffList';
import StaffForm from './pages/staff/StaffForm';
import TeamConfig from './pages/staff/TeamConfig';

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return (
    <AdminLayout />
  );
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Hello />} />
          <Route path="news" element={<ArticlesList />} />
          <Route path="news/new" element={<ArticleForm />} />
          <Route path="news/:slug/edit" element={<ArticleForm />} />
          <Route path="events" element={<EventsList />} />
          <Route path="events/new" element={<EventForm />} />
          <Route path="events/:slug/edit" element={<EventForm />} />
          <Route path="pages" element={<PagesList />} />
          <Route path="pages/new" element={<PageForm />} />
          <Route path="pages/:slug/edit" element={<PageForm />} />
          <Route path="team" element={<TeamConfig />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/new" element={<StaffForm />} />
          <Route path="staff/:id/edit" element={<StaffForm />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
