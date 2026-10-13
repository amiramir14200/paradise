import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Send, CheckCircle2, Phone, Mail, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { normalizeIranianPhone } from '../../utils/jalali';

export const AboutContactFaq: React.FC = () => {
  const { settings } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'آیا برای شرکت در کلاس‌های آنلاین، نیاز به نصب نرم‌افزار خاصی است؟',
      a: 'خیر، کلاس‌های زنده آکادمی پارادایس بر بستر اختصاصی اسکای‌روم و مرورگر وب برگزار می‌شوند و از طریق موبایل، تبلت یا لپ‌تاپ بدون نیاز به نصب هرگونه برنامه اضافی یا فیلترشکن قابل دسترسی هستند. همچنین ترافیک اینترنت برای کاربران ایران به صورت نیم‌بهاء محاسبه می‌شود.'
    },
    {
      q: 'کلاس‌ها چند نفره هستند و اساتید چگونه با کودکان تعامل می‌کنند؟',
      a: 'برای تضمین مکالمه فعال، کلاس‌های آنلاین ما حداکثر بین ۶ تا ۸ نفر ظرفیت دارند. تمام اساتید دارای مدرک تخصصی TTC کودکان و نوجوانان هستند و با استفاده از بازی، عروسک‌های آموزشی، داستان و انیمیشن کودک را مشتاق صحبت کردن نگه می‌دارند.'
    },
    {
      q: 'والدین چگونه می‌توانند پیشرفت درسی و تکالیف فرزندشان را رصد کنند؟',
      a: 'هر دانش‌آموز دارای یک پروفایل ولی (Guardian) متصل است. در پنل اختصاصی والدین، گزارش حضور و غیاب، نمرات کوئیزها، بازخورد اختصاصی استاد پس از هر جلسه و گواهی‌های مهارتی به صورت شفاف قابل مشاهده است.'
    },
    {
      q: 'آیا جلسات آنلاین ضبط می‌شوند تا در صورت غیبت مرور شوند؟',
      a: 'بله، تمامی جلسات آنلاین ذخیره شده و همراه با جزوات و فلش‌کارت‌های صوتی در پنل دانش‌آموز تا پایان ترم در دسترس خواهند بود.'
    },
    {
      q: 'شهریه به چه صورت پرداخت می‌شود؟ آیا امکان کارت به کارت وجود دارد؟',
      a: 'بله، علاوه بر درگاه پرداخت آنلاین شاپرک، امکان پرداخت سنتی از طریق کارت به کارت با ثبت شماره پیگیری و تایید توسط واحد مالی در سامانه وجود دارد.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, normalized } = normalizeIranianPhone(phone);
    if (!isValid) {
      setPhoneError('لطفاً یک شماره موبایل معتبر ایران (مثال: ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.');
      return;
    }
    setPhoneError('');
    setSubmitted(true);
  };

  return (
    <div className="bg-white">
      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-white to-orange-50/30 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>داستان آکادمی پارادایس</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                آموزش زبان، پلی برای اعتماد به نفس و کشف استعدادهای نسل فردا
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                آکادمی پارادایس با هدف پایان دادن به روش‌های حفظی و سنتی آموزش زبان انگلیسی، متدی مدرن و علمی را متناسب با ویژگی‌های رفتاری کودکان و نوجوانان ایرانی پایه‌گذاری کرده است.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">متد آواشناسی طبیعی (Phonics First)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">کودکان پیش از نوشتن، صداها و لهجه اصیل انگلیسی را از طریق بازی و موسیقی می‌آموزند.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-orange-100 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">کادر مدرسان برگزیده با تایید صلاحیت اخلاقی و علمی</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">تمام مدرسان تحت نظارت مشاور روانشناسی کودک و نوجوان گزینش و ارزیابی هفتگی می‌شوند.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80"
                  alt="محیط آموزشی پارادایس"
                  className="w-full h-[380px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50/70 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
              <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
              <span>پاسخ به ابهامات متداول</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">پرسش‌های پرتکرار والدین</h2>
            <p className="text-xs text-slate-500">اگر سوال دیگری دارید، تیم پشتیبانی ما همواره پاسخگوی شماست.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-right flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-800 hover:text-orange-600 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Info Side */}
            <div className="lg:col-span-5 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                <span>ارتباط مستقیم با مشاوران آموزشی</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">نیاز به راهنمایی برای ثبت‌نام دارید؟</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                مشاوران آموزشی ما آماده‌اند تا بر اساس سن و پیشینه تحصیلی فرزند شما، مناسب‌ترین دوره و زمان‌بندی را پیشنهاد دهند.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold">تلفن پشتیبانی (تهران)</span>
                    <span className="text-xs font-black text-slate-800" dir="ltr">{settings.brandPhone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold">ایمیل ارتباطی</span>
                    <span className="text-xs font-black text-slate-800" dir="ltr">{settings.brandEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-bold">دفتر مرکزی</span>
                    <span className="text-xs font-black text-slate-800">{settings.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-right">
                {submitted ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">پیام شما با موفقیت ثبت شد!</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      کارشناسان آموزش آکادمی پارادایس طی ۲۴ ساعت آینده با شماره وارد شده تماس خواهند گرفت.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setPhone('');
                        setMessage('');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold cursor-pointer"
                    >
                      ارسال پیام جدید
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="text-base font-black text-slate-800 mb-2">درخواست مشاوره رایگان تلفنی</h3>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">نام و نام خانوادگی والد / زبان‌آموز</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: مریم مرادی"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">شماره موبایل ایران (جهت تماس کارشناس)</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError('');
                        }}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-en text-right"
                      />
                      {phoneError && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{phoneError}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">توضیحات یا سن فرزند</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="سن فرزند، سابقه قبلی آموزش زبان یا روزهای مورد نظر خود را ذکر فرمایید..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>ارسال درخواست و دریافت تماس مشاوره</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
