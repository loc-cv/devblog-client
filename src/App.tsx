import { Layout } from 'components/Layout';
import RequireUser from 'components/RequireUser';
import LoginPage from 'features/auth/pages/LoginPage';
import RegisterPage from 'features/auth/pages/RegisterPage';
import DashboardPage from 'pages/DashboardPage';
import HomePage from 'pages/HomePage';
import ProfilePage from 'pages/ProfilePage';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route element={<RequireUser allowedRoles={['admin']} />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
