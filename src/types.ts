export type UserRole = 'admin' | 'teacher' | 'student' | 'guardian';

export type AgeBracket = '6-9' | '10-12' | '13-17' | 'all';

export type CourseLevel = 'starter' | 'elementary' | 'intermediate' | 'upper-intermediate' | 'advanced';

export type CurrencyType = 'toman' | 'rial';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  englishName?: string;
  role: UserRole;
  phone?: string;
  ageBracket?: AgeBracket;
  guardianId?: string;
  guardianName?: string;
  childrenIds?: string[];
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: string;
  example: string;
  exampleFa: string;
}

export interface ExerciseItem {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'listen-choose';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanationFa?: string;
}

export interface ResourceFile {
  name: string;
  url: string;
  type: 'pdf' | 'audio' | 'worksheet';
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleTitle?: string;
  title: string;
  titleEn: string;
  order: number;
  durationMinutes: number;
  summary: string;
  videoUrl?: string;
  grammarFocus?: string;
  readingText?: string;
  readingTranslation?: string;
  listeningPrompt?: string;
  homeworkPrompt?: string;
  resourceFiles?: ResourceFile[];
  vocabulary: VocabularyItem[];
  exercises: ExerciseItem[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  ageBracket: AgeBracket;
  level: CourseLevel;
  price: number; // in base units (Toman)
  originalPrice?: number;
  thumbnail: string;
  badge?: string;
  features: string[];
  prerequisites?: string[];
  instructorName: string;
  instructorAvatar?: string;
  syllabusCount: number;
  isPublished: boolean;
  liveSessionsCount: number;
  durationWeeks: number;
  createdAt: string;
}

export interface LiveClass {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  title: string;
  scheduledAt: string; // ISO date string
  durationMinutes: number;
  meetingUrl: string; // Skyroom, Google Meet, Adobe Connect link
  meetingPlatform?: 'skyroom' | 'google-meet' | 'adobe-connect';
  capacity: number;
  enrolledStudentIds: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  cancellationReason?: string;
  reminderSent?: boolean;
  sessionNotes?: string;
  homework?: string;
  createdAt: string;
}

export type PaymentMethod = 'online' | 'card_to_card' | 'scholarship';
export type EnrollmentStatus = 'pending' | 'active' | 'cancelled';

export type OrderStatus =
  | 'pending'
  | 'awaiting_manual_verification'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'rejected'
  | 'refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  changedBy?: string; // 'system' | 'customer' | admin name
}

export interface CourseOrder {
  id: string; // e.g. ord-1712345678
  orderNumber: string; // e.g. ORD-1403-9821
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  finalAmount: number;
  currency: CurrencyType;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  // Gateway specific
  gatewayProvider?: 'zarinpal';
  gatewayAuthority?: string;
  gatewayRefId?: string;
  gatewayCardPan?: string; // masked PAN
  // Manual payment specific
  manualTrackingCode?: string;
  manualCardLastFour?: string;
  manualReceiptUrl?: string;
  manualCustomerNote?: string;
  adminReviewNote?: string;
  reviewedByAdmin?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  courseId: string;
  courseTitle: string;
  status: EnrollmentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: CurrencyType;
  orderId?: string;
  orderNumber?: string;
  receiptRef?: string; // bank tracking code / فیش بانکی
  receiptImageUrl?: string;
  cardLastFour?: string;
  completedLessonIds?: string[];
  approvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export type QuizQuestionType =
  | 'multiple-choice'
  | 'multiple-select'
  | 'true-false'
  | 'fill-in-the-blank'
  | 'matching'
  | 'short-answer'
  | 'teacher-graded';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  promptEn?: string;
  type: QuizQuestionType;
  points: number;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswerIndices?: number[];
  correctBool?: boolean;
  correctText?: string;
  matchingPairs?: MatchingPair[];
  audioWord?: string;
  explanationFa?: string;
}

