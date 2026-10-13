import React, { useState } from 'react';
import {
  Palette,
  Layout,
  Type,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  ShieldCheck,
  LogIn,
  UserPlus,
  Monitor,
  Smartphone,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AuthDesignerConfig, UserRole } from '../../types';

export const AuthVisualDesigner: React.FC = () => {
  const { settings, saveSiteSettings } = useApp();
  const { isAdmin } = useAuth();

  const [config, setConfig] = useState<AuthDesignerConfig>(settings.authDesigner);
  const [designerTab, setDesignerTab] = useState<'branding' | 'login' | 'register'>('branding');
  const [previewMode, setPreviewMode] = useState<'login' | 'register'>('login');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [newPerk, setNewPerk] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const gradients = [
    { label: 'نارنجی پرانرژی (برند پارادایس)', value: 'from-amber-500 via-orange-500 to-amber-600' },
    { label: 'غروب آفتاب (بنفش و نارنجی)', value: 'from-orange-500 via-pink-500 to-purple-600' },
    { label: 'اقیانوسی هوشمند (آبی و کهربایی)', value: 'from-blue-600 via-indigo-600 to-orange-500' },
    { label: 'سبز رشد و آرامش (زمردی و کهربا)', value: 'from-emerald-600 via-teal-500 to-amber-500' }
  ];

  const handleUpdate = (updates: Partial<AuthDesignerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleUpdateLogin = (updates: Partial<typeof config.login>) => {
    setConfig(prev => ({
      ...prev,
      login: { ...prev.login, ...updates }
    }));
    setIsDirty(true);
  };

  const handleUpdateRegister = (updates: Partial<typeof config.register>) => {
    setConfig(prev => ({
      ...prev,
      register: { ...prev.register, ...updates }
    }));
    setIsDirty(true);
  };

  const handleAddPerk = () => {
    if (newPerk.trim()) {
      handleUpdate({ perks: [...config.perks, newPerk.trim()] });
      setNewPerk('');
    }
  };

  const handleRemovePerk = (index: number) => {
    handleUpdate({ perks: config.perks.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!isAdmin) {
      alert('دسترسی غیرمجاز: فقط مدیران ارشد سیستم می‌توانند تنظیمات را ذخیره کنند.');
      return;
    }

    try {
      await saveSiteSettings({ authDesigner: config });
      setIsSaved(true);
      setIsDirty(false);
      setFeedback('تنظیمات طراحی صفحات ورود و ثبت‌نام با موفقیت ذخیره شد.');
      setTimeout(() => {
        setIsSaved(false);
        setFeedback(null);
      }, 3500);
    } catch {
      alert('خطا در ذخیره تنظیمات');
    }
  };

  return (
    <div className="space-y-6 text-right selection:bg-orange-500 selection:text-white">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-500" />
            طراح بصری و تفکیک‌شده صفحات ورود و ثبت‌نام (Auth Visual Designer)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            شخصی‌سازی مستقل صفحه ورود، صفحه ثبت‌نام، پالت رنگ، چیدمان و کنتراست استاندارد
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-[11px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold animate-pulse">
              تغییرات ذخیره‌نشده!
            </span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'تنظیمات ذخیره شد!' : 'ذخیره و اعمال در کل سایت'}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Designer Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setDesignerTab('branding')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            designerTab === 'branding' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>برندینگ و چیدمان مشترک</span>
        </button>

        <button
          onClick={() => {
            setDesignerTab('login');
            setPreviewMode('login');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            designerTab === 'login' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LogIn className="w-4 h-4" />
          <span>تنظیمات صفحه ورود</span>
        </button>

        <button
          onClick={() => {
            setDesignerTab('register');
            setPreviewMode('register');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            designerTab === 'register' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>تنظیمات صفحه ثبت‌نام</span>
        </button>
      </div>

      {/* Main Grid: Controls Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* TAB 1: Shared Branding */}
          {designerTab === 'branding' && (
            <div className="space-y-6">
              {/* Layout Style */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
                <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-orange-500" />
                  الگوی چیدمان کلی
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdate({ layoutStyle: 'split' })}
                    className={`p-3 rounded-2xl border text-center text-xs font-black transition cursor-pointer ${
                      config.layoutStyle === 'split' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    دو ستونه (Split)
                  </button>
                  <button
                    onClick={() => handleUpdate({ layoutStyle: 'card' })}
                    className={`p-3 rounded-2xl border text-center text-xs font-black transition cursor-pointer ${
                      config.layoutStyle === 'card' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    تک ستونه (Card)
                  </button>
                  <button
                    onClick={() => handleUpdate({ layoutStyle: 'minimal' })}
                    className={`p-3 rounded-2xl border text-center text-xs font-black transition cursor-pointer ${
                      config.layoutStyle === 'minimal' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    مینیمال (Minimal)
                  </button>
                </div>
              </div>

              {/* Background Gradient */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
                <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-orange-500" />
                  گرادیانت پس‌زمینه ستون برند
                </label>
                <div className="space-y-2">
                  {gradients.map((grad, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleUpdate({ backgroundGradient: grad.value })}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition cursor-pointer ${
                        config.backgroundGradient === grad.value ? 'border-orange-500 bg-orange-50 text-orange-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{grad.label}</span>
                      <div className={`w-12 h-6 rounded-lg bg-gradient-to-r ${grad.value}`}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast and Accessibility Mode */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    کنتراست و خوانایی دسترسی‌پذیری (WCAG Contrast)
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                    استاندارد AAA
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdate({ contrastMode: 'standard' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      config.contrastMode !== 'high' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    کنتراست استاندارد (طبیعی)
                  </button>
                  <button
                    onClick={() => handleUpdate({ contrastMode: 'high' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      config.contrastMode === 'high' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    کنتراست بالا (برای افراد کم‌بینا)
                  </button>
                </div>
              </div>

              {/* Perks List */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
                <label className="text-xs font-black text-slate-800 block">
                  مزایای برجسته نمایش داده شده در ستون برند (Perks)
                </label>
                <div className="space-y-2">
                  {config.perks.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{p}</span>
                      </div>
                      <button onClick={() => handleRemovePerk(i)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newPerk}
                    onChange={(e) => setNewPerk(e.target.value)}
                    placeholder="مزیت جدید..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    onClick={handleAddPerk}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Login Page Specific Settings */}
          {designerTab === 'login' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <LogIn className="w-4 h-4 text-orange-500" />
                تنظیمات اختصاصی صفحه ورود (Sign In)
              </h3>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">تیتر بالای فرم ورود</label>
                <input
                  type="text"
                  value={config.login?.title || 'ورود به حساب کاربری'}
                  onChange={(e) => handleUpdateLogin({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">توضیحات زیر تیتر فرم ورود</label>
                <input
                  type="text"
                  value={config.login?.subtitle || ''}
                  onChange={(e) => handleUpdateLogin({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">پیام خوش‌آمدگویی کوتاه</label>
                <input
                  type="text"
                  value={config.login?.welcomeNote || ''}
                  onChange={(e) => handleUpdateLogin({ welcomeNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">دکمه ورود سریع با گوگل (Google Sign-In)</span>
                  <span className="text-[10px] text-slate-400">امکان ورود بدون رمز با حساب Google فعال باشد</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.login?.showSocialLogin !== false}
                  onChange={(e) => handleUpdateLogin({ showSocialLogin: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Register Page Specific Settings */}
          {designerTab === 'register' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-orange-500" />
                تنظیمات اختصاصی صفحه ثبت‌نام (Sign Up)
              </h3>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">تیتر بالای فرم عضویت</label>
                <input
                  type="text"
                  value={config.register?.title || 'عضویت در آکادمی پارادایس'}
                  onChange={(e) => handleUpdateRegister({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">توضیحات زیر تیتر عضویت</label>
                <input
                  type="text"
                  value={config.register?.subtitle || ''}
                  onChange={(e) => handleUpdateRegister({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">متن توافق‌نامه و قوانین (پایین دکمه)</label>
                <textarea
                  rows={2}
                  value={config.register?.termsText || ''}
                  onChange={(e) => handleUpdateRegister({ termsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                ></textarea>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">انتخاب رده سنی در فرم ثبت‌نام</span>
                    <span className="text-[10px] text-slate-400">زبان‌آموز سن ۶-۹، ۱۰-۱۲ یا ۱۳-۱۷ را انتخاب کند</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.register?.showAgeSelector !== false}
                    onChange={(e) => handleUpdateRegister({ showAgeSelector: e.target.checked })}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">فیلد شماره موبایل اجباری باشد</span>
                    <span className="text-[10px] text-slate-400">فرمت ۰۹xxxxxxxxx اعتبارسنجی شود</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.register?.requirePhone !== false}
                    onChange={(e) => handleUpdateRegister({ requirePhone: e.target.checked })}
                    className="w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Live Preview with Desktop / Mobile viewport */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              {/* Preview mode toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('login')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    previewMode === 'login' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  پیش‌نمایش ورود
                </button>
                <button
                  onClick={() => setPreviewMode('register')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    previewMode === 'register' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  پیش‌نمایش ثبت‌نام
                </button>
              </div>

              {/* Viewport switch */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg cursor-pointer ${previewDevice === 'desktop' ? 'bg-white shadow-xs text-orange-600' : 'text-slate-400'}`}
                  title="نمای دسکتاپ"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg cursor-pointer ${previewDevice === 'mobile' ? 'bg-white shadow-xs text-orange-600' : 'text-slate-400'}`}
                  title="نمای موبایل"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Box Frame */}
            <div className="bg-slate-200/90 p-4 rounded-3xl border border-slate-300 flex justify-center">
              <div
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transition-all ${
                  previewDevice === 'desktop' ? 'w-full' : 'w-[360px]'
                }`}
              >
                {/* Simulated Auth Card */}
                <div className={`${config.layoutStyle === 'split' && previewDevice === 'desktop' ? 'grid grid-cols-12' : ''}`}>
                  {/* Left Brand Column in Split */}
                  {(config.layoutStyle === 'split' || previewDevice === 'mobile') && (
                    <div className={`${config.layoutStyle === 'split' && previewDevice === 'desktop' ? 'col-span-5' : ''} p-6 bg-gradient-to-br ${config.backgroundGradient} text-white space-y-4`}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-200" />
                        <span className="text-sm font-black">{settings.brandName}</span>
                      </div>
                      <h4 className="text-base font-black leading-snug">{config.headline}</h4>
                      <p className="text-xs text-white/90 leading-relaxed">{config.subheadline}</p>

                      <div className="space-y-1.5 pt-1">
                        {config.perks.slice(0, 3).map((p, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-white/90">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Simulation Column */}
                  <div className={`${config.layoutStyle === 'split' && previewDevice === 'desktop' ? 'col-span-7' : ''} p-6 space-y-4 bg-white text-right`}>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        {previewMode === 'login' ? config.login?.title : config.register?.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {previewMode === 'login' ? config.login?.subtitle : config.register?.subtitle}
                      </p>
                    </div>

                    {/* Google button simulation if enabled */}
                    {previewMode === 'login' && config.login?.showSocialLogin !== false && (
                      <div className="p-2 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-700 bg-slate-50">
                        ورود سریع با حساب Google
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="h-8 rounded-xl bg-slate-100 border border-slate-200 text-[11px] px-3 flex items-center text-slate-400">
                        ایمیل کاربری...
                      </div>
                      <div className="h-8 rounded-xl bg-slate-100 border border-slate-200 text-[11px] px-3 flex items-center text-slate-400">
                        رمز عبور...
                      </div>
                      {previewMode === 'register' && config.register?.requirePhone !== false && (
                        <div className="h-8 rounded-xl bg-slate-100 border border-slate-200 text-[11px] px-3 flex items-center text-slate-400">
                          شماره موبایل (۰۹...)
                        </div>
                      )}
                    </div>

                    <button className="w-full py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black">
                      {previewMode === 'login' ? 'ورود به حساب' : 'ثبت‌نام در آکادمی'}
                    </button>

                    {previewMode === 'register' && config.register?.termsText && (
                      <p className="text-[10px] text-slate-400 text-center">
                        {config.register.termsText}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
