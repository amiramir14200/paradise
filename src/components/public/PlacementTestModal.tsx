import React, { useState } from 'react';
import { X, Compass, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Award, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CourseLevel, QuizAttempt } from '../../types';
import { toPersianDigits } from '../../utils/jalali';

export const PlacementTestModal: React.FC = () => {
  const { isPlacementModalOpen, setIsPlacementModalOpen, quizzes, courses, setSelectedCourseForCheckout, saveQuizAttempt } = useApp();
  const { profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const placementQuiz = quizzes.find((q) => q.isPlacementTest) || quizzes[0];
  if (!isPlacementModalOpen || !placementQuiz) return null;

  const questions = placementQuiz.questions;
  const currentQuestion = questions[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    let recommended: CourseLevel = 'starter';
    if (scorePercentage >= 80) recommended = 'upper-intermediate';
    else if (scorePercentage >= 60) recommended = 'intermediate';
    else if (scorePercentage >= 40) recommended = 'elementary';
    else recommended = 'starter';

    setIsFinished(true);

    if (profile) {
      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        quizId: placementQuiz.id,
        quizTitle: placementQuiz.title,
        studentId: profile.uid,
        studentName: profile.fullName,
        score: scorePercentage,
        totalPoints: 100,
        totalQuestions: questions.length,
        passed: scorePercentage >= 60,
        status: 'graded',
        questionResults: [],
        recommendedLevel: recommended,
        completedAt: new Date().toISOString()
      };
      await saveQuizAttempt(attempt);
    }
  };

  const resetTest = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setIsFinished(false);
  };

  // Calculate results
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswerIndex) {
      correctCount++;
    }
  });
  const score = Math.round((correctCount / questions.length) * 100);

  let recommendedLevel: CourseLevel = 'starter';
  let recommendedLevelFa = 'مقدماتی و فونیکس (Starter)';
  if (score >= 80) {
    recommendedLevel = 'upper-intermediate';
    recommendedLevelFa = 'پیشرفته و مکالمه روان (Upper-Intermediate)';
  } else if (score >= 60) {
    recommendedLevel = 'intermediate';
    recommendedLevelFa = 'متوسط و گرامر کاربردی (Intermediate)';
  } else if (score >= 40) {
    recommendedLevel = 'elementary';
    recommendedLevelFa = 'پایه و داستان‌خوانی (Elementary)';
  }

  const recommendedCourse = courses.find((c) => c.level === recommendedLevel && c.isPublished);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-right my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black">{placementQuiz.title}</h2>
              <p className="text-xs text-amber-100">ارزیابی آنلاین و هوشمند ۵ سواله برای تعیین سطح دقیق</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsPlacementModalOpen(false);
              resetTest();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {!isFinished ? (
          <div className="p-6 space-y-6">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span>سوال {toPersianDigits(currentStep + 1)} از {toPersianDigits(questions.length)}</span>
                <span dir="ltr">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <div className="bg-orange-50/60 p-5 rounded-2xl border border-orange-100 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">
                  نوع: {currentQuestion.type === 'multiple-choice' ? 'چهارگزینه‌ای' : 'ارزیابی هوشمند'}
                </span>
                <h3 className="text-base font-black text-slate-900 leading-normal">
                  {currentQuestion.prompt}
                </h3>
                {currentQuestion.promptEn && (
                  <p className="text-xs font-semibold text-slate-500 font-en" dir="ltr">
                    {currentQuestion.promptEn}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options?.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-right transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-black shadow-xs'
                          : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50 text-slate-700 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {toPersianDigits(idx + 1)}
                        </span>
                        <span className="text-xs sm:text-sm font-en">{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 transition ${
                  currentStep === 0 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                سوال قبلی
              </button>

              <button
                disabled={selectedAnswers[currentStep] === undefined}
                onClick={handleNext}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition ${
                  selectedAnswers[currentStep] === undefined
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 cursor-pointer'
                }`}
              >
                <span>{currentStep === questions.length - 1 ? 'مشاهده کارنامه و سطح پیشنهادی' : 'سوال بعدی'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="p-8 space-y-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">نتیجه تعیین سطح شما آماده است!</h3>
              <p className="text-xs text-slate-500">
                پاسخ‌های شما بررسی شد. در زیر نمره و بهترین رده آموزشی برای شما مشخص شده است.
              </p>
            </div>

            {/* Score pill */}
            <div className="max-w-sm mx-auto bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">نمره کسب شده:</span>
                <span className="text-2xl font-black text-orange-600 font-en">
                  {toPersianDigits(score)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">پاسخ‌های صحیح:</span>
                <span className="text-xs font-black text-slate-800">
                  {toPersianDigits(correctCount)} از {toPersianDigits(questions.length)} سوال
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 text-right">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">سطح آموزشی پیشنهادی:</span>
                <span className="text-sm font-black text-emerald-600 block bg-emerald-50 p-2 rounded-xl text-center">
                  {recommendedLevelFa}
                </span>
              </div>
            </div>

            {/* Recommended course CTA */}
            {recommendedCourse && (
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-right flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-700 block">دوره پیشنهادی سیستم برای شما:</span>
                  <span className="text-xs font-black text-slate-900">{recommendedCourse.title}</span>
                </div>
                <button
                  onClick={() => {
                    setIsPlacementModalOpen(false);
                    setSelectedCourseForCheckout(recommendedCourse);
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition cursor-pointer"
                >
                  ثبت‌نام مستقیم
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetTest}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>آزمون مجدد</span>
              </button>
              <button
                onClick={() => {
                  setIsPlacementModalOpen(false);
                  document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer"
              >
                مشاهده لیست همه دوره‌ها
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