export interface Quiz {
  id: string;
  courseId?: string; // empty if general placement test
  title: string;
  description: string;
  ageBracket: AgeBracket;
  timeLimitMinutes: number;
  passingScore: number;
  mode?: 'practice' | 'exam';
  shuffleQuestions?: boolean;
  maxAttempts?: number;
  isPlacementTest: boolean;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuestionGradeResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: any;
  pointsEarned: number;
  maxPoints: number;
  needsTeacherReview?: boolean;
  feedback?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalPoints: number;
  totalQuestions?: number;
  passed: boolean;
  status: 'graded' | 'pending_teacher_review';
  questionResults: QuestionGradeResult[];
  recommendedLevel?: CourseLevel;
  teacherReviewNotes?: string;
  teacherReviewedAt?: string;
  completedAt: string;
}

export interface HomeworkSubmission {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  studentId: string;
  studentName: string;
  submissionText: string;
  status: 'submitted' | 'graded';
  teacherFeedback?: string;
  score?: number;
  submittedAt: string;
  gradedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  classTitle: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  date: string;
  note?: string;
  createdAt: string;
}

export interface AuthPageSectionConfig {
  title: string;
  subtitle: string;
  welcomeNote?: string;
  termsText?: string;
  showSocialLogin?: boolean;
  showAgeSelector?: boolean;
  requirePhone?: boolean;
  allowedRoles?: UserRole[];
}

export interface AuthDesignerConfig {
  headline: string;
  subheadline: string;
  accentColor: string;
  layoutStyle: 'split' | 'card' | 'minimal';
  backgroundGradient: string;
  brandLogoText?: string;
  brandLogoUrl?: string;
  showPhoneField: boolean;
  requireAgeBracket: boolean;
  perks: string[];
  contrastMode?: 'standard' | 'high';
  // Separate configs for Login vs Registration
  login: AuthPageSectionConfig;
  register: AuthPageSectionConfig;
}

export interface NavigationItem {
  id: string;
  label: string;
  link: string;
  order: number;
  isExternal?: boolean;
  visible: boolean;
  target: 'header' | 'footer';
}

export interface Announcement {
  id: string;
  message: string;
  badge?: string;
  link?: string;
  linkText?: string;
  active: boolean;
  bgColor?: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'courses' | 'banners' | 'teachers' | 'general';
  altText: string;
  createdAt: string;
}

export interface SiteSettings {
  currency: CurrencyType;
  brandName: string;
  brandNameEn: string;
  brandPhone: string;
  brandEmail: string;
  address: string;
  // Payment Gateway & Manual Payment Config
  onlineGatewayEnabled: boolean;
  manualPaymentEnabled: boolean;
  gatewayProvider: 'zarinpal';
  gatewaySandbox: boolean;
  iranCardNumber: string;
  iranCardOwner: string;
  iranBankName: string;
  iranIban: string;
  manualPaymentInstructions: string;
  registrationOpen: boolean;
  announcement?: Announcement;
  navigationItems?: NavigationItem[];
  authDesigner: AuthDesignerConfig;
  updatedAt: string;
}

export type CmsSectionType =
  | 'hero'
  | 'banner'
  | 'stats'
  | 'features'
  | 'faq'
  | 'cta'
  | 'testimonials'
  | 'courses'
  | 'text-image';

export interface CmsSectionItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  meta?: string;
  authorName?: string;
  authorRole?: string;
  rating?: number;
}

export interface CmsSection {
  id: string;
  type: CmsSectionType;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  bgColor?: string;
  textColor?: string;
  textAlign?: 'right' | 'center' | 'left';
  padding?: 'compact' | 'standard' | 'spacious';
  badge?: string;
  items?: CmsSectionItem[];
  enabled: boolean;
  order: number;
}

export type PageStatus = 'draft' | 'published' | 'unpublished';

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  metaDescription?: string;
  status: PageStatus;
  revision: number;
  sections: CmsSection[];
  draftSections?: CmsSection[];
  isPublished: boolean;
  updatedBy?: string;
  updatedAt: string;
}
