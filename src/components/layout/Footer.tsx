import React from 'react';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Heart, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { settings, setActiveAgeFilter } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">{settings.brandName}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              آکادمی پارادایس، محیطی پویا، امن و شاد برای پرورش مهارت‌های مکالمه و زبان انگلیسی کودکان و نوجوانان ۶ تا ۱۷ سال ایران با برترین استانداردهای بین‌المللی و نظارت اختصاصی والدین.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>دارای مجوز رسمی آموزش الکترونیکی و نماد اعتماد پرداخت</span>
            </div>
          </div>

          {/* Educational Pathways */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-orange-500 pr-2">مسیرهای آموزشی</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveAgeFilter('6-9');
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  کودکان ۶ تا ۹ سال (فـونیکس و بازی)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveAgeFilter('10-12');
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  نوجوانان ۱۰ تا ۱۲ سال (مکالمه و واژگان)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveAgeFilter('13-17');
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition cursor-pointer"
                >
                  نوجوانان ۱۳ تا ۱۷ سال (آیلتس و آکادمیک)
                </button>
              </li>
              <li>
                <a href="#placement" className="hover:text-orange-400 transition">
                  آزمون تعیین سطح آنلاین
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-orange-500 pr-2">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-orange-400 transition">درباره آکادمی پارادایس</a></li>
              <li><a href="#teachers" className="hover:text-orange-400 transition">هیئت علمی و مدرسان</a></li>
              <li><a href="#faq" className="hover:text-orange-400 transition">پرسش‌های متداول والدین</a></li>
              <li><a href="#rules" className="hover:text-orange-400 transition">قوانین و مقررات کلاس‌ها</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-r-2 border-orange-500 pr-2">پشتیبانی و تماس</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span dir="ltr">{settings.brandPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span dir="ltr">{settings.brandEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                ساعت پاسخگویی: شنبه تا چهارشنبه ۹ الی ۱۸ (به وقت تهران)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© تمامی حقوق مادی و معنوی برای «آکادمی زبان پارادایس» محفوظ است. ۱۴۰۵ - ۲۰۲۶</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>طراحی شده با</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500 mx-1" />
            <span>برای فرزندان مستعد ایران زمین</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
