import React, { useState } from 'react';
import { X, Sparkles, LogIn, UserPlus, Phone, Mail, Lock, User, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole, AgeBracket } from '../../types';
import { normalizeIranianPhone } from '../../utils/jalali';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, settings } = useApp();
  const { loginWithGoogle, loginAsDemoUser } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [roleChoice, setRoleChoice] = useState<UserRole>('student');
  const [ageChoice, setAgeChoice] = useState<AgeBracket>('10-12');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const authConfig = settings.authDesigner;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (mode === 'signup' && phone) {
        const { isValid } = normalizeIranianPhone(phone);
        if (!isValid) {
          setErrorMessage('شماره موبایل وارد شده نامعتبر است (باید با ۰۹ آغاز شود).');
          setIsLoading(false);
          return;
        }
      }

      // Complete login / signup
      await loginAsDemoUser(roleChoice, fullName || (email ? email.split('@')[0] : 'کاربر پارادایس'), ageChoice);
      setIsAuthModalOpen(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'خطا در احراز هویت');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.warn('Google sign-in popup note:', err);
      // If popup was blocked or failed, allow instant demo account
      setErrorMessage('ارتباط با سرور گوگل برقرار نشد. می‌توانید با حساب‌های دمو زیر وارد شوید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className={`relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 text-right ${
        authConfig.layoutStyle === 'split' ? 'grid grid-cols-1 md:grid-cols-12' : 'max-w-xl mx-auto'
      }`}>
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Banner / Left Column in Split Layout */}
        {authConfig.layoutStyle === 'split' && (
          <div className={`md:col-span-5 bg-gradient-to-br ${authConfig.backgroundGradient} p-8 text-white flex flex-col justify-between relative overflow-hidden`}>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black">{settings.brandName}</h3>
                  <span className="text-[10px] text-amber-100 font-en font-bold">Paradise Academy Kids & Teens</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black leading-tight mb-2">
                  {authConfig.headline}
                </h2>
                <p className="text-xs text-orange-100 leading-relaxed">
                  {authConfig.subheadline}
                </p>
              </div>

              {/* Perks List */}
              <div className="space-y-3 pt-2">
                {authConfig.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white/95">
                    <CheckCircle2 className="w-4 h-4 text-amber-200 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 text-[11px] text-amber-100 relative z-10 border-t border-white/20">
              پلتفرم امن یادگیری زبان بر پایه استانداردهای حفظ حریم خصوصی کودکان
            </div>
          </div>
        )}

        {/* Form Column */}
        <div className={`${authConfig.layoutStyle === 'split' ? 'md:col-span-7' : ''} p-8 space-y-6`}>
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode('signin')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  mode === 'signin' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ورود به حساب
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  mode === 'signup' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ثبت‌نام جدید
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-bold">
              {mode === 'signin'
                ? (authConfig.login?.title || 'ورود به حساب')
                : (authConfig.register?.title || 'عضویت در آکادمی')}
            </span>
          </div>

          {/* Subtitle / Welcome Note */}
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900">
              {mode === 'signin' ? authConfig.login?.title : authConfig.register?.title}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'signin'
                ? (authConfig.login?.subtitle || 'برای دسترسی به کلاس‌های زنده و دوره‌های آموزشی وارد شوید')
                : (authConfig.register?.subtitle || 'حساب کاربری جدید برای فرزند یا خود بسازید')}
            </p>
          </div>

          {/* Google Sign-In if enabled */}
          {(mode === 'signup' || authConfig.login?.showSocialLogin !== false) && (
            <div>
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 text-xs font-black flex items-center justify-center gap-2.5 transition cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>ورود سریع با حساب گوگل (Google Sign-In)</span>
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <span className="relative px-3 bg-white text-[11px] text-slate-400 font-bold">یا ورود با نام و نقش</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">نام و نام خانوادگی</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: پارسا کمالی"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">ایمیل</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-en text-left"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {authConfig.showPhoneField && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">شماره همراه ایران</label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-en text-left"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">نقش شما</label>
                  <select
                    value={roleChoice}
                    onChange={(e) => setRoleChoice(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  >
                    <option value="student">دانش‌آموز</option>
                    <option value="guardian">ولی دانش‌آموز (والدین)</option>
                    <option value="teacher">متقاضی تدریس</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رده سنی</label>
                  <select
                    value={ageChoice}
                    onChange={(e) => setAgeChoice(e.target.value as AgeBracket)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  >
                    <option value="6-9">۶ تا ۹ سال</option>
                    <option value="10-12">۱۰ تا ۱۲ سال</option>
                    <option value="13-17">۱۳ تا ۱۷ سال</option>
                  </select>
                </div>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs text-red-500 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>{mode === 'signin' ? 'ورود به حساب کاربری' : 'تکمیل ثبت‌نام و ورود'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block mb-2">ورود آزمایشی با یک کلیک (جهت تست فوری بخش‌های سیستم):</span>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              <button
                onClick={() => {
                  loginAsDemoUser('admin');
                  setIsAuthModalOpen(false);
                }}
                className="py-1.5 px-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold cursor-pointer"
              >
                مدیر کل
              </button>
              <button
                onClick={() => {
                  loginAsDemoUser('teacher');
                  setIsAuthModalOpen(false);
                }}
                className="py-1.5 px-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold cursor-pointer"
              >
                مدرس
              </button>
              <button
                onClick={() => {
                  loginAsDemoUser('student');
                  setIsAuthModalOpen(false);
                }}
                className="py-1.5 px-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-[10px] font-bold cursor-pointer"
              >
                دانش‌آموز
              </button>
              <button
                onClick={() => {
                  loginAsDemoUser('guardian');
                  setIsAuthModalOpen(false);
                }}
                className="py-1.5 px-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold cursor-pointer"
              >
                ولی دانش‌آموز
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
