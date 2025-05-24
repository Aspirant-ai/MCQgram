import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import MinimalLayout from '@/layouts/MinimalLayout';

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

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<ExamCategoriesPage />} />
          <Route path="exams/:category" element={<ExamListPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route element={<MinimalLayout />}>
          <Route path="instructions/:examId" element={<TestInstructionsPage />} />
        </Route>
        <Route path="/test/:examId" element={<TestPage />} />
        <Route path="/result/:attemptId" element={<ResultPage />} />
        <Route path="/solution/:attemptId" element={<SolutionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </motion.div>
  );
}

export default App;