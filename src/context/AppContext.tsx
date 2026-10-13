import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, testConnection } from '../firebase';
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
  AgeBracket,
  CurrencyType,
  PaymentMethod,
  MediaItem,
  NavigationItem,
  Announcement,
  HomeworkSubmission,
  QuestionGradeResult,
  CourseOrder,
  OrderStatus
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_LIVE_CLASSES,
  INITIAL_QUIZZES,
  INITIAL_CMS_PAGES,
  INITIAL_ENROLLMENTS,
  INITIAL_MEDIA,
  INITIAL_HOMEWORK,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_ORDERS,
  seedInitialFirestoreData
} from '../services/dataService';

interface AppContextType {
  settings: SiteSettings;
  courses: Course[];
  lessons: Lesson[];
  liveClasses: LiveClass[];
  enrollments: Enrollment[];
  orders: CourseOrder[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  homeworkSubmissions: HomeworkSubmission[];
  attendances: AttendanceRecord[];
  cmsPages: CmsPage[];
  mediaItems: MediaItem[];
  loading: boolean;
  activeAgeFilter: AgeBracket;
  setActiveAgeFilter: (filter: AgeBracket) => void;
  currency: CurrencyType;
  setCurrency: (curr: CurrencyType) => void;
  // Dynamic page navigation
  activePageSlug: string;
  setActivePageSlug: (slug: string) => void;
  // Modal states
  selectedCourseForDetail: Course | null;
  setSelectedCourseForDetail: (c: Course | null) => void;
  selectedCourseForCheckout: Course | null;
  setSelectedCourseForCheckout: (c: Course | null) => void;
  activeQuizForModal: Quiz | null;
  setActiveQuizForModal: (q: Quiz | null) => void;
  isPlacementModalOpen: boolean;
  setIsPlacementModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  // Actions
  saveCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  saveLesson: (lesson: Lesson) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  saveQuiz: (quiz: Quiz) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  saveLiveClass: (liveClass: LiveClass) => Promise<void>;
  deleteLiveClass: (id: string) => Promise<void>;
  enrollInCourse: (course: Course, studentId: string, studentName: string, method: PaymentMethod, ref?: string) => Promise<Enrollment>;
  updateEnrollmentStatus: (id: string, status: 'active' | 'pending' | 'cancelled') => Promise<void>;
  createCourseOrder: (params: {
    course: Course;
    studentId: string;
    studentName: string;
    studentEmail?: string;
    studentPhone?: string;
    paymentMethod: PaymentMethod;
  }) => Promise<CourseOrder>;
  initiateOnlinePayment: (orderId: string) => Promise<{ paymentUrl: string; authority: string; sandbox?: boolean }>;
  submitManualPayment: (orderId: string, trackingCode: string, cardLastFour?: string, customerNote?: string, receiptUrl?: string) => Promise<CourseOrder>;
  reviewManualPayment: (orderId: string, decision: 'approved' | 'rejected', adminNote?: string, adminName?: string) => Promise<CourseOrder>;
  toggleLessonCompletion: (enrollmentId: string, lessonId: string) => Promise<void>;
  saveQuizAttempt: (attempt: QuizAttempt) => Promise<void>;
  gradeQuizAttempt: (attemptId: string, questionResults: QuestionGradeResult[], finalScore: number, teacherNotes: string) => Promise<void>;
  submitHomework: (sub: HomeworkSubmission) => Promise<void>;
  gradeHomework: (submissionId: string, score: number, feedback: string) => Promise<void>;
  saveAttendance: (record: AttendanceRecord) => Promise<void>;
  saveSiteSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  saveCmsPage: (page: CmsPage) => Promise<void>;
  publishCmsPage: (pageId: string) => Promise<void>;
  unpublishCmsPage: (pageId: string) => Promise<void>;
  createCmsPage: (title: string, slug: string) => Promise<CmsPage>;
  deleteCmsPage: (pageId: string) => Promise<void>;
  addMediaItem: (item: MediaItem) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(INITIAL_LIVE_CLASSES);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [orders, setOrders] = useState<CourseOrder[]>(INITIAL_ORDERS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(INITIAL_QUIZ_ATTEMPTS);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkSubmission[]>(INITIAL_HOMEWORK);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [cmsPages, setCmsPages] = useState<CmsPage[]>(INITIAL_CMS_PAGES);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [loading, setLoading] = useState(true);

  const [activePageSlug, setActivePageSlug] = useState<string>('home');
  const [activeAgeFilter, setActiveAgeFilter] = useState<AgeBracket>('all');
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState<Course | null>(null);
  const [activeQuizForModal, setActiveQuizForModal] = useState<Quiz | null>(null);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const refreshData = async () => {
    try {
      await testConnection();
      await seedInitialFirestoreData();

      // Fetch Courses
      try {
        const cSnap = await getDocs(collection(db, 'courses'));
        if (!cSnap.empty) {
          const fetchedCourses = cSnap.docs.map(d => ({ ...d.data(), id: d.id } as Course));
          setCourses(fetchedCourses);
        }
      } catch (e) {
        console.warn('Courses fetch fallback:', e);
      }

      // Fetch Live Classes
      try {
        const lSnap = await getDocs(collection(db, 'liveClasses'));
        if (!lSnap.empty) {
          setLiveClasses(lSnap.docs.map(d => ({ ...d.data(), id: d.id } as LiveClass)));
        }
      } catch (e) {
        console.warn('Live classes fetch fallback:', e);
      }

      // Fetch Enrollments
      try {
        const eSnap = await getDocs(collection(db, 'enrollments'));
        if (!eSnap.empty) {
          setEnrollments(eSnap.docs.map(d => ({ ...d.data(), id: d.id } as Enrollment)));
        }
      } catch (e) {
        console.warn('Enrollments fetch fallback:', e);
      }

      // Fetch Quizzes
      try {
        const qSnap = await getDocs(collection(db, 'quizzes'));
        if (!qSnap.empty) {
          setQuizzes(qSnap.docs.map(d => ({ ...d.data(), id: d.id } as Quiz)));
        }
      } catch (e) {
        console.warn('Quizzes fetch fallback:', e);
      }

      // Fetch Lessons
      try {
        const lesSnap = await getDocs(collection(db, 'lessons'));
        if (!lesSnap.empty) {
          setLessons(lesSnap.docs.map(d => ({ ...d.data(), id: d.id } as Lesson)));
        }
      } catch (e) {
        console.warn('Lessons fetch fallback:', e);
      }

      // Fetch CMS
      try {
        const cmsSnap = await getDocs(collection(db, 'cmsPages'));
        if (!cmsSnap.empty) {
          setCmsPages(cmsSnap.docs.map(d => ({ ...d.data(), id: d.id } as CmsPage)));
        }
      } catch (e) {
        console.warn('CMS fetch fallback:', e);
      }
    } catch (err) {
      console.warn('General data refresh note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const setCurrency = async (curr: CurrencyType) => {
    const updated = { ...settings, currency: curr, updatedAt: new Date().toISOString() };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'siteSettings', 'global'), updated, { merge: true });
    } catch (err) {
      console.warn('Currency update note:', err);
    }
  };

  const saveCourse = async (course: Course) => {
    setCourses(prev => {
      const idx = prev.findIndex(c => c.id === course.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = course;
        return next;
      }
      return [course, ...prev];
    });

    try {
      await setDoc(doc(db, 'courses', course.id), course);
    } catch (err) {
      console.warn('Course save Firestore note:', err);
    }
  };

  const deleteCourse = async (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    try {
      await deleteDoc(doc(db, 'courses', id));
    } catch (err) {
      console.warn('Course delete Firestore note:', err);
    }
  };

  const saveLiveClass = async (liveClass: LiveClass) => {
    setLiveClasses(prev => {
      const idx = prev.findIndex(l => l.id === liveClass.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = liveClass;
        return next;
      }
      return [liveClass, ...prev];
    });

    try {
      await setDoc(doc(db, 'liveClasses', liveClass.id), liveClass);
    } catch (err) {
      console.warn('LiveClass save Firestore note:', err);
    }
  };

  const deleteLiveClass = async (id: string) => {
    setLiveClasses(prev => prev.filter(l => l.id !== id));
    try {
      await deleteDoc(doc(db, 'liveClasses', id));
    } catch (err) {
      console.warn('LiveClass delete Firestore note:', err);
    }
  };

  const enrollInCourse = async (
    course: Course,
    studentId: string,
    studentName: string,
    method: PaymentMethod,
    ref?: string
  ): Promise<Enrollment> => {
    const newEnrollment: Enrollment = {
      id: `enroll-${Date.now()}`,
      studentId,
      studentName,
      courseId: course.id,
      courseTitle: course.title,
      status: method === 'online' ? 'active' : 'pending',
      paymentMethod: method,
      amount: course.price,
      currency: settings.currency,
      receiptRef: ref || (method === 'online' ? `SHAPARAK-${Math.floor(100000 + Math.random() * 900000)}` : 'منتظر تایید'),
      createdAt: new Date().toISOString()
    };

    setEnrollments(prev => [newEnrollment, ...prev]);

    try {
      await setDoc(doc(db, 'enrollments', newEnrollment.id), newEnrollment);
    } catch (err) {
      console.warn('Enrollment save Firestore note:', err);
    }

    return newEnrollment;
  };

  const updateEnrollmentStatus = async (id: string, status: 'active' | 'pending' | 'cancelled') => {
    setEnrollments(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
    try {
      await updateDoc(doc(db, 'enrollments', id), { status, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Enrollment status update Firestore note:', err);
    }
  };

  const createCourseOrder = async (params: {
    course: Course;
    studentId: string;
    studentName: string;
    studentEmail?: string;
    studentPhone?: string;
    paymentMethod: PaymentMethod;
  }): Promise<CourseOrder> => {
    const { course, studentId, studentName, studentEmail, studentPhone, paymentMethod } = params;

    // Check duplicate active enrollment
    const existing = enrollments.find(e => e.studentId === studentId && e.courseId === course.id && e.status === 'active');
    if (existing) {
      throw new Error('شما قبلاً در این دوره ثبت‌نام کرده‌اید و دسترسی فعال دارید.');
    }

    try {
      // Attempt server-side creation
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          studentEmail,
          studentPhone,
          courseId: course.id,
          courseTitle: course.title,
          coursePrice: course.price,
          currency: settings.currency,
          paymentMethod
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders(prev => [data.order, ...prev.filter(o => o.id !== data.order.id)]);
          return data.order;
        }
      }
    } catch (err) {
      console.warn('Server create-order fallback to local:', err);
    }

    // Client/Firestore fallback
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ORD-1403-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: CourseOrder = {
      id: orderId,
      orderNumber,
      studentId,
      studentName,
      studentEmail,
      studentPhone,
      courseId: course.id,
      courseTitle: course.title,
      coursePrice: course.price,
      finalAmount: course.price,
      currency: settings.currency,
      paymentMethod,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: `سفارش ایجاد شد. روش پرداخت: ${paymentMethod === 'online' ? 'درگاه زرین‌پال' : 'کارت به کارت'}`,
          changedBy: 'customer'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.warn('Order Firestore save note:', err);
    }

    return newOrder;
  };

  const initiateOnlinePayment = async (orderId: string): Promise<{ paymentUrl: string; authority: string; sandbox?: boolean }> => {
    try {
      const res = await fetch('/api/payments/online/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.messageFa || data.error || 'خطا در اتصال به درگاه پرداخت');
      }

      return {
        paymentUrl: data.paymentUrl,
        authority: data.authority,
        sandbox: data.sandbox
      };
    } catch (err: any) {
      // If server unreachable, provide clear message
      throw new Error(err.message || 'عدم امکان برقراری ارتباط با سرور پرداخت');
    }
  };

  const submitManualPayment = async (
    orderId: string,
    trackingCode: string,
    cardLastFour?: string,
    customerNote?: string,
    receiptUrl?: string
  ): Promise<CourseOrder> => {
    try {
      const res = await fetch('/api/payments/manual/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          trackingCode,
          cardLastFour,
          customerNote,
          receiptImageUrl: receiptUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
          return data.order;
        }
      }
    } catch (err) {
      console.warn('Server manual submit fallback:', err);
    }

    // Local / Firestore update
    const updated = orders.find(o => o.id === orderId);
    if (!updated) throw new Error('سفارش یافت نشد.');

    const newStatusHistory = [
      ...updated.statusHistory,
      {
        status: 'awaiting_manual_verification' as const,
        timestamp: new Date().toISOString(),
        note: `فیش با کد پیگیری ${trackingCode} ارسال شد.`,
        changedBy: 'customer'
      }
    ];

    const updatedOrder: CourseOrder = {
      ...updated,
      status: 'awaiting_manual_verification',
      manualTrackingCode: trackingCode,
      manualCardLastFour: cardLastFour,
      manualCustomerNote: customerNote,
      manualReceiptUrl: receiptUrl,
      statusHistory: newStatusHistory,
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));
    try {
      await setDoc(doc(db, 'orders', orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.warn('Order update Firestore note:', err);
    }

    return updatedOrder;
  };

  const reviewManualPayment = async (
    orderId: string,
    decision: 'approved' | 'rejected',
    adminNote?: string,
    adminName = 'مدیر مالی آکادمی'
  ): Promise<CourseOrder> => {
    try {
      const res = await fetch('/api/payments/manual/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          decision,
          adminNote,
          adminName,
          adminRole: 'admin'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders(prev => prev.map(o => (o.id === orderId ? data.order : o)));
          if (data.enrollment) {
            setEnrollments(prev => {
              const idx = prev.findIndex(e => e.id === data.enrollment.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = data.enrollment;
                return next;
              }
              return [data.enrollment, ...prev];
            });
          }
          return data.order;
        }
      }
    } catch (err) {
      console.warn('Server review fallback:', err);
    }

    // Local / Firestore update
    const target = orders.find(o => o.id === orderId);
    if (!target) throw new Error('سفارش یافت نشد.');

    const newStatus: OrderStatus = decision === 'approved' ? 'paid' : 'rejected';
    const note = adminNote || (decision === 'approved' ? 'فیش بانکی تایید شد.' : 'فیش بانکی رد شد.');

    const updatedOrder: CourseOrder = {
      ...target,
      status: newStatus,
      reviewedByAdmin: adminName,
      adminReviewNote: note,
      reviewedAt: new Date().toISOString(),
      statusHistory: [
        ...target.statusHistory,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note,
          changedBy: adminName
        }
      ],
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));

