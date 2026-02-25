import React from 'react';
import { Navigate } from 'react-router-dom';
import { authHelpers } from '../api/api';

/**
 * PrivateRoute
 * Wraps a component and redirects to the specified loginPath
 * if the user is not logged in OR doesn't have the required role.
 *
 * Usage:
 *   <Route path="/student-dashboard" element={
 *     <PrivateRoute role="student" loginPath="/student-login">
 *       <StudentDashboard />
 *     </PrivateRoute>
 *   } />
 */
export default function PrivateRoute({ children, role, loginPath = '/login' }) {
    const user = authHelpers.getUser();

    // Not logged in at all → redirect to appropriate login
    if (!user) {
        return <Navigate to={loginPath} replace />;
    }

    // Logged in but wrong role → redirect to their proper page
    if (role && user.role !== role) {
        const redirect = user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';
        return <Navigate to={redirect} replace />;
    }

    return children;
}
