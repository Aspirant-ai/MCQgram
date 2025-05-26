
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import MinimalLayout from '@/layouts/MinimalLayout';
import TestLayout from '@/layouts/TestLayout'; // For full screen test view

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
          <Route path="login" element={<LoginPage />} />
          <Route path="subscriptions" element={<SubscriptionPage />} />
          <Route path="live-tests" element={<LiveTestsPage />} />
          <Route path="study-material" element={<StudyMaterialPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="current-affairs" element={<CurrentAffairsPage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="doubt-forum" element={<DoubtForumPage />} />
        </Route>
        
        <Route element={<MinimalLayout />}>
          <Route path="instructions/:examId" element={<TestInstructionsPage />} />
        </Route>

        <Route element={<TestLayout />}>
          <Route path="/test/:examId" element={<TestPage />} />
        </Route>
        
        <Route path="/result/:attemptId" element={<ResultPage />} />
        <Route path="/solution/:attemptId" element={<SolutionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </motion.div>
  );
}

export default App;
