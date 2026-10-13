import React from 'react';
import { Sparkles, Compass, CheckCircle2, Star, ShieldCheck, PlayCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toPersianDigits } from '../../utils/jalali';

export const Hero: React.FC = () => {
  const { setIsPlacementModalOpen, setActiveAgeFilter } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-amber-50/40 py-16 lg:py-24">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>پلتفرم تخصصی آموزش زبان انگلیسی کودکان و نوجوانان ایران</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.25] tracking-tight">
              انگلیسی را مثل <span className="text-orange-500 underline decoration-amber-300 decoration-wavy decoration-2">زبان مادری</span>، با لبخند و اطمینان بیاموزید!
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              در آکادمی پارادایس، فرزندان شما در محیطی امن، تعاملی و پرانرژی همراه با اساتید برتر کودک و نوجوان، مهارت مکالمه واقعی زبان انگلیسی را بر پایه استانداردهای بین‌المللی کمبریج کسب می‌کنند.
            </p>

            {/* Quick stats badges */}
            <div className="grid grid-cols-3 gap-3 py-2 max-w-lg">
              <div className="bg-white p-3 rounded-2xl border border-orange-100 shadow-xs text-center">
                <span className="block text-xl font-black text-orange-600 font-en">+{toPersianDigits('2400')}</span>
                <span className="text-[11px] text-slate-500 font-bold">دانش‌آموز فعال</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-orange-100 shadow-xs text-center">
                <span className="block text-xl font-black text-amber-500 font-en">۹۸.۶٪</span>
                <span className="text-[11px] text-slate-500 font-bold">رضایت والدین</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-orange-100 shadow-xs text-center">
                <span className="block text-xl font-black text-orange-600 font-en">۶ تا ۱۷</span>
                <span className="text-[11px] text-slate-500 font-bold">رده‌های سنی تخصصی</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setIsPlacementModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Compass className="w-5 h-5 text-amber-100" />
                <span>شروع آزمون تعیین سطح رایگان</span>
              </button>

              <button
                onClick={() => {
                  document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-orange-50 border-2 border-orange-200 text-orange-700 font-black text-sm transition-all cursor-pointer shadow-xs"
              >
                <PlayCircle className="w-5 h-5 text-orange-500" />
                <span>مشاهده دوره‌ها و شهریه‌ها</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>کلاس‌های کم‌جمعیت آنلاین (حداکثر ۸ نفر)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>پنل اختصاصی پایش پیشرفت والدین</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>جلسه نخست با ضمانت بازگشت شهریه</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image & Interactive Age Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Feature Card with child learner illustration */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                  alt="کودکان و نوجوانان در حال یادگیری آنلاین انگلیسی"
                  className="w-full h-[400px] object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="absolute bottom-6 right-6 left-6 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                      کلاس آنلاین زنده
                    </span>
                    <span className="text-xs text-slate-300">اسکای‌روم با ترافیک نیم‌بهاء</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    «پسرم بعد از ۳ ماه بدون لهجه کلمات سخت رو ادا می‌کنه!»
                  </h3>
                  <p className="text-xs text-slate-300">
                    رضایت مادر رادین، زبان‌آموز ۷ ساله دوره فونیکس پارادایس
                  </p>
                </div>
              </div>

              {/* Floating Age Selector */}
              <div className="absolute -bottom-6 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-800">تفکیک سنی ۳ مرحله‌ای</div>
                  <div className="text-[10px] text-slate-500">محتوای متناسب با رشد شناختی کودک</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
