import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  ShoppingBag,
  Users,
  Settings,
  Palette,
  FileEdit,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Coins,
  Save,
  Search,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  BellRing,
  Menu as MenuIcon,
  Globe,
  Lock,
  Copy,
  Check,
  Eye,
  Link as LinkIcon,
  Award,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Course,
  LiveClass,
  AgeBracket,
  CourseLevel,
  UserRole,
  MediaItem,
  NavigationItem,
  Announcement,
  Lesson,
  Quiz,
  QuizQuestion,
  QuizQuestionType,
  CourseOrder,
  OrderStatus
} from '../../types';
import { formatPrice, formatToJalali, toPersianDigits } from '../../utils/jalali';
import { VisualPageBuilder } from '../cms/VisualPageBuilder';
import { AuthVisualDesigner } from '../auth/AuthVisualDesigner';

export const AdminDashboard: React.FC = () => {
  const {
    courses,
    saveCourse,
    deleteCourse,
    lessons,
    saveLesson,
    deleteLesson,
    quizzes,
    saveQuiz,
    deleteQuiz,
    liveClasses,
    saveLiveClass,
    deleteLiveClass,
    enrollments,
    orders,
    reviewManualPayment,
    updateEnrollmentStatus,
    settings,
    saveSiteSettings,
    currency,
    setCurrency,
    cmsPages,
    publishCmsPage,
    unpublishCmsPage,
    deleteCmsPage,
    mediaItems,
    addMediaItem,
    deleteMediaItem
  } = useApp();

  const { profile, isAdmin, loginAsDemoUser } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'analytics'
    | 'cms-builder'
    | 'pages'
    | 'announcements'
    | 'navigation'
    | 'media'
    | 'courses'
    | 'quizzes'
    | 'classes'
    | 'orders'
    | 'users'
    | 'auth'
    | 'settings'
  >('analytics');

  // Course creation state
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTitleEn, setCourseTitleEn] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseAge, setCourseAge] = useState<AgeBracket>('6-9');
  const [courseLevel, setCourseLevel] = useState<CourseLevel>('starter');
  const [coursePrice, setCoursePrice] = useState<number>(950000);
  const [courseInstructor, setCourseInstructor] = useState('خانم سارا احمدی');

  // Selected Course for Lesson management
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonTitleEn, setLessonTitleEn] = useState('');
  const [lessonModule, setLessonModule] = useState('فصل اول');
  const [lessonDuration, setLessonDuration] = useState(45);
  const [lessonSummary, setLessonSummary] = useState('');
  const [lessonGrammar, setLessonGrammar] = useState('');
  const [lessonReading, setLessonReading] = useState('');
  const [lessonReadingTr, setLessonReadingTr] = useState('');
  const [lessonHomework, setLessonHomework] = useState('');

  // Quiz creation state
  const [isAddingQuiz, setIsAddingQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizCourseId, setQuizCourseId] = useState('');
  const [quizAge, setQuizAge] = useState<AgeBracket>('6-9');
  const [quizTimeLimit, setQuizTimeLimit] = useState(15);
  const [quizPassingScore, setQuizPassingScore] = useState(70);
  const [quizMode, setQuizMode] = useState<'exam' | 'practice'>('exam');
  const [quizQuestionsList, setQuizQuestionsList] = useState<QuizQuestion[]>([]);

  // Question adding state inside quiz
  const [qPrompt, setQPrompt] = useState('');
  const [qType, setQType] = useState<QuizQuestionType>('multiple-choice');
  const [qPoints, setQPoints] = useState(20);
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState('');

  // Live class creation state
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [classTitle, setClassTitle] = useState('');
  const [classCourseId, setClassCourseId] = useState(courses[0]?.id || '');
  const [classTeacher, setClassTeacher] = useState('خانم سارا احمدی');
  const [classDuration, setClassDuration] = useState(60);
  const [classUrl, setClassUrl] = useState('https://skyroom.online/ch/paradise/new-class');

  // Announcement state
  const [annMessage, setAnnMessage] = useState(settings.announcement?.message || 'ثبت‌نام ترم جدید با تخفیف ویژه آغاز شد!');
  const [annBadge, setAnnBadge] = useState(settings.announcement?.badge || 'ویژه');
  const [annLink, setAnnLink] = useState(settings.announcement?.link || '#courses');
  const [annActive, setAnnActive] = useState(settings.announcement?.active !== false);

  // Navigation Items state
  const [navItems, setNavItems] = useState<NavigationItem[]>(
    settings.navigationItems || [
      { id: 'nav-1', label: 'صفحه اصلی', link: '#home', order: 1, visible: true, target: 'header' },
      { id: 'nav-2', label: 'کاتالوگ دوره‌ها', link: '#courses', order: 2, visible: true, target: 'header' },
      { id: 'nav-3', label: 'تعیین سطح هوشمند', link: '#placement', order: 3, visible: true, target: 'header' },
      { id: 'nav-4', label: 'درباره ما', link: '#about', order: 4, visible: true, target: 'header' },
      { id: 'nav-5', label: 'تماس با ما', link: '#contact', order: 5, visible: true, target: 'header' }
    ]
  );
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavLink, setNewNavLink] = useState('');

  // Media upload state
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<'banners' | 'courses' | 'teachers' | 'general'>('banners');
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);

  // Users management state
  const [userRoleMap, setUserRoleMap] = useState<Record<string, UserRole>>({
    'user-1': 'student',
    'user-2': 'student',
    'user-3': 'teacher',
    'user-4': 'guardian'
  });
  const [demoUsersList, setDemoUsersList] = useState([
    { id: 'user-1', name: 'کیان رضایی', email: 'kian@student.ir', phone: '۰۹۱۲۳۴۵۶۷۸۹', role: 'student', age: '۶-۹ سال' },
    { id: 'user-2', name: 'سارا صادقی', email: 'sara@student.ir', phone: '۰۹۳۵۶۷۸۹۰۱۲', role: 'student', age: '۱۳-۱۷ سال' },
    { id: 'user-3', name: 'خانم سارا احمدی', email: 'sara.ahmadi@paradise.ir', phone: '۰۹۱۲۵۵۵۴۴۳۳', role: 'teacher', age: 'مدرس فونیکس' },
    { id: 'user-4', name: 'آقای علی رضایی (پدر)', email: 'ali.rezaei@family.ir', phone: '۰۹۱۲۱۱۱۴۴۷۷', role: 'guardian', age: 'ولی کیان' }
  ]);

  // Orders & Payment Audit State
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderFilterMethod, setOrderFilterMethod] = useState<string>('all');
  const [orderFilterCourse, setOrderFilterCourse] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<CourseOrder | null>(null);
  const [adminReviewNoteInput, setAdminReviewNoteInput] = useState<string>('');
  const [reviewActionSuccess, setReviewActionSuccess] = useState<string | null>(null);

  // System Settings state
  const [brandNameInput, setBrandNameInput] = useState(settings.brandName);
  const [phoneInput, setPhoneInput] = useState(settings.brandPhone);
  const [cardNumInput, setCardNumInput] = useState(settings.iranCardNumber);
  const [cardOwnerInput, setCardOwnerInput] = useState(settings.iranCardOwner);
  const [bankNameInput, setBankNameInput] = useState(settings.iranBankName || 'بانک ملی ایران');
  const [ibanInput, setIbanInput] = useState(settings.iranIban || 'IR120170000000123456789012');
  const [manualInstructionsInput, setManualInstructionsInput] = useState(
    settings.manualPaymentInstructions ||
      'لطفاً مبلغ دوره را به حساب فوق واریز نموده، سپس کد پیگیری و ۴ رقم آخر کارت را وارد فرمایید.'
  );
  const [onlineGatewayEnabledInput, setOnlineGatewayEnabledInput] = useState(settings.onlineGatewayEnabled !== false);
  const [manualPaymentEnabledInput, setManualPaymentEnabledInput] = useState(settings.manualPaymentEnabled !== false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Calculate stats
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((acc, curr) => acc + curr.finalAmount, 0);
  const awaitingVerificationOrders = orders.filter(o => o.status === 'awaiting_manual_verification');
  const pendingOrders = orders.filter(o => o.status === 'awaiting_manual_verification' || o.status === 'pending');

  // Permission Guard Notice
  const PermissionBanner = () => {
    if (isAdmin) return null;
    return (
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-bold mb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <span>شما در حال حاضر با نقش غیرمدیریتی وارد شده‌اید. تغییرات سیستمی و انتشار فقط توسط مدیر کل مجاز است.</span>
        </div>
        <button
          onClick={() => loginAsDemoUser('admin')}
          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black cursor-pointer shadow-xs"
        >
          ورود با نقش مدیر کل (Admin)
        </button>
      </div>
    );
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('دسترسی غیرمجاز: فقط مدیران ارشد مجاز به ایجاد دوره هستند.');
      return;
    }
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      titleEn: courseTitleEn,
      slug: `course-${Date.now()}`,
      description: courseDesc,
      ageBracket: courseAge,
      level: courseLevel,
      price: Number(coursePrice),
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
      badge: 'جدید',
      features: ['کلاس‌های تعاملی آنلاین', 'فلش‌کارت صوتی', 'پشتیبانی اختصاصی'],
      instructorName: courseInstructor,
      syllabusCount: 16,
      isPublished: true,
      liveSessionsCount: 16,
      durationWeeks: 8,
      createdAt: new Date().toISOString()
    };
    await saveCourse(newCourse);
    setIsAddingCourse(false);
    setCourseTitle('');
    setCourseTitleEn('');
    setCourseDesc('');
  };

  const handleCreateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('دسترسی غیرمجاز.');
      return;
    }
    const matchedCourse = courses.find(c => c.id === classCourseId);
    const newLive: LiveClass = {
      id: `class-${Date.now()}`,
      courseId: classCourseId,
      courseTitle: matchedCourse?.title || 'دوره انگلیسی',
      teacherId: 'teacher-sara-1',
      teacherName: classTeacher,
      title: classTitle,
      scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
      durationMinutes: Number(classDuration),
      meetingUrl: classUrl,
      capacity: 8,
      enrolledStudentIds: [],
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    await saveLiveClass(newLive);
    setIsAddingClass(false);
    setClassTitle('');
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('دسترسی غیرمجاز.');
      return;
    }
    if (!selectedCourseForLessons || !lessonTitle) return;

    const newLesson: Lesson = {
      id: `lesson-${selectedCourseForLessons.id}-${Date.now()}`,
      courseId: selectedCourseForLessons.id,
      moduleTitle: lessonModule,
      title: lessonTitle,
      titleEn: lessonTitleEn || 'Unit Lesson',
      order: lessons.filter(l => l.courseId === selectedCourseForLessons.id).length + 1,
      durationMinutes: Number(lessonDuration),
      summary: lessonSummary,
      grammarFocus: lessonGrammar || undefined,
      readingText: lessonReading || undefined,
      readingTranslation: lessonReadingTr || undefined,
      homeworkPrompt: lessonHomework || undefined,
      vocabulary: [],
      exercises: [],
      createdAt: new Date().toISOString()
    };

    await saveLesson(newLesson);
    setIsAddingLesson(false);
    setLessonTitle('');
    setLessonTitleEn('');
    setLessonSummary('');
    setLessonGrammar('');
    setLessonReading('');
    setLessonReadingTr('');
    setLessonHomework('');
  };

  const handleAddQuestionToQuiz = () => {
    if (!qPrompt.trim()) return;

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      prompt: qPrompt,
      type: qType,
      points: Number(qPoints) || 10,
      options: qType === 'multiple-choice' || qType === 'multiple-select' ? [qOptA, qOptB, qOptC, qOptD].filter(Boolean) : undefined,
      correctAnswerIndex: qType === 'multiple-choice' ? Number(qCorrectIdx) : undefined,
      correctBool: qType === 'true-false' ? qCorrectIdx === 0 : undefined,
      correctText: qType === 'fill-in-the-blank' ? qOptA.trim() : undefined,
      explanationFa: qExplanation || undefined
    };

    setQuizQuestionsList(prev => [...prev, newQ]);
    setQPrompt('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('دسترسی غیرمجاز.');
      return;
    }
    if (!quizTitle || quizQuestionsList.length === 0) {
      alert('لطفاً عنوان آزمون را وارد کرده و حداقل یک سوال به آن اضافه کنید.');
      return;
    }

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      courseId: quizCourseId || undefined,
      title: quizTitle,
      description: quizDesc,
      ageBracket: quizAge,
      timeLimitMinutes: Number(quizTimeLimit),
      passingScore: Number(quizPassingScore),
      mode: quizMode,
      shuffleQuestions: false,
      isPlacementTest: false,
      questions: quizQuestionsList,
      createdAt: new Date().toISOString()
    };

    await saveQuiz(newQuiz);
    setIsAddingQuiz(false);
    setQuizTitle('');
    setQuizDesc('');
    setQuizQuestionsList([]);
  };

  const handleSaveAnnouncement = async () => {
    if (!isAdmin) {
      alert('دسترسی غیرمجاز.');
      return;
    }
    const updatedAnn: Announcement = {
      id: settings.announcement?.id || 'ann-1',
      message: annMessage,
      badge: annBadge,
      link: annLink,
      active: annActive,
      updatedAt: new Date().toISOString()
    };
    await saveSiteSettings({ announcement: updatedAnn });
    alert('پیام اعلان بالای سایت با موفقیت به‌روزرسانی شد.');
  };

  const handleSaveNavigation = async () => {
    if (!isAdmin) {
      alert('دسترسی غیرمجاز.');
      return;
    }
    await saveSiteSettings({ navigationItems: navItems });
    alert('منوهای ناوبری سایت ذخیره شدند.');
  };

  const handleAddNavItem = () => {
    if (!newNavLabel.trim() || !newNavLink.trim()) return;
    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      label: newNavLabel,
      link: newNavLink,
      order: navItems.length + 1,
      visible: true,
      target: 'header'
    };
    setNavItems([...navItems, newItem]);
    setNewNavLabel('');
    setNewNavLink('');
  };

  const handleDeleteNavItem = (id: string) => {
    setNavItems(navItems.filter(n => n.id !== id));
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaName || !newMediaUrl) return;
    const item: MediaItem = {
      id: `med-${Date.now()}`,
      name: newMediaName,
      url: newMediaUrl,
      category: newMediaCategory,
      altText: newMediaName,
      createdAt: new Date().toISOString()
    };
    await addMediaItem(item);
    setNewMediaName('');
    setNewMediaUrl('');
  };

  const handleCopyMediaUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMediaId(id);
    setTimeout(() => setCopiedMediaId(null), 2000);
  };

  const handleSaveSettings = async () => {
    if (!isAdmin) {
      alert('دسترسی غیرمجاز: فقط مدیران سیستم می‌توانند تنظیمات را ذخیره کنند.');
      return;
    }
    await saveSiteSettings({
      brandName: brandNameInput,
      brandPhone: phoneInput,
      iranCardNumber: cardNumInput,
      iranCardOwner: cardOwnerInput,
      iranBankName: bankNameInput,
      iranIban: ibanInput,
      manualPaymentInstructions: manualInstructionsInput,
      onlineGatewayEnabled: onlineGatewayEnabledInput,
      manualPaymentEnabled: manualPaymentEnabledInput
    });
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  const handleReviewOrder = async (orderId: string, decision: 'approved' | 'rejected') => {
    if (!isAdmin) {
      alert('دسترسی غیرمجاز: فقط مدیران ارشد مجاز به بررسی و تایید یا رد فیش‌های واریزی هستند.');
      return;
    }

    try {
      const updated = await reviewManualPayment(
        orderId,
        decision,
        adminReviewNoteInput || undefined,
        profile?.fullName || 'مدیر کل سامانه'
      );

      setReviewActionSuccess(
        decision === 'approved'
          ? `سفارش ${updated.orderNumber} با موفقیت تایید شد و دسترسی دانش‌آموز به دوره فعال گردید.`
          : `سفارش ${updated.orderNumber} رد شد و پیام علت رد برای کاربر ثبت گردید.`
      );

      setSelectedOrderForReview(updated);
      setAdminReviewNoteInput('');
      setTimeout(() => setReviewActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'خطا در ثبت بررسی فیش.');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 text-right selection:bg-orange-500 selection:text-white">
      {/* Super Admin Top Banner */}
      <div className="bg-gradient-to-r from-red-700 via-orange-800 to-amber-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-500/50 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
              کنترل پنل مدیریت جامع و سامانه مدیریت محتوا (Admin CMS)
            </span>
            <span className="text-red-200 text-xs font-mono">v2.5 Enterprise</span>
          </div>
          <h1 className="text-2xl font-black">{settings.brandName}</h1>
          <p className="text-xs text-red-200 mt-1">
            ویرایشگر بصری صفحات، مدیریت رسانه‌ها، منوها، اعلان‌ها، کاربران و تراکنش‌های بانکی
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-red-200 block font-bold">واحد پولی فعال:</span>
            <span className="text-base font-black text-amber-300">
              {currency === 'toman' ? 'تومان' : 'ریال'}
            </span>
          </div>
          <button
            onClick={() => setCurrency(currency === 'toman' ? 'rial' : 'toman')}
            className="px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold cursor-pointer transition"
            title="تغییر واحد پولی سیستم بدون تبدیل خاموش"
          >
            تغییر به {currency === 'toman' ? 'ریال' : 'تومان'}
          </button>
        </div>
      </div>

      <PermissionBanner />

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'analytics' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>آمار و گزارش‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('cms-builder')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'cms-builder' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileEdit className="w-4 h-4" />
          <span>ویرایشگر بصری صفحات (Visual Builder)</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'pages' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>صفحات عمومی ({toPersianDigits(cmsPages.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'announcements' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>نوار اعلان بالای سایت</span>
        </button>

        <button
          onClick={() => setActiveTab('navigation')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'navigation' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MenuIcon className="w-4 h-4" />
          <span>منوهای ناوبری</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'media' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>کتابخانه چندرسانه‌ای ({toPersianDigits(mediaItems.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'courses' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>دوره‌ها و درس‌ها ({toPersianDigits(courses.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'quizzes' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>آزمون‌ها و کوئیزها ({toPersianDigits(quizzes.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'classes' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>کلاس‌های اسکای‌روم ({toPersianDigits(liveClasses.length)})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'orders' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>سفارش‌ها و پرداخت‌ها</span>
          {pendingOrders.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {toPersianDigits(pendingOrders.length)}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'users' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>کاربران و نقش‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'auth' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>طراحی صفحه ورود</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer ${
            activeTab === 'settings' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>تنظیمات سیستم و درگاه</span>
        </button>
      </div>

      {/* 1. ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">کل درآمد ثبت‌نامی‌ها:</span>
              <span className="text-xl font-black text-emerald-600 block">
                {formatPrice(totalRevenue, currency)}
              </span>
              <span className="text-[10px] text-slate-400">تراکنش‌های موفق آنلاین و کارت‌به‌کارت</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">فیش‌های در انتظار تایید مالی:</span>
              <span className="text-xl font-black text-amber-600 block">
                {toPersianDigits(pendingOrders.length)} فیش بانکی
              </span>
              <span className="text-[10px] text-slate-400">نیاز به تطابق با حساب بانکی</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">صفحات فعال CMS:</span>
              <span className="text-xl font-black text-orange-600 block font-en">
                {toPersianDigits(cmsPages.length)} صفحه
              </span>
              <span className="text-[10px] text-slate-400">طراحی شده با ویرایشگر بصری</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-400">کلاس‌های زنده اسکای‌روم:</span>
              <span className="text-xl font-black text-indigo-600 block font-en">
                {toPersianDigits(liveClasses.length)} کلاس
              </span>
              <span className="text-[10px] text-slate-400">سرورهای داخلی با ترافیک نیم‌بهاء</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. VISUAL PAGE BUILDER */}
      {activeTab === 'cms-builder' && (
        <VisualPageBuilder />
      )}

      {/* 3. PUBLIC PAGES WORKFLOW */}
      {activeTab === 'pages' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">مدیریت صفحات وب‌سایت (Pages & Workflows)</h3>
              <p className="text-xs text-slate-500">مشاهده وضعیت انتشار، ویرایش سرفصل‌ها و نسخه‌بندی صفحات</p>
            </div>
            <button
              onClick={() => setActiveTab('cms-builder')}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer shadow-xs"
            >
              طراحی و چیدمان بصری در Page Builder
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">عنوان صفحه</th>
                  <th className="p-4">آدرس (Slug)</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">تعداد بخش‌ها</th>
                  <th className="p-4">آخرین بازبینی</th>
                  <th className="p-4">عملیات انتشار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cmsPages.map(page => (
                  <tr key={page.id} className="hover:bg-slate-50">
                    <td className="p-4 font-black text-slate-900">{page.title}</td>
                    <td className="p-4 font-mono text-slate-500" dir="ltr">/{page.slug}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        page.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : page.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {page.status === 'published' ? 'منتشر شده' : page.status === 'draft' ? 'پیش‌نویس' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="p-4">{toPersianDigits(page.sections.length)} بخش</td>
                    <td className="p-4">{formatToJalali(page.updatedAt)}</td>
                    <td className="p-4 flex items-center gap-2">
                      {page.status === 'published' ? (
                        <button
                          onClick={() => unpublishCmsPage(page.id)}
                          className="px-3 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                        >
                          خروج از انتشار
                        </button>
                      ) : (
                        <button
                          onClick={() => publishCmsPage(page.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          انتشار عمومی
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('cms-builder')}
                        className="px-3 py-1 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-bold cursor-pointer"
                      >
                        ویرایشگر
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-orange-500" />
                مدیریت نوار اطلاعیه فوری بالای سایت
              </h3>
              <p className="text-xs text-slate-500">تنظیم پیام تبلیغاتی یا مناسبتی که در بالای تمام صفحات نمایش می‌یابد</p>
            </div>
            <button
              onClick={handleSaveAnnouncement}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره اطلاعیه</span>
            </button>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">نمایش نوار اطلاعیه در سایت</span>
                <span className="text-[11px] text-slate-400">فعال یا غیرفعال بودن نمایش بنر فوقانی</span>
              </div>
              <input
                type="checkbox"
                checked={annActive}
                onChange={(e) => setAnnActive(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">متن پیام اطلاعیه</label>
              <input
                type="text"
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">برچسب (Badge)</label>
                <input
                  type="text"
                  value={annBadge}
                  onChange={(e) => setAnnBadge(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">لینک اقدام (Link)</label>
                <input
                  type="text"
                  value={annLink}
                  onChange={(e) => setAnnLink(e.target.value)}
                  dir="ltr"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-en text-left"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. NAVIGATION MENUS */}
      {activeTab === 'navigation' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MenuIcon className="w-5 h-5 text-orange-500" />
                مدیریت پیوندهای منوی هدر و فوتر
              </h3>
              <p className="text-xs text-slate-500">افزودن، ویرایش و جابجایی آیتم‌های منوی بالای سایت</p>
            </div>
            <button
              onClick={handleSaveNavigation}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات منو</span>
            </button>
          </div>

          {/* Add item */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <input
              type="text"
              value={newNavLabel}
              onChange={(e) => setNewNavLabel(e.target.value)}
              placeholder="عنوان منو (مثال: بلاگ آموزشی)"
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
            />
            <input
              type="text"
              value={newNavLink}
              onChange={(e) => setNewNavLink(e.target.value)}
              placeholder="لینک (مثال: #courses یا https://...)"
              dir="ltr"
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-en text-left"
            />
            <button
              onClick={handleAddNavItem}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shrink-0"
            >
              افزودن به منو
            </button>
          </div>

          {/* Items list */}
          <div className="space-y-2">
            {navItems.map((item, idx) => (
              <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900">{item.label}</span>
                  <span className="text-slate-400 font-mono text-[11px]" dir="ltr">{item.link}</span>
                </div>
                <button
                  onClick={() => handleDeleteNavItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MEDIA LIBRARY */}
      {activeTab === 'media' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-500" />
                کتابخانه چندرسانه‌ای و تصاویر (Media Library)
              </h3>
              <p className="text-xs text-slate-500">مدیریت تصاویر دوره‌ها، اساتید، و بنرهای مورد استفاده در Page Builder</p>
            </div>
          </div>

          {/* Add media form */}
          <form onSubmit={handleAddMedia} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-3">
            <input
              type="text"
              required
              value={newMediaName}
              onChange={(e) => setNewMediaName(e.target.value)}
              placeholder="عنوان تصویر (مثال: بنر دوره نوجوانان)"
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
            />
            <input
              type="url"
              required
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              placeholder="آدرس اینترنتی عکس (URL)"
              dir="ltr"
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-en text-left"
            />
            <select
              value={newMediaCategory}
              onChange={(e) => setNewMediaCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs cursor-pointer"
            >
              <option value="banners">بنرها و هیرو</option>
              <option value="courses">کاور دوره‌ها</option>
              <option value="teachers">عکس اساتید</option>
              <option value="general">عمومی</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer shrink-0"
            >
              ثبت تصویر
            </button>
          </form>

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaItems.map(m => (
              <div key={m.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden group space-y-2 pb-3">
                <div className="h-32 bg-slate-200 relative overflow-hidden">
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {m.category}
                  </span>
                </div>
                <div className="px-3">
                  <span className="text-xs font-black text-slate-800 block truncate">{m.name}</span>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleCopyMediaUrl(m.url, m.id)}
                      className="text-[10px] text-orange-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedMediaId === m.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedMediaId === m.id ? 'کپی شد!' : 'کپی لینک'}</span>
                    </button>
                    <button
                      onClick={() => deleteMediaItem(m.id)}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. COURSES MANAGER */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">مدیریت دوره‌های آموزشی و شهریه‌ها</h3>
            <button
              onClick={() => setIsAddingCourse(!isAddingCourse)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingCourse ? 'انصراف' : 'تعریف دوره جدید'}</span>
            </button>
          </div>

          {/* Add Course Form */}
          {isAddingCourse && (
            <form onSubmit={handleCreateCourse} className="bg-orange-50/60 p-6 rounded-3xl border border-orange-200 space-y-4">
              <h4 className="text-xs font-black text-orange-950">مشخصات دوره آموزشی جدید:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان فارسی دوره</label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="مثال: کارگاه فن بیان و شعر انگلیسی"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان انگلیسی دوره</label>
                  <input
                    type="text"
                    required
                    value={courseTitleEn}
                    onChange={(e) => setCourseTitleEn(e.target.value)}
                    placeholder="Poetry & Speech Workshop"
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-en text-left"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">رده سنی</label>
                  <select
                    value={courseAge}
                    onChange={(e) => setCourseAge(e.target.value as AgeBracket)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    <option value="6-9">کودکان ۶ تا ۹ سال</option>
                    <option value="10-12">نوجوانان ۱۰ تا ۱۲ سال</option>
                    <option value="13-17">نوجوانان ۱۳ تا ۱۷ سال</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">شهریه ({currency === 'toman' ? 'تومان' : 'ریال'})</label>
                  <input
                    type="number"
                    required
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-en text-left"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">توضیحات دوره</label>
                <textarea
                  rows={2}
                  required
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="اهداف آموزشی و سرفصل‌های دوره..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black cursor-pointer"
              >
                ذخیره و انتشار دوره در سایت
              </button>
            </form>
          )}

          {/* Courses Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">عنوان دوره</th>
                  <th className="p-4">رده سنی</th>
                  <th className="p-4">سطح</th>
                  <th className="p-4">شهریه</th>
                  <th className="p-4">مدرس</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-4 font-black text-slate-900">{c.title}</td>
                    <td className="p-4">{c.ageBracket} سال</td>
                    <td className="p-4">{c.level}</td>
                    <td className="p-4 font-black text-orange-600">{formatPrice(c.price, currency)}</td>
                    <td className="p-4">{c.instructorName}</td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCourseForLessons(selectedCourseForLessons?.id === c.id ? null : c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                          selectedCourseForLessons?.id === c.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        سرفصل‌ها ({toPersianDigits(lessons.filter(l => l.courseId === c.id).length)})
                      </button>
                      <button
                        onClick={() => deleteCourse(c.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="حذف دوره"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sub-manager: Lessons & Modules for Selected Course */}
          {selectedCourseForLessons && (
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    مدیریت جلسات و محتوای آموزشی
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-1">
                    جلسات آموزشی دوره: {selectedCourseForLessons.title}
                  </h4>
                </div>
                <button
                  onClick={() => setIsAddingLesson(!isAddingLesson)}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer"
                >
                  {isAddingLesson ? 'انصراف' : 'افزودن جلسه جدید به این دوره'}
                </button>
              </div>

              {/* Add Lesson Form */}
              {isAddingLesson && (
                <form onSubmit={handleCreateLesson} className="bg-white p-5 rounded-2xl border border-orange-200 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان فارسی جلسه</label>
                      <input
                        type="text"
                        required
                        value={lessonTitle}
                        onChange={e => setLessonTitle(e.target.value)}
                        placeholder="جلسه ۱: صدای حروف ..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان انگلیسی جلسه</label>
                      <input
                        type="text"
                        value={lessonTitleEn}
                        onChange={e => setLessonTitleEn(e.target.value)}
                        placeholder="Unit 1: Letter sounds"
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">فصل / ماژول</label>
                      <input
                        type="text"
                        value={lessonModule}
                        onChange={e => setLessonModule(e.target.value)}
                        placeholder="فصل اول"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">نکته کلیدی گرامر (Grammar Focus)</label>
                      <input
                        type="text"
                        value={lessonGrammar}
                        onChange={e => setLessonGrammar(e.target.value)}
                        placeholder="قاعده CVC یا زمان حال ساده..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">مدت زمان (دقیقه)</label>
                      <input
                        type="number"
                        value={lessonDuration}
                        onChange={e => setLessonDuration(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">خلاصه جلسه</label>
                    <textarea
                      rows={2}
                      required
                      value={lessonSummary}
                      onChange={e => setLessonSummary(e.target.value)}
                      placeholder="اهداف یادگیری و لغات جدید این جلسه..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">متن ریدینگ انگلیسی (Reading Passage)</label>
                      <textarea
                        rows={2}
                        value={lessonReading}
                        onChange={e => setLessonReading(e.target.value)}
                        placeholder="Short story passage in English..."
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">ترجمه فارسی ریدینگ</label>
                      <textarea
                        rows={2}
                        value={lessonReadingTr}
                        onChange={e => setLessonReadingTr(e.target.value)}
                        placeholder="ترجمه روان برای والدین و دانش‌آموز..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">تکلیف جلسه (Homework Prompt)</label>
                    <input
                      type="text"
                      value={lessonHomework}
                      onChange={e => setLessonHomework(e.target.value)}
                      placeholder="تمرین نگارش یا ضبط صدا برای ارسال به معلم..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer"
                  >
                    ثبت و ذخیره جلسه آموزشی
                  </button>
                </form>
              )}

              {/* Lessons List Table */}
              <div className="divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {lessons.filter(l => l.courseId === selectedCourseForLessons.id).map(l => (
                  <div key={l.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-slate-900 block">{l.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {l.moduleTitle || 'فصل اول'} • {toPersianDigits(l.durationMinutes)} دقیقه
                      </span>
                    </div>
                    <button
                      onClick={() => deleteLesson(l.id)}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                      title="حذف جلسه"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {lessons.filter(l => l.courseId === selectedCourseForLessons.id).length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    هنوز جلسه‌ای برای این دوره ثبت نشده است. با دکمه بالا اولین جلسه را اضافه کنید.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. QUIZZES & EXAMS MANAGER */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">طراح و بانک سوالات آزمون‌ها و کوئیزها</h3>
              <p className="text-xs text-slate-500">پشتیبانی از انواع سوالات چندگزینه‌ای، تطبیق، جای خالی، و تشریحی</p>
            </div>
            <button
              onClick={() => setIsAddingQuiz(!isAddingQuiz)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingQuiz ? 'انصراف' : 'طراحی آزمون جدید'}</span>
            </button>
          </div>

          {/* Add Quiz Form */}
          {isAddingQuiz && (
            <form onSubmit={handleCreateQuiz} className="bg-orange-50/60 p-6 rounded-3xl border border-orange-200 space-y-4">
              <h4 className="text-xs font-black text-orange-950">مشخصات آزمون جدید:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان آزمون</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    placeholder="کوئیز پایان فصل..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">اتصال به دوره (اختیاری)</label>
                  <select
                    value={quizCourseId}
                    onChange={e => setQuizCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    <option value="">آزمون عمومی / تعیین سطح</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">رده سنی</label>
                  <select
                    value={quizAge}
                    onChange={e => setQuizAge(e.target.value as AgeBracket)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    <option value="6-9">کودکان ۶ تا ۹ سال</option>
                    <option value="10-12">نوجوانان ۱۰ تا ۱۲ سال</option>
                    <option value="13-17">نوجوانان ۱۳ تا ۱۷ سال</option>
                    <option value="all">همه رده‌های سنی</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">مدت زمان (دقیقه)</label>
                  <input
                    type="number"
                    value={quizTimeLimit}
                    onChange={e => setQuizTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">حد نصاب قبولی (درصد)</label>
                  <input
                    type="number"
                    value={quizPassingScore}
                    onChange={e => setQuizPassingScore(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">حالت آزمون</label>
                  <select
                    value={quizMode}
                    onChange={e => setQuizMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    <option value="exam">آزمون رسمی زمان‌دار</option>
                    <option value="practice">خودآزمایی و تمرین (با راهنما)</option>
                  </select>
                </div>
              </div>

              {/* Question Builder Box */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-black text-slate-800">افزودن سوال به این آزمون:</h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={qPrompt}
                      onChange={e => setQPrompt(e.target.value)}
                      placeholder="صورت سوال به فارسی یا انگلیسی..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={qType}
                      onChange={e => setQType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    >
                      <option value="multiple-choice">چهارگزینه‌ای (تک انتخابی)</option>
                      <option value="multiple-select">انتخاب چندتایی</option>
                      <option value="true-false">صحیح / غلط</option>
                      <option value="fill-in-the-blank">جای خالی (متنی)</option>
                      <option value="teacher-graded">تشریحی (تصحیح معلم)</option>
                    </select>
                  </div>
                </div>

                {qType === 'multiple-choice' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="گزینه الف"
                      value={qOptA}
                      onChange={e => setQOptA(e.target.value)}
                      className="p-2 rounded-xl border text-xs"
                    />
                    <input
                      type="text"
                      placeholder="گزینه ب"
                      value={qOptB}
                      onChange={e => setQOptB(e.target.value)}
                      className="p-2 rounded-xl border text-xs"
                    />
                    <input
                      type="text"
                      placeholder="گزینه ج"
                      value={qOptC}
                      onChange={e => setQOptC(e.target.value)}
                      className="p-2 rounded-xl border text-xs"
                    />
                    <input
                      type="text"
                      placeholder="گزینه د"
                      value={qOptD}
                      onChange={e => setQOptD(e.target.value)}
                      className="p-2 rounded-xl border text-xs"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <input
                    type="text"
                    placeholder="توضیحات آموزشی و راهنمای پاسخ صحیح..."
                    value={qExplanation}
                    onChange={e => setQExplanation(e.target.value)}
                    className="flex-1 ml-2 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuestionToQuiz}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer"
                  >
                    افزودن این سوال
                  </button>
                </div>

                {/* Staged Questions List */}
                {quizQuestionsList.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">سوالات آماده ثبت:</span>
                    {quizQuestionsList.map((q, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl">
                        <span>{toPersianDigits(idx + 1)}. {q.prompt} ({q.type})</span>
                        <span className="text-[10px] text-orange-600 font-bold">{toPersianDigits(q.points)} امتیاز</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black cursor-pointer shadow-xs"
              >
                ذخیره آزمون در پایگاه داده
              </button>
            </form>
          )}

          {/* Quizzes Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">عنوان آزمون</th>
                  <th className="p-4">رده سنی</th>
                  <th className="p-4">زمان</th>
                  <th className="p-4">حد نصاب</th>
                  <th className="p-4">تعداد سوالات</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quizzes.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="p-4 font-black text-slate-900">{q.title}</td>
                    <td className="p-4">{q.ageBracket} سال</td>
                    <td className="p-4">{toPersianDigits(q.timeLimitMinutes)} دقیقه</td>
                    <td className="p-4 font-black text-emerald-600">{toPersianDigits(q.passingScore)}٪</td>
                    <td className="p-4">{toPersianDigits(q.questions.length)} سوال</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteQuiz(q.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="حذف آزمون"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. LIVE CLASSES */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">برنامه‌ریزی جلسات زنده آنلاین (اسکای‌روم)</h3>
            <button
              onClick={() => setIsAddingClass(!isAddingClass)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingClass ? 'انصراف' : 'زمان‌بندی کلاس زنده جدید'}</span>
            </button>
          </div>

          {isAddingClass && (
            <form onSubmit={handleCreateLiveClass} className="bg-orange-50/60 p-6 rounded-3xl border border-orange-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">عنوان جلسه زنده</label>
                  <input
                    type="text"
                    required
                    value={classTitle}
                    onChange={(e) => setClassTitle(e.target.value)}
                    placeholder="مثال: جلسه پرسش و پاسخ و مکالمه گروهی"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">دوره مربوطه</label>
                  <select
                    value={classCourseId}
                    onChange={(e) => setClassCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">لینک جلسه (Skyroom / Meet)</label>
                  <input
                    type="url"
                    required
                    value={classUrl}
                    onChange={(e) => setClassUrl(e.target.value)}
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-en text-left"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">استاد کلاس</label>
                  <input
                    type="text"
                    required
                    value={classTeacher}
                    onChange={(e) => setClassTeacher(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black cursor-pointer"
              >
                ثبت و اطلاع‌رسانی به دانش‌آموزان
              </button>
            </form>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">عنوان جلسه</th>
                  <th className="p-4">دوره</th>
                  <th className="p-4">استاد</th>
                  <th className="p-4">زمان برگزاری (تهران)</th>
                  <th className="p-4">لینک اسکای‌روم</th>
                  <th className="p-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveClasses.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="p-4 font-black text-slate-900">{l.title}</td>
                    <td className="p-4">{l.courseTitle}</td>
                    <td className="p-4">{l.teacherName}</td>
                    <td className="p-4">{formatToJalali(l.scheduledAt, true)}</td>
                    <td className="p-4 font-en text-orange-600 truncate max-w-xs" dir="ltr">{l.meetingUrl}</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteLiveClass(l.id)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. ORDERS & PAYMENTS (COURSE COMMERCE MANAGER) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Header & Success Feedback */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                مدیریت جامع سفارشات، پرداخت‌های آنلاین زرین‌پال و فیش‌های بانکی
              </h3>
              <p className="text-xs text-slate-500">
                بررسی و تایید واریزهای کارت‌به‌کارت، رهگیری تراکنش‌های درگاه شاپرک و تاریخچه تغییر وضعیت
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                مجموع سفارشات: {toPersianDigits(orders.length)}
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                کل درآمد وصول شده: {formatPrice(totalRevenue, currency)}
              </span>
            </div>
          </div>

          {reviewActionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">{reviewActionSuccess}</span>
              </div>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setOrderFilterStatus('awaiting_manual_verification')}
              className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                orderFilterStatus === 'awaiting_manual_verification'
                  ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] text-amber-700 font-bold block">نیازمند بررسی فیش:</span>
              <span className="text-xl font-black text-amber-900">
                {toPersianDigits(awaitingVerificationOrders.length)} سفارش
              </span>
            </button>

            <button
              onClick={() => setOrderFilterStatus('paid')}
              className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                orderFilterStatus === 'paid'
                  ? 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] text-emerald-700 font-bold block">پرداخت شده و فعال:</span>
              <span className="text-xl font-black text-emerald-900">
                {toPersianDigits(orders.filter(o => o.status === 'paid').length)} سفارش
              </span>
            </button>

            <button
              onClick={() => setOrderFilterStatus('pending')}
              className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                orderFilterStatus === 'pending'
                  ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] text-blue-700 font-bold block">معلق در انتظار پرداخت:</span>
              <span className="text-xl font-black text-blue-900">
                {toPersianDigits(orders.filter(o => o.status === 'pending').length)} سفارش
              </span>
            </button>

            <button
              onClick={() => setOrderFilterStatus('rejected')}
              className={`p-4 rounded-2xl border text-right transition cursor-pointer ${
                orderFilterStatus === 'rejected'
                  ? 'border-red-400 bg-red-50 ring-2 ring-red-300'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] text-red-700 font-bold block">رد شده یا ناموفق:</span>
              <span className="text-xl font-black text-red-900">
                {toPersianDigits(orders.filter(o => o.status === 'rejected' || o.status === 'failed').length)} سفارش
              </span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس شماره سفارش، نام دانش‌آموز، کد پیگیری..."
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={orderFilterStatus}
              onChange={e => setOrderFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="awaiting_manual_verification">در انتظار بررسی فیش</option>
              <option value="paid">پرداخت شده (Paid)</option>
              <option value="pending">در انتظار پرداخت (Pending)</option>
              <option value="rejected">رد شده (Rejected)</option>
              <option value="failed">ناموفق درگاه (Failed)</option>
              <option value="cancelled">انصراف کاربر (Cancelled)</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={orderFilterMethod}
              onChange={e => setOrderFilterMethod(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold"
            >
              <option value="all">همه روش‌های پرداخت</option>
              <option value="online">درگاه آنلاین زرین‌پال</option>
              <option value="card_to_card">کارت‌به‌کارت دستی</option>
              <option value="scholarship">بورسیه / رایگان</option>
            </select>

            {/* Course Filter */}
            <select
              value={orderFilterCourse}
              onChange={e => setOrderFilterCourse(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold"
            >
              <option value="all">همه دوره‌ها</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            {(orderFilterStatus !== 'all' || orderFilterMethod !== 'all' || orderFilterCourse !== 'all' || orderSearchQuery) && (
              <button
                onClick={() => {
                  setOrderFilterStatus('all');
                  setOrderFilterMethod('all');
                  setOrderFilterCourse('all');
                  setOrderSearchQuery('');
                }}
                className="text-xs text-orange-600 hover:underline font-bold px-2 cursor-pointer"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>

          {/* Orders Table */}
          {(() => {
            let filteredOrders = orders.filter(o => {
              if (orderFilterStatus !== 'all' && o.status !== orderFilterStatus) return false;
              if (orderFilterMethod !== 'all' && o.paymentMethod !== orderFilterMethod) return false;
              if (orderFilterCourse !== 'all' && o.courseId !== orderFilterCourse) return false;
              if (orderSearchQuery) {
                const q = orderSearchQuery.toLowerCase();
                const matchNumber = o.orderNumber?.toLowerCase().includes(q);
                const matchName = o.studentName?.toLowerCase().includes(q);
                const matchTrack = o.manualTrackingCode?.toLowerCase().includes(q);
                const matchRef = o.gatewayRefId?.toLowerCase().includes(q);
                const matchCourse = o.courseTitle?.toLowerCase().includes(q);
                if (!matchNumber && !matchName && !matchTrack && !matchRef && !matchCourse) return false;
              }
              return true;
            });

            const getStatusBadge = (status: OrderStatus) => {
              switch (status) {
                case 'paid':
                  return (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>پرداخت شده و فعال</span>
                    </span>
                  );
                case 'awaiting_manual_verification':
                  return (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 w-fit animate-pulse">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>در انتظار بررسی فیش</span>
                    </span>
                  );
                case 'pending':
                  return (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>معلق (در انتظار پرداخت)</span>
                    </span>
                  );
                case 'rejected':
                  return (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                      <XCircle className="w-3 h-3 text-red-600" />
                      <span>رد شده توسط حسابداری</span>
                    </span>
                  );
                case 'failed':
                  return (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 flex items-center gap-1 w-fit">
                      <AlertCircle className="w-3 h-3 text-slate-500" />
                      <span>ناموفق در شاپرک</span>
                    </span>
                  );
                case 'cancelled':
                  return (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 flex items-center gap-1 w-fit">
                      <span>لغو شده</span>
                    </span>
                  );
                default:
                  return (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {status}
                    </span>
                  );
              }
            };

            return (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr>
                        <th className="p-4">شماره سفارش</th>
                        <th className="p-4">دانش‌آموز</th>
                        <th className="p-4">دوره انتخابی</th>
                        <th className="p-4">روش پرداخت</th>
                        <th className="p-4">مبلغ</th>
                        <th className="p-4">کد پیگیری / ارجاع</th>
                        <th className="p-4">وضعیت</th>
                        <th className="p-4">تاریخ ثبت</th>
                        <th className="p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-4 font-mono font-black text-slate-900" dir="ltr">
                            {order.orderNumber}
                          </td>
                          <td className="p-4">
                            <span className="font-black text-slate-900 block">{order.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{order.studentPhone || order.studentEmail || 'بدون تماس'}</span>
                          </td>
                          <td className="p-4 font-bold text-slate-800 max-w-[200px] truncate">
                            {order.courseTitle}
                          </td>
                          <td className="p-4">
                            <span className="text-slate-700">
                              {order.paymentMethod === 'online'
                                ? 'درگاه آنلاین زرین‌پال'
                                : order.paymentMethod === 'card_to_card'
                                ? 'کارت به کارت'
                                : 'بورسیه / رایگان'}
                            </span>
                          </td>
                          <td className="p-4 font-black text-slate-900">
                            {order.finalAmount === 0 ? 'رایگان' : formatPrice(order.finalAmount, currency)}
                          </td>
                          <td className="p-4 font-mono text-slate-600 text-[11px]">
                            {order.manualTrackingCode
                              ? `کد: ${order.manualTrackingCode} (کارت: ${order.manualCardLastFour || '---'})`
                              : order.gatewayRefId
                              ? `شاپرک: ${order.gatewayRefId}`
                              : '---'}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="p-4 text-slate-400 text-[11px]">
                            {formatToJalali(order.createdAt)}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setSelectedOrderForReview(order);
                                setAdminReviewNoteInput('');
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer transition shadow-2xs ${
                                order.status === 'awaiting_manual_verification'
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {order.status === 'awaiting_manual_verification'
                                ? 'بررسی و تایید فیش'
                                : 'مشاهده جزییات و لاگ'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredOrders.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                    <p>هیچ سفارشی مطابق با فیلترهای انتخابی یافت نشد.</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Order Details & Audit Trail Review Modal */}
          {selectedOrderForReview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
              <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-right my-8">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">جزییات پرونده سفارش:</span>
                      <span className="font-mono font-black text-amber-300" dir="ltr">
                        {selectedOrderForReview.orderNumber}
                      </span>
                    </div>
                    <h3 className="text-base font-black">{selectedOrderForReview.courseTitle}</h3>
                  </div>

                  <button
                    onClick={() => setSelectedOrderForReview(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                  {/* Order Overview Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">دانش‌آموز:</span>
                      <span className="font-black text-slate-900 block">{selectedOrderForReview.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedOrderForReview.studentPhone || selectedOrderForReview.studentEmail || '---'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">مبلغ سفارش:</span>
                      <span className="font-black text-orange-600 block text-sm">
                        {selectedOrderForReview.finalAmount === 0 ? 'رایگان' : formatPrice(selectedOrderForReview.finalAmount, currency)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">روش پرداخت:</span>
                      <span className="font-bold text-slate-800 block">
                        {selectedOrderForReview.paymentMethod === 'online'
                          ? 'درگاه زرین‌پال'
                          : selectedOrderForReview.paymentMethod === 'card_to_card'
                          ? 'کارت به کارت دستی'
                          : 'بورسیه'}
                      </span>
                    </div>

                    {selectedOrderForReview.manualTrackingCode && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">کد پیگیری اعلامی کاربر:</span>
                        <span className="font-mono font-black text-slate-900">{selectedOrderForReview.manualTrackingCode}</span>
                      </div>
                    )}

                    {selectedOrderForReview.manualCardLastFour && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">۴ رقم آخر کارت:</span>
                        <span className="font-mono font-black text-slate-900">{selectedOrderForReview.manualCardLastFour}</span>
                      </div>
                    )}

                    {selectedOrderForReview.gatewayRefId && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">شناسه مرجع شاپرک (Ref ID):</span>
                        <span className="font-mono font-black text-emerald-700">{selectedOrderForReview.gatewayRefId}</span>
                      </div>
                    )}

                    {selectedOrderForReview.manualCustomerNote && (
                      <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-bold">یادداشت مشتری هنگام ثبت فیش:</span>
                        <p className="text-slate-700 bg-white p-2 rounded-xl border border-slate-200 mt-1">
                          {selectedOrderForReview.manualCustomerNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Manual Approval Action Area (If Awaiting Verification) */}
                  {selectedOrderForReview.status === 'awaiting_manual_verification' && (
                    <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-4">
                      <div className="flex items-center gap-2 text-amber-900">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <h4 className="text-xs font-black">تصمیم‌گیری واحد مالی برای این فیش واریزی</h4>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          یادداشت داخلی یا علت رد / شماره پیگیری حسابداری:
                        </label>
                        <input
                          type="text"
                          value={adminReviewNoteInput}
                          onChange={e => setAdminReviewNoteInput(e.target.value)}
                          placeholder="مثال: با گردش حساب بانک ملی تطابق داده شد و تایید شد."
                          className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleReviewOrder(selectedOrderForReview.id, 'approved')}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تایید فیش بانکی و فعال‌سازی دوره</span>
                        </button>

                        <button
                          onClick={() => handleReviewOrder(selectedOrderForReview.id, 'rejected')}
                          className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>رد فیش بانکی</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-amber-800 leading-relaxed">
                        نکته امنیتی: پس از تایید مدیر، وضعیت سفارش به <b>paid</b> تغییر یافته و مجوز دسترسی دانش‌آموز به کلاس‌ها صادر می‌شود.
                      </p>
                    </div>
                  )}

                  {/* Auditable Status History Trail */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      تاریخچه ممیزی و تغییر وضعیت‌های سفارش (Audit Trail):
                    </h4>

                    <div className="space-y-2 border-r-2 border-orange-200 pr-4 mr-2">
                      {(selectedOrderForReview.statusHistory || []).map((hist, idx) => (
                        <div key={idx} className="relative text-xs space-y-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 absolute -right-[21px] top-1" />
                          <div className="flex items-center justify-between text-slate-400 text-[10px]">
                            <span>توسط: {hist.changedBy || 'سیستم'}</span>
                            <span>{formatToJalali(hist.timestamp)}</span>
                          </div>
                          <p className="text-slate-800 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            {hist.note || `تغییر وضعیت به: ${hist.status}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={() => setSelectedOrderForReview(null)}
                    className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
                  >
                    بستن پنجره
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                مدیریت کاربران، نقش‌ها و پیوند والدین به فرزندان
              </h3>
              <p className="text-xs text-slate-500">مشاهده زبان‌آموزان، اولیا و معلمان و تغییر نقش‌های سیستمی</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-4">نام کاربر</th>
                  <th className="p-4">ایمیل / شناسه</th>
                  <th className="p-4">شماره همراه</th>
                  <th className="p-4">رده سنی / توضیحات</th>
                  <th className="p-4">نقش سیستمی</th>
                  <th className="p-4">تغییر نقش</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {demoUsersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-4 font-black text-slate-900">{u.name}</td>
                    <td className="p-4 font-mono text-slate-500" dir="ltr">{u.email}</td>
                    <td className="p-4" dir="ltr">{u.phone}</td>
                    <td className="p-4">{u.age}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        u.role === 'admin' ? 'bg-red-100 text-red-800' :
                        u.role === 'teacher' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'guardian' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {u.role === 'admin' ? 'مدیر کل' : u.role === 'teacher' ? 'مدرس' : u.role === 'guardian' ? 'ولی' : 'دانش‌آموز'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={userRoleMap[u.id] || u.role}
                        onChange={(e) => {
                          const newRole = e.target.value as UserRole;
                          setUserRoleMap(prev => ({ ...prev, [u.id]: newRole }));
                          setDemoUsersList(prev => prev.map(item => item.id === u.id ? { ...item, role: newRole } : item));
                        }}
                        className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white cursor-pointer"
                      >
                        <option value="student">دانش‌آموز</option>
                        <option value="guardian">ولی دانش‌آموز</option>
                        <option value="teacher">مدرس</option>
                        <option value="admin">مدیر سیستم</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 11. AUTH VISUAL DESIGNER */}
      {activeTab === 'auth' && (
        <AuthVisualDesigner />
      )}

      {/* 12. SETTINGS & CURRENCY */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">تنظیمات مالی و اطلاعات آکادمی</h3>
              <p className="text-xs text-slate-500">تغییر واحد پولی سیستم (تومان / ریال) و مشخصات کارت بانکی</p>
            </div>
            <button
              onClick={handleSaveSettings}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saveSettingsSuccess ? 'ذخیره شد!' : 'ذخیره تنظیمات'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">واحد پولی سامانه (Currency)</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 font-bold"
              >
                <option value="toman">تومان (Toman)</option>
                <option value="rial">ریال (Rial)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                واحد انتخابی در تمامی صفحات سایت، پیش‌فاکتورها و پرداخت‌ها نمایش داده می‌شود.
              </p>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">نام رسمی آکادمی</label>
              <input
                type="text"
                value={brandNameInput}
                onChange={(e) => setBrandNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">شماره تماس پشتیبانی (تهران)</label>
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                dir="ltr"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left"
              />
            </div>
          </div>

          {/* Payment Gateway and Manual Payment Controls */}
          <div className="pt-6 border-t border-slate-150 space-y-4">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              تنظیمات درگاه‌های پرداخت و واریز بانکی (Payment Gateways)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Online Gateway Toggle */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-orange-950">درگاه پرداخت اینترنتی زرین‌پال (Zarinpal)</span>
                  <input
                    type="checkbox"
                    checked={onlineGatewayEnabledInput}
                    onChange={e => setOnlineGatewayEnabledInput(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  اتصال به شبکه شتاب و شاپرک از طریق زرین‌پال. کلیدها و شناسه مرچنت منحصراً در سرور ذخیره می‌شوند.
                </p>
              </div>

              {/* Manual Payment Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">پرداخت کارت به کارت و حواله شبا (Manual)</span>
                  <input
                    type="checkbox"
                    checked={manualPaymentEnabledInput}
                    onChange={e => setManualPaymentEnabledInput(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  امکان واریز مستقیم به حساب و ثبت فیش توسط زبان‌آموز با تایید دستی واحد مالی.
                </p>
              </div>
            </div>

            {/* Iranian Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">شماره کارت بانکی (کارت به کارت)</label>
                <input
                  type="text"
                  value={cardNumInput}
                  onChange={(e) => setCardNumInput(e.target.value)}
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left tracking-wider"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">نام صاحب حساب بانکی</label>
                <input
                  type="text"
                  value={cardOwnerInput}
                  onChange={(e) => setCardOwnerInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">نام بانک صادرکننده</label>
                <input
                  type="text"
                  value={bankNameInput}
                  onChange={(e) => setBankNameInput(e.target.value)}
                  placeholder="مثال: بانک ملی ایران"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">شماره شبا (IBAN)</label>
                <input
                  type="text"
                  value={ibanInput}
                  onChange={(e) => setIbanInput(e.target.value)}
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left tracking-wider"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black text-slate-700 block mb-1">
                  راهنمای فارسی پرداخت واریزی برای مشتریان
                </label>
                <textarea
                  rows={2}
                  value={manualInstructionsInput}
                  onChange={(e) => setManualInstructionsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
