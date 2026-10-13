import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Video,
  CheckCircle2,
  XCircle,
  Clock3,
  Award,
  BookOpen,
  FileText,
  Save,
  MessageSquare,
  ExternalLink,
  UserCheck,
  AlertCircle,
  Check,
  Sparkles,
  Edit,
  Send,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LiveClass, AttendanceRecord, QuizAttempt, HomeworkSubmission } from '../../types';
import { formatToJalali, toPersianDigits } from '../../utils/jalali';

export const TeacherDashboard: React.FC = () => {
  const { profile } = useAuth();
  const {
    liveClasses,
    courses,
    lessons,
    saveLiveClass,
    saveAttendance,
    attendances,
    quizAttempts,
    gradeQuizAttempt,
    homeworkSubmissions,
    gradeHomework
  } = useApp();

  const [activeTab, setActiveTab] = useState<'classes' | 'quizzes' | 'homework' | 'materials'>('classes');

  // Selected live class state
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(liveClasses[0] || null);
  const [sessionNotes, setSessionNotes] = useState(selectedClass?.sessionNotes || '');
  const [homeworkText, setHomeworkText] = useState(selectedClass?.homework || '');
  const [classStatus, setClassStatus] = useState<'scheduled' | 'in-progress' | 'completed' | 'cancelled'>(
    selectedClass?.status || 'scheduled'
  );
  const [cancellationReason, setCancellationReason] = useState(selectedClass?.cancellationReason || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Attendance state
  const [studentStatuses, setStudentStatuses] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({
    'demo-student-1': 'present',
    'demo-student-2': 'present',
    'demo-student-3': 'late'
  });

  const studentsList = [
    { id: 'demo-student-1', name: 'کیان رضایی', age: '۸ ساله', guardian: 'علی رضایی (پدر)' },
    { id: 'demo-student-2', name: 'سارا صادقی', age: '۱۴ ساله', guardian: 'زهرا صادقی (مادر)' },
    { id: 'demo-student-3', name: 'آرتین رستمی', age: '۱۰ ساله', guardian: 'مهرداد رستمی (پدر)' }
  ];

  // Quiz grading state
  const pendingQuizAttempts = quizAttempts.filter(q => q.status === 'pending_teacher_review');
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(pendingQuizAttempts[0] || null);
  const [gradedScoreInput, setGradedScoreInput] = useState<number>(85);
  const [teacherQuizFeedback, setTeacherQuizFeedback] = useState('پاسخ شما بسیار روان و ساختارمند بود. آفرین!');
  const [quizGradeSuccess, setQuizGradeSuccess] = useState(false);

  // Homework grading state
  const [selectedHomework, setSelectedHomework] = useState<HomeworkSubmission | null>(
    homeworkSubmissions[0] || null
  );
  const [hwScore, setHwScore] = useState<number>(90);
  const [hwFeedback, setHwFeedback] = useState('کار بسیار عالی با خط خوانا و تلفظ صحیح واژگان!');
  const [hwGradeSuccess, setHwGradeSuccess] = useState(false);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudentStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveSessionData = async () => {
    if (!selectedClass) return;

    // 1. Update live class notes and status
    const updatedClass: LiveClass = {
      ...selectedClass,
      sessionNotes,
      homework: homeworkText,
      status: classStatus,
      cancellationReason: classStatus === 'cancelled' ? cancellationReason : undefined
    };
    await saveLiveClass(updatedClass);

    // 2. Save attendance records
    for (const st of studentsList) {
      const record: AttendanceRecord = {
        id: `att-${selectedClass.id}-${st.id}`,
        classId: selectedClass.id,
        classTitle: selectedClass.title,
        studentId: st.id,
        studentName: st.name,
        status: studentStatuses[st.id] || 'present',
        date: new Date().toISOString(),
        note: `ثبت شده توسط استاد ${profile?.fullName || 'سارا احمدی'}`,
        createdAt: new Date().toISOString()
      };
      await saveAttendance(record);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSubmitQuizReview = async () => {
    if (!selectedAttempt) return;

    const updatedQuestions = selectedAttempt.questionResults.map(q => {
      if (q.needsTeacherReview) {
        return {
          ...q,
          isCorrect: true,
          pointsEarned: q.maxPoints,
          needsTeacherReview: false,
          feedback: teacherQuizFeedback
        };
      }
      return q;
    });

    await gradeQuizAttempt(selectedAttempt.id, updatedQuestions, gradedScoreInput, teacherQuizFeedback);
    setQuizGradeSuccess(true);
    setTimeout(() => {
      setQuizGradeSuccess(false);
      setSelectedAttempt(null);
    }, 2500);
  };

  const handleSubmitHomeworkGrading = async () => {
    if (!selectedHomework) return;
    await gradeHomework(selectedHomework.id, hwScore, hwFeedback);
    setHwGradeSuccess(true);
    setTimeout(() => {
      setHwGradeSuccess(false);
    }, 2500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-right">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 p-1 border border-white/30 shrink-0">
            <img
              src={profile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'}
              alt={profile?.fullName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <span className="bg-purple-500/50 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
              پنل اساتید و هیئت علمی
            </span>
            <h1 className="text-2xl font-black mt-1">{profile?.fullName || 'خانم سارا احمدی'}</h1>
            <p className="text-xs text-purple-200">
              مدیریت کلاس‌های زنده، ثبت حضور و غیاب، تصحیح آزمون‌های تشریحی و ارسال بازخورد به والدین
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-center">
            <span className="text-lg font-black block font-en">{toPersianDigits(liveClasses.length)}</span>
            <span className="text-[10px] text-purple-200">کلاس فعال این ترم</span>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-center">
            <span className="text-lg font-black block font-en">
              {toPersianDigits(pendingQuizAttempts.length)}
            </span>
            <span className="text-[10px] text-amber-300 font-bold">آزمون نیازمند تصحیح</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'classes' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>کلاس‌های زنده و حضور و غیاب</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'quizzes' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>بررسی آزمون‌های تشریحی ({toPersianDigits(pendingQuizAttempts.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('homework')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'homework' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>بررسی تکالیف ارسالی دانش‌آموزان ({toPersianDigits(homeworkSubmissions.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'materials' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>سرفصل‌ها و محتوای آموزشی</span>
        </button>
      </div>

      {/* Tab 1: Live Classes & Attendance */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Assigned Classes List */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-black text-slate-800">کلاس‌های آنلاین محول شده:</h3>
            <div className="space-y-3">
              {liveClasses.map(lClass => {
                const isSelected = selectedClass?.id === lClass.id;
                return (
                  <button
                    key={lClass.id}
                    onClick={() => {
                      setSelectedClass(lClass);
                      setSessionNotes(lClass.sessionNotes || '');
                      setHomeworkText(lClass.homework || '');
                      setClassStatus(lClass.status || 'scheduled');
                      setCancellationReason(lClass.cancellationReason || '');
                    }}
                    className={`w-full text-right p-5 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 line-clamp-1">{lClass.title}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                        {toPersianDigits(lClass.durationMinutes)} دقیقه
                      </span>
                    </div>

                    <p className="text-[11px] text-purple-700 font-bold">{lClass.courseTitle}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>{formatToJalali(lClass.scheduledAt, true)}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        lClass.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : lClass.status === 'completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {lClass.status === 'cancelled'
                          ? 'لغو شده'
                          : lClass.status === 'completed'
                          ? 'پایان یافته'
                          : 'برنامه‌ریزی شده'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Class Management & Attendance Register */}
          <div className="lg:col-span-8">
            {selectedClass ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                {/* Header & Live Link */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                      جلسه آنلاین فعال
                    </span>
                    <h2 className="text-lg font-black text-slate-900 mt-1">{selectedClass.title}</h2>
                    <p className="text-xs text-slate-500">{selectedClass.courseTitle}</p>
                  </div>

                  <a
                    href={selectedClass.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer transition shrink-0"
                  >
                    <Video className="w-4 h-4" />
                    <span>ورود استاد به اتاق اسکای‌روم</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Status & Reschedule / Cancel */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800">وضعیت برگزاری کلاس:</span>
                    <select
                      value={classStatus}
                      onChange={e => setClassStatus(e.target.value as any)}
                      className="p-2 rounded-xl border border-slate-300 text-xs font-bold bg-white outline-none"
                    >
                      <option value="scheduled">برنامه‌ریزی شده (عادی)</option>
                      <option value="in-progress">در حال برگزاری</option>
                      <option value="completed">برگزار شد (پایان جلسه)</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>

                  {classStatus === 'cancelled' && (
                    <input
                      type="text"
                      value={cancellationReason}
                      onChange={e => setCancellationReason(e.target.value)}
                      placeholder="علت لغو کلاس (مثال: تغییر ساعت به درخواست اولیا)"
                      className="w-full p-2.5 rounded-xl border border-red-200 text-xs bg-red-50 text-red-900 outline-none"
                    />
                  )}
                </div>

                {/* Attendance Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      لیست دانش‌آموزان و ثبت حضور و غیاب:
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      ثبت در پایگاه ابری و ارسال نوتیفیکیشن به اولیا
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {studentsList.map(st => {
                      const currentStatus = studentStatuses[st.id] || 'present';
                      return (
                        <div
                          key={st.id}
                          className="p-3.5 bg-white hover:bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-xs font-black text-slate-900 block">{st.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {st.age} • ولی: {st.guardian}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                              onClick={() => handleStatusChange(st.id, 'present')}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>حاضر</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(st.id, 'late')}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                                currentStatus === 'late'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <Clock3 className="w-3.5 h-3.5" />
                              <span>تاخیر</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(st.id, 'absent')}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                                currentStatus === 'absent'
                                  ? 'bg-red-500 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>غایب</span>
                            </button>

                            <button
                              onClick={() => handleStatusChange(st.id, 'excused')}
                              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition ${
                                currentStatus === 'excused'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              موجه
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Session Notes & Homework */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                      <span>یادداشت جلسه برای خانواده‌ها:</span>
                    </label>
                    <textarea
                      rows={3}
                      value={sessionNotes}
                      onChange={e => setSessionNotes(e.target.value)}
                      placeholder="توضیحات پیشرفت کلاسی، نحوه ادای کلمات و آمادگی برای جلسه بعد..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                      <span>تکلیف محول شده برای جلسه آینده:</span>
                    </label>
                    <textarea
                      rows={3}
                      value={homeworkText}
                      onChange={e => setHomeworkText(e.target.value)}
                      placeholder="کاربرگ مربوط به درس، ضبط صدا یا مرور لغات جدید..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between pt-2">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اطلاعات کلاس و حضور و غیاب با موفقیت در پایگاه داده ثبت شد!</span>
                    </span>
                  )}
                  <button
                    onClick={handleSaveSessionData}
                    className="mr-auto px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black shadow-md shadow-purple-700/20 flex items-center gap-2 cursor-pointer transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>ثبت نهایی حضور و غیاب و گزارش جلسه</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                لطفاً یکی از کلاس‌های سمت راست را انتخاب فرمایید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Subjective Quiz Grading */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-black text-slate-800">
              آزمون‌های در انتظار بررسی ({toPersianDigits(pendingQuizAttempts.length)}):
            </h3>

            <div className="space-y-3">
              {pendingQuizAttempts.map(attempt => {
                const isSelected = selectedAttempt?.id === attempt.id;
                return (
                  <button
                    key={attempt.id}
                    onClick={() => {
                      setSelectedAttempt(attempt);
                      setGradedScoreInput(attempt.score || 80);
                    }}
                    className={`w-full text-right p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{attempt.studentName}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                        نیازمند بررسی تشریحی
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-700 font-bold">{attempt.quizTitle}</p>
                    <span className="text-[10px] text-slate-400 block">
                      تاریخ آزمون: {formatToJalali(attempt.completedAt)}
                    </span>
                  </button>
                );
              })}

              {pendingQuizAttempts.length === 0 && (
                <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  تمامی آزمون‌های تشریحی تا این لحظه بررسی و نمره‌دهی شده‌اند.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedAttempt ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                      بررسی پاسخ تشریحی
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                      {selectedAttempt.quizTitle}
                    </h2>
                    <p className="text-xs text-slate-500">
                      دانش‌آموز: {selectedAttempt.studentName}
                    </p>
                  </div>
                </div>

                {/* Subjective Questions to Review */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-800">پاسخ‌های تشریحی ثبت شده توسط دانش‌آموز:</h4>
                  {selectedAttempt.questionResults.map((qr, idx) => (
                    <div
                      key={qr.questionId}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800">سوال شماره {toPersianDigits(idx + 1)}</span>
                        <span className="text-[11px] text-slate-500">حداکثر امتیاز: {toPersianDigits(qr.maxPoints)}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-en text-slate-900 leading-relaxed">
                        {String(qr.userAnswer || 'بدون پاسخ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Score and Feedback Form */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">نمره نهایی این آزمون (درصد):</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={gradedScoreInput}
                        onChange={e => setGradedScoreInput(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm font-en font-black outline-none focus:border-purple-600 bg-white"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">یادداشت و توصیه تشویقی استاد:</label>
                    <textarea
                      rows={3}
                      value={teacherQuizFeedback}
                      onChange={e => setTeacherQuizFeedback(e.target.value)}
                      placeholder="بازخورد برای دانش‌آموز و والدین..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-600 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {quizGradeSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>نمره نهایی با موفقیت ثبت شد و به کارنامه دانش‌آموز افزوده گردید!</span>
                      </span>
                    )}
                    <button
                      onClick={handleSubmitQuizReview}
                      className="mr-auto px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black shadow-md shadow-purple-700/20 flex items-center gap-2 cursor-pointer transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تایید نهایی و ارسال نمره به کارنامه</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                لطفاً یکی از آزمون‌های در انتظار بررسی را انتخاب فرمایید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Homework Submissions Review */}
      {activeTab === 'homework' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-black text-slate-800">
              تکالیف ارسالی دانش‌آموزان ({toPersianDigits(homeworkSubmissions.length)}):
            </h3>

            <div className="space-y-3">
              {homeworkSubmissions.map(hw => {
                const isSelected = selectedHomework?.id === hw.id;
                return (
                  <button
                    key={hw.id}
                    onClick={() => {
                      setSelectedHomework(hw);
                      setHwScore(hw.score || 95);
                      setHwFeedback(hw.teacherFeedback || 'آفرین! تلاش بسیار خوبی بود.');
                    }}
                    className={`w-full text-right p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{hw.studentName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        hw.status === 'graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hw.status === 'graded' ? 'نمره‌دهی شد' : 'جدید (بررسی نشده)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 line-clamp-1">{hw.lessonTitle}</p>
                    <span className="text-[10px] text-slate-400 block">
                      ارسال: {formatToJalali(hw.submittedAt)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedHomework ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
                      بررسی تکلیف کلاسی
                    </span>
                    <h2 className="text-base font-black text-slate-900 mt-1">{selectedHomework.lessonTitle}</h2>
                    <p className="text-xs text-slate-500">دانش‌آموز: {selectedHomework.studentName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800">متن تکلیف ارسال شده:</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-en text-slate-900 leading-relaxed">
                    {selectedHomework.submissionText}
                  </div>
                </div>

                {/* Grading Controls */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">نمره تکلیف (از ۱۰۰):</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={hwScore}
                        onChange={e => setHwScore(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm font-en font-black outline-none focus:border-purple-600 bg-white"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">پیام و فیدبک تشویقی استاد:</label>
                    <textarea
                      rows={3}
                      value={hwFeedback}
                      onChange={e => setHwFeedback(e.target.value)}
                      placeholder="بازخورد برای دانش‌آموز..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-600 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {hwGradeSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>نمره و بازخورد تکلیف با موفقیت ثبت شد!</span>
                      </span>
                    )}
                    <button
                      onClick={handleSubmitHomeworkGrading}
                      className="mr-auto px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black shadow-md shadow-purple-700/20 flex items-center gap-2 cursor-pointer transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ثبت نمره تکلیف</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                لطفاً یکی از تکالیف ارسالی را انتخاب فرمایید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Course Materials Overview */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-800">سرفصل‌ها و جلسات دوره‌های آکادمی:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map(lesson => (
              <div
                key={lesson.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3"
              >
                <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md">
                  {lesson.moduleTitle || 'جلسه آموزشی'}
                </span>
                <h4 className="text-xs font-black text-slate-900">{lesson.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{lesson.summary}</p>

                {lesson.grammarFocus && (
                  <p className="text-[10px] text-indigo-700 bg-indigo-50 p-2 rounded-xl">
                    گرامر: {lesson.grammarFocus}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>مدت: {toPersianDigits(lesson.durationMinutes)} دقیقه</span>
                  <span>{toPersianDigits(lesson.vocabulary.length)} واژه کلیدی</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
