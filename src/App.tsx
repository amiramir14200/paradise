/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/public/Hero';
import { AgePathways } from './components/public/AgePathways';
import { CourseCatalog } from './components/public/CourseCatalog';
import { AboutContactFaq } from './components/public/AboutContactFaq';
import { CourseDetailModal } from './components/public/CourseDetailModal';
import { QuizRunnerModal } from './components/public/QuizRunnerModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DynamicPageRenderer } from './components/cms/DynamicPageRenderer';

function MainLayout() {
  const [currentView, setCurrentView] = useState<string>('home');
  const { role, isAdmin } = useAuth();
  const { cmsPages, activePageSlug } = useApp();

  const homePage = cmsPages.find(p => p.slug === 'home');
  const customPage = cmsPages.find(p => p.slug === activePageSlug && p.slug !== 'home');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Global Navigation */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {/* If homePage has CMS sections, render them dynamically */}
            {homePage && homePage.sections.length > 0 ? (
              <DynamicPageRenderer sections={homePage.sections} />
            ) : (
              <Hero />
            )}
            <AgePathways />
            <CourseCatalog />
            <AboutContactFaq />
          </div>
        )}

        {currentView === 'page' && customPage && (
          <div className="py-8">
            <DynamicPageRenderer sections={customPage.sections} />
          </div>
        )}

        {currentView === 'student' && (
          <StudentDashboard />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard />
        )}

        {currentView === 'guardian' && (
          <ParentDashboard />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <CourseDetailModal />
      <QuizRunnerModal />
      <CheckoutModal />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
