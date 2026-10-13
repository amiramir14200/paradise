import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server-side Payment Configuration
const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || '';
const ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === 'true' || !process.env.ZARINPAL_MERCHANT_ID;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// In-memory persistent order & enrollment store synced with server runtime
interface ServerOrder {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  finalAmount: number;
  currency: 'toman' | 'rial';
  paymentMethod: 'online' | 'card_to_card' | 'scholarship';
  status: 'pending' | 'awaiting_manual_verification' | 'paid' | 'failed' | 'cancelled' | 'rejected' | 'refunded';
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
    changedBy?: string;
  }>;
  gatewayProvider?: 'zarinpal';
  gatewayAuthority?: string;
  gatewayRefId?: string;
  gatewayCardPan?: string;
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

interface ServerEnrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  courseId: string;
  courseTitle: string;
  status: 'pending' | 'active' | 'cancelled';
  paymentMethod: 'online' | 'card_to_card' | 'scholarship';
  amount: number;
  currency: 'toman' | 'rial';
  orderId?: string;
  orderNumber?: string;
  receiptRef?: string;
  completedLessonIds?: string[];
  approvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

// Initial Server seed state
const ordersStore: Map<string, ServerOrder> = new Map([
  [
    'ord-1001',
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
          note: 'تراکنش با شناسه مرجع ۱۰۸۴۲۹۱۸ در شاپرک تایید و دوره فعال شد.',
          changedBy: 'zarinpal-verification'
        }
      ],
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 5 + 120000).toISOString()
    }
  ],
  [
    'ord-1002',
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
          note: 'سفارش دستی ایجاد شد.',
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
    }
  ]
]);

const enrollmentsStore: Map<string, ServerEnrollment> = new Map([
  [
    'enroll-sample-1',
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
      orderId: 'ord-1001',
      orderNumber: 'ORD-1403-9821',
      receiptRef: 'TXN-984210',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ]
]);

// Helper to activate enrollment idempotently
function activateEnrollmentForOrder(order: ServerOrder): ServerEnrollment {
  // Check if enrollment already exists for this order
  for (const en of enrollmentsStore.values()) {
    if (en.orderId === order.id || (en.studentId === order.studentId && en.courseId === order.courseId)) {
      en.status = 'active';
      en.orderId = order.id;
      en.orderNumber = order.orderNumber;
      en.receiptRef = order.gatewayRefId || order.manualTrackingCode || `TXN-${Date.now()}`;
      en.updatedAt = new Date().toISOString();
      return en;
    }
  }

  // Create new active enrollment
  const newEnrollment: ServerEnrollment = {
    id: `enroll-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    studentId: order.studentId,
    studentName: order.studentName,
    studentEmail: order.studentEmail,
    studentPhone: order.studentPhone,
    courseId: order.courseId,
    courseTitle: order.courseTitle,
    status: 'active',
    paymentMethod: order.paymentMethod,
    amount: order.finalAmount,
    currency: order.currency,
    orderId: order.id,
    orderNumber: order.orderNumber,
    receiptRef: order.gatewayRefId || order.manualTrackingCode || `TXN-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  enrollmentsStore.set(newEnrollment.id, newEnrollment);
  return newEnrollment;
}

// -------------------------------------------------------------
// 1. Payment Configuration Endpoint
// -------------------------------------------------------------
app.get('/api/payments/status', (_req: Request, res: Response) => {
  const isMerchantConfigured = Boolean(ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim().length >= 30);
  res.json({
    configured: true,
    provider: 'zarinpal',
    merchantConfigured: isMerchantConfigured,
    sandbox: ZARINPAL_SANDBOX,
    currencyDefault: 'toman',
    messageFa: isMerchantConfigured
      ? 'درگاه زرین‌پال با شناسه مرچنت سرور پیکربندی شده و آماده است.'
      : 'درگاه پرداخت نیازمند تنظیم متغیر ZARINPAL_MERCHANT_ID در فایل .env سرور است (در حال حاضر حالت آزمایشی سناریو/سندباکس فعال می‌باشد).'
  });
});

// -------------------------------------------------------------
// 2. Create Order (Pending)
// -------------------------------------------------------------
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      studentPhone,
      courseId,
      courseTitle,
      coursePrice,
      currency = 'toman',
      paymentMethod = 'online'
    } = req.body;

    if (!courseId || !courseTitle || !studentId) {
      return res.status(400).json({ error: 'اطلاعات دوره و کاربر الزامی است.' });
    }

    // Check if student already has active enrollment in this course (prevent duplicate)
    for (const en of enrollmentsStore.values()) {
      if (en.studentId === studentId && en.courseId === courseId && en.status === 'active') {
        return res.status(409).json({
          error: 'duplicate_enrollment',
          messageFa: 'شما قبلاً در این دوره ثبت‌نام کرده‌اید و دسترسی شما فعال است.'
        });
      }
    }

    const orderId = `ord-${Date.now()}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-1403-${randomSuffix}`;

    const newOrder: ServerOrder = {
      id: orderId,
      orderNumber,
      studentId,
      studentName: studentName || 'کاربر گرامی',
      studentEmail,
      studentPhone,
      courseId,
      courseTitle,
      coursePrice: Number(coursePrice) || 0,
      finalAmount: Number(coursePrice) || 0,
      currency: currency === 'rial' ? 'rial' : 'toman',
      paymentMethod,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: `سفارش ایجاد شد. روش پرداخت انتخاب شده: ${paymentMethod === 'online' ? 'درگاه آنلاین زرین‌پال' : 'کارت به کارت دستی'}`,
          changedBy: 'customer'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    ordersStore.set(orderId, newOrder);
    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'خطای سرور در ایجاد سفارش.' });
  }
});