    if (decision === 'approved') {
      // Activate course enrollment idempotently
      const existingEnroll = enrollments.find(e => e.orderId === orderId || (e.studentId === target.studentId && e.courseId === target.courseId));
      if (existingEnroll) {
        const updatedEnroll: Enrollment = {
          ...existingEnroll,
          status: 'active',
          orderId: target.id,
          orderNumber: target.orderNumber,
          receiptRef: target.manualTrackingCode || 'فیش تایید شده',
          approvedBy: adminName,
          updatedAt: new Date().toISOString()
        };
        setEnrollments(prev => prev.map(e => (e.id === existingEnroll.id ? updatedEnroll : e)));
        try {
          await setDoc(doc(db, 'enrollments', existingEnroll.id), updatedEnroll, { merge: true });
        } catch (err) {
          console.warn('Enrollment update note:', err);
        }
      } else {
        const newEnroll: Enrollment = {
          id: `enroll-${Date.now()}`,
          studentId: target.studentId,
          studentName: target.studentName,
          studentEmail: target.studentEmail,
          studentPhone: target.studentPhone,
          courseId: target.courseId,
          courseTitle: target.courseTitle,
          status: 'active',
          paymentMethod: target.paymentMethod,
          amount: target.finalAmount,
          currency: target.currency,
          orderId: target.id,
          orderNumber: target.orderNumber,
          receiptRef: target.manualTrackingCode || 'فیش تایید شده',
          approvedBy: adminName,
          createdAt: new Date().toISOString()
        };
        setEnrollments(prev => [newEnroll, ...prev]);
        try {
          await setDoc(doc(db, 'enrollments', newEnroll.id), newEnroll);
        } catch (err) {
          console.warn('Enrollment insert note:', err);
        }
      }
    }

