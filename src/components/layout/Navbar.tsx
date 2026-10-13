import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  Compass,
  UserCheck,
  LogOut,
  LogIn,
  ChevronDown,
  Phone,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { profile, role, isAdmin, isTeacher, isGuardian, logout, loginAsDemoUser } = useAuth();
  const { settings, currency, setCurrency, setIsPlacementModalOpen, setIsAuthModalOpen, setActiveAgeFilter } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const announcement = settings.announcement;
  const navItems = settings.navigationItems?.filter(n => n.visible && n.target === 'header') || [];

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    admin: { title: 'مدیر کل آکادمی', color: 'bg-red-500 text-white' },
    teacher: { title: 'مدرس', color: 'bg-purple-600 text-white' },
    student: { title: 'دانش‌آموز', color: 'bg-orange-500 text-white' },
    guardian: { title: 'ولی دانش‌آموز', color: 'bg-emerald-600 text-white' }
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    loginAsDemoUser(newRole);
    setShowRoleMenu(false);
    // Switch to respective view
    if (newRole === 'admin') setCurrentView('admin');
    else if (newRole === 'teacher') setCurrentView('teacher');
    else if (newRole === 'guardian') setCurrentView('guardian');
    else setCurrentView('student');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      {/* Top micro banner */}
      {announcement?.active !== false && (
        <div className={`bg-gradient-to-r ${announcement?.bgColor || 'from-orange-600 to-amber-500'} text-white text-xs py-1.5 px-4 font-medium`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-200 animate-pulse"></span>
              {announcement?.badge && (
                <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.2 rounded-md">
                  {announcement.badge}
                </span>
              )}
              <span>{announcement?.message || 'ثبت‌نام ترم پاییز آکادمی پارادایس با تخفیف ویژه آغاز شد!'}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-200" />
                <span>واحد پول:</span>
                <button
                  onClick={() => setCurrency(currency === 'toman' ? 'rial' : 'toman')}
                  className="underline hover:text-amber-100 cursor-pointer font-bold px-1"
                  title="تغییر واحد پولی سیستم به تومان یا ریال"
                >
                  {currency === 'toman' ? 'تومان' : 'ریال'}
                </button>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span dir="ltr">{settings.brandPhone}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-3 text-right group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>آکادمی پارادایس</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-en">
                    Kids & Teens
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">پلتفرم تخصصی آموزش زبان انگلیسی کودکان و نوجوانان</p>
              </div>
            </button>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  currentView === 'home' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                صفحه اصلی
              </button>
              <button
                onClick={() => {
                  setCurrentView('home');
                  setTimeout(() => {
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                کاتالوگ دوره‌ها
              </button>
              <button
                onClick={() => setIsPlacementModalOpen(true)}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-orange-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-orange-500" />
                تعیین سطح هوشمند
              </button>

              {/* Age groups dropdown / shortcuts */}
              <div className="flex items-center gap-1 mr-2 pr-2 border-r border-slate-200">
                <button
                  onClick={() => {
                    setActiveAgeFilter('6-9');
                    setCurrentView('home');
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer"
                >
                  ۶ تا ۹ سال
                </button>
                <button
                  onClick={() => {
                    setActiveAgeFilter('10-12');
                    setCurrentView('home');
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer"
                >
                  ۱۰ تا ۱۲ سال
                </button>
                <button
                  onClick={() => {
                    setActiveAgeFilter('13-17');
                    setCurrentView('home');
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer"
                >
                  ۱۳ تا ۱۷ سال
                </button>
              </div>
            </nav>
          </div>

          {/* Action side: Role Switcher & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Role Tester Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
                title="تغییر سریع نقش برای بررسی تمام بخش‌های سیستم"
              >
                <Users className="w-3.5 h-3.5 text-orange-500" />
                <span>نقش فعال:</span>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${roleLabels[role]?.color}`}>
                  {roleLabels[role]?.title}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
                    انتخاب نقش کاربر جهت آزمایش سامانه:
                  </div>
                  {(['student', 'teacher', 'admin', 'guardian'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full text-right px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 cursor-pointer transition ${
                        role === r ? 'bg-orange-50 text-orange-600' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${roleLabels[r].color.split(' ')[0]}`}></span>
                        <span>{roleLabels[r].title}</span>
                      </div>
                      {role === r && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">فعال</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dedicated Dashboard Button based on role */}
            {profile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (role === 'admin') setCurrentView('admin');
                    else if (role === 'teacher') setCurrentView('teacher');
                    else if (role === 'guardian') setCurrentView('guardian');
                    else setCurrentView('student');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-sm shadow-orange-500/30 transition cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>داشبورد اختصاصی</span>
                </button>

                {/* User menu avatar */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="w-10 h-10 rounded-xl overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition cursor-pointer"
                  >
                    <img
                      src={profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.uid}`}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                      <div className="p-3 bg-slate-50 rounded-xl mb-2 text-right">
                        <p className="text-xs font-bold text-slate-800">{profile.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate" dir="ltr">{profile.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView(role);
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        میز کار من ({roleLabels[role].title})
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-right px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          پنل مدیریت کل آکادمی
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-right px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        خروج از حساب
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                ورود / ثبت‌نام
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
