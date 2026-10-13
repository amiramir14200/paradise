import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  Award,
  Sparkles,
  Volume2,
  CheckCircle2,
  Circle,
  Play,
  Calendar,
  Clock,
  ExternalLink,
  Star,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  FileText,
  Send,
  HelpCircle,
  Download,
  Flame,
  Check,
  Eye,
  MessageSquare,
  ShoppingBag,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Course, Lesson, LiveClass, HomeworkSubmission } from '../../types';
import { formatToJalali, speakEnglish, toPersianDigits, formatPrice } from '../../utils/jalali';

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();
  const {
    courses,
    lessons,
    liveClasses,
    enrollments,
    orders,
    currency,
    quizzes,
    quizAttempts,
    setActiveQuizForModal,
    setIsPlacementModalOpen,
    toggleLessonCompletion,
    homeworkSubmissions,
    submitHomework
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'quizzes' | 'live' | 'exercises' | 'achievements' | 'orders'>('courses');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0] || null);
  const [showReadingTranslation, setShowReadingTranslation] = useState(false);
  const [homeworkInput, setHomeworkInput] = useState('');
  const [homeworkSubmittedMsg, setHomeworkSubmittedMsg] = useState(false);

  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, boolean>>({});

  // Active student identity
  const myStudentId = profile?.uid || 'demo-student-1';
  const myEnrollments = enrollments.filter(e => e.studentId === myStudentId && e.status === 'active');
  const enrolledCourseIds = myEnrollments.map(e => e.courseId);

  // If no enrollments yet, fallback to sample courses
  const myCourses = courses.filter(
    c => enrolledCourseIds.includes(c.id) || c.id === 'course-phonics-1' || c.id === 'course-junior-explorers-3'
  );

  // Active enrollment for current selected lesson's course
  const currentEnrollment = myEnrollments.find(e => e.courseId === selectedLesson?.courseId) || myEnrollments[0];
  const completedLessonIds = currentEnrollment?.completedLessonIds || [];

  // Live classes for student's courses
  const myLiveClasses = liveClasses.filter(
    l => myCourses.some(c => c.id === l.courseId) || l.enrolledStudentIds.includes(myStudentId)
  );

  // Student's quiz attempts
  const myQuizAttempts = quizAttempts.filter(
    a => a.studentId === myStudentId || a.studentId === 'demo-student-1'
  );

  // Homework submission for current selected lesson
  const currentLessonSubmission = homeworkSubmissions.find(
    h => h.lessonId === selectedLesson?.id && (h.studentId === myStudentId || h.studentId === 'demo-student-1')
  );

  // Age adaptive styles
  const isKid = profile?.ageBracket === '6-9';
  const isTeen = profile?.ageBracket === '13-17';

  const handleExerciseCheck = (exerciseId: string, answer: string, correct: string) => {
    setExerciseAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    setExerciseFeedback(prev => ({
      ...prev,
      [exerciseId]: answer.trim().toLowerCase() === correct.trim().toLowerCase()
    }));
  };

  const handleToggleCompletion = async () => {
    if (!selectedLesson || !currentEnrollment) return;
    await toggleLessonCompletion(currentEnrollment.id, selectedLesson.id);
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeworkInput.trim() || !selectedLesson) return;

    const newSub: HomeworkSubmission = {
      id: `hw-${Date.now()}`,
      lessonId: selectedLesson.id,
      lessonTitle: selectedLesson.title,
      courseId: selectedLesson.courseId,
      studentId: myStudentId,
      studentName: profile?.fullName || 'کیان رضایی (دانش‌آموز)',
      submissionText: homeworkInput.trim(),
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    await submitHomework(newSub);
    setHomeworkInput('');
    setHomeworkSubmittedMsg(true);
    setTimeout(() => setHomeworkSubmittedMsg(false), 3000);
  };

  // Calculate course completion percentage
  const courseLessons = selectedLesson ? lessons.filter(l => l.courseId === selectedLesson.courseId) : [];
  const completedCount = courseLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const progressPercent = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;

  // Find course quiz if exists
  const courseQuiz = quizzes.find(q => q.courseId === selectedLesson?.courseId);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-right">
      {/* Student Welcome Header */}
      <div
        className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
          isKid
            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
            : isTeen
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-orange-950'
            : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700'
        }`}
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-xs p-1 border-2 border-white/40 shrink-0">
            <img
              src={profile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${myStudentId}`}
              alt={profile?.fullName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                دانش‌آموز رده {profile?.ageBracket || '۶-۹'} سال
              </span>
              {profile?.guardianName && (
                <span className="text-white/80 text-[11px] flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>ولی متصل: {profile.guardianName}</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-3xl font-black">{profile?.fullName || 'کیان رضایی عزیز'}</h1>
            <p className="text-xs sm:text-sm text-white/90">
              {isKid
                ? 'آماده‌ای برای ماجراجویی امروز با الفبا و انیمیشن‌های شاد؟'
                : 'به میز کار زبان‌آموزی خود در آکادمی پارادایس خوش آمدید.'}
            </p>
          </div>
        </div>

        {/* Gamified Stars & Streaks */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-300">
              <Star className="w-4 h-4 fill-amber-300" />
              <span className="text-lg font-black font-en">{toPersianDigits('24')}</span>
            </div>
            <span className="text-[10px] text-white/80 font-bold">ستاره‌های کسب شده</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-200">
              <Sparkles className="w-4 h-4" />
              <span className="text-lg font-black font-en">{toPersianDigits('5')}</span>
            </div>
            <span className="text-[10px] text-white/80 font-bold">روز زنجیره یادگیری</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'courses' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>دوره‌ها و سرفصل‌ها ({toPersianDigits(myCourses.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'quizzes' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>آزمون‌ها و کوئیزها ({toPersianDigits(quizzes.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'live' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>کلاس‌های زنده اسکای‌روم ({toPersianDigits(myLiveClasses.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'exercises' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>کارگاه لغات و تلفظ صوتی</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'achievements' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>کارنامه، مدال‌ها و گواهی‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer shrink-0 ${
            activeTab === 'orders' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>سفارشات و رسیدهای من</span>
        </button>
      </div>

      {/* Tab 1: Courses, Modules & Interactive Learning Path Player */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Enrolled Courses & Lesson Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-black text-slate-800">مسیرهای یادگیری من:</h3>
            <div className="space-y-4">
              {myCourses.map(course => {
                const cLessons = lessons.filter(l => l.courseId === course.id);
                const cCompleted = cLessons.filter(l => completedLessonIds.includes(l.id)).length;
                const cPercent = cLessons.length > 0 ? Math.round((cCompleted / cLessons.length) * 100) : 0;

                return (
                  <div key={course.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{course.title}</span>
                      <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-md">
                        مدرس: {course.instructorName}
                      </span>
                    </div>

                    {/* Course Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span>پیشرفت دوره:</span>
                        <span>{toPersianDigits(cPercent)}٪ تکمیل شده</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${cPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Lessons list under this course */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">جلسات و ماژول‌ها:</span>
                      {cLessons.map(lesson => {
                        const isDone = completedLessonIds.includes(lesson.id);
                        const isCurrent = selectedLesson?.id === lesson.id;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-right p-3 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isDone ? (
                                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : 'text-emerald-500'}`} />
                              ) : (
                                <Circle className={`w-4 h-4 shrink-0 opacity-40`} />
                              )}
                              <span className="line-clamp-1">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] opacity-80 shrink-0">
                              {toPersianDigits(lesson.durationMinutes)} دقیقه
                            </span>
                          </button>
                        );
                      })}

                      {/* Course Quiz CTA */}
                      {courseQuiz && (
                        <button
                          onClick={() => setActiveQuizForModal(courseQuiz)}
                          className="w-full mt-2 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 flex items-center justify-center gap-2 cursor-pointer transition"
                        >
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>شرکت در آزمون پایان فصل: {courseQuiz.title}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Lesson Player */}
          <div className="lg:col-span-7">
            {selectedLesson ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                {/* Lesson Header */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg">
                        {selectedLesson.moduleTitle || 'جلسه آموزشی فعال'}
                      </span>
                      <span className="text-xs text-slate-400">
                        مدت: {toPersianDigits(selectedLesson.durationMinutes)} دقیقه
                      </span>
                    </div>

                    {/* Mark as Completed Button */}
                    <button
                      onClick={handleToggleCompletion}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        completedLessonIds.includes(selectedLesson.id)
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>
                        {completedLessonIds.includes(selectedLesson.id) ? 'تکمیل شده ✓' : 'علامت به عنوان خوانده شده'}
                      </span>
                    </button>
                  </div>

                  <h2 className="text-xl font-black text-slate-900">{selectedLesson.title}</h2>
                  <p className="text-xs text-slate-400 font-en">{selectedLesson.titleEn}</p>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800">خلاصه این جلسه:</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedLesson.summary}
                  </p>
                </div>

                {/* Grammar Focus if available */}
                {selectedLesson.grammarFocus && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                    <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      نکته کلیدی گرامر و ساختار جمله:
                    </span>
                    <p className="text-xs text-indigo-950 leading-relaxed font-bold">
                      {selectedLesson.grammarFocus}
                    </p>
                  </div>
                )}

                {/* Reading & Listening Section with Translation Toggle */}
                {selectedLesson.readingText && (
                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        متن ریدینگ و داستان انگلیسی (Reading Practice):
                      </span>
                      <button
                        onClick={() => setShowReadingTranslation(!showReadingTranslation)}
                        className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showReadingTranslation ? 'مخفی کردن ترجمه فارسی' : 'نمایش ترجمه فارسی'}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-en text-slate-800 leading-loose bg-white p-4 rounded-xl border border-amber-200">
                      {selectedLesson.readingText}
                    </p>

                    {showReadingTranslation && selectedLesson.readingTranslation && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-amber-100/40 p-3 rounded-xl border border-amber-200">
                        ترجمه فارسی: {selectedLesson.readingTranslation}
                      </p>
                    )}

                    {selectedLesson.listeningPrompt && (
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-200 text-xs">
                        <span className="text-slate-700 font-en italic line-clamp-1">
                          {selectedLesson.listeningPrompt}
                        </span>
                        <button
                          onClick={() => speakEnglish(selectedLesson.readingText || selectedLesson.listeningPrompt!)}
                          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>گوش دادن صوتی</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Vocabulary Flashcards with Web Speech Pronunciation */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-orange-500" />
                    واژگان کلیدی این درس (با کلیک روی بلندگو تلفظ را گوش دهید):
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLesson.vocabulary.map(vocab => (
                      <div
                        key={vocab.id}
                        className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black font-en text-slate-900">{vocab.word}</span>
                            {vocab.phonetic && (
                              <span className="text-[11px] text-slate-400 font-en font-normal">{vocab.phonetic}</span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-orange-800">{vocab.translation}</p>
                          <p className="text-[11px] text-slate-500 font-en mt-1 italic">{vocab.example}</p>
                          <p className="text-[10px] text-slate-400">{vocab.exampleFa}</p>
                        </div>

                        <button
                          onClick={() => speakEnglish(vocab.word)}
                          className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition transform hover:scale-105"
                          title="پخش تلفظ انگلیسی"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Files (Worksheets / PDF) */}
                {selectedLesson.resourceFiles && selectedLesson.resourceFiles.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-slate-500" />
                      فایل‌های تمرینی و کاربرگ‌های آموزشی:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLesson.resourceFiles.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-orange-500" />
                          <span>{res.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Homework Submission Box */}
                {selectedLesson.homeworkPrompt && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-orange-500" />
                        تکلیف این جلسه (ارسال به استاد):
                      </h4>
                      {currentLessonSubmission && (
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          currentLessonSubmission.status === 'graded'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {currentLessonSubmission.status === 'graded' ? 'نمره‌دهی شد ✓' : 'ارسال شده (در انتظار بررسی استاد)'}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                      {selectedLesson.homeworkPrompt}
                    </p>

                    {/* Teacher Feedback if graded */}
                    {currentLessonSubmission?.teacherFeedback && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                        <span className="font-black text-emerald-900 block">
                          بازخورد استاد: (نمره: {toPersianDigits(currentLessonSubmission.score || 100)} از ۱۰۰)
                        </span>
                        <p className="text-emerald-800">{currentLessonSubmission.teacherFeedback}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmitHomework} className="space-y-2 pt-1">
                      <textarea
                        rows={3}
                        value={homeworkInput}
                        onChange={e => setHomeworkInput(e.target.value)}
                        placeholder="متن پاسخ یا تکلیف خود را بنویسید..."
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none text-xs bg-white"
                      />
                      <div className="flex items-center justify-between">
                        {homeworkSubmittedMsg && (
                          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            <span>تکلیف با موفقیت برای معلم ارسال شد!</span>
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={!homeworkInput.trim()}
                          className="mr-auto px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-black shadow-xs cursor-pointer transition flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>ثبت و ارسال تکلیف</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
                لطفاً یکی از جلسات را برای شروع مطالعه انتخاب فرمایید.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Quizzes & Exams */}
      {activeTab === 'quizzes' && (
        <div className="space-y-8">
          {/* Available Quizzes */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800">آزمون‌ها و کوئیزهای در دسترس:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(quiz => (
                <div
                  key={quiz.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        {quiz.mode === 'exam' ? 'آزمون زمان‌دار' : 'خودآزمایی'}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{toPersianDigits(quiz.timeLimitMinutes)} دقیقه</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{quiz.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{quiz.description}</p>

                    <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      <span>تعداد سوالات: {toPersianDigits(quiz.questions.length)}</span>
                      <span>•</span>
                      <span>نصاب قبولی: {toPersianDigits(quiz.passingScore)}٪</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveQuizForModal(quiz)}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-xs cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>شروع کوئیز</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Past Attempts History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              تاریخچه نتایج کوئیزها و آزمون‌های شما:
            </h3>

            {myQuizAttempts.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {myQuizAttempts.map(attempt => (
                  <div key={attempt.id} className="py-3.5 flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900">{attempt.quizTitle}</h4>
                      <span className="text-[11px] text-slate-400">
                        تاریخ شرکت: {formatToJalali(attempt.completedAt)}
                      </span>
                      {attempt.teacherReviewNotes && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md">
                          نظر استاد: {attempt.teacherReviewNotes}
                        </p>
                      )}
                    </div>

                    <div className="text-left space-y-1">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          attempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {attempt.status === 'pending_teacher_review'
                          ? 'در انتظار بررسی استاد'
                          : attempt.passed
                          ? 'قبول شدید'
                          : 'مردود'}
                      </span>
                      <span className="block text-sm font-black text-slate-900 font-en">
                        {toPersianDigits(attempt.score)}٪
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                هنوز در هیچ کوئیزی شرکت نکرده‌اید. با انتخاب یکی از کوئیزهای بالا شروع کنید!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Live Online Classes */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800">برنامه کلاس‌های زنده اسکای‌روم (به وقت تهران)</h3>
            <span className="text-xs text-orange-600 font-bold">لینک ورود ۱۰ دقیقه قبل از جلسه فعال می‌شود</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLiveClasses.map(liveClass => (
              <div
                key={liveClass.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                      {liveClass.courseTitle}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                      {toPersianDigits(liveClass.durationMinutes)} دقیقه
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 leading-snug">{liveClass.title}</h4>

                  <div className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>{formatToJalali(liveClass.scheduledAt, true)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                      <span>استاد: {liveClass.teacherName}</span>
                    </div>
                  </div>

                  {liveClass.sessionNotes && (
                    <p className="text-[11px] text-slate-600 bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                      یادداشت استاد: {liveClass.sessionNotes}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <a
                    href={liveClass.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Video className="w-4 h-4" />
                    <span>ورود به کلاس آنلاین اسکای‌روم</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Vocabulary & Pronunciation Trainer */}
      {activeTab === 'exercises' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">بانک جامع واژگان و تلفظ صوتی هوشمند</h3>
              <p className="text-xs text-slate-500">
                روی هر کلمه کلیک کنید تا تلفظ استاندارد را با متد زبان مادری تمرین کنید.
              </p>
            </div>
            <button
              onClick={() => setIsPlacementModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold cursor-pointer"
            >
              شرکت در تعیین سطح
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lessons.flatMap(l => l.vocabulary).map(vocab => (
              <div
                key={vocab.id}
                className="bg-slate-50 hover:bg-orange-50/60 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 transition space-y-2 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-black font-en text-slate-900">{vocab.word}</span>
                  <p className="text-xs font-bold text-slate-600">{vocab.translation}</p>
                  {vocab.phonetic && <span className="text-[10px] text-slate-400 font-en">{vocab.phonetic}</span>}
                </div>

                <button
                  onClick={() => speakEnglish(vocab.word)}
                  className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-xs cursor-pointer transition"
                  title="پخش تلفظ صوتی"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Achievements & Badges */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-black text-slate-800">نشان قهرمان فونیکس</h4>
              <p className="text-xs text-slate-500">پایان موفقیت‌آمیز آزمون تلفظ ۲۶ حرف الفبای انگلیسی</p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                کسب شده در ترم جاری
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
                <Star className="w-8 h-8 fill-orange-500" />
              </div>
              <h4 className="text-sm font-black text-slate-800">نشان زبان‌آموز کوشا</h4>
              <p className="text-xs text-slate-500">حضور منظم و بدون غیبت در ۵ جلسه آنلاین متوالی</p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                کسب شده با حضور فعال
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-black text-slate-800">گواهی تعیین سطح رسمی</h4>
              <p className="text-xs text-slate-500">تایید سطح آموزشی توسط سیستم ارزیابی هوشمند پارادایس</p>
              <button
                onClick={() => setIsPlacementModalOpen(true)}
                className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
              >
                مشاهده کارنامه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Orders & Payment Receipts */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              فاکتورها و سوابق ثبت‌نام دوره‌های شما
            </h3>
            <span className="text-xs text-slate-500">
              {toPersianDigits(orders.filter(o => o.studentId === myStudentId).length)} سفارش ثبت شده
            </span>
          </div>

          <div className="space-y-4">
            {orders
              .filter(o => o.studentId === myStudentId)
              .map(order => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-bold">شماره سفارش:</span>
                        <span className="font-mono font-black text-slate-900 text-xs" dir="ltr">
                          {order.orderNumber}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{order.courseTitle}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          order.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'awaiting_manual_verification'
                            ? 'bg-amber-100 text-amber-900'
                            : order.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status === 'paid'
                          ? 'پرداخت شده و فعال ✓'
                          : order.status === 'awaiting_manual_verification'
                          ? 'در انتظار بررسی واحد مالی'
                          : order.status === 'rejected'
                          ? 'رد شده توسط حسابداری'
                          : 'معلق'}
                      </span>

                      <span className="text-base font-black text-orange-600">
                        {order.finalAmount === 0 ? 'رایگان' : formatPrice(order.finalAmount, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">روش پرداخت:</span>
                      <span className="font-bold">
                        {order.paymentMethod === 'online'
                          ? 'درگاه پرداخت زرین‌پال'
                          : order.paymentMethod === 'card_to_card'
                          ? 'کارت به کارت'
                          : 'بورسیه'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">کد پیگیری / شناسه مرجع:</span>
                      <span className="font-mono font-bold">
                        {order.manualTrackingCode || order.gatewayRefId || '---'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">تاریخ ثبت:</span>
                      <span>{formatToJalali(order.createdAt)}</span>
                    </div>
                  </div>

                  {order.adminReviewNote && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold block text-slate-900">یادداشت واحد مالی:</span>
                      <p>{order.adminReviewNote}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>چاپ رسید سفارش</span>
                    </button>
                  </div>
                </div>
              ))}

            {orders.filter(o => o.studentId === myStudentId).length === 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-400">هنوز سفارشی برای شما ثبت نشده است.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
