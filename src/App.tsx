import { Layout } from 'components/Layout';
import { RequireUser } from 'components/RequireUser';
import { LoginPage } from 'features/auth/pages/LoginPage';
import { RegisterPage } from 'features/auth/pages/RegisterPage';
import { EditPostPage } from 'features/posts/pages/EditPostPage';
import { NewPostPage } from 'features/posts/pages/NewPostPage';
import { ReadingListPage } from 'features/posts/pages/ReadingListPage';
import { SinglePostPage } from 'features/posts/pages/SinglePostPage';
import { ProfilePage } from 'features/users/pages/ProfilePage';
import { PasswordPage } from 'features/users/pages/settingsPages/PasswordSettingsPage';
import { PublicProfilePage } from 'features/users/pages/settingsPages/ProfileSettingsPage';
import { UserSettingsPage } from 'features/users/pages/settingsPages/SettingsPage';
import { DashboardPage } from 'pages/dashboardPages/DashboardPage';
import { PostsDashboardPage } from 'pages/dashboardPages/PostsDashboardPage';
// import { ReportsDashboardPage } from 'pages/dashboardPages/ReportsDashboardPage';
import { TagsDashboardPage } from 'pages/dashboardPages/TagsDashboardPage';
import { UsersDashboardPage } from 'pages/dashboardPages/UsersDashboardPage';
import { HomePage } from 'pages/HomePage';
import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'spinkit/spinkit.css';

export default function App() {
  return (
    <Fragment>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* Auth routes */}
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Post routes */}
          <Route path="posts" element={<HomePage />} />
          <Route path="posts/:postId" element={<SinglePostPage />} />
          <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
            <Route path="posts/new" element={<NewPostPage />} />
          </Route>
          <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
            <Route path="posts/:postId/edit" element={<EditPostPage />} />
          </Route>
          <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
            <Route path="posts/saved" element={<ReadingListPage />} />
          </Route>

          {/* User routes */}
          <Route path="profiles/:username" element={<ProfilePage />} />
          <Route element={<RequireUser allowedRoles={['user', 'admin']} />}>
            <Route path="settings" element={<UserSettingsPage />}>
              <Route path="profile" element={<PublicProfilePage />} />
              <Route path="password" element={<PasswordPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<RequireUser allowedRoles={['admin']} />}>
            <Route path="dashboard" element={<DashboardPage />}>
              <Route path="users" element={<UsersDashboardPage />} />
              <Route path="posts" element={<PostsDashboardPage />} />
              <Route path="tags" element={<TagsDashboardPage />} />
              {/* <Route path="reports" element={<ReportsDashboardPage />} /> */}
            </Route>
          </Route>
        </Route>
      </Routes>
    </Fragment>
  );
}
