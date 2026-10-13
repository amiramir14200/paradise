import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Course,
  Lesson,
  LiveClass,
  Enrollment,
  Quiz,
  QuizAttempt,
  AttendanceRecord,
  SiteSettings,
  CmsPage,
  UserProfile,
  MediaItem,
  NavigationItem,
  Announcement,
  QuestionGradeResult,
  HomeworkSubmission,
  CourseOrder
} from '../types';

export function gradeQuizSubmission(
  quiz: Quiz,
  userAnswers: Record<string, any>
): {
  score: number;
  totalPoints: number;
  passed: boolean;
  status: 'graded' | 'pending_teacher_review';
  questionResults: QuestionGradeResult[];
} {
  let earnedPoints = 0;
  let totalPoints = 0;
  let hasTeacherReviewPending = false;
  const questionResults: QuestionGradeResult[] = [];

  for (const q of quiz.questions) {
    const qPoints = q.points || 10;
    totalPoints += qPoints;
    const ans = userAnswers[q.id];

    let isCorrect = false;
    let earned = 0;
    let needsTeacherReview = false;

    if (q.type === 'multiple-choice') {
      isCorrect = Number(ans) === q.correctAnswerIndex;
      earned = isCorrect ? qPoints : 0;
    } else if (q.type === 'true-false') {
      isCorrect = Boolean(ans) === Boolean(q.correctBool);
      earned = isCorrect ? qPoints : 0;
    } else if (q.type === 'multiple-select') {
      const correctList = (q.correctAnswerIndices || []).sort();
      const userList = (Array.isArray(ans) ? ans : []).map(Number).sort();
      isCorrect =
        correctList.length === userList.length &&
        correctList.every((val, index) => val === userList[index]);
      earned = isCorrect ? qPoints : 0;
    } else if (q.type === 'fill-in-the-blank' || q.type === 'short-answer') {
      const normalizedUser = String(ans || '').trim().toLowerCase();
      const normalizedTarget = String(q.correctText || '').trim().toLowerCase();
      isCorrect = normalizedUser === normalizedTarget;
      earned = isCorrect ? qPoints : 0;
    } else if (q.type === 'matching') {
      const userMatches = typeof ans === 'object' && ans !== null ? ans : {};
      const pairs = q.matchingPairs || [];
      let correctMatches = 0;
      for (const pair of pairs) {
        if (userMatches[pair.left] === pair.right) {
          correctMatches++;
        }
      }
      isCorrect = pairs.length > 0 && correctMatches === pairs.length;
      earned = Math.round((correctMatches / (pairs.length || 1)) * qPoints);
    } else if (q.type === 'teacher-graded') {
      // Subjective answer: requires teacher review
      needsTeacherReview = true;
      hasTeacherReviewPending = true;
      isCorrect = false;
      earned = 0;
    }

    earnedPoints += earned;
    questionResults.push({
      questionId: q.id,
      isCorrect,
      userAnswer: ans,
      pointsEarned: earned,
      maxPoints: qPoints,
      needsTeacherReview,
      feedback: q.explanationFa
    });
  }

  const percentageScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = percentageScore >= quiz.passingScore;

  return {
    score: percentageScore,
    totalPoints,
    passed,
    status: hasTeacherReviewPending ? 'pending_teacher_review' : 'graded',
    questionResults
  };
}

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    name: 'کودکان در حال یادگیری آنلاین',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    category: 'banners',
    altText: 'کودک خندان در حال یادگیری انگلیسی با تبلت',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-2',
    name: 'کلاس آنلاین تعاملی',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    category: 'banners',
    altText: 'دانش‌آموزان در کلاس گروهی آنلاین',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-3',
    name: 'مدرسه و کتاب‌های داستان',
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    category: 'courses',
    altText: 'داستان‌خوانی کودکان به زبان انگلیسی',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-4',
    name: 'خانم سارا احمدی (مدرس)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    category: 'teachers',
    altText: 'خانم سارا احمدی مدرس تخصصی فونیکس و زبان کودک',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-5',
    name: 'آقای پوریا رضوانی (مدرس)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'teachers',
    altText: 'آقای پوریا رضوانی مدرس داستان و کارتون انگلیسی',
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_NAVIGATION: NavigationItem[] = [
  { id: 'nav-1', label: 'صفحه اصلی', link: '#home', order: 1, visible: true, target: 'header' },
  { id: 'nav-2', label: 'کاتالوگ دوره‌ها', link: '#courses', order: 2, visible: true, target: 'header' },
  { id: 'nav-3', label: 'تعیین سطح هوشمند', link: '#placement', order: 3, visible: true, target: 'header' },
  { id: 'nav-4', label: 'درباره پارادایس', link: '#about', order: 4, visible: true, target: 'header' },
  { id: 'nav-5', label: 'تماس و مشاوره', link: '#contact', order: 5, visible: true, target: 'header' }
];

export const DEFAULT_ANNOUNCEMENT: Announcement = {
  id: 'ann-1',
  message: 'ثبت‌نام ترم پاییز آکادمی پارادایس با ۳۰٪ تخفیف ویژه زبان‌آموزان جدید آغاز شد!',
  badge: 'تخفیف ویژه ترم جدید',
  link: '#courses',
  linkText: 'مشاهده دوره‌ها',
  active: true,
  bgColor: 'from-orange-600 to-amber-500',
  updatedAt: new Date().toISOString()
};

