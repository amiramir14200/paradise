import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, Users, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, AgeBracket, CourseLevel } from '../../types';
import { formatPrice, toPersianDigits } from '../../utils/jalali';

export const CourseCatalog: React.FC = () => {
  const {
    courses,
    currency,
    activeAgeFilter,
    setActiveAgeFilter,
    setSelectedCourseForDetail,
    setSelectedCourseForCheckout
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const ageTabs: { label: string; value: AgeBracket }[] = [
    { label: 'همه رده‌های سنی', value: 'all' },
    { label: 'کودکان ۶ تا ۹ سال', value: '6-9' },
    { label: 'نوجوانان ۱۰ تا ۱۲ سال', value: '10-12' },
    { label: 'نوجوانان ۱۳ تا ۱۷ سال', value: '13-17' }
  ];

  const levelLabels: Record<CourseLevel, string> = {
    starter: 'مبتدی (Starter)',
    elementary: 'پایه (Elementary)',
    intermediate: 'متوسط (Intermediate)',
    'upper-intermediate': 'فوق متوسط (Upper-Int)',
    advanced: 'پیشرفته (Advanced)'
  };

  const filteredCourses = courses.filter((c) => {
    if (!c.isPublished) return false;
    if (activeAgeFilter !== 'all' && c.ageBracket !== activeAgeFilter && c.ageBracket !== 'all') {
      return false;
    }
    if (levelFilter !== 'all' && c.level !== levelFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q) || c.titleEn.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchInstructor = c.instructorName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchInstructor) return false;
    }
    return true;
  });

  return (
    <section id="courses-section" className="py-20 bg-slate-50/60 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>کاتالوگ کامل دوره‌های آنلاین ترم جدید</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              دوره‌های تخصصی آموزش زبان انگلیسی
            </h2>
            <p className="text-sm text-slate-600">
              کلاس‌های ترمیک و مهارتی آنلاین با شهریه شفاف به واحد {currency === 'toman' ? 'تومان' : 'ریال'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی دوره، مدرس یا مهارت..."
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          {/* Age Bracket Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {ageTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveAgeFilter(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeAgeFilter === tab.value
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Level selector */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>سطح:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              <option value="all">همه سطوح</option>
              <option value="starter">مبتدی (Starter)</option>
              <option value="elementary">پایه (Elementary)</option>
              <option value="intermediate">متوسط (Intermediate)</option>
              <option value="upper-intermediate">فوق متوسط (Upper-Int)</option>
              <option value="advanced">پیشرفته (Advanced)</option>
            </select>
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">هیچ دوره‌ای با این مشخصات یافت نشد</h3>
            <p className="text-xs text-slate-400 mt-1">لطفاً فیلترهای جستجو یا رده سنی را تغییر دهید.</p>
            <button
              onClick={() => {
                setActiveAgeFilter('all');
                setLevelFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 cursor-pointer"
            >
              پاک کردن فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Thumbnail & Badge */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {course.badge && (
                        <span className="bg-orange-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                          {course.badge}
                        </span>
                      )}
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {course.ageBracket === 'all' ? 'همه سنین' : `${course.ageBracket} سال`}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-800 shadow-xs">
                      {levelLabels[course.level]}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-400 font-en mt-0.5 line-clamp-1">
                        {course.titleEn}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{toPersianDigits(course.durationWeeks)} هفته ({toPersianDigits(course.liveSessionsCount)} جلسه)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        <span>مدرس: {course.instructorName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer and Price */}
                <div className="p-6 pt-0 space-y-4 border-t border-slate-50">
                  <div className="flex items-baseline justify-between pt-3">
                    <span className="text-xs text-slate-400">شهریه دوره:</span>
                    <div className="text-right">
                      {course.originalPrice && (
                        <span className="block text-[11px] text-slate-400 line-through">
                          {formatPrice(course.originalPrice, currency)}
                        </span>
                      )}
                      <span className="text-base font-black text-orange-600">
                        {formatPrice(course.price, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition cursor-pointer text-center"
                    >
                      سرفصل و جزئیات
                    </button>
                    <button
                      onClick={() => setSelectedCourseForCheckout(course)}
                      className="w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-sm shadow-orange-500/20 transition cursor-pointer text-center"
                    >
                      ثبت‌نام دوره
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
