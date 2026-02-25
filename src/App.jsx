import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';
import UploadResource from './components/UploadResource';
import ResourceDetails from './components/ResourceDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ── Student protected routes ── */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute role="student" loginPath="/student-login">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/resource/:id"
          element={
            <PrivateRoute role="student" loginPath="/student-login">
              <ResourceDetails />
            </PrivateRoute>
          }
        />

        {/* ── Admin protected routes ── */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin" loginPath="/admin-login">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute role="admin" loginPath="/admin-login">
              <UploadResource />
            </PrivateRoute>
          }
        />

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