// Default initial data for seeding on first run
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  currency: 'toman',
  brandName: 'آکادمی زبان پارادایس',
  brandNameEn: 'Paradise Academy',
  brandPhone: '۰۲۱-۸۸۹۹۰۰۱۱',
  brandEmail: 'support@paradise-academy.ir',
  address: 'تهران، خیابان ولیعصر، تقاطع فاطمی، پلاک ۱۲۴، واحد ۴',
  onlineGatewayEnabled: true,
  manualPaymentEnabled: true,
  gatewayProvider: 'zarinpal',
  gatewaySandbox: true,
  iranCardNumber: '۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸',
  iranCardOwner: 'آکادمی پارادایس (بانک ملی ایران)',
  iranBankName: 'بانک ملی ایران',
  iranIban: 'IR120170000000123456789012',
  manualPaymentInstructions: 'لطفاً مبلغ دوره را به شماره کارت یا شماره شبای فوق واریز نموده، سپس کد پیگیری و ۴ رقم آخر کارت را در فرم زیر وارد فرمایید. کارشناسان مالی حداکثر ظرف ۲ ساعت فیش را بررسی و دسترسی شما را فعال می‌کنند.',
  registrationOpen: true,
  announcement: DEFAULT_ANNOUNCEMENT,
  navigationItems: DEFAULT_NAVIGATION,
  authDesigner: {
    headline: 'یادگیری شاد، پویا و اصولی انگلیسی برای آینده‌سازان ایران',
    subheadline: 'کلاس‌های تعاملی آنلاین برای سنین ۶ تا ۱۷ سال با اساتید برتر کودک و نوجوان',
    accentColor: '#F97316',
    layoutStyle: 'split',
    backgroundGradient: 'from-amber-500 via-orange-500 to-amber-600',
    brandLogoText: 'آکادمی پارادایس',
    showPhoneField: true,
    requireAgeBracket: true,
    contrastMode: 'standard',
    perks: [
      'کلاس‌های تعاملی با ظرفیت محدود (حداکثر ۸ نفر)',
      'سیستم اختصاصی نظارت والدین و گزارش هفتگی پیشرفت',
      'گواهی پایان دوره معتبر و قابل استعلام',
      'تمرین‌های صوتی هوشمند و بازی‌های جذاب آموزشی'
    ],
    login: {
      title: 'ورود به حساب کاربری',
      subtitle: 'برای دسترسی به کلاس‌های زنده و دوره‌های آموزشی وارد شوید',
      welcomeNote: 'خوش آمدید! ماجراجویی انگلیسی شما ادامه دارد.',
      showSocialLogin: true
    },
    register: {
      title: 'عضویت در آکادمی پارادایس',
      subtitle: 'حساب کاربری جدید برای فرزند یا خود بسازید',
      termsText: 'با ثبت‌نام، قوانین و حفظ حریم خصوصی آکادمی را می‌پذیرید.',
      allowedRoles: ['student', 'guardian', 'teacher'],
      showAgeSelector: true,
      requirePhone: true
    }
  },
  updatedAt: new Date().toISOString()
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-phonics-1',
    title: 'انگلیسی شاد و فونیکس جادویی (Magic Phonics)',
    titleEn: 'Magic Phonics & Sound Adventures',
    slug: 'magic-phonics-6-9',
    description: 'یادگیری اصولی حروف الفبا، صداها، و کلمات نخستین انگلیسی با شعر، انیمیشن و بازی‌های تعاملی مخصوص کودکان ۶ تا ۹ سال.',
    ageBracket: '6-9',
    level: 'starter',
    price: 850000,
    originalPrice: 1100000,
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    badge: 'محبوب‌ترین کودکان',
    features: ['آموزش صداهای ۲۶ حرف الفبا', 'فلش‌کارت‌های صوتی و مصور', 'کلاس آنلاین شاد ۲ جلسه در هفته', 'کاربرگ‌های هفتگی رنگ‌آمیزی'],
    instructorName: 'خانم سارا احمدی',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    syllabusCount: 16,
    isPublished: true,
    liveSessionsCount: 16,
    durationWeeks: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-storytime-2',
    title: 'قصه و داستان‌های ماجراجویانه انگلیسی',
    titleEn: 'Adventure Stories & Conversational Fun',
    slug: 'storytime-fun-6-9',
    description: 'پرورش تخیل کودک و تقویت مهارت شنیداری و گفتاری از طریق داستان‌خوانی جذاب و کارتون‌های آموزشی هدفمند.',
    ageBracket: '6-9',
    level: 'elementary',
    price: 920000,
    originalPrice: 1200000,
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    badge: 'پرانرژی و خلاقانه',
    features: ['۱۲ داستان جذاب مصور', 'شخصیت‌پردازی و ایفای نقش صوتی', 'گزارش هفتگی ویدئویی برای والدین', 'پشتیبانی اختصاصی معلم'],
    instructorName: 'آقای پوریا رضوانی',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    syllabusCount: 12,
    isPublished: true,
    liveSessionsCount: 12,
    durationWeeks: 6,
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-junior-explorers-3',
    title: 'قهرمانان مکالمه و گرامر کاربردی (Junior Explorers)',
    titleEn: 'Junior Explorers: Everyday Conversations',
    slug: 'junior-explorers-10-12',
    description: 'تقویت اعتماد به نفس صحبت کردن، ساخت جملات صحیح بدون ترس از گرامر، و واژگان موضوعی مدرسه، سفر و فناوری برای نوجوانان ۱۰ تا ۱۲ سال.',
    ageBracket: '10-12',
    level: 'intermediate',
    price: 1250000,
    originalPrice: 1550000,
    thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    badge: 'پیشنهاد ویژه اساتید',
    features: ['بحث‌های گروهی پرشور', 'کارگاه گرامر تعاملی بدون حفظ فرمول', 'پروژه‌های خلاقانه هفتگی', 'جلسات رفع اشکال انفرادی'],
    instructorName: 'خانم مریم کاظمی',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    syllabusCount: 20,
    isPublished: true,
    liveSessionsCount: 20,
    durationWeeks: 10,
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-vocabulary-master-4',
    title: 'ماراتن واژگان و چالش مکالمه (Vocab Master)',
    titleEn: 'Vocab Master & Speed Speaking',
    slug: 'vocab-master-10-12',
    description: 'یادگیری بیش از ۵۰۰ واژه پرکاربرد زبان انگلیسی در قالب موقعیت‌های واقعی، بازی‌های رقابتی، و اتاق‌های گفتگوی جذاب دو نفره.',
    ageBracket: '10-12',
    level: 'elementary',
    price: 980000,
    originalPrice: 1300000,
    thumbnail: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
    badge: 'بازی‌محور و پرتحرک',
    features: ['سیستم لیگ رقابتی و ستاره‌ها', 'کوئیزهای تعاملی کلاسی', 'بانک لغات هوشمند صوتی', 'مدال افتخار دانش‌آموز برتر'],
    instructorName: 'آقای امیر راد',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    syllabusCount: 16,
    isPublished: true,
    liveSessionsCount: 16,
    durationWeeks: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-teen-fluency-5',
    title: 'مکالمه روان و آمادگی آیلتس نوجوانان (Teen Fluency)',
    titleEn: 'Teen Fluency & IELTS Bridge',
    slug: 'teen-fluency-13-17',
    description: 'دوره تخصصی نوجوانان ۱۳ تا ۱۷ سال برای تسلط بر مناظره، ارائه، مکالمات بین‌المللی، و ساخت پایه علمی مستحکم برای آزمون‌های بین‌المللی.',
    ageBracket: '13-17',
    level: 'upper-intermediate',
    price: 1650000,
    originalPrice: 2100000,
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    badge: 'پیشرفته و آکادمیک',
    features: ['تمرین مناظره انگلیسی (Debate)', 'آشنایی با متدهای Speaking آیلتس', 'تولید محتوا و پادکست دانش‌آموزی', 'ارزیابی ماهانه با استاد برتر'],
    instructorName: 'استاد علیرضا شمس',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    syllabusCount: 24,
    isPublished: true,
    liveSessionsCount: 24,
    durationWeeks: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: 'course-teen-writing-6',
    title: 'نگارش مقالات تحلیلی و ریدینگ پیشرفته (Academic Writing)',
    titleEn: 'Teen Critical Reading & Essay Craft',
    slug: 'teen-writing-13-17',
    description: 'یادگیری ساختار پاراگراف، مقاله‌نویسی آکادمیک و درک عمیق متون علمی و ادبی انگلیسی مناسب المپیادها و دبیرستان.',
    ageBracket: '13-17',
    level: 'advanced',
    price: 1780000,
    originalPrice: 2300000,
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    badge: 'تخصصی کنکور و مهاجرت',
    features: ['تصحیح خط‌به‌خط مقالات', 'آموزش ساختار استدلال و Essay', 'تحلیل رمان‌ها و مقالات کوتاه', 'نمونه سوالات استاندارد'],
    instructorName: 'دکتر الهام ستوده',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    syllabusCount: 20,
    isPublished: true,
    liveSessionsCount: 20,
    durationWeeks: 10,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-phonics-1-1',
    courseId: 'course-phonics-1',
    moduleTitle: 'فصل اول: الفبای جادویی و صداهای ابتدایی',
    title: 'جلسه ۱: صدای جادویی /æ/ و /b/ با الف و بابی خرگوشه',
    titleEn: 'Unit 1: Letter Sounds A & B with Apple & Bob the Bunny',
    order: 1,
    durationMinutes: 45,
    summary: 'در این جلسه کودکان با صدای کوتاه A مثل Apple و صدای B مثل Ball آشنا می‌شوند و می‌توانند اولین کلمات خود را ادا کنند.',
    grammarFocus: 'حروف صدادار و بی‌صدا (Vowels & Consonants): صدای باز حرف A در برابر ضربه لب‌ها در حرف B',
    readingText: 'Look at the apple! It is red and sweet. Bob has a big blue ball. He plays with the ball under the green tree.',
    readingTranslation: 'به سیب نگاه کن! قرمز و شیرین است. بابی یک توپ بزرگ آبی دارد. او زیر درخت سبز با توپ بازی می‌کند.',
    listeningPrompt: 'Apple, Ball, Ant, Bear! Can you hear the bouncy sound of /b/?',
    homeworkPrompt: 'نقاشی یک سیب قرمز و یک توپ رنگی را بکشید و نام انگلیسی آن‌ها (Apple, Ball) را کنارش با مداد بنویسید.',
    resourceFiles: [
      { name: 'کاربرگ تمرین الفبای A و B (PDF)', url: 'https://example.com/phonics-ab.pdf', type: 'pdf' },
      { name: 'فایل صوتی تلفظ ترانه الفبا (Audio)', url: 'https://example.com/audio-phonics-1.mp3', type: 'audio' }
    ],
    vocabulary: [
      { id: 'v1', word: 'Apple', translation: 'سیب', phonetic: '/ˈæp.əl/', partOfSpeech: 'اسم', example: 'I eat a red apple.', exampleFa: 'من یک سیب قرمز می‌خورم.' },
      { id: 'v2', word: 'Ant', translation: 'مورچه', phonetic: '/ænt/', partOfSpeech: 'اسم', example: 'The ant is tiny.', exampleFa: 'مورچه خیلی کوچک است.' },
      { id: 'v3', word: 'Ball', translation: 'توپ', phonetic: '/bɔːl/', partOfSpeech: 'اسم', example: 'Kick the blue ball.', exampleFa: 'به توپ آبی شوت بزن.' },
      { id: 'v4', word: 'Bear', translation: 'خرس', phonetic: '/beər/', partOfSpeech: 'اسم', example: 'Big brown bear.', exampleFa: 'خرس قهوه‌ای بزرگ.' }
    ],
    exercises: [
      {
        id: 'e1',
        type: 'multiple-choice',
        prompt: 'کدام کلمه با صدای /æ/ مثل Apple شروع می‌شود؟',
        options: ['Ball', 'Ant', 'Cat', 'Dog'],
        correctAnswer: 'Ant',
        explanationFa: 'واژه Ant با همان صدای حرف A در Apple آغاز می‌شود.'
      },
      {
        id: 'e2',
        type: 'multiple-choice',
        prompt: 'کلمه Ball در زبان فارسی به چه معناست؟',
        options: ['کتاب', 'توپ', 'سیب', 'مورچه'],
        correctAnswer: 'توپ',
        explanationFa: 'Ball به معنی توپ بازی است.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'lesson-phonics-1-2',
    courseId: 'course-phonics-1',
    moduleTitle: 'فصل اول: الفبای جادویی و صداهای ابتدایی',
    title: 'جلسه ۲: ترکیب صداها و خواندن کلمات سه‌حرفی (CVC)',
    titleEn: 'Unit 2: Blending CVC Words (Cat, Bat, Hat)',
    order: 2,
    durationMinutes: 45,
    summary: 'کودکان با ترکیب صداها کلمات ساده انگلیسی را هجی کرده و اولین جملات کوتاه خود را می‌خوانند.',
    grammarFocus: 'قاعده CVC (صامت - مصوت - صامت): خواندن ریتمیک کلمات تک‌سیلابی مانند Cat و Bat',
    readingText: 'The cat sat on the mat. The cat saw a bat with a hat! What a funny cat!',
    readingTranslation: 'گربه روی زیرانداز نشست. گربه یک خفاش کلاه‌به‌سر دید! چه گربه بامزه‌ای!',
    listeningPrompt: 'Listen carefully: C-A-T makes CAT! B-A-T makes BAT! Can you repeat after me?',
    homeworkPrompt: 'سه کلمه هم‌قافیه CVC (مثل Cat, Hat, Bat) را با صدای بلند بخوانید و صدای خود را برای معلم ارسال کنید.',
    resourceFiles: [
      { name: 'پازل تصویری ساخت کلمات سه‌حرفی (Worksheet)', url: 'https://example.com/cvc-puzzle.pdf', type: 'worksheet' }
    ],
    vocabulary: [
      { id: 'v5', word: 'Cat', translation: 'گربه', phonetic: '/kæt/', example: 'The cat is soft.', exampleFa: 'گربه نرم است.' },
      { id: 'v6', word: 'Bat', translation: 'خفاش / چوب بیسبال', phonetic: '/bæt/', example: 'The bat flies at night.', exampleFa: 'خفاش شب‌ها پرواز می‌کند.' },
      { id: 'v7', word: 'Hat', translation: 'کلاه', phonetic: '/hæt/', example: 'Put on your sunny hat.', exampleFa: 'کلاه آفتابی‌ات را سرت بگذار.' }
    ],
    exercises: [
      {
        id: 'e3',
        type: 'multiple-choice',
        prompt: 'ترکیب صداهای /k/ + /æ/ + /t/ کدام واژه را می‌سازد؟',
        options: ['Hat', 'Bat', 'Cat', 'Mat'],
        correctAnswer: 'Cat',
        explanationFa: 'حروف c-a-t با هم کلمه Cat به معنی گربه را تشکیل می‌دهند.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'lesson-junior-3-1',
    courseId: 'course-junior-explorers-3',
    moduleTitle: 'فصل اول: گفتگوهای روزمره و برنامه‌های هفتگی',
    title: 'جلسه ۱: روتین روزانه و معرفی سرگرمی‌ها (Daily Routines)',
    titleEn: 'Unit 1: My Vibrant Daily Routine & Weekend Hobbies',
    order: 1,
    durationMinutes: 60,
    summary: 'بیان ساعت، کارهای روزمره، فعالیت‌های مدرسه و استفاده طبیعی از افعال زمان حال ساده در مکالمه.',
    grammarFocus: 'زمان حال ساده (Simple Present Tense): تفاوت فاعل I/You/They با He/She و افزودن s سوم شخص',
    readingText: 'Every morning at 7:00 AM, Kian wakes up and eats a healthy breakfast with his family. He rides his bicycle to school and loves science class. In the afternoons, he practices English on Paradise Academy and plays chess.',
    readingTranslation: 'هر روز صبح در ساعت ۷:۰۰، کیان بیدار می‌شود و همراه خانواده صبحانه‌ای سالم می‌خورد. او با دوچرخه به مدرسه می‌رود و عاشق کلاس علوم است. بعدازظهرها در آکادمی پارادایس انگلیسی تمرین می‌کند و شطرنج بازی می‌کند.',
    listeningPrompt: 'Listen to Kian describing his favorite hobby: "Playing chess helps me think strategically and stay calm under pressure."',
    homeworkPrompt: 'برنامه روزانه خود را در ۵ خط انگلیسی بنویسید (از بیدار شدن تا خوابیدن) و حداقل دو قید زمان مانند usually و always به کار ببرید.',
    resourceFiles: [
      { name: 'جدول برنامه هفتگی روتین انگلیسی (PDF)', url: 'https://example.com/routine-tracker.pdf', type: 'pdf' }
    ],
    vocabulary: [
      { id: 'v11', word: 'Wake up', translation: 'بیدار شدن', phonetic: '/weɪk ʌp/', partOfSpeech: 'فعل', example: 'I wake up at dawn.', exampleFa: 'من سپیده‌دم بیدار می‌شوم.' },
      { id: 'v12', word: 'Routine', translation: 'برنامه روتین و منظم', phonetic: '/ruːˈtiːn/', partOfSpeech: 'اسم', example: 'Morning routine gives me energy.', exampleFa: 'روتین صبحگاهی به من انرژی می‌دهد.' },
      { id: 'v13', word: 'Healthy', translation: 'سالم و تندرست', phonetic: '/ˈhel.θi/', partOfSpeech: 'صفت', example: 'Eat fresh and healthy food.', exampleFa: 'غذای تازه و سالم بخورید.' },
      { id: 'v14', word: 'Hobby', translation: 'سرگرمی مورد علاقه', phonetic: '/ˈhɒb.i/', partOfSpeech: 'اسم', example: 'Photography is my passion and hobby.', exampleFa: 'عکاسی اشتیاق و سرگرمی من است.' }
    ],
    exercises: [
      {
        id: 'ej1',
        type: 'multiple-choice',
        prompt: 'کدام شکل فعل صحیح است؟ "My brother ____ soccer every Friday."',
        options: ['play', 'plays', 'playing', 'played'],
        correctAnswer: 'plays',
        explanationFa: 'برای فاعل سوم شخص مفرد My brother در زمان حال ساده s سوم شخص لازم است.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'lesson-teen-5-1',
    courseId: 'course-teen-fluency-5',
    moduleTitle: 'فصل اول: مناظره، ارتباطات پیشرفته و آمادگی آزمون',
    title: 'جلسه ۱: هنر بیان نظر و مناظره مودبانه (Expressing Opinions)',
    titleEn: 'Unit 1: The Art of Agreeing & Disagreeing Diplomatically',
    order: 1,
    durationMinutes: 60,
    summary: 'آموزش اصطلاحات کلیدی برای بیان دیدگاه، مخالفت محترمانه و مشارکت در بحث‌های گروهی پیرامون فناوری و آینده.',
    grammarFocus: 'ساختارهای دیپلماتیک و ملایم‌کننده‌ها (Hedging & Nuanced Modals): استفاده از It appears that, I am inclined to believe, In light of',
    readingText: 'In contemporary debates, effective communication is rarely about shouting the loudest; it is about structuring cohesive arguments with reliable supporting evidence. Teenagers who cultivate diplomatic discourse early gain enormous advantages in university admissions, IELTS interviews, and international collaborations.',
    readingTranslation: 'در مناظرات امروزی، ارتباط موثر به‌ندرت به معنای فریاد زدن است؛ بلکه ساختاربندی استدلال‌های منسجم همراه با شواهد موثق است. نوجوانانی که گفتمان دیپلماتیک را در سنین پایین فرا می‌گیرند، در پذیرش دانشگاه، مصاحبه آیلتس و همکاری‌های بین‌المللی مزیت چشمگیری پیدا می‌کنند.',
    listeningPrompt: 'Audio lecture: "Listen to the nuances between aggressive confrontation versus diplomatic rebuttal in formal debates."',
    homeworkPrompt: 'یک پاراگراف استدلالی (۱۰۰ کلمه) درباره مزایا و خطرات شبکه‌های اجتماعی برای نوجوانان بنویسید و حداقل از دو اصطلاح دیپلماتیک آموخته‌شده استفاده کنید.',
    resourceFiles: [
      { name: 'واژه‌نامه تخصصی مناظره آیلتس (PDF)', url: 'https://example.com/ielts-debate-handout.pdf', type: 'pdf' },
      { name: 'پادکست آموزشی تکنیک‌های Speaking آیلتس (MP3)', url: 'https://example.com/ielts-podcast-1.mp3', type: 'audio' }
    ],
    vocabulary: [
      { id: 'v8', word: 'In my perspective', translation: 'از دیدگاه من', phonetic: '/pəˈspek.tɪv/', example: 'In my perspective, online education saves valuable time.', exampleFa: 'از دیدگاه من، آموزش آنلاین در وقت صرفه‌جویی می‌کند.' },
      { id: 'v9', word: 'I see your point, but...', translation: 'نکته شما را می‌فهمم، اما...', example: 'I see your point, but we must consider the downsides.', exampleFa: 'حرف شما را متوجه می‌شوم، اما باید معایب را هم بسنجیم.' },
      { id: 'v10', word: 'Convincing', translation: 'قانع‌کننده', phonetic: '/kənˈvɪn.sɪŋ/', example: 'Her argument was entirely convincing.', exampleFa: 'استدلال او کاملاً قانع‌کننده بود.' },
      { id: 'v15', word: 'Substantiate', translation: 'با دلیل و مدرک اثبات کردن', phonetic: '/səbˈstæn.ʃi.eɪt/', example: 'Always substantiate your claims with facts.', exampleFa: 'همیشه ادعاهای خود را با حقایق اثبات کنید.' }
    ],
    exercises: [
      {
        id: 'e4',
        type: 'multiple-choice',
        prompt: 'Which phrase is the most formal way to express disagreement?',
        options: ["You are wrong!", "No way!", "I respect your view, however I have a different take.", "That is silly."],
        correctAnswer: "I respect your view, however I have a different take.",
        explanationFa: 'این عبارت محترمانه‌ترین شیوه برای ابراز تفاوت دیدگاه در مکالمات حرفه‌ای است.'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_LIVE_CLASSES: LiveClass[] = [
  {
    id: 'class-live-101',
    courseId: 'course-phonics-1',
    courseTitle: 'انگلیسی شاد و فونیکس جادویی (Magic Phonics)',
    teacherId: 'teacher-sara-1',
    teacherName: 'خانم سارا احمدی',
    title: 'جلسه زنده تمرین تلفظ و بازی با کارت‌های حیوانات',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationMinutes: 45,
    meetingUrl: 'https://skyroom.online/ch/paradise/kids-phonics-101',
    capacity: 8,
    enrolledStudentIds: ['demo-student-1'],
    status: 'scheduled',
    sessionNotes: 'کودکان عزیز لطفاً مدادرنگی و کاربرگ صفحه ۴ را همراه داشته باشند.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'class-live-102',
    courseId: 'course-junior-explorers-3',
    courseTitle: 'قهرمانان مکالمه و گرامر کاربردی (Junior Explorers)',
    teacherId: 'teacher-maryam-2',
    teacherName: 'خانم مریم کاظمی',
    title: 'کارگاه گفتگوی آزاد: حیوان خانگی مورد علاقه من و سفر در زمان',
    scheduledAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    durationMinutes: 60,
    meetingUrl: 'https://skyroom.online/ch/paradise/junior-speaking-102',
    capacity: 10,
    enrolledStudentIds: ['demo-student-1'],
    status: 'scheduled',
    sessionNotes: 'آماده کردن ۲ دقیقه توضیح انگلیسی درباره یک وسیله جالب در اتاق خوابتان.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'class-live-103',
    courseId: 'course-teen-fluency-5',
    teacherId: 'teacher-alireza-3',
    teacherName: 'استاد علیرضا شمس',
    courseTitle: 'مکالمه روان و آمادگی آیلتس نوجوانان (Teen Fluency)',
    title: 'مناظره کلاسی: آیا هوش مصنوعی جای انسان را خواهد گرفت؟',
    scheduledAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    durationMinutes: 75,
    meetingUrl: 'https://skyroom.online/ch/paradise/teen-debate-103',
    capacity: 12,
    enrolledStudentIds: [],
    status: 'scheduled',
    sessionNotes: 'مطالعه مقاله کوتاه ارسالی در کانال تلگرام آکادمی قبل از شروع جلسه.',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'placement-test-general',
    title: 'آزمون تعیین سطح هوشمند آنلاین پارادایس',
    description: 'تست استاندارد تعیین سطح برای تشخیص بهترین دوره آموزشی متناسب با سن و توانایی شما',
    ageBracket: 'all',
    timeLimitMinutes: 10,
    passingScore: 70,
    isPlacementTest: true,
    questions: [
      {
        id: 'q1',
        prompt: 'کدام گزینه کلمه "کتاب" به انگلیسی است؟',
        promptEn: 'Choose the word for "book":',
        options: ['Door', 'Book', 'Apple', 'Pen'],
        correctAnswerIndex: 1,
        points: 20,
        type: 'multiple-choice',
        explanationFa: 'واژه Book به معنی کتاب است.'
      },
      {
        id: 'q2',
        prompt: 'جمله را کامل کنید: "She ____ playing tennis right now."',
        promptEn: 'Complete the sentence: "She ____ playing tennis right now."',
        options: ['is', 'are', 'were', 'have'],
        correctAnswerIndex: 0,
        points: 20,
        type: 'multiple-choice',
        explanationFa: 'برای فاعل سوم شخص مفرد She در زمان حال استمراری از فعل کمکی is استفاده می‌شود.'
      },
      {
        id: 'q3',
        prompt: 'متضاد کلمه "Dangerous" (خطرناک) کدام است؟',
        promptEn: 'What is the opposite of "Dangerous"?',
        options: ['Fast', 'Safe', 'Scary', 'Heavy'],
        correctAnswerIndex: 1,
        points: 20,
        type: 'multiple-choice',
        explanationFa: 'متضاد واژه Dangerous کلمه Safe (امن) است.'
      },
      {
        id: 'q4',
        prompt: 'کدام پاسخ مودبانه‌تر است؟ "Could you please pass the salt?"',
        promptEn: 'How to respond politely: "Could you please pass the salt?"',
        options: ["Here you go!", "Why not?", "I don't know.", "Whatever."],
        correctAnswerIndex: 0,
        points: 20,
        type: 'multiple-choice',
        explanationFa: 'عبارت Here you go بهترین پاسخ دوستانه و مودبانه هنگام تقدیم کردن شیء است.'
      },
      {
        id: 'q5',
        prompt: 'معنی عبارت "Under the weather" چیست؟',
        promptEn: 'What does the idiom "Under the weather" mean?',
        options: ['زیر باران ماندن', 'کمی ناخوش یا بیمار بودن', 'هوای آفتابی داشتن', 'عجله داشتن'],
        correctAnswerIndex: 1,
        points: 20,
        type: 'multiple-choice',
        explanationFa: 'اصطلاح انگلیسی Under the weather به معنی کمی احساس بیماری یا کسالت داشتن است.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'quiz-unit-junior-1',
    courseId: 'course-junior-explorers-3',
    title: 'آزمون جامع پایان فصل ۱: مهارت‌های مکالمه و گرامر',
    description: 'آزمون چند مهارتی شامل سوالات چندگزینه‌ای، صحیح/غلط، جای خالی، تطبیق واژگان و بخش تشریحی گفتاری',
    ageBracket: '10-12',
    timeLimitMinutes: 15,
    passingScore: 75,
    mode: 'exam',
    shuffleQuestions: false,
    maxAttempts: 3,
    isPlacementTest: false,
    questions: [
      {
        id: 'uq1',
        prompt: 'عبارت مناسب را انتخاب کنید: "I usually ____ up at 7:00 AM."',
        promptEn: 'Choose the correct form: "I usually ____ up at 7:00 AM."',
        type: 'multiple-choice',
        points: 15,
        options: ['wakes', 'wake', 'waking', 'woke'],
        correctAnswerIndex: 1,
        explanationFa: 'برای فاعل I در زمان حال ساده فعل به صورت ساده wake استفاده می‌شود.'
      },
      {
        id: 'uq2',
        prompt: 'کدام یک از کلمات زیر اسامی میوه‌ها هستند؟ (انتخاب چندتایی)',
        promptEn: 'Which words are fruits? (Multiple Select)',
        type: 'multiple-select',
        points: 15,
        options: ['Apple', 'Carrot', 'Banana', 'Desk'],
        correctAnswerIndices: [0, 2],
        explanationFa: 'سیب (Apple) و موز (Banana) هر دو میوه هستند.'
      },
      {
        id: 'uq3',
        prompt: 'آیا جمله "They is watching a movie" از نظر گرامری درست است؟',
        promptEn: 'Is "They is watching a movie" grammatically correct? (True / False)',
        type: 'true-false',
        points: 15,
        correctBool: false,
        explanationFa: 'نادرست است؛ برای فاعل جمع They باید از فعل کمکی are استفاده شود.'
      },
      {
        id: 'uq4',
        prompt: 'کلمه ناقص را تایپ کنید: "The sun rises in the ____ (شرق)"',
        promptEn: 'Fill in the blank with the direction "east":',
        type: 'fill-in-the-blank',
        points: 15,
        correctText: 'east',
        explanationFa: 'واژه east به معنی شرق است.'
      },
      {
        id: 'uq5',
        prompt: 'کلمات انگلیسی را به متضاد مناسب خود وصل کنید:',
        promptEn: 'Match the opposites:',
        type: 'matching',
        points: 20,
        matchingPairs: [
          { left: 'Hot', right: 'Cold' },
          { left: 'Big', right: 'Small' },
          { left: 'Happy', right: 'Sad' }
        ],
        explanationFa: 'Hot <-> Cold (گرم و سرد)، Big <-> Small (بزرگ و کوچک)، Happy <-> Sad (شاد و غمگین).'
      },
      {
        id: 'uq6',
        prompt: 'بخش تشریحی (نیازمند بررسی معلم): خودتان را در دو جمله انگلیسی معرفی کنید و بگویید غذای مورد علاقه‌تان چیست.',
        promptEn: 'Subjective speaking/writing: Introduce yourself in two sentences and state your favorite food.',
        type: 'teacher-graded',
        points: 20,
        explanationFa: 'استاد شما این پاسخ را بررسی کرده و بازخورد اختصاصی خود را ارسال خواهد کرد.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'quiz-phonics-kids-1',
    courseId: 'course-phonics-1',
    title: 'کوئیز شاد حیوانات و الفبا (Fun Phonics Quiz)',
    description: 'کارگاه کوئیز خودآزمایی با تلفظ صوتی و تمرین جذاب متصل کردن کلمات برای کودکان ۶ تا ۹ سال',
    ageBracket: '6-9',
    timeLimitMinutes: 10,
    passingScore: 60,
    mode: 'practice',
    shuffleQuestions: false,
    maxAttempts: 5,
    isPlacementTest: false,
    questions: [
      {
        id: 'pq1',
        prompt: 'کدام کلمه با تصویر «سیب قرمز» تطابق دارد؟',
        promptEn: 'Which word matches the red fruit?',
        type: 'multiple-choice',
        points: 25,
        options: ['Ball', 'Apple', 'Cat', 'Bear'],
        correctAnswerIndex: 1,
        audioWord: 'Apple',
        explanationFa: 'Apple به معنی سیب است و با صدای /æ/ شروع می‌شود.'
      },
      {
        id: 'pq2',
        prompt: 'آیا واژه Cat با صدای حرف B شروع می‌شود؟ (صحیح یا غلط)',
        promptEn: 'Does "Cat" start with the sound of "B"?',
        type: 'true-false',
        points: 25,
        correctBool: false,
        explanationFa: 'نادرست است؛ واژه Cat با صدای /k/ از حرف C آغاز می‌شود.'
      },
      {
        id: 'pq3',
        prompt: 'حروف حیوانات انگلیسی را به نام‌هایشان وصل کنید:',
        promptEn: 'Match the letters to animal words:',
        type: 'matching',
        points: 25,
        matchingPairs: [
          { left: 'A', right: 'Ant' },
          { left: 'B', right: 'Bear' },
          { left: 'C', right: 'Cat' }
        ],
        explanationFa: 'A برای Ant (مورچه)، B برای Bear (خرس)، C برای Cat (گربه).'
      },
      {
        id: 'pq4',
        prompt: 'کدام گزینه‌ها از وسایل بازی و ورزش هستند؟ (انتخاب چندتایی)',
        promptEn: 'Which items are toys or sports gear? (Multiple Select)',
        type: 'multiple-select',
        points: 25,
        options: ['Ball', 'Apple', 'Bat', 'Ant'],
        correctAnswerIndices: [0, 2],
        explanationFa: 'Ball (توپ) و Bat (چوب بیسبال) وسایل بازی هستند.'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'quiz-teen-ielts-1',
    courseId: 'course-teen-fluency-5',
    title: 'آزمون رسمی ارزیابی مناظره و ساختار ریدینگ آیلتس',
    description: 'آزمون زمان‌دار حرفه‌ای برای سنجش مهارت‌های تحلیل متن، واژگان آکادمیک و نگارش استدلالی',
    ageBracket: '13-17',
    timeLimitMinutes: 20,
    passingScore: 70,
    mode: 'exam',
    shuffleQuestions: true,
    maxAttempts: 2,
    isPlacementTest: false,
    questions: [
      {
        id: 'tq1',
        prompt: 'Choose the most suitable synonym for "substantiate":',
        promptEn: 'Academic Vocabulary in Context',
        type: 'multiple-choice',
        points: 20,
        options: ['Diminish', 'Corroborate with evidence', 'Ignore completely', 'Fabricate'],
        correctAnswerIndex: 1,
        explanationFa: 'واژه Substantiate مترادف با اثبات و تایید با ارائه شواهد (Corroborate) است.'
      },
      {
        id: 'tq2',
        prompt: 'Which indicators signal a cautious academic claim (Hedging)? (Multiple Select)',
        promptEn: 'Select all phrases functioning as hedging devices:',
        type: 'multiple-select',
        points: 20,
        options: ['It is arguably true', 'Undoubtedly and 100% proved', 'Evidence suggests that', 'Without question'],
        correctAnswerIndices: [0, 2],
        explanationFa: 'عبارات It is arguably و Evidence suggests به عنوان تکنیک‌های احتیاط آکادمیک (Hedging) به کار می‌روند.'
      },
      {
        id: 'tq3',
        prompt: 'Type the opposite of "subjective" (شخصی و سلیقه‌ای):',
        promptEn: 'Fill in the blank with the academic antonym:',
        type: 'fill-in-the-blank',
        points: 20,
        correctText: 'objective',
        explanationFa: 'متضاد subjective کلمه objective (عینی و بی‌طرفانه) است.'
      },
      {
        id: 'tq4',
        prompt: 'Connect academic discourse markers to their functions:',
        promptEn: 'Match markers to rhetorical purpose:',
        type: 'matching',
        points: 20,
        matchingPairs: [
          { left: 'Furthermore', right: 'Adding support' },
          { left: 'Conversely', right: 'Contrasting' },
          { left: 'Consequently', right: 'Showing result' }
        ],
        explanationFa: 'Furthermore برای افزودن استدلال، Conversely برای تضاد و Consequently برای بیان نتیجه استفاده می‌شود.'
      },
      {
        id: 'tq5',
        prompt: 'بخش تشریحی آیلتس (نمره‌دهی توسط استاد): در سه جمله نظر خود را بنویسید: آیا استفاده از هوش مصنوعی در تکالیف مدرسه باید کاملاً ممنوع شود یا آموزش داده شود؟',
        promptEn: 'IELTS Task 2 Short Argument: Should AI be banned in homework or taught responsibly? Provide 2 reasoned sentences.',
        type: 'teacher-graded',
        points: 20,
        explanationFa: 'استاد دپارتمان آیلتس بر اساس گرامر، دامنه لغات (Lexical Resource) و انسجام نمره‌دهی خواهد کرد.'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_HOMEWORK: HomeworkSubmission[] = [
  {
    id: 'hw-sub-1',
    lessonId: 'lesson-phonics-1-1',
    lessonTitle: 'جلسه ۱: صدای جادویی /æ/ و /b/ با الف و بابی خرگوشه',
    courseId: 'course-phonics-1',
    studentId: 'demo-student-1',
    studentName: 'کیان رضایی (کودک ۸ ساله)',
    submissionText: 'I love red apples! Apple is very sweet and I drew a picture of a bunny with a big blue ball.',
    status: 'submitted',
    submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'hw-sub-2',
    lessonId: 'lesson-teen-5-1',
    lessonTitle: 'جلسه ۱: هنر بیان نظر و مناظره مودبانه (Expressing Opinions)',
    courseId: 'course-teen-fluency-5',
    studentId: 'demo-student-2',
    studentName: 'سارا صادقی (نوجوان ۱۴ ساله)',
    submissionText: 'In my perspective, technology can enhance learning when used responsibly, but human mentorship remains irreplaceable.',
    status: 'graded',
    score: 95,
    teacherFeedback: 'آفرین سارا جان! ساختار جمله بسیار روان، استفاده از واژگان In my perspective و enhances کاملاً صحیح و استدلال عالی بود.',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    gradedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'attempt-demo-1',
    quizId: 'quiz-unit-junior-1',
    quizTitle: 'آزمون جامع پایان فصل ۱: مهارت‌های مکالمه و گرامر',
    studentId: 'demo-student-1',
    studentName: 'کیان رضایی (کودک ۸ ساله)',
    score: 75,
    totalPoints: 100,
    passed: true,
    status: 'pending_teacher_review',
    questionResults: [
      { questionId: 'uq1', isCorrect: true, userAnswer: 1, pointsEarned: 15, maxPoints: 15, feedback: 'صحیح' },
      { questionId: 'uq2', isCorrect: true, userAnswer: [0, 2], pointsEarned: 15, maxPoints: 15, feedback: 'صحیح' },
      { questionId: 'uq3', isCorrect: true, userAnswer: false, pointsEarned: 15, maxPoints: 15, feedback: 'صحیح' },
      { questionId: 'uq4', isCorrect: true, userAnswer: 'east', pointsEarned: 15, maxPoints: 15, feedback: 'صحیح' },
      { questionId: 'uq5', isCorrect: false, userAnswer: { Hot: 'Cold', Big: 'Small', Happy: 'Bad' }, pointsEarned: 15, maxPoints: 20, feedback: 'پاسخ نزدیک بود' },
      { questionId: 'uq6', isCorrect: false, userAnswer: 'Hello, my name is Kian and I like pizza and pasta very much.', pointsEarned: 0, maxPoints: 20, needsTeacherReview: true }
    ],
    completedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'attempt-demo-2',
    quizId: 'placement-test-general',
    quizTitle: 'آزمون تعیین سطح هوشمند آنلاین پارادایس',
    studentId: 'demo-student-1',
    studentName: 'کیان رضایی (کودک ۸ ساله)',
    score: 80,
    totalPoints: 100,
    passed: true,
    status: 'graded',
    recommendedLevel: 'elementary',
    teacherReviewNotes: 'سطح درک لغات کودک بسیار خوب است. برای مهارت مکالمه دوره داستان و فونیکس پیشنهاد می‌شود.',
    teacherReviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    questionResults: []
  }
];

export const INITIAL_CMS_PAGES: CmsPage[] = [
  {
    id: 'cms-home',
    slug: 'home',
    title: 'صفحه اصلی آکادمی پارادایس',
    metaDescription: 'پلتفرم تخصصی آموزش زبان انگلیسی کودکان و نوجوانان ایران با متد تعاملی کمبریج',
    status: 'published',
    revision: 1,
    isPublished: true,
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-hero',
        type: 'hero',
        title: 'انگلیسی را مثل زبان مادری، با عشق و لبخند یاد بگیرید!',
        subtitle: 'اولین آکادمی تخصصی آنلاین آموزش زبان به کودکان و نوجوانان ایران با متد تعاملی کمبریج و اساتید مجرب',
        buttonText: 'شروع تعیین سطح رایگان',
        buttonLink: '#placement',
        secondaryButtonText: 'مشاهده دوره‌ها و شهریه‌ها',
        secondaryButtonLink: '#courses',
        badge: 'پلتفرم تخصصی آموزش زبان کودکان و نوجوانان ایران',
        imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
        padding: 'standard',
        textAlign: 'right',
        enabled: true,
        order: 1
      },
      {
        id: 'sec-stats',
        type: 'stats',
        title: 'دست‌آوردهای آموزشی پارادایس در یک نگاه',
        subtitle: 'اعتماد هزاران خانواده ایرانی به شیوه نوین آموزش مکالمه',
        padding: 'compact',
        textAlign: 'center',
        enabled: true,
        order: 2,
        items: [
          { id: 'st-1', title: '+۲,۴۰۰', description: 'دانش‌آموز فعال در سراسر کشور' },
          { id: 'st-2', title: '۹۸.۶٪', description: 'رضایت والدین از پیشرفت مکالمه' },
          { id: 'st-3', title: '۶ تا ۱۷ سال', description: 'تفکیک سنی تخصصی در ۳ مرحله' },
          { id: 'st-4', title: '۱۰۰٪', description: 'کلاس‌های آنلاین زنده کم‌جمعیت' }
        ]
      },
      {
        id: 'sec-features',
        type: 'features',
        title: 'چرا والدین ایرانی آکادمی پارادایس را انتخاب می‌کنند؟',
        subtitle: 'کیفیت، امنیت، روانشناسی کودک و نشاط آموزشی در بستر اختصاصی',
        padding: 'standard',
        textAlign: 'right',
        enabled: true,
        order: 3,
        items: [
          {
            id: 'ft-1',
            title: 'متد فونیکس طبیعی (Jolly Phonics)',
            description: 'یادگیری ناخودآگاه صداها و الفبا بدون حفظ طوطی‌وار و با لهجه استاندارد بومی'
          },
          {
            id: 'ft-2',
            title: 'کلاس‌های کم‌جمعیت (حداکثر ۸ نفر)',
            description: 'فرصت صحبت کردن و مکالمه فعال برای تک‌تک دانش‌آموزان در هر جلسه'
          },
          {
            id: 'ft-3',
            title: 'پنل اختصاصی نظارت والدین',
            description: 'ارسال منظم گزارش حضور و غیاب، نمرات و بازخورد ویدیویی استاد به ولی دانش‌آموز'
          },
          {
            id: 'ft-4',
            title: 'اسکای‌روم با ترافیک نیم‌بهاء',
            description: 'بدون نیاز به فیلترشکن با سرعت پایدار روی گوشی، تبلت و کامپیوتر'
          }
        ]
      },
      {
        id: 'sec-testimonials',
        type: 'testimonials',
        title: 'نظرات و تجربیات واقعی اولیا و دانش‌آموزان',
        subtitle: 'داستان پیشرفت و اعتماد به نفس فرزندان پارادایس',
        padding: 'standard',
        textAlign: 'center',
        enabled: true,
        order: 4,
        items: [
          {
            id: 'tm-1',
            title: 'تلفظ فوق‌العاده پسرم در ۳ ماه',
            description: 'پسرم رادین (۷ ساله) قبلاً از کلاس زبان فراری بود، اما در دوره فونیکس پارادایس با انیمیشن‌ها مشتاقانه جلوتر از کلاس کلمات را می‌خواند.',
            authorName: 'خانم مرادی (مادر رادین ۷ ساله)',
            authorRole: 'دوره Magic Phonics',
            rating: 5
          },
          {
            id: 'tm-2',
            title: 'اعتماد به نفس دخترم در صحبت کردن',
            description: 'سارا (۱۴ ساله) همیشه از گرامر می‌ترسید. استاد شمس در دوره Teen Fluency باعث شد روان و بدون استرس در جلسات بحث آزاد شرکت کند.',
            authorName: 'آقای صادقی (پدر سارا)',
            authorRole: 'دوره Teen Fluency',
            rating: 5
          }
        ]
      },
      {
        id: 'sec-faq',
        type: 'faq',
        title: 'پرسش‌های متداول والدین و دانش‌آموزان',
        subtitle: 'پاسخ به سوالات پرتکرار شما در مورد کلاس‌ها و سیستم آموزشی',
        padding: 'standard',
        textAlign: 'right',
        enabled: true,
        order: 5,
        items: [
          {
            id: 'faq-1',
            title: 'آیا برای شرکت در کلاس‌ها نیاز به نصب نرم‌افزار خاصی است؟',
            description: 'خیر، کلاس‌های زنده در بستر مرورگر وب و اسکای‌روم بدون نیاز به نصب برنامه یا فیلترشکن برگزار می‌شوند.'
          },
          {
            id: 'faq-2',
            title: 'جلسات ضبط می‌شوند؟',
            description: 'بله، ویدیوهای ضبط شده به همراه جزوات و فلش‌کارت‌های صوتی در پنل دانش‌آموز ذخیره می‌شوند.'
          },
          {
            id: 'faq-3',
            title: 'امکان پرداخت کارت به کارت وجود دارد؟',
            description: 'بله، علاوه بر درگاه اینترنتی شاپرک، امکان پرداخت کارت به کارت با ثبت کد پیگیری فراهم است.'
          }
        ]
      },
      {
        id: 'sec-cta',
        type: 'cta',
        title: 'همین امروز آینده انگلیسی فرزندتان را رقم بزنید!',
        subtitle: 'تنها با یک آزمون تعیین سطح ۱۰ دقیقه‌ای، بهترین مسیر یادگیری را پیدا کنید.',
        buttonText: 'شروع آزمون تعیین سطح آنلاین',
        buttonLink: '#placement',
        bgColor: 'from-orange-600 via-amber-600 to-orange-700',
        padding: 'spacious',
        textAlign: 'center',
        enabled: true,
        order: 6
      }
    ]
  },
  {
    id: 'cms-about',
    slug: 'about',
    title: 'درباره آکادمی پارادایس',
    metaDescription: 'تاریخچه، رسالت و اساتید مجرب آکادمی زبان انگلیسی پارادایس',
    status: 'published',
    revision: 1,
    isPublished: true,
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-about-hero',
        type: 'hero',
        title: 'درباره آکادمی پارادایس',
        subtitle: 'پرورش‌دهنده نسل آینده‌سازان مسلط به مکالمه زبان انگلیسی در ایران',
        padding: 'standard',
        textAlign: 'right',
        enabled: true,
        order: 1
      }
    ]
  }
];

export const INITIAL_ORDERS: CourseOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-1403-9821',
    studentId: 'demo-student-1',
    studentName: 'کیان رضایی (کودک ۸ ساله)',
    studentEmail: 'kian@paradise-example.ir',
    studentPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    courseId: 'course-phonics-1',
    courseTitle: 'انگلیسی شاد و فونیکس جادویی (Magic Phonics)',
    coursePrice: 850000,
    finalAmount: 850000,
    currency: 'toman',
    paymentMethod: 'online',
    status: 'paid',
    gatewayProvider: 'zarinpal',
    gatewayAuthority: 'A00000000000000000000000000259817462',
    gatewayRefId: '10842918',
    gatewayCardPan: '۵۰۲۲۲۹******۴۳۱۲',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        note: 'سفارش ثبت شد و در انتظار پرداخت آنلاین زرین‌پال قرار گرفت.',
        changedBy: 'system'
      },
      {
        status: 'paid',
        timestamp: new Date(Date.now() - 86400000 * 5 + 120000).toISOString(),
        note: 'تراکنش با شناسه مرجع ۱۰۸۴۲۹۱۸ با موفقیت در شاپرک تایید و دوره فعال شد.',
        changedBy: 'zarinpal-verification'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5 + 120000).toISOString()
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-1403-9822',
    studentId: 'demo-student-2',
    studentName: 'سارا صادقی (نوجوان ۱۴ ساله)',
    studentEmail: 'sara@paradise-example.ir',
    studentPhone: '۰۹۳۵۶۷۸۹۰۱۲',
    courseId: 'course-teen-fluency-5',
    courseTitle: 'مکالمه روان و آمادگی آیلتس نوجوانان (Teen Fluency)',
    coursePrice: 1650000,
    finalAmount: 1650000,
    currency: 'toman',
    paymentMethod: 'card_to_card',
    status: 'awaiting_manual_verification',
    manualTrackingCode: '۷۸۹۶۴۲',
    manualCardLastFour: '۴۵۲۱',
    manualCustomerNote: 'واریز از همراه بانک ملت در ساعت ۱۰:۱۵ صبح انجام شد.',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        note: 'سفارش دستی کارت‌به‌کارت ایجاد شد.',
        changedBy: 'customer'
      },
      {
        status: 'awaiting_manual_verification',
        timestamp: new Date(Date.now() - 86400000 * 1 + 600000).toISOString(),
        note: 'اطلاعات فیش بانکی توسط کاربر ثبت شد و به صف بررسی واحد مالی ارسال گردید.',
        changedBy: 'customer'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1 + 600000).toISOString()
  },
  {
    id: 'ord-1003',
    orderNumber: 'ORD-1403-9823',
    studentId: 'demo-student-3',
    studentName: 'آرتین رستمی (۱۰ ساله)',
    studentEmail: 'artin@paradise-example.ir',
    studentPhone: '۰۹۱۲۹۸۷۶۵۴۳',
    courseId: 'course-junior-3',
    courseTitle: 'مکالمه مقدماتی کودکان و نوجوانان (Junior Movers)',
    coursePrice: 1200000,
    finalAmount: 1200000,
    currency: 'toman',
    paymentMethod: 'card_to_card',
    status: 'rejected',
    manualTrackingCode: '۱۱۱۰۰۰',
    manualCardLastFour: '۹۹۸۸',
    manualCustomerNote: 'واریز شده به حساب',
    adminReviewNote: 'کد پیگیری ارائه شده با پرینت حساب بانکی مطابقت نداشت؛ لطفاً تصویر فیش واریزی را ارسال کنید.',
    reviewedByAdmin: 'مدیر سامانه (امیرحسین پارسا)',
    reviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        note: 'سفارش ایجاد شد.',
        changedBy: 'customer'
      },
      {
        status: 'awaiting_manual_verification',
        timestamp: new Date(Date.now() - 86400000 * 3 + 300000).toISOString(),
        note: 'کد پیگیری ثبت شد.',
        changedBy: 'customer'
      },
      {
        status: 'rejected',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: 'رد فیش توسط واحد مالی: عدم تطابق با تراکنش‌های بانکی.',
        changedBy: 'مدیر سامانه'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enroll-sample-1',
    studentId: 'demo-student-1',
    studentName: 'کیان رضایی (کودک ۸ ساله)',
    studentEmail: 'kian@paradise-example.ir',
    studentPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    courseId: 'course-phonics-1',
    courseTitle: 'انگلیسی شاد و فونیکس جادویی (Magic Phonics)',
    status: 'active',
    paymentMethod: 'online',
    amount: 850000,
    currency: 'toman',
    receiptRef: 'TXN-984210',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'enroll-sample-2',
    studentId: 'demo-student-2',
    studentName: 'سارا صادقی (نوجوان ۱۴ ساله)',
    studentEmail: 'sara@paradise-example.ir',
    studentPhone: '۰۹۳۵۶۷۸۹۰۱۲',
    courseId: 'course-teen-fluency-5',
    courseTitle: 'مکالمه روان و آمادگی آیلتس نوجوانان (Teen Fluency)',
    status: 'pending',
    paymentMethod: 'card_to_card',
    amount: 1650000,
    currency: 'toman',
    receiptRef: 'کارت‌به‌کارت: پیگیری ۷۸۹۶۴۲',
    cardLastFour: '۴۵۲۱',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Helper to seed Firestore if empty
export async function seedInitialFirestoreData() {
  try {
    // 1. Settings
    const settingsDoc = await getDoc(doc(db, 'siteSettings', 'global'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'siteSettings', 'global'), DEFAULT_SITE_SETTINGS);
    }

    // 2. Courses
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    if (coursesSnapshot.empty) {
      for (const course of INITIAL_COURSES) {
        await setDoc(doc(db, 'courses', course.id), course);
      }
    }

    // 3. Lessons
    const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
    if (lessonsSnapshot.empty) {
      for (const lesson of INITIAL_LESSONS) {
        await setDoc(doc(db, 'lessons', lesson.id), lesson);
      }
    }

    // 4. Live Classes
    const liveClassesSnapshot = await getDocs(collection(db, 'liveClasses'));
    if (liveClassesSnapshot.empty) {
      for (const liveClass of INITIAL_LIVE_CLASSES) {
        await setDoc(doc(db, 'liveClasses', liveClass.id), liveClass);
      }
    }

    // 5. Quizzes
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    if (quizzesSnapshot.empty) {
      for (const quiz of INITIAL_QUIZZES) {
        await setDoc(doc(db, 'quizzes', quiz.id), quiz);
      }
    }

    // 6. CMS Pages
    const cmsSnapshot = await getDocs(collection(db, 'cmsPages'));
    if (cmsSnapshot.empty) {
      for (const page of INITIAL_CMS_PAGES) {
        await setDoc(doc(db, 'cmsPages', page.id), page);
      }
    }

    // 7. Enrollments
    const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
    if (enrollmentsSnapshot.empty) {
      for (const enroll of INITIAL_ENROLLMENTS) {
        await setDoc(doc(db, 'enrollments', enroll.id), enroll);
      }
    }
  } catch (err) {
    console.warn('Initial seeding note (may be permission-restricted if not logged in):', err);
  }
}
