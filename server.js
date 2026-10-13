// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "";
var ZARINPAL_SANDBOX = process.env.ZARINPAL_SANDBOX === "true" || !process.env.ZARINPAL_MERCHANT_ID;
var APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
var ordersStore = /* @__PURE__ */ new Map([
  [
    "ord-1001",
    {
      id: "ord-1001",
      orderNumber: "ORD-1403-9821",
      studentId: "demo-student-1",
      studentName: "\u06A9\u06CC\u0627\u0646 \u0631\u0636\u0627\u06CC\u06CC (\u06A9\u0648\u062F\u06A9 \u06F8 \u0633\u0627\u0644\u0647)",
      studentEmail: "kian@paradise-example.ir",
      studentPhone: "\u06F0\u06F9\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9",
      courseId: "course-phonics-1",
      courseTitle: "\u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0634\u0627\u062F \u0648 \u0641\u0648\u0646\u06CC\u06A9\u0633 \u062C\u0627\u062F\u0648\u06CC\u06CC (Magic Phonics)",
      coursePrice: 85e4,
      finalAmount: 85e4,
      currency: "toman",
      paymentMethod: "online",
      status: "paid",
      gatewayProvider: "zarinpal",
      gatewayAuthority: "A00000000000000000000000000259817462",
      gatewayRefId: "10842918",
      gatewayCardPan: "\u06F5\u06F0\u06F2\u06F2\u06F2\u06F9******\u06F4\u06F3\u06F1\u06F2",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(Date.now() - 864e5 * 5).toISOString(),
          note: "\u0633\u0641\u0627\u0631\u0634 \u062B\u0628\u062A \u0634\u062F \u0648 \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u067E\u0631\u062F\u0627\u062E\u062A \u0622\u0646\u0644\u0627\u06CC\u0646 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644 \u0642\u0631\u0627\u0631 \u06AF\u0631\u0641\u062A.",
          changedBy: "system"
        },
        {
          status: "paid",
          timestamp: new Date(Date.now() - 864e5 * 5 + 12e4).toISOString(),
          note: "\u062A\u0631\u0627\u06A9\u0646\u0634 \u0628\u0627 \u0634\u0646\u0627\u0633\u0647 \u0645\u0631\u062C\u0639 \u06F1\u06F0\u06F8\u06F4\u06F2\u06F9\u06F1\u06F8 \u062F\u0631 \u0634\u0627\u067E\u0631\u06A9 \u062A\u0627\u06CC\u06CC\u062F \u0648 \u062F\u0648\u0631\u0647 \u0641\u0639\u0627\u0644 \u0634\u062F.",
          changedBy: "zarinpal-verification"
        }
      ],
      createdAt: new Date(Date.now() - 864e5 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 864e5 * 5 + 12e4).toISOString()
    }
  ],
  [
    "ord-1002",
    {
      id: "ord-1002",
      orderNumber: "ORD-1403-9822",
      studentId: "demo-student-2",
      studentName: "\u0633\u0627\u0631\u0627 \u0635\u0627\u062F\u0642\u06CC (\u0646\u0648\u062C\u0648\u0627\u0646 \u06F1\u06F4 \u0633\u0627\u0644\u0647)",
      studentEmail: "sara@paradise-example.ir",
      studentPhone: "\u06F0\u06F9\u06F3\u06F5\u06F6\u06F7\u06F8\u06F9\u06F0\u06F1\u06F2",
      courseId: "course-teen-fluency-5",
      courseTitle: "\u0645\u06A9\u0627\u0644\u0645\u0647 \u0631\u0648\u0627\u0646 \u0648 \u0622\u0645\u0627\u062F\u06AF\u06CC \u0622\u06CC\u0644\u062A\u0633 \u0646\u0648\u062C\u0648\u0627\u0646\u0627\u0646 (Teen Fluency)",
      coursePrice: 165e4,
      finalAmount: 165e4,
      currency: "toman",
      paymentMethod: "card_to_card",
      status: "awaiting_manual_verification",
      manualTrackingCode: "\u06F7\u06F8\u06F9\u06F6\u06F4\u06F2",
      manualCardLastFour: "\u06F4\u06F5\u06F2\u06F1",
      manualCustomerNote: "\u0648\u0627\u0631\u06CC\u0632 \u0627\u0632 \u0647\u0645\u0631\u0627\u0647 \u0628\u0627\u0646\u06A9 \u0645\u0644\u062A \u062F\u0631 \u0633\u0627\u0639\u062A \u06F1\u06F0:\u06F1\u06F5 \u0635\u0628\u062D \u0627\u0646\u062C\u0627\u0645 \u0634\u062F.",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(Date.now() - 864e5 * 1).toISOString(),
          note: "\u0633\u0641\u0627\u0631\u0634 \u062F\u0633\u062A\u06CC \u0627\u06CC\u062C\u0627\u062F \u0634\u062F.",
          changedBy: "customer"
        },
        {
          status: "awaiting_manual_verification",
          timestamp: new Date(Date.now() - 864e5 * 1 + 6e5).toISOString(),
          note: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0641\u06CC\u0634 \u0628\u0627\u0646\u06A9\u06CC \u062A\u0648\u0633\u0637 \u06A9\u0627\u0631\u0628\u0631 \u062B\u0628\u062A \u0634\u062F \u0648 \u0628\u0647 \u0635\u0641 \u0628\u0631\u0631\u0633\u06CC \u0648\u0627\u062D\u062F \u0645\u0627\u0644\u06CC \u0627\u0631\u0633\u0627\u0644 \u06AF\u0631\u062F\u06CC\u062F.",
          changedBy: "customer"
        }
      ],
      createdAt: new Date(Date.now() - 864e5 * 1).toISOString(),
      updatedAt: new Date(Date.now() - 864e5 * 1 + 6e5).toISOString()
    }
  ]
]);
var enrollmentsStore = /* @__PURE__ */ new Map([
  [
    "enroll-sample-1",
    {
      id: "enroll-sample-1",
      studentId: "demo-student-1",
      studentName: "\u06A9\u06CC\u0627\u0646 \u0631\u0636\u0627\u06CC\u06CC (\u06A9\u0648\u062F\u06A9 \u06F8 \u0633\u0627\u0644\u0647)",
      studentEmail: "kian@paradise-example.ir",
      studentPhone: "\u06F0\u06F9\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9",
      courseId: "course-phonics-1",
      courseTitle: "\u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u0634\u0627\u062F \u0648 \u0641\u0648\u0646\u06CC\u06A9\u0633 \u062C\u0627\u062F\u0648\u06CC\u06CC (Magic Phonics)",
      status: "active",
      paymentMethod: "online",
      amount: 85e4,
      currency: "toman",
      orderId: "ord-1001",
      orderNumber: "ORD-1403-9821",
      receiptRef: "TXN-984210",
      createdAt: new Date(Date.now() - 864e5 * 5).toISOString()
    }
  ]
]);
function activateEnrollmentForOrder(order) {
  for (const en of enrollmentsStore.values()) {
    if (en.orderId === order.id || en.studentId === order.studentId && en.courseId === order.courseId) {
      en.status = "active";
      en.orderId = order.id;
      en.orderNumber = order.orderNumber;
      en.receiptRef = order.gatewayRefId || order.manualTrackingCode || `TXN-${Date.now()}`;
      en.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      return en;
    }
  }
  const newEnrollment = {
    id: `enroll-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    studentId: order.studentId,
    studentName: order.studentName,
    studentEmail: order.studentEmail,
    studentPhone: order.studentPhone,
    courseId: order.courseId,
    courseTitle: order.courseTitle,
    status: "active",
    paymentMethod: order.paymentMethod,
    amount: order.finalAmount,
    currency: order.currency,
    orderId: order.id,
    orderNumber: order.orderNumber,
    receiptRef: order.gatewayRefId || order.manualTrackingCode || `TXN-${Date.now()}`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  enrollmentsStore.set(newEnrollment.id, newEnrollment);
  return newEnrollment;
}
app.get("/api/payments/status", (_req, res) => {
  const isMerchantConfigured = Boolean(ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim().length >= 30);
  res.json({
    configured: true,
    provider: "zarinpal",
    merchantConfigured: isMerchantConfigured,
    sandbox: ZARINPAL_SANDBOX,
    currencyDefault: "toman",
    messageFa: isMerchantConfigured ? "\u062F\u0631\u06AF\u0627\u0647 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644 \u0628\u0627 \u0634\u0646\u0627\u0633\u0647 \u0645\u0631\u0686\u0646\u062A \u0633\u0631\u0648\u0631 \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC \u0634\u062F\u0647 \u0648 \u0622\u0645\u0627\u062F\u0647 \u0627\u0633\u062A." : "\u062F\u0631\u06AF\u0627\u0647 \u067E\u0631\u062F\u0627\u062E\u062A \u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u062A\u0646\u0638\u06CC\u0645 \u0645\u062A\u063A\u06CC\u0631 ZARINPAL_MERCHANT_ID \u062F\u0631 \u0641\u0627\u06CC\u0644 .env \u0633\u0631\u0648\u0631 \u0627\u0633\u062A (\u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u062D\u0627\u0644\u062A \u0622\u0632\u0645\u0627\u06CC\u0634\u06CC \u0633\u0646\u0627\u0631\u06CC\u0648/\u0633\u0646\u062F\u0628\u0627\u06A9\u0633 \u0641\u0639\u0627\u0644 \u0645\u06CC\u200C\u0628\u0627\u0634\u062F)."
  });
});
app.post("/api/payments/create-order", (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      studentPhone,
      courseId,
      courseTitle,
      coursePrice,
      currency = "toman",
      paymentMethod = "online"
    } = req.body;
    if (!courseId || !courseTitle || !studentId) {
      return res.status(400).json({ error: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062F\u0648\u0631\u0647 \u0648 \u06A9\u0627\u0631\u0628\u0631 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." });
    }
    for (const en of enrollmentsStore.values()) {
      if (en.studentId === studentId && en.courseId === courseId && en.status === "active") {
        return res.status(409).json({
          error: "duplicate_enrollment",
          messageFa: "\u0634\u0645\u0627 \u0642\u0628\u0644\u0627\u064B \u062F\u0631 \u0627\u06CC\u0646 \u062F\u0648\u0631\u0647 \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F \u0648 \u062F\u0633\u062A\u0631\u0633\u06CC \u0634\u0645\u0627 \u0641\u0639\u0627\u0644 \u0627\u0633\u062A."
        });
      }
    }
    const orderId = `ord-${Date.now()}`;
    const randomSuffix = Math.floor(1e3 + Math.random() * 9e3);
    const orderNumber = `ORD-1403-${randomSuffix}`;
    const newOrder = {
      id: orderId,
      orderNumber,
      studentId,
      studentName: studentName || "\u06A9\u0627\u0631\u0628\u0631 \u06AF\u0631\u0627\u0645\u06CC",
      studentEmail,
      studentPhone,
      courseId,
      courseTitle,
      coursePrice: Number(coursePrice) || 0,
      finalAmount: Number(coursePrice) || 0,
      currency: currency === "rial" ? "rial" : "toman",
      paymentMethod,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          note: `\u0633\u0641\u0627\u0631\u0634 \u0627\u06CC\u062C\u0627\u062F \u0634\u062F. \u0631\u0648\u0634 \u067E\u0631\u062F\u0627\u062E\u062A \u0627\u0646\u062A\u062E\u0627\u0628 \u0634\u062F\u0647: ${paymentMethod === "online" ? "\u062F\u0631\u06AF\u0627\u0647 \u0622\u0646\u0644\u0627\u06CC\u0646 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644" : "\u06A9\u0627\u0631\u062A \u0628\u0647 \u06A9\u0627\u0631\u062A \u062F\u0633\u062A\u06CC"}`,
          changedBy: "customer"
        }
      ],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ordersStore.set(orderId, newOrder);
    return res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "\u062E\u0637\u0627\u06CC \u0633\u0631\u0648\u0631 \u062F\u0631 \u0627\u06CC\u062C\u0627\u062F \u0633\u0641\u0627\u0631\u0634." });
  }
});
app.post("/api/payments/online/initiate", async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u0633\u0641\u0627\u0631\u0634 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." });
    }
    const order = ordersStore.get(orderId);
    if (!order) {
      return res.status(404).json({ error: "\u0633\u0641\u0627\u0631\u0634 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." });
    }
    if (order.status === "paid") {
      return res.status(400).json({
        error: "already_paid",
        messageFa: "\u0627\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634 \u0642\u0628\u0644\u0627\u064B \u067E\u0631\u062F\u0627\u062E\u062A \u0648 \u062A\u0627\u06CC\u06CC\u062F \u0634\u062F\u0647 \u0627\u0633\u062A."
      });
    }
    const amountInToman = order.currency === "rial" ? Math.round(order.finalAmount / 10) : order.finalAmount;
    const hasMerchant = Boolean(ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim().length >= 30);
    if (!hasMerchant && !ZARINPAL_SANDBOX) {
      return res.status(400).json({
        error: "setup_required",
        messageFa: "\u062A\u0646\u0638\u06CC\u0645 \u062F\u0631\u06AF\u0627\u0647 \u067E\u0631\u062F\u0627\u062E\u062A \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644 \u062F\u0631 \u0633\u0631\u0648\u0631 \u0636\u0631\u0648\u0631\u06CC \u0627\u0633\u062A. \u0644\u0637\u0641\u0627\u064B \u0645\u062A\u063A\u06CC\u0631 ZARINPAL_MERCHANT_ID \u0631\u0627 \u062F\u0631 \u0645\u062A\u063A\u06CC\u0631\u0647\u0627\u06CC \u0645\u062D\u06CC\u0637\u06CC \u0633\u0631\u0648\u0631 \u062A\u0646\u0638\u06CC\u0645 \u0646\u0645\u0627\u06CC\u06CC\u062F."
      });
    }
    const callbackUrl = `${APP_URL}/api/payments/online/callback?orderId=${encodeURIComponent(order.id)}`;
    if (hasMerchant && !ZARINPAL_SANDBOX) {
      try {
        const response = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: amountInToman,
            currency: "IRT",
            description: `\u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u062F\u0648\u0631\u0647 \u0622\u0645\u0648\u0632\u0634\u06CC ${order.courseTitle} - \u0633\u0641\u0627\u0631\u0634 ${order.orderNumber}`,
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
          order.gatewayProvider = "zarinpal";
          order.gatewayAuthority = authority;
          order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          order.statusHistory.push({
            status: "pending",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            note: `\u0627\u062A\u0635\u0627\u0644 \u0628\u0647 \u062F\u0631\u06AF\u0627\u0647 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644 \u0628\u0627 \u0634\u0646\u0627\u0633\u0647 \u067E\u06CC\u06AF\u06CC\u0631\u06CC ${authority}`,
            changedBy: "system"
          });
          return res.json({
            success: true,
            authority,
            paymentUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`
          });
        } else {
          return res.status(400).json({
            error: "gateway_error",
            messageFa: `\u062E\u0637\u0627\u06CC \u062F\u0631\u06AF\u0627\u0647 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644: \u06A9\u062F \u062E\u0637\u0627 ${data?.errors?.code || data?.data?.code || "\u0646\u0627\u0645\u0634\u062E\u0635"}`
          });
        }
      } catch (err) {
        console.error("Zarinpal API connection error:", err);
      }
    }
    const simulatedAuthority = `A00000000000000000000000000${Date.now().toString().slice(-8)}`;
    order.gatewayProvider = "zarinpal";
    order.gatewayAuthority = simulatedAuthority;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    order.statusHistory.push({
      status: "pending",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      note: `\u0627\u062A\u0635\u0627\u0644 \u0628\u0647 \u062F\u0631\u06AF\u0627\u0647 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644 (\u062D\u0627\u0644\u062A \u0622\u0632\u0645\u0627\u06CC\u0634\u06CC \u0645\u0639\u062A\u0628\u0631 Sandbox) \u0628\u0627 \u0634\u0646\u0627\u0633\u0647 ${simulatedAuthority}`,
      changedBy: "system"
    });
    const sandboxPaymentUrl = `${APP_URL}/api/payments/sandbox-gateway?Authority=${simulatedAuthority}&orderId=${order.id}&amount=${amountInToman}`;
    return res.json({
      success: true,
      authority: simulatedAuthority,
      sandbox: true,
      paymentUrl: sandboxPaymentUrl,
      messageFa: "\u0627\u062A\u0635\u0627\u0644 \u0628\u0647 \u062F\u0631\u06AF\u0627\u0647 \u0622\u0632\u0645\u0627\u06CC\u0634\u06CC \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0627\u0646\u062C\u0627\u0645 \u0634\u062F."
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json({ error: "\u062E\u0637\u0627\u06CC \u0633\u0631\u0648\u0631 \u062F\u0631 \u0627\u062A\u0635\u0627\u0644 \u0628\u0647 \u062F\u0631\u06AF\u0627\u0647 \u067E\u0631\u062F\u0627\u062E\u062A." });
  }
});
app.get("/api/payments/sandbox-gateway", (req, res) => {
  const { Authority, orderId, amount } = req.query;
  const order = ordersStore.get(orderId);
  if (!order) {
    return res.status(404).send("\u0633\u0641\u0627\u0631\u0634 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>\u062F\u0631\u06AF\u0627\u0647 \u067E\u0631\u062F\u0627\u062E\u062A \u0627\u0644\u06A9\u062A\u0631\u0648\u0646\u06CC\u06A9 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644 (\u062D\u0627\u0644\u062A \u0622\u0632\u0645\u0627\u06CC\u0634\u06CC)</title>
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
          <div class="logo">\u062F\u0631\u06AF\u0627\u0647 \u067E\u0631\u062F\u0627\u062E\u062A \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644</div>
          <span class="badge">\u0645\u062D\u06CC\u0637 \u0622\u0632\u0645\u0627\u06CC\u0634\u06CC (\u0633\u0646\u062F\u0628\u0627\u06A9\u0633 \u0634\u0627\u067E\u0631\u06A9)</span>
        </div>
        <div class="row">
          <span class="label">\u067E\u0630\u06CC\u0631\u0646\u062F\u0647:</span>
          <span class="value">\u0622\u06A9\u0627\u062F\u0645\u06CC \u0632\u0628\u0627\u0646 \u0627\u0646\u06AF\u0644\u06CC\u0633\u06CC \u067E\u0627\u0631\u0627\u062F\u0627\u06CC\u0633</span>
        </div>
        <div class="row">
          <span class="label">\u0634\u0645\u0627\u0631\u0647 \u0633\u0641\u0627\u0631\u0634:</span>
          <span class="value" dir="ltr">${order.orderNumber}</span>
        </div>
        <div class="row">
          <span class="label">\u062F\u0648\u0631\u0647 \u0627\u0646\u062A\u062E\u0627\u0628\u06CC:</span>
          <span class="value">${order.courseTitle}</span>
        </div>
        <div class="row">
          <span class="label">\u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632:</span>
          <span class="value">${order.studentName}</span>
        </div>
        <div class="row" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9;">
          <span class="label">\u0645\u0628\u0644\u063A \u0642\u0627\u0628\u0644 \u067E\u0631\u062F\u0627\u062E\u062A:</span>
          <span class="amount">${Number(amount || order.finalAmount).toLocaleString("fa-IR")} \u062A\u0648\u0645\u0627\u0646</span>
        </div>

        <div class="card-box">
          \u0627\u06CC\u0646 \u0645\u062D\u06CC\u0637 \u0634\u0628\u06CC\u0647\u200C\u0633\u0627\u0632 \u062F\u0631\u06AF\u0627\u0647 \u0648\u0627\u0642\u0639\u06CC \u0628\u0631\u0627\u06CC \u0627\u0631\u0632\u06CC\u0627\u0628\u06CC \u0641\u0631\u0622\u06CC\u0646\u062F \u067E\u0631\u062F\u0627\u062E\u062A \u0648 \u062A\u0627\u06CC\u06CC\u062F \u0633\u0641\u0627\u0631\u0634 \u0627\u0633\u062A. \u0628\u0627 \u06A9\u0644\u06CC\u06A9 \u0628\u0631 \u0631\u0648\u06CC <b>\u062A\u0627\u06CC\u06CC\u062F \u067E\u0631\u062F\u0627\u062E\u062A</b>\u060C \u062A\u0631\u0627\u06A9\u0646\u0634 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0645\u0648\u0641\u0642 \u062F\u0631 \u0633\u0631\u0648\u0631 \u062A\u0627\u06CC\u06CC\u062F \u0634\u062F\u0647 \u0648 \u062F\u0648\u0631\u0647 \u0641\u0639\u0627\u0644 \u062E\u0648\u0627\u0647\u062F \u0634\u062F.
        </div>

        <div class="btn-group">
          <a href="/api/payments/online/callback?Authority=${Authority}&Status=OK&orderId=${order.id}" class="btn btn-success">
            \u062A\u0627\u06CC\u06CC\u062F \u067E\u0631\u062F\u0627\u062E\u062A \u0648 \u0628\u0627\u0632\u06AF\u0634\u062A
          </a>
          <a href="/api/payments/online/callback?Authority=${Authority}&Status=NOK&orderId=${order.id}" class="btn btn-cancel">
            \u0627\u0646\u0635\u0631\u0627\u0641 \u0627\u0632 \u067E\u0631\u062F\u0627\u062E\u062A
          </a>
        </div>
      </div>
    </body>
    </html>
  `);
});
app.get("/api/payments/online/callback", async (req, res) => {
  try {
    const { Authority, Status, orderId } = req.query;
    if (!orderId) {
      return res.redirect("/?paymentStatus=error&message=order_not_found");
    }
    const order = ordersStore.get(orderId);
    if (!order) {
      return res.redirect("/?paymentStatus=error&message=order_not_found");
    }
    if (Status !== "OK") {
      order.status = "cancelled";
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.statusHistory.push({
        status: "cancelled",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        note: "\u067E\u0631\u062F\u0627\u062E\u062A \u0622\u0646\u0644\u0627\u06CC\u0646 \u062A\u0648\u0633\u0637 \u0645\u0634\u062A\u0631\u06CC \u062F\u0631 \u062F\u0631\u06AF\u0627\u0647 \u0628\u0627\u0646\u06A9\u06CC \u0644\u063A\u0648 \u0634\u062F \u06CC\u0627 \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F.",
        changedBy: "gateway-callback"
      });
      return res.redirect(`/?paymentStatus=cancelled&orderNumber=${encodeURIComponent(order.orderNumber)}`);
    }
    if (order.status === "paid") {
      return res.redirect(
        `/?paymentStatus=success&orderNumber=${encodeURIComponent(order.orderNumber)}&refId=${encodeURIComponent(order.gatewayRefId || "")}`
      );
    }
    let verified = false;
    let refId = "";
    let cardPan = "\u06F5\u06F0\u06F2\u06F2\u06F2\u06F9******" + Math.floor(1e3 + Math.random() * 9e3);
    const hasMerchant = Boolean(ZARINPAL_MERCHANT_ID && ZARINPAL_MERCHANT_ID.trim().length >= 30);
    if (hasMerchant && !ZARINPAL_SANDBOX) {
      try {
        const amountInToman = order.currency === "rial" ? Math.round(order.finalAmount / 10) : order.finalAmount;
        const verifyRes = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            merchant_id: ZARINPAL_MERCHANT_ID,
            amount: amountInToman,
            authority: Authority
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyData?.data?.code === 100 || verifyData?.data?.code === 101) {
          verified = true;
          refId = String(verifyData.data.ref_id);
          cardPan = verifyData.data.card_pan || cardPan;
        } else {
          order.status = "failed";
          order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
          order.statusHistory.push({
            status: "failed",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            note: `\u062A\u0627\u06CC\u06CC\u062F \u062A\u0631\u0627\u06A9\u0646\u0634 \u0628\u0627 \u062F\u0631\u06AF\u0627\u0647 \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F (\u06A9\u062F \u062E\u0637\u0627: ${verifyData?.errors?.code || verifyData?.data?.code})`,
            changedBy: "zarinpal-verify"
          });
          return res.redirect(`/?paymentStatus=failed&orderNumber=${encodeURIComponent(order.orderNumber)}`);
        }
      } catch (verifyErr) {
        console.error("Error contacting Zarinpal verify:", verifyErr);
      }
    } else {
      verified = true;
      refId = String(Math.floor(1e7 + Math.random() * 9e7));
    }
    if (verified) {
      order.status = "paid";
      order.gatewayRefId = refId;
      order.gatewayCardPan = cardPan;
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.statusHistory.push({
        status: "paid",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        note: `\u067E\u0631\u062F\u0627\u062E\u062A \u0622\u0646\u0644\u0627\u06CC\u0646 \u062A\u0627\u06CC\u06CC\u062F \u0634\u062F. \u0634\u0645\u0627\u0631\u0647 \u0645\u0631\u062C\u0639 \u0634\u0627\u067E\u0631\u06A9: ${refId}`,
        changedBy: "zarinpal-verification"
      });
      activateEnrollmentForOrder(order);
      return res.redirect(
        `/?paymentStatus=success&orderNumber=${encodeURIComponent(order.orderNumber)}&refId=${encodeURIComponent(refId)}`
      );
    }
    return res.redirect(`/?paymentStatus=failed&orderNumber=${encodeURIComponent(order.orderNumber)}`);
  } catch (error) {
    console.error("Callback error:", error);
    return res.redirect("/?paymentStatus=error");
  }
});
app.post("/api/payments/manual/submit", (req, res) => {
  try {
    const { orderId, trackingCode, cardLastFour, customerNote, receiptImageUrl } = req.body;
    if (!orderId || !trackingCode) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u0633\u0641\u0627\u0631\u0634 \u0648 \u06A9\u062F \u067E\u06CC\u06AF\u06CC\u0631\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." });
    }
    const order = ordersStore.get(orderId);
    if (!order) {
      return res.status(404).json({ error: "\u0633\u0641\u0627\u0631\u0634 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." });
    }
    if (order.status === "paid") {
      return res.status(400).json({ error: "\u0627\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634 \u0642\u0628\u0644\u0627\u064B \u062A\u0627\u06CC\u06CC\u062F \u0648 \u067E\u0631\u062F\u0627\u062E\u062A \u0634\u062F\u0647 \u0627\u0633\u062A." });
    }
    order.status = "awaiting_manual_verification";
    order.manualTrackingCode = trackingCode;
    order.manualCardLastFour = cardLastFour || void 0;
    order.manualReceiptUrl = receiptImageUrl || void 0;
    order.manualCustomerNote = customerNote || void 0;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    order.statusHistory.push({
      status: "awaiting_manual_verification",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      note: `\u0641\u06CC\u0634 \u0648\u0627\u0631\u06CC\u0632\u06CC \u0628\u0627 \u06A9\u062F \u067E\u06CC\u06AF\u06CC\u0631\u06CC ${trackingCode} \u062B\u0628\u062A \u0634\u062F \u0648 \u062F\u0631 \u0635\u0641 \u0628\u0631\u0631\u0633\u06CC \u0648\u0627\u062D\u062F \u0645\u0627\u0644\u06CC \u0642\u0631\u0627\u0631 \u06AF\u0631\u0641\u062A.`,
      changedBy: "customer"
    });
    return res.json({
      success: true,
      order,
      messageFa: "\u0631\u0633\u06CC\u062F \u067E\u0631\u062F\u0627\u062E\u062A \u062F\u0633\u062A\u06CC \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F \u0648 \u067E\u0633 \u0627\u0632 \u0628\u0631\u0631\u0633\u06CC \u062D\u0633\u0627\u0628\u062F\u0627\u0631\u060C \u062F\u0648\u0631\u0647 \u0634\u0645\u0627 \u0641\u0639\u0627\u0644 \u062E\u0648\u0627\u0647\u062F \u0634\u062F."
    });
  } catch (error) {
    console.error("Error submitting manual payment:", error);
    return res.status(500).json({ error: "\u062E\u0637\u0627\u06CC \u0633\u0631\u0648\u0631 \u062F\u0631 \u062B\u0628\u062A \u0641\u06CC\u0634." });
  }
});
app.post("/api/payments/manual/review", (req, res) => {
  try {
    const { orderId, decision, adminNote, adminName = "\u0645\u062F\u06CC\u0631 \u0645\u0627\u0644\u06CC \u0622\u06A9\u0627\u062F\u0645\u06CC", adminRole } = req.body;
    if (adminRole !== "admin") {
      return res.status(403).json({
        error: "unauthorized",
        messageFa: "\u062F\u0633\u062A\u0631\u0633\u06CC \u063A\u06CC\u0631\u0645\u062C\u0627\u0632: \u0641\u0642\u0637 \u0645\u062F\u06CC\u0631\u0627\u0646 \u0627\u0631\u0634\u062F \u0633\u06CC\u0633\u062A\u0645 \u0627\u0645\u06A9\u0627\u0646 \u0628\u0631\u0631\u0633\u06CC \u0648 \u062A\u0627\u06CC\u06CC\u062F \u0641\u06CC\u0634\u200C\u0647\u0627\u06CC \u0648\u0627\u0631\u06CC\u0632\u06CC \u0631\u0627 \u062F\u0627\u0631\u0646\u062F."
      });
    }
    if (!orderId || !decision) {
      return res.status(400).json({ error: "\u0634\u0646\u0627\u0633\u0647 \u0633\u0641\u0627\u0631\u0634 \u0648 \u062A\u0635\u0645\u06CC\u0645 \u0628\u0631\u0631\u0633\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." });
    }
    const order = ordersStore.get(orderId);
    if (!order) {
      return res.status(404).json({ error: "\u0633\u0641\u0627\u0631\u0634 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." });
    }
    if (decision === "approved") {
      order.status = "paid";
      order.reviewedByAdmin = adminName;
      order.adminReviewNote = adminNote || "\u0641\u06CC\u0634 \u0628\u0627\u0646\u06A9\u06CC \u0628\u0627 \u06AF\u0631\u062F\u0634 \u062D\u0633\u0627\u0628 \u062A\u0637\u0627\u0628\u0642 \u062F\u0627\u062F\u0647 \u0634\u062F \u0648 \u062A\u0627\u06CC\u06CC\u062F \u06AF\u0631\u062F\u06CC\u062F.";
      order.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.statusHistory.push({
        status: "paid",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        note: `\u062A\u0627\u06CC\u06CC\u062F \u0641\u06CC\u0634 \u0628\u0627\u0646\u06A9\u06CC \u062A\u0648\u0633\u0637 ${adminName}. \u06CC\u0627\u062F\u062F\u0627\u0634\u062A: ${order.adminReviewNote}`,
        changedBy: adminName
      });
      const enrollment = activateEnrollmentForOrder(order);
      return res.json({
        success: true,
        order,
        enrollment,
        messageFa: "\u0641\u06CC\u0634 \u0628\u0627\u0646\u06A9\u06CC \u062A\u0627\u06CC\u06CC\u062F \u0634\u062F \u0648 \u062F\u0633\u062A\u0631\u0633\u06CC \u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632 \u0628\u0647 \u062F\u0648\u0631\u0647 \u0622\u0645\u0648\u0632\u0634\u06CC \u0641\u0639\u0627\u0644 \u06AF\u0631\u062F\u06CC\u062F."
      });
    } else if (decision === "rejected") {
      order.status = "rejected";
      order.reviewedByAdmin = adminName;
      order.adminReviewNote = adminNote || "\u0641\u06CC\u0634 \u0628\u0627\u0646\u06A9\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A \u06CC\u0627 \u0628\u0627 \u067E\u0631\u06CC\u0646\u062A \u062D\u0633\u0627\u0628 \u062A\u0637\u0627\u0628\u0642 \u0646\u062F\u0627\u0631\u062F.";
      order.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.statusHistory.push({
        status: "rejected",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        note: `\u0631\u062F \u0641\u06CC\u0634 \u0628\u0627\u0646\u06A9\u06CC \u062A\u0648\u0633\u0637 ${adminName}. \u0639\u0644\u062A: ${order.adminReviewNote}`,
        changedBy: adminName
      });
      return res.json({
        success: true,
        order,
        messageFa: "\u0641\u06CC\u0634 \u0628\u0627\u0646\u06A9\u06CC \u0631\u062F \u0634\u062F \u0648 \u0639\u0644\u062A \u0631\u062F \u062F\u0631 \u06A9\u0627\u0631\u062A\u0627\u0628\u0644 \u06A9\u0627\u0631\u0628\u0631 \u062B\u0628\u062A \u06AF\u0631\u062F\u06CC\u062F."
      });
    } else {
      return res.status(400).json({ error: "\u062A\u0635\u0645\u06CC\u0645 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A. (approved \u06CC\u0627 rejected)" });
    }
  } catch (error) {
    console.error("Error reviewing payment:", error);
    return res.status(500).json({ error: "\u062E\u0637\u0627\u06CC \u0633\u0631\u0648\u0631 \u062F\u0631 \u0628\u0631\u0631\u0633\u06CC \u0641\u06CC\u0634." });
  }
});
app.get("/api/payments/orders", (req, res) => {
  const { status, studentId, courseId, method } = req.query;
  let list = Array.from(ordersStore.values());
  if (status && status !== "all") {
    list = list.filter((o) => o.status === status);
  }
  if (studentId) {
    list = list.filter((o) => o.studentId === studentId);
  }
  if (courseId) {
    list = list.filter((o) => o.courseId === courseId);
  }
  if (method && method !== "all") {
    list = list.filter((o) => o.paymentMethod === method);
  }
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ orders: list });
});
app.get("/api/payments/orders/:orderId", (req, res) => {
  const order = ordersStore.get(req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: "\u0633\u0641\u0627\u0631\u0634 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." });
  }
  res.json({ order });
});
app.get("/api/payments/enrollments", (req, res) => {
  const { studentId } = req.query;
  let list = Array.from(enrollmentsStore.values());
  if (studentId) {
    list = list.filter((e) => e.studentId === studentId);
  }
  res.json({ enrollments: list });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`\u{1F680} Paradise Academy Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
