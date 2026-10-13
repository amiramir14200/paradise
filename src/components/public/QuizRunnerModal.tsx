import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  Sparkles,
  RefreshCw,
  Clock,
  Volume2,
  HelpCircle,
  Check,
  FileQuestion,
  UserCheck,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Quiz, QuizQuestion, QuizAttempt, CourseLevel } from '../../types';
import { gradeQuizSubmission } from '../../services/dataService';
import { toPersianDigits, speakEnglish } from '../../utils/jalali';

export const QuizRunnerModal: React.FC = () => {
  const {
    isPlacementModalOpen,
    setIsPlacementModalOpen,
    activeQuizForModal,
    setActiveQuizForModal,
    quizzes,
    courses,
    setSelectedCourseForCheckout,
    saveQuizAttempt
  } = useApp();

  const { profile } = useAuth();

  // Determine current active quiz
  const currentQuiz: Quiz | null = useMemo(() => {
    if (activeQuizForModal) return activeQuizForModal;
    if (isPlacementModalOpen) {
      return quizzes.find(q => q.isPlacementTest) || quizzes[0] || null;
    }
    return null;
  }, [activeQuizForModal, isPlacementModalOpen, quizzes]);

  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [finalAttempt, setFinalAttempt] = useState<QuizAttempt | null>(null);

  // Matching question state: selected left key
  const [selectedMatchLeft, setSelectedMatchLeft] = useState<string | null>(null);

  // Timer state for Exam Mode
  const timeLimitSeconds = (currentQuiz?.timeLimitMinutes || 15) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(timeLimitSeconds);
  const isExamMode = currentQuiz?.mode === 'exam';

  // Questions list (optionally shuffled in exam mode)
  const questions: QuizQuestion[] = useMemo(() => {
    if (!currentQuiz) return [];
    if (currentQuiz.shuffleQuestions && currentQuiz.mode === 'exam') {
      return [...currentQuiz.questions].sort(() => 0.5 - Math.random());
    }
    return currentQuiz.questions;
  }, [currentQuiz]);

  // Reset state when quiz changes or modal opens
  useEffect(() => {
    if (currentQuiz) {
      setCurrentStep(0);
      setUserAnswers({});
      setCheckedQuestions({});
      setIsFinished(false);
      setFinalAttempt(null);
      setSelectedMatchLeft(null);
      setSecondsRemaining((currentQuiz.timeLimitMinutes || 15) * 60);
    }
  }, [currentQuiz?.id]);

  // Exam countdown timer
  useEffect(() => {
    if (!currentQuiz || !isExamMode || isFinished) return;

    if (secondsRemaining <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuiz, isExamMode, isFinished, secondsRemaining]);

  if (!currentQuiz || (!isPlacementModalOpen && !activeQuizForModal)) {
    return null;
  }

  const currentQ = questions[currentStep];

  const handleClose = () => {
    setIsPlacementModalOpen(false);
    setActiveQuizForModal(null);
  };

  const handleAnswerChange = (questionId: string, val: any) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  // Multiple-select toggle
  const handleMultipleSelectToggle = (questionId: string, optionIdx: number) => {
    const currentList: number[] = userAnswers[questionId] || [];
    const updated = currentList.includes(optionIdx)
      ? currentList.filter(i => i !== optionIdx)
      : [...currentList, optionIdx];
    handleAnswerChange(questionId, updated);
  };

  // Matching pair selection
  const handleMatchSelect = (questionId: string, leftItem: string, rightItem: string) => {
    const currentMatches: Record<string, string> = userAnswers[questionId] || {};
    const updated = { ...currentMatches, [leftItem]: rightItem };
    handleAnswerChange(questionId, updated);
    setSelectedMatchLeft(null);
  };

  const removeMatch = (questionId: string, leftItem: string) => {
    const currentMatches: Record<string, string> = { ...(userAnswers[questionId] || {}) };
    delete currentMatches[leftItem];
    handleAnswerChange(questionId, currentMatches);
  };

  const handleCheckPracticeQuestion = (questionId: string) => {
    setCheckedQuestions(prev => ({ ...prev, [questionId]: true }));
  };

  const handleFinishQuiz = async () => {
    if (!currentQuiz) return;

    const grading = gradeQuizSubmission(currentQuiz, userAnswers);

    let recommended: CourseLevel | undefined = undefined;
    if (currentQuiz.isPlacementTest) {
      if (grading.score >= 80) recommended = 'upper-intermediate';
      else if (grading.score >= 60) recommended = 'intermediate';
      else if (grading.score >= 40) recommended = 'elementary';
      else recommended = 'starter';
    }

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: currentQuiz.id,
      quizTitle: currentQuiz.title,
      studentId: profile?.uid || 'demo-student-1',
      studentName: profile?.fullName || 'کیان رضایی (دانش‌آموز)',
      score: grading.score,
      totalPoints: grading.totalPoints,
      totalQuestions: questions.length,
      passed: grading.passed,
      status: grading.status,
      questionResults: grading.questionResults,
      recommendedLevel: recommended,
      completedAt: new Date().toISOString()
    };

    setFinalAttempt(attempt);
    setIsFinished(true);

    await saveQuizAttempt(attempt);
  };

  const minutesLeft = Math.floor(secondsRemaining / 60);
  const secondsLeft = secondsRemaining % 60;
  const timerPercent = (secondsRemaining / timeLimitSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-right my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-5 sm:p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                {currentQuiz.isPlacementTest ? (
                  <Compass className="w-5 h-5 text-white" />
                ) : (
                  <Award className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black">{currentQuiz.title}</h2>
                  <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                    {isExamMode ? 'آزمون رسمی زمان‌دار' : 'کارگاه خودآزمایی'}
                  </span>
                </div>
                <p className="text-xs text-amber-100 line-clamp-1">{currentQuiz.description}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition cursor-pointer shrink-0"
              title="بستن پنجره"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Exam Mode Timer bar */}
          {isExamMode && !isFinished && (
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 text-white">
                <Clock className="w-4 h-4 text-amber-200 animate-pulse" />
                <span>زمان باقیمانده:</span>
                <span className="font-en text-sm bg-black/20 px-2 py-0.5 rounded-md" dir="ltr">
                  {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
                </span>
              </div>
              <span className="text-amber-100 text-[11px]">
                نصاب قبولی: {toPersianDigits(currentQuiz.passingScore)}٪
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {!isFinished ? (
            <>
              {/* Progress step bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>
                    سوال {toPersianDigits(currentStep + 1)} از {toPersianDigits(questions.length)}
                  </span>
                  <span className="text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    {currentQ.points || 10} امتیاز
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Question Card */}
              {currentQ && (
                <div className="space-y-4">
                  {/* Prompt & Audio Pronunciation */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 leading-relaxed">
                          {currentQ.prompt}
                        </h3>
                        {currentQ.promptEn && (
                          <p className="text-xs text-slate-400 font-en mt-1">{currentQ.promptEn}</p>
                        )}
                      </div>

                      {currentQ.audioWord && (
                        <button
                          onClick={() => speakEnglish(currentQ.audioWord!)}
                          className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xs cursor-pointer transition shrink-0"
                          title="پخش تلفظ صوتی"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 1. Multiple Choice */}
                  {currentQ.type === 'multiple-choice' && currentQ.options && (
                    <div className="space-y-2.5">
                      {currentQ.options.map((opt, idx) => {
                        const isSelected = userAnswers[currentQ.id] === idx;
                        const isChecked = checkedQuestions[currentQ.id];
                        const isCorrectOpt = idx === currentQ.correctAnswerIndex;

                        let borderClass = 'border-slate-200 hover:border-orange-300 bg-white';
                        if (isSelected) {
                          borderClass = 'border-orange-500 bg-orange-50 text-orange-950 font-bold';
                        }
                        if (isChecked) {
                          if (isCorrectOpt) {
                            borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                          } else if (isSelected && !isCorrectOpt) {
                            borderClass = 'border-red-500 bg-red-50 text-red-900 font-bold';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerChange(currentQ.id, idx)}
                            className={`w-full p-4 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${borderClass}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-en font-black text-slate-600">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-xs sm:text-sm font-en">{opt}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-orange-600" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. Multiple Select */}
                  {currentQ.type === 'multiple-select' && currentQ.options && (
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-amber-700 font-bold">
                        (می‌توانید بیش از یک گزینه را تیک بزنید)
                      </p>
                      {currentQ.options.map((opt, idx) => {
                        const selectedList: number[] = userAnswers[currentQ.id] || [];
                        const isSelected = selectedList.includes(idx);

                        return (
                          <button
                            key={idx}
                            onClick={() => handleMultipleSelectToggle(currentQ.id, idx)}
                            className={`w-full p-4 rounded-2xl border text-right transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                                : 'border-slate-200 hover:border-orange-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                  isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-xs sm:text-sm font-en">{opt}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 3. True / False */}
                  {currentQ.type === 'true-false' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleAnswerChange(currentQ.id, true)}
                        className={`p-5 rounded-2xl border text-center transition cursor-pointer font-black text-sm ${
                          userAnswers[currentQ.id] === true
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        درست (True)
                      </button>
                      <button
                        onClick={() => handleAnswerChange(currentQ.id, false)}
                        className={`p-5 rounded-2xl border text-center transition cursor-pointer font-black text-sm ${
                          userAnswers[currentQ.id] === false
                            ? 'bg-red-500 text-white border-red-500 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        نادرست (False)
                      </button>
                    </div>
                  )}

                  {/* 4. Fill in the Blank / Short Answer */}
                  {(currentQ.type === 'fill-in-the-blank' || currentQ.type === 'short-answer') && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={userAnswers[currentQ.id] || ''}
                        onChange={e => handleAnswerChange(currentQ.id, e.target.value)}
                        placeholder="پاسخ خود را به انگلیسی تایپ کنید..."
                        className="w-full p-4 rounded-2xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-left font-en text-sm"
                        dir="ltr"
                      />
                    </div>
                  )}

                  {/* 5. Matching Pairs */}
                  {currentQ.type === 'matching' && currentQ.matchingPairs && (
                    <div className="space-y-4">
                      <p className="text-[11px] text-slate-500 font-bold">
                        ابتدا روی کلمه ستون راست کلیک کنید، سپس معادل یا متضاد آن را از ستون چپ انتخاب کنید:
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Left column */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-400 block mb-1">کلمات ردیف اول:</span>
                          {currentQ.matchingPairs.map(pair => {
                            const isMatched = !!(userAnswers[currentQ.id] && userAnswers[currentQ.id][pair.left]);
                            const isSelected = selectedMatchLeft === pair.left;

                            return (
                              <button
                                key={pair.left}
                                onClick={() => setSelectedMatchLeft(pair.left)}
                                className={`w-full p-3 rounded-xl border text-xs font-bold font-en text-center cursor-pointer transition ${
                                  isSelected
                                    ? 'border-orange-500 bg-orange-100 text-orange-900 ring-2 ring-orange-400'
                                    : isMatched
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                              >
                                {pair.left}
                              </button>
                            );
                          })}
                        </div>

                        {/* Right column */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-slate-400 block mb-1">کلمات ردیف دوم:</span>
                          {currentQ.matchingPairs.map(pair => (
                            <button
                              key={pair.right}
                              disabled={!selectedMatchLeft}
                              onClick={() => {
                                if (selectedMatchLeft) {
                                  handleMatchSelect(currentQ.id, selectedMatchLeft, pair.right);
                                }
                              }}
                              className={`w-full p-3 rounded-xl border text-xs font-bold font-en text-center transition ${
                                selectedMatchLeft
                                  ? 'border-orange-300 hover:bg-orange-50 text-slate-800 cursor-pointer'
                                  : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {pair.right}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Display matched pairs */}
                      {userAnswers[currentQ.id] && Object.keys(userAnswers[currentQ.id]).length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-500 block">اتصال‌های ثبت شده شما:</span>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(userAnswers[currentQ.id]).map(([l, r]) => (
                              <div
                                key={l}
                                className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-en"
                              >
                                <span>{l} ↔ {String(r)}</span>
                                <button
                                  onClick={() => removeMatch(currentQ.id, l)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer"
                                  title="حذف اتصال"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 6. Teacher-Graded Subjective */}
                  {currentQ.type === 'teacher-graded' && (
                    <div className="space-y-3">
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>این پاسخ پس از ارسال مستقیماً توسط استاد بررسی و نمره‌دهی خواهد شد.</span>
                      </div>
                      <textarea
                        rows={4}
                        value={userAnswers[currentQ.id] || ''}
                        onChange={e => handleAnswerChange(currentQ.id, e.target.value)}
                        placeholder="متن نگارش یا خلاصه صحبت‌های خود را اینجا به انگلیسی وارد کنید..."
                        className="w-full p-4 rounded-2xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-left font-en text-xs sm:text-sm"
                        dir="ltr"
                      />
                    </div>
                  )}

                  {/* Practice Mode immediate check button & explanation */}
                  {!isExamMode && (
                    <div className="pt-2">
                      {!checkedQuestions[currentQ.id] ? (
                        <button
                          onClick={() => handleCheckPracticeQuestion(currentQ.id)}
                          disabled={userAnswers[currentQ.id] === undefined}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>بررسی پاسخ و راهنما</span>
                        </button>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="text-[11px] font-black text-slate-800 block">توضیحات آموزشی:</span>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {currentQ.explanationFa || 'پاسخ شما با موفقیت ثبت شد.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            finalAttempt && (
              <div className="space-y-6 text-center">
                <div
                  className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-md ${
                    finalAttempt.passed
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {finalAttempt.passed ? (
                    <Award className="w-10 h-10" />
                  ) : (
                    <Sparkles className="w-10 h-10" />
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {finalAttempt.passed ? 'تبریک! آزمون را با موفقیت گذراندید' : 'تلاش خوبی بود! نیاز به کمی تمرین بیشتر'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    نتیجه شما در سیستم آموزشی پارادایس ثبت و ذخیره گردید.
                  </p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-2xl font-black text-orange-600 font-en">
                      {toPersianDigits(finalAttempt.score)}٪
                    </span>
                    <span className="block text-[11px] text-slate-500 font-bold mt-1">نمره کسب شده</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-2xl font-black text-slate-800 font-en">
                      {toPersianDigits(finalAttempt.totalPoints)}
                    </span>
                    <span className="block text-[11px] text-slate-500 font-bold mt-1">مجموع امتیاز</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className={`text-sm font-black inline-block mt-1 ${
                      finalAttempt.status === 'pending_teacher_review' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {finalAttempt.status === 'pending_teacher_review'
                        ? 'در انتظار بررسی استاد'
                        : finalAttempt.passed
                        ? 'قبول شده'
                        : 'مردود'}
                    </span>
                    <span className="block text-[11px] text-slate-500 font-bold mt-1">وضعیت نهایی</span>
                  </div>
                </div>

                {/* Teacher Review Notice */}
                {finalAttempt.status === 'pending_teacher_review' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-right space-y-1">
                    <div className="flex items-center gap-2 text-amber-900 text-xs font-black">
                      <UserCheck className="w-4 h-4 text-amber-600" />
                      <span>یادداشت بررسی سوالات تشریحی:</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      این کوئیز شامل سوالات گفتاری/تشریحی بود. استاد شما پاسخ‌ها را بررسی کرده و نتیجه بازنگری در پنل کاربری شما نمایش داده خواهد شد.
                    </p>
                  </div>
                )}

                {/* Placement Recommendation if applicable */}
                {finalAttempt.recommendedLevel && (
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-right space-y-3">
                    <div className="flex items-center gap-2 text-orange-900 font-black text-sm">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      <span>سطح پیشنهادی سیستم آکادمی پارادایس:</span>
                    </div>
                    <p className="text-xs text-orange-800">
                      بر اساس تحلیل عملکرد شما، دوره مناسب رده سنی شما سطح{' '}
                      <span className="font-bold underline font-en">{finalAttempt.recommendedLevel}</span> تشخیص داده شد.
                    </p>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => {
                          handleClose();
                          const target = courses.find(c => c.level === finalAttempt.recommendedLevel);
                          if (target) setSelectedCourseForCheckout(target);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-xs cursor-pointer transition flex items-center gap-1.5"
                      >
                        <span>مشاهده و ثبت‌نام در دوره پیشنهادی</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Question Breakdown Accordion */}
                <div className="text-right space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-800">ریز نتایج و پاسخ‌های تشریحی:</h4>
                  <div className="space-y-2">
                    {finalAttempt.questionResults.map((qr, idx) => (
                      <div
                        key={qr.questionId}
                        className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                          qr.needsTeacherReview
                            ? 'bg-amber-50/60 border-amber-200'
                            : qr.isCorrect
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-red-50/60 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>سوال {toPersianDigits(idx + 1)}</span>
                          <span>
                            {qr.needsTeacherReview
                              ? 'نیازمند تصحیح معلم'
                              : `${toPersianDigits(qr.pointsEarned)} از ${toPersianDigits(qr.maxPoints)} امتیاز`}
                          </span>
                        </div>
                        {qr.feedback && (
                          <p className="text-[11px] text-slate-600">{qr.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          {!isFinished ? (
            <>
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition"
              >
                <ArrowRight className="w-4 h-4" />
                <span>سوال قبلی</span>
              </button>

              {currentStep < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5 transition"
                >
                  <span>سوال بعدی</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>پایان و ثبت آزمون</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer"
            >
              بستن و بازگشت به داشبورد
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