    try {
      await setDoc(doc(db, 'orders', orderId), updatedOrder, { merge: true });
    } catch (err) {
      console.warn('Order save Firestore note:', err);
    }

    return updatedOrder;
  };

  const saveLesson = async (lesson: Lesson) => {
    setLessons(prev => {
      const idx = prev.findIndex(l => l.id === lesson.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = lesson;
        return next;
      }
      return [lesson, ...prev];
    });

    try {
      await setDoc(doc(db, 'lessons', lesson.id), lesson);
    } catch (err) {
      console.warn('Lesson save note:', err);
    }
  };

  const deleteLesson = async (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
    try {
      await deleteDoc(doc(db, 'lessons', id));
    } catch (err) {
      console.warn('Lesson delete note:', err);
    }
  };

  const saveQuiz = async (quiz: Quiz) => {
    setQuizzes(prev => {
      const idx = prev.findIndex(q => q.id === quiz.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = quiz;
        return next;
      }
      return [quiz, ...prev];
    });

    try {
      await setDoc(doc(db, 'quizzes', quiz.id), quiz);
    } catch (err) {
      console.warn('Quiz save note:', err);
    }
  };

  const deleteQuiz = async (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    try {
      await deleteDoc(doc(db, 'quizzes', id));
    } catch (err) {
      console.warn('Quiz delete note:', err);
    }
  };

  const toggleLessonCompletion = async (enrollmentId: string, lessonId: string) => {
    setEnrollments(prev =>
      prev.map(en => {
        if (en.id !== enrollmentId) return en;
        const currentCompleted = en.completedLessonIds || [];
        const isCompleted = currentCompleted.includes(lessonId);
        const updated = isCompleted
          ? currentCompleted.filter(id => id !== lessonId)
          : [...currentCompleted, lessonId];
        return { ...en, completedLessonIds: updated, updatedAt: new Date().toISOString() };
      })
    );

    try {
      const target = enrollments.find(e => e.id === enrollmentId);
      if (target) {
        const currentCompleted = target.completedLessonIds || [];
        const isCompleted = currentCompleted.includes(lessonId);
        const updated = isCompleted
          ? currentCompleted.filter(id => id !== lessonId)
          : [...currentCompleted, lessonId];
        await updateDoc(doc(db, 'enrollments', enrollmentId), {
          completedLessonIds: updated,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Lesson completion update note:', err);
    }
  };

  const saveQuizAttempt = async (attempt: QuizAttempt) => {
    setQuizAttempts(prev => {
      const idx = prev.findIndex(a => a.id === attempt.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = attempt;
        return next;
      }
      return [attempt, ...prev];
    });

    try {
      await setDoc(doc(db, 'quizAttempts', attempt.id), attempt);
    } catch (err) {
      console.warn('Quiz attempt save note:', err);
    }
  };

  const gradeQuizAttempt = async (
    attemptId: string,
    questionResults: QuestionGradeResult[],
    finalScore: number,
    teacherNotes: string
  ) => {
    setQuizAttempts(prev =>
      prev.map(a => {
        if (a.id !== attemptId) return a;
        return {
          ...a,
          score: finalScore,
          status: 'graded',
          passed: finalScore >= 60,
          questionResults,
          teacherReviewNotes: teacherNotes,
          teacherReviewedAt: new Date().toISOString()
        };
      })
    );

    try {
      await updateDoc(doc(db, 'quizAttempts', attemptId), {
        score: finalScore,
        status: 'graded',
        passed: finalScore >= 60,
        questionResults,
        teacherReviewNotes: teacherNotes,
        teacherReviewedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Grade quiz attempt update note:', err);
    }
  };

  const submitHomework = async (sub: HomeworkSubmission) => {
    setHomeworkSubmissions(prev => [sub, ...prev]);
    try {
      await setDoc(doc(db, 'homeworkSubmissions', sub.id), sub);
    } catch (err) {
      console.warn('Homework submission note:', err);
    }
  };

  const gradeHomework = async (submissionId: string, score: number, feedback: string) => {
    setHomeworkSubmissions(prev =>
      prev.map(h => {
        if (h.id !== submissionId) return h;
        return {
          ...h,
          score,
          teacherFeedback: feedback,
          status: 'graded',
          gradedAt: new Date().toISOString()
        };
      })
    );

    try {
      await updateDoc(doc(db, 'homeworkSubmissions', submissionId), {
        score,
        teacherFeedback: feedback,
        status: 'graded',
        gradedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Homework grading note:', err);
    }
  };

  const saveAttendance = async (record: AttendanceRecord) => {
    setAttendances(prev => {
      const idx = prev.findIndex(a => a.id === record.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = record;
        return next;
      }
      return [record, ...prev];
    });

    try {
      await setDoc(doc(db, 'attendances', record.id), record);
    } catch (err) {
      console.warn('Attendance save note:', err);
    }
  };

  const saveSiteSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'siteSettings', 'global'), updated, { merge: true });
    } catch (err) {
      console.warn('Settings save note:', err);
    }
  };

  const saveCmsPage = async (page: CmsPage) => {
    setCmsPages(prev => prev.map(p => (p.id === page.id ? page : p)));
    try {
      await setDoc(doc(db, 'cmsPages', page.id), page);
    } catch (err) {
      console.warn('CMS save note:', err);
    }
  };

  const publishCmsPage = async (pageId: string) => {
    const target = cmsPages.find(p => p.id === pageId);
    if (!target) return;

    // When publishing, draftSections become live sections
    const publishedSections = target.draftSections || target.sections;
    const updated: CmsPage = {
      ...target,
      sections: publishedSections,
      draftSections: undefined,
      status: 'published',
      isPublished: true,
      revision: (target.revision || 1) + 1,
      updatedAt: new Date().toISOString()
    };

    await saveCmsPage(updated);
  };

  const unpublishCmsPage = async (pageId: string) => {
    const target = cmsPages.find(p => p.id === pageId);
    if (!target) return;

    const updated: CmsPage = {
      ...target,
      status: 'unpublished',
      isPublished: false,
      updatedAt: new Date().toISOString()
    };

    await saveCmsPage(updated);
  };

  const createCmsPage = async (title: string, slug: string): Promise<CmsPage> => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/^-|-$/g, '') || `page-${Date.now()}`;
    const newPage: CmsPage = {
      id: `cms-${cleanSlug}`,
      slug: cleanSlug,
      title,
      status: 'draft',
      revision: 1,
      isPublished: false,
      sections: [
        {
          id: `sec-${Date.now()}-hero`,
          type: 'hero',
          title: title,
          subtitle: 'متن توضیحات این بخش را در ویرایشگر بنویسید...',
          padding: 'standard',
          textAlign: 'right',
          enabled: true,
          order: 1
        }
      ],
      updatedAt: new Date().toISOString()
    };

    setCmsPages(prev => [newPage, ...prev]);
    try {
      await setDoc(doc(db, 'cmsPages', newPage.id), newPage);
    } catch (err) {
      console.warn('Create CMS page Firestore note:', err);
    }

    return newPage;
  };

  const deleteCmsPage = async (pageId: string) => {
    setCmsPages(prev => prev.filter(p => p.id !== pageId));
    try {
      await deleteDoc(doc(db, 'cmsPages', pageId));
    } catch (err) {
      console.warn('Delete CMS page Firestore note:', err);
    }
  };

  const addMediaItem = async (item: MediaItem) => {
    setMediaItems(prev => [item, ...prev]);
    try {
      await setDoc(doc(db, 'mediaItems', item.id), item);
    } catch (err) {
      console.warn('Add media Firestore note:', err);
    }
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
    try {
      await deleteDoc(doc(db, 'mediaItems', id));
    } catch (err) {
      console.warn('Delete media Firestore note:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        courses,
        lessons,
        liveClasses,
        enrollments,
        orders,
        quizzes,
        quizAttempts,
        homeworkSubmissions,
        attendances,
        cmsPages,
        mediaItems,
        loading,
        activePageSlug,
        setActivePageSlug,
        activeAgeFilter,
        setActiveAgeFilter,
        currency: settings.currency,
        setCurrency,
        selectedCourseForDetail,
        setSelectedCourseForDetail,
        selectedCourseForCheckout,
        setSelectedCourseForCheckout,
        activeQuizForModal,
        setActiveQuizForModal,
        isPlacementModalOpen,
        setIsPlacementModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        saveCourse,
        deleteCourse,
        saveLesson,
        deleteLesson,
        saveQuiz,
        deleteQuiz,
        saveLiveClass,
        deleteLiveClass,
        enrollInCourse,
        updateEnrollmentStatus,
        createCourseOrder,
        initiateOnlinePayment,
        submitManualPayment,
        reviewManualPayment,
        toggleLessonCompletion,
        saveQuizAttempt,
        gradeQuizAttempt,
        submitHomework,
        gradeHomework,
        saveAttendance,
        saveSiteSettings,
        saveCmsPage,
        publishCmsPage,
        unpublishCmsPage,
        createCmsPage,
        deleteCmsPage,
        addMediaItem,
        deleteMediaItem,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
