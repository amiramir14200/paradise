import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Clock3,
  Award,
  BookOpen,
  Receipt,
  Link as LinkIcon,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Star,
  Sparkles,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { formatToJalali, formatPrice, toPersianDigits } from '../../utils/jalali';

export const ParentDashboard: React.FC = () => {
  const { profile, linkChildToGuardian } = useAuth();
  const {
    enrollments,
    orders,
    liveClasses,
    attendances,
    currency,
    lessons,
    quizAttempts,
    homeworkSubmissions
  } = useApp();

  const [childIdInput, setChildIdInput] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Linked children list
  const linkedChildren = profile?.childrenIds || ['demo-student-1'];
  const [selectedChildId, setSelectedChildId] = useState<string>(linkedChildren[0] || 'demo-student-1');

  // Child's enrollments and attendance
  const childEnrollments = enrollments.filter(e => e.studentId === selectedChildId);
  const childOrders = orders.filter(o => o.studentId === selectedChildId);
  const childAttendances = attendances.filter(a => a.studentId === selectedChildId);
  const childQuizAttempts = quizAttempts.filter(q => q.studentId === selectedChildId);
  const childHomework = homeworkSubmissions.filter(h => h.studentId === selectedChildId);

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (childIdInput.trim()) {
      await linkChildToGuardian(childIdInput.trim());
      setLinkSuccess(true);
      setChildIdInput('');
      setTimeout(() => setLinkSuccess(false), 3000);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-right">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 p-1 border border-white/30 shrink-0">
            <img
              src={profile?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
              alt={profile?.fullName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <span className="bg-emerald-500/50 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
              سامانه اختصاصی اولیا و خانواده‌ها
            </span>
            <h1 className="text-2xl font-black mt-1">{profile?.fullName || 'آقای علی رضایی (ولی دانش‌آموز)'}</h1>
            <p className="text-xs text-emerald-200">
              پایش لحظه‌ای روند آموزش، ساعات کلاسی و کارنامه فرزند دلبندتان
            </p>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center">
          <span className="text-xs text-emerald-100 block font-bold">فرزند فعال در پنل:</span>
          <span className="text-base font-black text-white">کیان رضایی (۸ ساله)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Child Progress & Attendance */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Courses with Lesson Progress */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              دوره‌های ثبت‌نام شده و درصد پیشرفت سرفصل‌ها
            </h3>

            <div className="divide-y divide-slate-100">
              {childEnrollments.map(en => {
                const cLessons = lessons.filter(l => l.courseId === en.courseId);
                const completedCount = (en.completedLessonIds || []).length;
                const percent = cLessons.length > 0 ? Math.round((completedCount / cLessons.length) * 100) : 0;

                return (
                  <div key={en.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{en.courseTitle}</h4>
                        <span className="text-[11px] text-slate-400">
                          تاریخ ثبت‌نام: {formatToJalali(en.createdAt)}
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {en.status === 'active' ? 'در حال برگزاری' : 'در انتظار تایید'}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-1">
                          {formatPrice(en.amount, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span>جلسات مطالعه شده: {toPersianDigits(completedCount)} از {toPersianDigits(cLessons.length)}</span>
                        <span>{toPersianDigits(percent)}٪</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Child's Quiz & Exam Report Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              کارنامه و نمرات آزمون‌های فرزند
            </h3>

            {childQuizAttempts.length > 0 ? (
              <div className="space-y-3">
                {childQuizAttempts.map(attempt => (
                  <div
                    key={attempt.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-slate-800 block">{attempt.quizTitle}</span>
                        <span className="text-[10px] text-slate-400">
                          تاریخ: {formatToJalali(attempt.completedAt)}
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-black font-en text-emerald-700">
                          {toPersianDigits(attempt.score)}٪
                        </span>
                        <span className={`block text-[10px] font-bold ${
                          attempt.passed ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {attempt.status === 'pending_teacher_review'
                            ? 'در انتظار تصحیح معلم'
                            : attempt.passed
                            ? 'قبول شده ✓'
                            : 'نیاز به تمرین'}
                        </span>
                      </div>
                    </div>

                    {attempt.teacherReviewNotes && (
                      <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                        یادداشت معلم: {attempt.teacherReviewNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">هنوز آزمونی ثبت نشده است.</p>
            )}
          </div>

          {/* Child's Homework Submissions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              تکالیف ارسالی و بازخورد استاد
            </h3>

            {childHomework.length > 0 ? (
              <div className="space-y-3">
                {childHomework.map(hw => (
                  <div
                    key={hw.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">{hw.lessonTitle}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        hw.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hw.status === 'graded' ? `نمره: ${toPersianDigits(hw.score || 100)} از ۱۰۰` : 'در حال بررسی توسط استاد'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 font-en">
                      {hw.submissionText}
                    </p>

                    {hw.teacherFeedback && (
                      <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        پیام تشویقی معلم: {hw.teacherFeedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">هنوز تکلیفی ارسال نشده است.</p>
            )}
          </div>

          {/* Teacher Reports & Attendance Log */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                سوابق حضور و غیاب و بازخورد معلم در جلسات زنده
              </h3>
              <span className="text-xs text-emerald-600 font-bold">بدون تاخیر غیرموجه</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">جلسه ۲: تمرین تلفظ فونیکس CVC</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    حاضر در جلسه
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  پیام معلم (خانم احمدی): «کیان در این جلسه با انگیزه بالا کلمات مربوط به Cat و Hat را ادا کرد و امتیاز کامل بازی کلاسی را گرفت.»
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">جلسه ۱: صدای حروف A و B</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    حاضر در جلسه
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  پیام معلم (خانم احمدی): «شروع بسیار عالی! تلفظ صدای /æ/ کاملاً طبیعی بود.»
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Link new child & Invoices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Link Child Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-600" />
              اتصال فرزند دیگر به حساب ولی
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              اگر فرزند دیگری در آکادمی پارادایس دارید، شناسه یا کد دانش‌آموزی وی را وارد کنید.
            </p>

            <form onSubmit={handleLinkChild} className="space-y-3">
              <input
                type="text"
                value={childIdInput}
                onChange={e => setChildIdInput(e.target.value)}
                placeholder="کد دانش‌آموز (مثال: demo-student-2)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer"
              >
                {linkSuccess ? 'با موفقیت متصل شد!' : 'اتصال به فرزند'}
              </button>
            </form>
          </div>

          {/* Payment Receipts & Official Invoices */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                رسیدهای مالی و سفارشات فرزند
              </h3>
              <span className="text-[10px] text-slate-400 font-bold">
                {toPersianDigits(childOrders.length)} تراکنش
              </span>
            </div>

            <div className="space-y-2">
              {childOrders.map(order => (
                <div key={order.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="font-mono text-slate-900 text-[11px]" dir="ltr">
                      {order.orderNumber}
                    </span>
                    <span className="text-emerald-700 font-black">
                      {order.finalAmount === 0 ? 'رایگان' : formatPrice(order.finalAmount, currency)}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-slate-800 truncate">
                    {order.courseTitle}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                    <span className="text-slate-400 font-mono">
                      {order.manualTrackingCode
                        ? `پیگیری: ${order.manualTrackingCode}`
                        : order.gatewayRefId
                        ? `مرجع: ${order.gatewayRefId}`
                        : 'در انتظار پرداخت'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        order.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'awaiting_manual_verification'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {order.status === 'paid'
                        ? 'تایید شده ✓'
                        : order.status === 'awaiting_manual_verification'
                        ? 'در انتظار بررسی'
                        : order.status === 'rejected'
                        ? 'رد شده'
                        : 'معلق'}
                    </span>
                  </div>
                </div>
              ))}

              {childOrders.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">
                  هنوز سفارشی برای این فرزند ثبت نشده است.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
