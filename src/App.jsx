// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import MinimalLayout from '@/layouts/MinimalLayout';
import TestLayout from '@/layouts/TestLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Pages
import HomePage from '@/pages/HomePage';
import ExamCategoriesPage from '@/pages/ExamCategoriesPage';
import ExamListPage from '@/pages/ExamListPage';
import TestInstructionsPage from '@/pages/TestInstructionsPage';
import TestPage from '@/pages/TestPage';
import ResultPage from '@/pages/ResultPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import SolutionPage from '@/pages/SolutionPage';
import LoginPage from '@/pages/LoginPage'; 
import SubscriptionPage from '@/pages/SubscriptionPage';
import LiveTestsPage from '@/pages/LiveTestsPage';
import StudyMaterialPage from '@/pages/StudyMaterialPage';
import ClassesPage from '@/pages/ClassesPage';
import CurrentAffairsPage from '@/pages/CurrentAffairsPage';
import EditProfilePage from '@/pages/EditProfilePage';
import DoubtForumPage from '@/pages/DoubtForumPage';

// Dashboard Pages
import DashboardHomePage from '@/pages/dashboard/DashboardHomePage'; 

// Admin Page
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'; 

// Auth
const isAuthenticated = () => !!localStorage.getItem('userRole');
const userRole = () => localStorage.getItem('userRole');

// ProtectedRoute Component
const ProtectedRoute = ({ children, role }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole() !== role) {
    return <Navigate to={userRole() === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="student">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="categories" element={<ExamCategoriesPage />} />
          <Route path="exams/:category" element={<ExamListPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="subscriptions" element={<SubscriptionPage />} />
          <Route path="live-tests" element={<LiveTestsPage />} />
          <Route path="study-material" element={<StudyMaterialPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="current-affairs" element={<CurrentAffairsPage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="doubt-forum" element={<DoubtForumPage />} />

          {/* Nested Routes under Dashboard */}
          <Route path="instructions/:examId" element={<TestLayout><TestInstructionsPage /></TestLayout>} />
          <Route path="test/:examId" element={<TestLayout><TestPage /></TestLayout>} />
          <Route path="result/:attemptId" element={<ResultPage />} />
          <Route path="solution/:attemptId" element={<TestLayout><SolutionPage /></TestLayout>} />
        </Route>

        {/* Test Routes */}
        <Route path="/test/instructions/:examId" element={<ProtectedRoute role="student"><TestLayout><TestInstructionsPage /></TestLayout></ProtectedRoute>} />
        <Route path="/test/:examId" element={<ProtectedRoute role="student"><TestLayout><TestPage /></TestLayout></ProtectedRoute>} />
        <Route path="/solution/:attemptId" element={<ProtectedRoute role="student"><TestLayout><SolutionPage /></TestLayout></ProtectedRoute>} />



        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />  {/* ✅ Now works */}
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </motion.div>
  );
}

export default App;