import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { useAuth } from './state/AuthContext';
import { Loading } from './components/common/Loading';

// Lazy pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Settings = lazy(() => import('./pages/profile/Settings'));
const Questions = lazy(() => import('./pages/questions/QuestionsList'));
const QuestionDetail = lazy(() => import('./pages/questions/QuestionDetail'));
const AskQuestion = lazy(() => import('./pages/questions/AskQuestion'));
const EditQuestion = lazy(() => import('./pages/questions/EditQuestion'));
const Drafts = lazy(() => import('./pages/questions/Drafts'));
const MyDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const Moderation = lazy(() => import('./pages/moderation/ModerationDashboard'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const NotificationsCenter = lazy(() => import('./pages/notifications/NotificationsCenter'));
const NotFound = lazy(() => import('./pages/NotFound'));

// PUBLIC_INTERFACE
export function AppRoutes() {
  /** Route configuration with protected and role-guarded routes. */
  const { isAuthenticated, hasRole } = useAuth();

  const Protected = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const RoleProtected = ({ role, children }) => {
    return isAuthenticated && hasRole(role) ? children : <Navigate to="/" replace />;
  };

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
          <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="profile" element={<Protected><Profile /></Protected>} />
          <Route path="settings" element={<Protected><Settings /></Protected>} />
          <Route path="notifications" element={<Protected><NotificationsCenter /></Protected>} />

          <Route path="questions" element={<Questions />} />
          <Route path="questions/ask" element={<Protected><AskQuestion /></Protected>} />
          <Route path="questions/:id" element={<QuestionDetail />} />
          <Route path="questions/:id/edit" element={<Protected><EditQuestion /></Protected>} />
          <Route path="drafts" element={<Protected><Drafts /></Protected>} />
          <Route path="dashboard" element={<Protected><MyDashboard /></Protected>} />

          <Route path="moderation" element={<RoleProtected role="moderator"><Moderation /></RoleProtected>} />
          <Route path="admin/analytics" element={<RoleProtected role="administrator"><AdminAnalytics /></RoleProtected>} />
          <Route path="admin/users" element={<RoleProtected role="administrator"><AdminUsers /></RoleProtected>} />
          <Route path="admin/settings" element={<RoleProtected role="administrator"><AdminSettings /></RoleProtected>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
