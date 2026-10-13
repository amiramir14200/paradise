import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building,
  CheckCircle2,
  Copy,
  Receipt,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  Printer,
  ShieldCheck,
  ExternalLink,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod, CourseOrder } from '../../types';
import { formatPrice, formatToJalali, toPersianDigits } from '../../utils/jalali';

export const CheckoutModal: React.FC = () => {
  const {
    selectedCourseForCheckout,
    setSelectedCourseForCheckout,
    settings,
    currency,
    createCourseOrder,
    initiateOnlinePayment,
    submitManualPayment,
    enrollInCourse
  } = useApp();
  const { profile } = useAuth();

  const isOnlineEnabled = settings.onlineGatewayEnabled !== false;
  const isManualEnabled = settings.manualPaymentEnabled !== false;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    isOnlineEnabled ? 'online' : isManualEnabled ? 'card_to_card' : 'online'
  );
  const [cardTrackRef, setCardTrackRef] = useState('');
  const [cardLastFour, setCardLastFour] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [setupRequiredNote, setSetupRequiredNote] = useState<string | null>(null);

  // Completed order state (for manual confirmation or free course enrollment)
  const [completedOrder, setCompletedOrder] = useState<CourseOrder | null>(null);
  const [copyCardNote, setCopyCardNote] = useState(false);
  const [copyIbanNote, setCopyIbanNote] = useState(false);

  if (!selectedCourseForCheckout) return null;
  const course = selectedCourseForCheckout;
  const isFree = course.price === 0;

  const handleCopyCard = () => {
    navigator.clipboard.writeText(settings.iranCardNumber.replace(/-/g, ''));
    setCopyCardNote(true);
    setTimeout(() => setCopyCardNote(false), 2500);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(settings.iranIban || 'IR120170000000123456789012');
    setCopyIbanNote(true);
    setTimeout(() => setCopyIbanNote(false), 2500);
  };

  const handleStartOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);
    setSetupRequiredNote(null);

    const studentId = profile?.uid || 'guest-student-' + Date.now();
    const studentName = profile?.fullName || 'کاربر گرامی';
    const studentEmail = profile?.email;
    const studentPhone = profile?.phone;

    try {
      // 1. If course is Free (0 Tomans)
      if (isFree) {
        await enrollInCourse(course, studentId, studentName, 'scholarship', 'دوره رایگان هدیه پارادایس');
        const freeOrder: CourseOrder = {
          id: `ord-free-${Date.now()}`,
          orderNumber: `ORD-FREE-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId,
          studentName,
          studentEmail,
          studentPhone,
          courseId: course.id,
          courseTitle: course.title,
          coursePrice: 0,
          finalAmount: 0,
          currency,
          paymentMethod: 'scholarship',
          status: 'paid',
          statusHistory: [
            {
              status: 'paid',
              timestamp: new Date().toISOString(),
              note: 'ثبت‌نام دوره رایگان با موفقیت فعال شد.',
              changedBy: 'system'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCompletedOrder(freeOrder);
        setIsProcessing(false);
        return;
      }

      // 2. Paid Course: First create pending order server-side
      const order = await createCourseOrder({
        course,
        studentId,
        studentName,
        studentEmail,
        studentPhone,
        paymentMethod
      });

      // Method A: Online Gateway (Zarinpal)
      if (paymentMethod === 'online') {
        try {
          const initiateResult = await initiateOnlinePayment(order.id);
          if (initiateResult.paymentUrl) {
            // Redirect to official gateway / sandbox
            window.location.href = initiateResult.paymentUrl;
            return;
          }
        } catch (gatewayErr: any) {
          if (gatewayErr.message?.includes('ZARINPAL_MERCHANT_ID') || gatewayErr.message?.includes('setup_required')) {
            setSetupRequiredNote(gatewayErr.message);
          } else {
            setErrorMessage(gatewayErr.message || 'خطا در برقراری ارتباط با درگاه پرداخت زرین‌پال.');
          }
          setIsProcessing(false);
          return;
        }
      }

      // Method B: Manual Payment (Card to Card)
      if (paymentMethod === 'card_to_card') {
        if (!cardTrackRef.trim()) {
          setErrorMessage('لطفاً کد پیگیری یا شماره ارجاع فیش واریزی را وارد فرمایید.');
          setIsProcessing(false);
          return;
        }

        const submitted = await submitManualPayment(
          order.id,
          cardTrackRef.trim(),
          cardLastFour.trim() || undefined,
          customerNote.trim() || undefined
        );

        setCompletedOrder(submitted);
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'خطا در ثبت سفارش. لطفاً دوباره تلاش فرمایید.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-right my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black">تسویه حساب و ثبت‌نام در دوره</h2>
              <p className="text-xs text-amber-100">سامانه خرید امن و رسمی دوره‌های آکادمی پارادایس</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCourseForCheckout(null);
              setCompletedOrder(null);
              setErrorMessage(null);
              setSetupRequiredNote(null);
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {!completedOrder ? (
          <form onSubmit={handleStartOrder} className="p-6 space-y-6">
            {/* Error & Warning Notifications */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">خطا در پردازش:</span>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {setupRequiredNote && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-black block">نیاز به پیکربندی درگاه پرداخت زرین‌پال:</span>
                  <p className="leading-relaxed">{setupRequiredNote}</p>
                  <p className="text-[11px] text-amber-700">
                    برای تست سیستم می‌توانید روش «کارت به کارت و ثبت فیش» را انتخاب کرده یا متغیر ZARINPAL_SANDBOX را فعال نمایید.
                  </p>
                </div>
              </div>
            )}

            {/* Selected Course Summary */}
            <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-100 space-y-2">
              <span className="text-[10px] font-bold text-orange-600 block">دوره انتخابی:</span>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">{course.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    مدرس: {course.instructorName} | {toPersianDigits(course.durationWeeks)} هفته ({toPersianDigits(course.liveSessionsCount)} جلسه آنلاین)
                  </p>
                </div>
                <div className="text-left shrink-0">
                  <span className="text-sm font-black text-orange-600">
                    {isFree ? 'رایگان' : formatPrice(course.price, currency)}
                  </span>
                </div>
              </div>
            </div>

            {!isFree && (
              /* Payment Method Selector */
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-800 block">انتخاب روش پرداخت:</label>

                <div className="grid grid-cols-2 gap-3">
                  {isOnlineEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('online');
                        setErrorMessage(null);
                      }}
                      className={`p-4 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                        paymentMethod === 'online'
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-black shadow-xs ring-2 ring-orange-400/30'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black">درگاه آنلاین زرین‌پال</span>
                        <CreditCard className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-[10px] text-slate-500">پرداخت امن شاپرک و تایید خودکار سرور</span>
                    </button>
                  )}

                  {isManualEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('card_to_card');
                        setErrorMessage(null);
                      }}
                      className={`p-4 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                        paymentMethod === 'card_to_card'
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-black shadow-xs ring-2 ring-orange-400/30'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black">کارت به کارت / شبا</span>
                        <Building className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-[10px] text-slate-500">واریز به شماره کارت و ثبت کد پیگیری</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Manual Payment: Bank Details & Submission Form */}
            {!isFree && paymentMethod === 'card_to_card' && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="space-y-3 pb-3 border-b border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">شماره کارت آکادمی:</span>
                      <span className="text-sm font-black font-en text-slate-900 tracking-wider" dir="ltr">
                        {settings.iranCardNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {settings.iranCardOwner} - {settings.iranBankName || 'بانک ملی ایران'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCard}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copyCardNote ? 'کپی شد!' : 'کپی کارت'}</span>
                    </button>
                  </div>

                  {settings.iranIban && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-150">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">شماره شبا (IBAN):</span>
                        <span className="text-xs font-black font-en text-slate-900 tracking-wider" dir="ltr">
                          {settings.iranIban}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copyIbanNote ? 'کپی شد!' : 'کپی شبا'}</span>
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-150">
                    {settings.manualPaymentInstructions ||
                      'لطفاً مبلغ دوره را به حساب فوق واریز نموده، سپس کد پیگیری و ۴ رقم آخر کارت را وارد فرمایید.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      کد پیگیری / شماره ارجاع تراکنش *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardTrackRef}
                      onChange={(e) => setCardTrackRef(e.target.value)}
                      placeholder="مثال: ۸۹۴۵۶۱"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      ۴ رقم آخر کارت واریزکننده
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardLastFour}
                      onChange={(e) => setCardLastFour(e.target.value)}
                      placeholder="مثال: ۱۲۳۴"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-en text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    توضیحات واریز یا نام صاحب حساب (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="مثال: واریز از همراه بانک ملت توسط پدر کیان"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Total Due & Submit */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">مبلغ نهایی قابل پرداخت:</span>
                <span className="text-lg font-black text-orange-600">
                  {isFree ? 'رایگان' : formatPrice(course.price, currency)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>
                  {isProcessing
                    ? 'در حال پردازش...'
                    : isFree
                    ? 'ثبت‌نام رایگان و فعال‌سازی آنی'
                    : paymentMethod === 'online'
                    ? 'اتصال به درگاه زرین‌پال و پرداخت'
                    : 'ثبت فیش و ارسال به کارتابل مالی'}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>تراکنش‌ها توسط پروتکل امن SSL و ضوابط بانک مرکزی محافظت می‌شوند.</span>
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation & Receipt Screen */
          <div className="p-8 space-y-6 text-center">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                completedOrder.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              {completedOrder.status === 'paid' ? (
                <CheckCircle2 className="w-9 h-9" />
              ) : (
                <Clock className="w-9 h-9" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                {completedOrder.status === 'paid'
                  ? 'ثبت‌نام شما با موفقیت تایید و فعال شد!'
                  : 'فیش واریزی با موفقیت دریافت شد!'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                {completedOrder.status === 'paid'
                  ? 'دسترسی شما به دوره و جلسات زنده آنلاین فعال گردید و می‌توانید از میز کار دانش‌آموز شروع کنید.'
                  : 'سفارش شما در وضعیت «در انتظار بررسی واحد مالی» قرار گرفت. کارشناسان مالی حداکثر ظرف ۲ ساعت رسید را بررسی و دسترسی شما را فعال خواهند کرد.'}
              </p>
            </div>

            {/* Official Invoice Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-right space-y-2.5 max-w-sm mx-auto text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold">
                <span className="text-slate-400">شماره سفارش:</span>
                <span className="text-slate-900 font-en font-black" dir="ltr">
                  {completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">دوره انتخابی:</span>
                <span className="text-slate-900 font-bold">{completedOrder.courseTitle}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">روش پرداخت:</span>
                <span className="text-slate-900 font-bold">
                  {completedOrder.paymentMethod === 'online'
                    ? 'درگاه آنلاین زرین‌پال'
                    : completedOrder.paymentMethod === 'scholarship'
                    ? 'دوره رایگان / بورسیه'
                    : 'کارت به کارت'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">وضعیت پرداخت:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    completedOrder.status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {completedOrder.status === 'paid' ? 'پرداخت شده و فعال ✓' : 'در انتظار تایید حسابداری'}
                </span>
              </div>
              {completedOrder.manualTrackingCode && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-400">کد پیگیری ثبت شده:</span>
                  <span className="text-slate-900 font-mono font-bold">
                    {completedOrder.manualTrackingCode}
                  </span>
                </div>
              )}
              {completedOrder.gatewayRefId && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-400">شناسه مرجع بانکی:</span>
                  <span className="text-slate-900 font-mono font-bold">
                    {completedOrder.gatewayRefId}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-400">تاریخ ثبت:</span>
                <span className="text-slate-900 font-bold">{formatToJalali(completedOrder.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">مبلغ پرداختی:</span>
                <span className="text-emerald-600 font-black">
                  {completedOrder.finalAmount === 0 ? 'رایگان' : formatPrice(completedOrder.finalAmount, currency)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>چاپ فاکتور</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCourseForCheckout(null);
                  setCompletedOrder(null);
                }}
                className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black cursor-pointer shadow-xs"
              >
                بستن و ادامه
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
