// Pure mathematical Gregorian <-> Jalali Converter without heavy external dependencies

const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const JALALI_WEEK_DAYS = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'
];

/**
 * Converts a Gregorian date (year, month 1-12, day 1-31) to Jalali [jy, jm, jd]
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 0) {
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

/**
 * Convert any Date or ISO string to Persian formatted string
 * e.g. "۲۵ مهر ۱۴۰۵"
 */
export function formatToJalali(dateInput: Date | string | number, includeTime: boolean = false): string {
  const date = typeof dateInput === 'object' ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return 'تاریخ نامشخص';

  const [jy, jm, jd] = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const monthName = JALALI_MONTH_NAMES[jm - 1];

  let result = `${toPersianDigits(jd)} ${monthName} ${toPersianDigits(jy)}`;

  if (includeTime) {
    // Tehran time format
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    result += ` - ساعت ${toPersianDigits(`${hours}:${minutes}`)} (تهران)`;
  }

  return result;
}

/**
 * Converts standard English numbers to Persian digits
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Converts Persian and Arabic digits to standard ASCII English digits
 */
export function normalizePersianDigits(input: string): string {
  if (!input) return '';
  return input
    .replace(/[۰-۹]/g, d => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)])
    .replace(/[٠-٩]/g, d => '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]);
}

/**
 * Validates and normalizes Iranian mobile numbers (e.g. 09123456789 or +989123456789)
 */
export function normalizeIranianPhone(phone: string): { isValid: boolean; normalized: string } {
  let clean = normalizePersianDigits(phone).replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('+98')) {
    clean = '0' + clean.slice(3);
  } else if (clean.startsWith('0098')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('98')) {
    clean = '0' + clean.slice(2);
  } else if (clean.startsWith('9') && clean.length === 10) {
    clean = '0' + clean;
  }

  const isValid = /^09[0-9]{9}$/.test(clean);
  return { isValid, normalized: clean };
}

/**
 * Formats monetary price with explicit currency unit in Persian
 * Never silently converts between toman and rial; preserves administrator choice
 */
export function formatPrice(amount: number, currency: 'toman' | 'rial' = 'toman'): string {
  const formatted = amount.toLocaleString('en-US');
  const persianNum = toPersianDigits(formatted);
  const unit = currency === 'toman' ? 'تومان' : 'ریال';
  return `${persianNum} ${unit}`;
}

/**
 * Plays English speech pronunciation using standard Web Speech API
 */
export function speakEnglish(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slightly slower for Persian children and youth learning
    window.speechSynthesis.speak(utterance);
  }
}