// -------------------------------------------------------------
// 3. Initiate Online Payment with Zarinpal (Server-Side)
// -------------------------------------------------------------
app.post('/api/payments/online/initiate', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'شناسه سفارش الزامی است.' });
    }

    const order = ordersStore.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'سفارش یافت نشد.' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({
        error: 'already_paid',
        messageFa: 'این سفارش قبلاً پرداخت و تایید شده است.'
      });
    }

    // Convert amount according to Zarinpal requirements (Toman vs Rial)
    // Zarinpal v4 expects Toman
    const amountInToman = order.currency === 'rial' ? Math.round(order.finalAmount / 10) : order.finalAmount;

    // Check credentials: If neither merchant id nor sandbox is configured, inform setup required
    const hasMerchant = Boolean(ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim().length >= 30);
    if (!hasMerchant && !ZARINPAL_SANDBOX) {
      return res.status(400).json({
        error: 'setup_required',
        messageFa: 'تنظیم درگاه پرداخت زرین‌پال در سرور ضروری است. لطفاً متغیر ZARINPAL_MERCHANT_ID را در متغیرهای محیطی سرور تنظیم نمایید.'
      });
    }

    const callbackUrl = `${APP_URL}/api/payments/online/callback?orderId=${encodeURIComponent(order.id)}`;

    // If real merchant ID is configured, call official Zarinpal API v4
    if (hasMerchant && !ZARINPAL_SANDBOX) {
      try {
        const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: amountInToman,
            currency: 'IRT',
            description: `ثبت‌نام دوره آموزشی ${order.courseTitle} - سفارش ${order.orderNumber}`,
            callback_url: callbackUrl,
            metadata: {
              mobile: order.studentPhone,
              email: order.studentEmail,
              order_id: order.id
            }
          })
        });

        const data = await response.json();
        if (data?.data?.code === 100 && data?.data?.authority) {
          const authority = data.data.authority;
          order.gatewayProvider = 'zarinpal';
          order.gatewayAuthority = authority;
          order.updatedAt = new Date().toISOString();
          order.statusHistory.push({
            status: 'pending',
            timestamp: new Date().toISOString(),
            note: `اتصال به درگاه زرین‌پال با شناسه پیگیری ${authority}`,
            changedBy: 'system'
          });

          return res.json({
            success: true,
            authority,
            paymentUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`
          });
        } else {
          return res.status(400).json({
            error: 'gateway_error',
            messageFa: `خطای درگاه زرین‌پال: کد خطا ${data?.errors?.code || data?.data?.code || 'نامشخص'}`
          });
        }
      } catch (err) {
        console.error('Zarinpal API connection error:', err);
        // Fall back to sandbox response if network fails
      }
    }

    // Sandbox / Simulation for testing without live bank settlement
    const simulatedAuthority = `A00000000000000000000000000${Date.now().toString().slice(-8)}`;
    order.gatewayProvider = 'zarinpal';
    order.gatewayAuthority = simulatedAuthority;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: 'pending',
      timestamp: new Date().toISOString(),
      note: `اتصال به درگاه زرین‌پال (حالت آزمایشی معتبر Sandbox) با شناسه ${simulatedAuthority}`,
      changedBy: 'system'
    });

    // Provide a gateway simulation landing URL that redirects to callback
    const sandboxPaymentUrl = `${APP_URL}/api/payments/sandbox-gateway?Authority=${simulatedAuthority}&orderId=${order.id}&amount=${amountInToman}`;

    return res.json({
      success: true,
      authority: simulatedAuthority,
      sandbox: true,
      paymentUrl: sandboxPaymentUrl,
      messageFa: 'اتصال به درگاه آزمایشی زرین‌پال با موفقیت انجام شد.'
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return res.status(500).json({ error: 'خطای سرور در اتصال به درگاه پرداخت.' });
  }
});

// -------------------------------------------------------------
// Sandbox Gateway Simulation Screen (Interactive Bank Portal Simulation)
// -------------------------------------------------------------
app.get('/api/payments/sandbox-gateway', (req: Request, res: Response) => {
  const { Authority, orderId, amount } = req.query;
  const order = ordersStore.get(orderId as string);

  if (!order) {
    return res.status(404).send('سفارش یافت نشد.');
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>درگاه پرداخت الکترونیک زرین‌پال (حالت آزمایشی)</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .container { max-width: 480px; margin: 40px auto; background: white; border-radius: 24px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 20px; font-weight: 900; color: #f59e0b; }
        .badge { background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 13px; }
        .label { color: #64748b; }
        .value { font-weight: 800; color: #0f172a; }
        .amount { color: #ea580c; font-size: 18px; font-weight: 900; }
        .btn-group { display: flex; gap: 12px; margin-top: 28px; }
        .btn { flex: 1; padding: 14px; border: none; border-radius: 14px; font-size: 14px; font-weight: 800; cursor: pointer; text-align: center; text-decoration: none; }
        .btn-success { background: #16a34a; color: white; }
        .btn-cancel { background: #f1f5f9; color: #475569; }
        .card-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 14px; padding: 14px; margin-top: 16px; font-size: 12px; line-height: 1.6; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">درگاه پرداخت زرین‌پال</div>
          <span class="badge">محیط آزمایشی (سندباکس شاپرک)</span>
        </div>
        <div class="row">
          <span class="label">پذیرنده:</span>
          <span class="value">آکادمی زبان انگلیسی پارادایس</span>
        </div>
        <div class="row">
          <span class="label">شماره سفارش:</span>
          <span class="value" dir="ltr">${order.orderNumber}</span>
        </div>
        <div class="row">
          <span class="label">دوره انتخابی:</span>
          <span class="value">${order.courseTitle}</span>
        </div>
        <div class="row">
          <span class="label">دانش‌آموز:</span>
          <span class="value">${order.studentName}</span>
        </div>
        <div class="row" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
          <span class="label">مبلغ قابل پرداخت:</span>
          <span class="amount">${Number(amount || order.finalAmount).toLocaleString('fa-IR')} تومان</span>
        </div>

        <div class="card-box">
          این محیط شبیه‌ساز درگاه واقعی برای ارزیابی فرآیند پرداخت و تایید سفارش است. با کلیک بر روی <b>تایید پرداخت</b>، تراکنش به عنوان موفق در سرور تایید شده و دوره فعال خواهد شد.
        </div>

        <div class="btn-group">
          <a href="/api/payments/online/callback?Authority=${Authority}&Status=OK&orderId=${order.id}" class="btn btn-success">
            تایید پرداخت و بازگشت
          </a>
          <a href="/api/payments/online/callback?Authority=${Authority}&Status=NOK&orderId=${order.id}" class="btn btn-cancel">
            انصراف از پرداخت
          </a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// -------------------------------------------------------------
// 4. Online Payment Callback (Server-Side Verification & Idempotency)
// -------------------------------------------------------------
app.get('/api/payments/online/callback', async (req: Request, res: Response) => {
  try {
    const { Authority, Status, orderId } = req.query;

    if (!orderId) {
      return res.redirect('/?paymentStatus=error&message=order_not_found');
    }

    const order = ordersStore.get(orderId as string);
    if (!order) {
      return res.redirect('/?paymentStatus=error&message=order_not_found');
    }

    // 1. Handle Cancelled or Failed Callbacks
    if (Status !== 'OK') {
      order.status = 'cancelled';
      order.updatedAt = new Date().toISOString();
      order.statusHistory.push({
        status: 'cancelled',
        timestamp: new Date().toISOString(),
        note: 'پرداخت آنلاین توسط مشتری در درگاه بانکی لغو شد یا ناموفق بود.',
        changedBy: 'gateway-callback'
      });

      return res.redirect(`/?paymentStatus=cancelled&orderNumber=${encodeURIComponent(order.orderNumber)}`);
    }

    // 2. Idempotency Check: If already verified and paid, return existing success without duplicate activation
    if (order.status === 'paid') {
      return res.redirect(
        `/?paymentStatus=success&orderNumber=${encodeURIComponent(order.orderNumber)}&refId=${encodeURIComponent(order.gatewayRefId || '')}`
      );
    }

    // 3. Server-side Verification against Zarinpal API
    let verified = false;
    let refId = '';
    let cardPan = '۵۰۲۲۲۹******' + Math.floor(1000 + Math.random() * 9000);

    const hasMerchant = Boolean(ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim().length >= 30);
    if (hasMerchant && !ZARINPAL_SANDBOX) {
      try {
        const amountInToman = order.currency === 'rial' ? Math.round(order.finalAmount / 10) : order.finalAmount;
        const verifyRes = await fetch('https://api.zarinpal.com/pg/v4/payment/verify.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: amountInToman,
            authority: Authority
          })
        });

        const verifyData = await verifyRes.json();
        // Code 100: Success, Code 101: Already Verified
        if (verifyData?.data?.code === 100 || verifyData?.data?.code === 101) {
          verified = true;
          refId = String(verifyData.data.ref_id);
          cardPan = verifyData.data.card_pan || cardPan;
        } else {
          order.status = 'failed';
          order.updatedAt = new Date().toISOString();
          order.statusHistory.push({
            status: 'failed',
            timestamp: new Date().toISOString(),
            note: `تایید تراکنش با درگاه ناموفق بود (کد خطا: ${verifyData?.errors?.code || verifyData?.data?.code})`,
            changedBy: 'zarinpal-verify'
          });
          return res.redirect(`/?paymentStatus=failed&orderNumber=${encodeURIComponent(order.orderNumber)}`);
        }
      } catch (verifyErr) {
        console.error('Error contacting Zarinpal verify:', verifyErr);
        // Fall back to sandbox verification if network glitch
      }
    } else {
      // Sandbox verified
      verified = true;
      refId = String(Math.floor(10000000 + Math.random() * 90000000));
    }

    if (verified) {
      // Mark Order as Paid
      order.status = 'paid';
      order.gatewayRefId = refId;
      order.gatewayCardPan = cardPan;
      order.updatedAt = new Date().toISOString();
      order.statusHistory.push({
        status: 'paid',
        timestamp: new Date().toISOString(),
        note: `پرداخت آنلاین تایید شد. شماره مرجع شاپرک: ${refId}`,
        changedBy: 'zarinpal-verification'
      });

      // Activate Enrollment Idempotently
      activateEnrollmentForOrder(order);

      return res.redirect(
        `/?paymentStatus=success&orderNumber=${encodeURIComponent(order.orderNumber)}&refId=${encodeURIComponent(refId)}`
      );
    }

    return res.redirect(`/?paymentStatus=failed&orderNumber=${encodeURIComponent(order.orderNumber)}`);
  } catch (error) {
    console.error('Callback error:', error);
    return res.redirect('/?paymentStatus=error');
  }
});

// -------------------------------------------------------------
// 5. Submit Manual Payment (Card-to-Card / Bank Transfer)
// -------------------------------------------------------------
app.post('/api/payments/manual/submit', (req: Request, res: Response) => {
  try {
    const { orderId, trackingCode, cardLastFour, customerNote, receiptImageUrl } = req.body;

    if (!orderId || !trackingCode) {
      return res.status(400).json({ error: 'شناسه سفارش و کد پیگیری الزامی است.' });
    }

    const order = ordersStore.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'سفارش مورد نظر یافت نشد.' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ error: 'این سفارش قبلاً تایید و پرداخت شده است.' });
    }

    // Set status to awaiting_manual_verification
    order.status = 'awaiting_manual_verification';
    order.manualTrackingCode = trackingCode;
    order.manualCardLastFour = cardLastFour || undefined;
    order.manualReceiptUrl = receiptImageUrl || undefined;
    order.manualCustomerNote = customerNote || undefined;
    order.updatedAt = new Date().toISOString();

    order.statusHistory.push({
      status: 'awaiting_manual_verification',
      timestamp: new Date().toISOString(),
      note: `فیش واریزی با کد پیگیری ${trackingCode} ثبت شد و در صف بررسی واحد مالی قرار گرفت.`,
      changedBy: 'customer'
    });

    return res.json({
      success: true,
      order,
      messageFa: 'رسید پرداخت دستی شما با موفقیت ثبت شد و پس از بررسی حسابدار، دوره شما فعال خواهد شد.'
    });
  } catch (error) {
    console.error('Error submitting manual payment:', error);
    return res.status(500).json({ error: 'خطای سرور در ثبت فیش.' });
  }
});

// -------------------------------------------------------------
// 6. Admin Review Manual Payment (Approve or Reject)
// -------------------------------------------------------------
app.post('/api/payments/manual/review', (req: Request, res: Response) => {
  try {
    const { orderId, decision, adminNote, adminName = 'مدیر مالی آکادمی', adminRole } = req.body;

    // Enforce authorization
    if (adminRole !== 'admin') {
      return res.status(403).json({
        error: 'unauthorized',
        messageFa: 'دسترسی غیرمجاز: فقط مدیران ارشد سیستم امکان بررسی و تایید فیش‌های واریزی را دارند.'
      });
    }

    if (!orderId || !decision) {
      return res.status(400).json({ error: 'شناسه سفارش و تصمیم بررسی الزامی است.' });
    }

    const order = ordersStore.get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'سفارش یافت نشد.' });
    }

    if (decision === 'approved') {
      order.status = 'paid';
      order.reviewedByAdmin = adminName;
      order.adminReviewNote = adminNote || 'فیش بانکی با گردش حساب تطابق داده شد و تایید گردید.';
      order.reviewedAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();

      order.statusHistory.push({
        status: 'paid',
        timestamp: new Date().toISOString(),
        note: `تایید فیش بانکی توسط ${adminName}. یادداشت: ${order.adminReviewNote}`,
        changedBy: adminName
      });

      // Activate Course Enrollment
      const enrollment = activateEnrollmentForOrder(order);

      return res.json({
        success: true,
        order,
        enrollment,
        messageFa: 'فیش بانکی تایید شد و دسترسی دانش‌آموز به دوره آموزشی فعال گردید.'
      });
    } else if (decision === 'rejected') {
      order.status = 'rejected';
      order.reviewedByAdmin = adminName;
      order.adminReviewNote = adminNote || 'فیش بانکی نامعتبر است یا با پرینت حساب تطابق ندارد.';
      order.reviewedAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();

      order.statusHistory.push({
        status: 'rejected',
        timestamp: new Date().toISOString(),
        note: `رد فیش بانکی توسط ${adminName}. علت: ${order.adminReviewNote}`,
        changedBy: adminName
      });

      return res.json({
        success: true,
        order,
        messageFa: 'فیش بانکی رد شد و علت رد در کارتابل کاربر ثبت گردید.'
      });
    } else {
      return res.status(400).json({ error: 'تصمیم نامعتبر است. (approved یا rejected)' });
    }
  } catch (error) {
    console.error('Error reviewing payment:', error);
    return res.status(500).json({ error: 'خطای سرور در بررسی فیش.' });
  }
});

// -------------------------------------------------------------
// 7. Get Orders List with Filters
// -------------------------------------------------------------
app.get('/api/payments/orders', (req: Request, res: Response) => {
  const { status, studentId, courseId, method } = req.query;

  let list = Array.from(ordersStore.values());

  if (status && status !== 'all') {
    list = list.filter(o => o.status === status);
  }
  if (studentId) {
    list = list.filter(o => o.studentId === studentId);
  }
  if (courseId) {
    list = list.filter(o => o.courseId === courseId);
  }
  if (method && method !== 'all') {
    list = list.filter(o => o.paymentMethod === method);
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ orders: list });
});

// -------------------------------------------------------------
// 8. Get Single Order Detail with Audit History
// -------------------------------------------------------------
app.get('/api/payments/orders/:orderId', (req: Request, res: Response) => {
  const order = ordersStore.get(req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'سفارش یافت نشد.' });
  }
  res.json({ order });
});

// -------------------------------------------------------------
// 9. Get Enrollments List
// -------------------------------------------------------------
app.get('/api/payments/enrollments', (req: Request, res: Response) => {
  const { studentId } = req.query;
  let list = Array.from(enrollmentsStore.values());
  if (studentId) {
    list = list.filter(e => e.studentId === studentId);
  }
  res.json({ enrollments: list });
});

// -------------------------------------------------------------
// Vite Middleware / Static serving setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Paradise Academy Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
