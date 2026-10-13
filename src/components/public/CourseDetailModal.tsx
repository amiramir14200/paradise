import React from 'react';
import { X, Clock, Users, CheckCircle2, Volume2, BookOpen, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, toPersianDigits, speakEnglish } from '../../utils/jalali';

export const CourseDetailModal: React.FC = () => {
  const {
    selectedCourseForDetail,
    setSelectedCourseForDetail,
    setSelectedCourseForCheckout,
    lessons,
    currency
  } = useApp();

  if (!selectedCourseForDetail) return null;
  const course = selectedCourseForDetail;

  const courseLessons = lessons.filter((l) => l.courseId === course.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="relative h-48 bg-slate-900 shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            onClick={() => setSelectedCourseForDetail(null)}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 right-6 left-6 text-white text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                {course.ageBracket === 'all' ? 'همه رده‌های سنی' : `رده سنی ${course.ageBracket} سال`}
              </span>
              <span className="bg-white/20 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full">
                سطح: {course.level}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{course.title}</h2>
            <p className="text-xs text-slate-300 font-en font-medium mt-0.5">{course.titleEn}</p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-right">
          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-500" />
              توضیحات و اهداف آموزشی دوره
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-orange-50/60 p-4 rounded-2xl border border-orange-100">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">مدرس دوره</span>
              <span className="text-xs font-black text-slate-800">{course.instructorName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">مدت کل ترم</span>
              <span className="text-xs font-black text-slate-800">{toPersianDigits(course.durationWeeks)} هفته</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">تعداد جلسات آنلاین</span>
              <span className="text-xs font-black text-slate-800">{toPersianDigits(course.liveSessionsCount)} جلسه زنده</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">شهریه</span>
              <span className="text-xs font-black text-orange-600">{formatPrice(course.price, currency)}</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-black text-slate-900">سرفصل‌ها و مزایای ویژه دوره</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson Syllabus & Interactive Audio Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-500" />
                نمونه جلسات و تمرین‌های تعاملی
              </h3>
              <span className="text-[11px] text-slate-400">
                {toPersianDigits(courseLessons.length)} جلسه نمونه آماده
              </span>
            </div>

            {courseLessons.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
                سرفصل‌های تفصیلی این دوره به‌زودی بارگذاری می‌شود.
              </p>
            ) : (
              <div className="space-y-3">
                {courseLessons.map((lesson) => (
                  <div key={lesson.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">{lesson.title}</span>
                      <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md font-bold">
                        {toPersianDigits(lesson.durationMinutes)} دقیقه
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{lesson.summary}</p>

                    {/* Vocabulary interactive preview */}
                    {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 block mb-2">
                          واژگان کلیدی این جلسه (برای شنیدن تلفظ روی بلندگو بزنید):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {lesson.vocabulary.map((vocab) => (
                            <div
                              key={vocab.id}
                              className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2"
                            >
                              <button
                                onClick={() => speakEnglish(vocab.word)}
                                className="w-5 h-5 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-700 flex items-center justify-center transition cursor-pointer"
                                title="پخش صوتی تلفظ استاندارد"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold font-en text-slate-900">{vocab.word}</span>
                              <span className="text-[11px] text-slate-500">({vocab.translation})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">شهریه ثبت‌نام:</span>
            <span className="text-base font-black text-orange-600">{formatPrice(course.price, currency)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCourseForDetail(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              بستن
            </button>
            <button
              onClick={() => {
                setSelectedCourseForDetail(null);
                setSelectedCourseForCheckout(course);
              }}
              className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 cursor-pointer"
            >
              ثبت‌نام مستقیم در این دوره
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
