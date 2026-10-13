import React from 'react';
import { Baby, Compass, Sparkles, Trophy, BookOpen, Flame, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgeBracket } from '../../types';

export const AgePathways: React.FC = () => {
  const { setActiveAgeFilter } = useApp();

  const pathways: {
    bracket: AgeBracket;
    title: string;
    englishTitle: string;
    ageLabel: string;
    color: string;
    gradient: string;
    badgeBg: string;
    icon: React.ReactNode;
    description: string;
    features: string[];
    outcomes: string;
  }[] = [
    {
      bracket: '6-9',
      title: 'کاوشگران کوچک (Little Explorers)',
      englishTitle: 'Phonics, Play & Songs',
      ageLabel: '۶ تا ۹ سال',
      color: 'text-amber-600',
      gradient: 'from-amber-400 to-orange-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Baby className="w-6 h-6 text-white" />,
      description: 'آموزش کاملاً غیرمستقیم از طریق بازی، شعر، کارتون و انیمیشن برای درونی‌سازی الفبا و تلفظ بومی بدون حفظ طوطی‌وار.',
      features: [
        'سیستم آواشناسی فونیکس (Jolly Phonics)',
        'کارگاه رنگ‌آمیزی و قصه‌گویی تعاملی',
        'پرورش مهارت شنیداری و گفتاری ناخودآگاه',
        'گزارش ویدیویی پیشرفت برای والدین'
      ],
      outcomes: 'تلفظ اصولی الفبا، بیان بیش از ۲۰۰ واژه روزمره، و خواندن کلمات ساده انگلیسی'
    },
    {
      bracket: '10-12',
      title: 'قهرمانان پویا (Junior Champions)',
      englishTitle: 'Grammar in Action & Fluency',
      ageLabel: '۱۰ تا ۱۲ سال',
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: <Trophy className="w-6 h-6 text-white" />,
      description: 'گذر از جملات ساده به سمت مکالمه خودجوش، درک گرامر در بستر داستان‌های ماجراجویانه و افزایش چشمگیر دایره واژگان.',
      features: [
        'داستان‌خوانی تعاملی و خلاصه‌نویسی کوتاه',
        'گرامر کاربردی بدون فرمول‌های خسته‌کننده',
        'ایفای نقش (Role Play) و چالش‌های گروهی',
        'آزمون‌های دوره‌ای با جایزه و نشان افتخار'
      ],
      outcomes: 'توانایی مکالمه در سفر، مدرسه، معرفی کامل خود، و شرکت در گفتگوهای ساده روزمره'
    },
    {
      bracket: '13-17',
      title: 'رهبران آینده (Teen Leaders)',
      englishTitle: 'Academic Speaking & IELTS Prep',
      ageLabel: '۱۳ تا ۱۷ سال',
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-600',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: <Flame className="w-6 h-6 text-white" />,
      description: 'آمادگی جامع برای مقاله‌نویسی، بحث و مناظره آزاد، تحلیل متون پیشرفته، و پایه‌ریزی موفقیت در آزمون‌های بین‌المللی نظیر آیلتس و تافل.',
      features: [
        'اتاق‌های مناظره و بحث آزاد پیرامون اخبار و علم',
        'اصول رایتینگ آکادمیک و گرامر پیشرفته',
        'آمادگی برای آزمون‌های بین‌المللی و مهاجرت',
        'پادکست‌سازی و پروژه‌های تیمی زبان‌آموزان'
      ],
      outcomes: 'تسلط روان بر مکالمه آزاد، تحلیل و بیان استدلال قوی، و کسب نمره عالی در آزمون‌های مدرسه'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>مسیرهای آموزشی اختصاصی بر اساس سن و روانشناسی کودک</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            آموزش اختصاصی برای هر رده سنی
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            روش یادگیری یک کودک ۶ ساله با یک نوجوان ۱۵ ساله کاملاً متفاوت است. در آکادمی پارادایس هر گروه سنی سیلابس و متدولوژی روانشناختی ویژه خود را دارد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pathways.map((path) => (
            <div
              key={path.bracket}
              className="group relative bg-slate-50 hover:bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header of card */}
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${path.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {path.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${path.badgeBg}`}>
                    {path.ageLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 font-en mt-1">{path.englishTitle}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {path.description}
                </p>

                {/* Features list */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-700">ویژگی‌های کلیدی دوره:</p>
                  {path.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Outcome box */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-right space-y-1">
                  <span className="text-[10px] font-bold text-orange-600 block">دست‌آورد پایان این مسیر:</span>
                  <p className="text-xs font-bold text-slate-700 leading-normal">{path.outcomes}</p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    setActiveAgeFilter(path.bracket);
                    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white group-hover:bg-orange-500 border border-slate-200 group-hover:border-transparent text-slate-700 group-hover:text-white text-xs font-black shadow-xs group-hover:shadow-md transition-all cursor-pointer"
                >
                  <span>مشاهده دوره‌های این رده سنی</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
