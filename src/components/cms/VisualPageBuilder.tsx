import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Settings,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Image as ImageIcon,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CmsPage, CmsSection, CmsSectionType, CmsSectionItem } from '../../types';
import { DynamicPageRenderer } from './DynamicPageRenderer';

export const VisualPageBuilder: React.FC = () => {
  const { cmsPages, saveCmsPage, publishCmsPage, unpublishCmsPage, createCmsPage, deleteCmsPage, mediaItems } = useApp();
  const { isAdmin } = useAuth();

  // Selected page state
  const [selectedPageId, setSelectedPageId] = useState<string>(cmsPages[0]?.id || 'cms-home');
  const activePage = cmsPages.find(p => p.id === selectedPageId) || cmsPages[0];

  // Working sections state (draft state in the editor)
  const [sections, setSections] = useState<CmsSection[]>(activePage?.sections || []);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(activePage?.sections[0]?.id || '');

  // Preview device state
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // New page creation modal
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  // Unsaved changes tracking
  const [isDirty, setIsDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync sections when selected page changes
  useEffect(() => {
    if (activePage) {
      const workingSet = activePage.draftSections || activePage.sections || [];
      setSections(workingSet);
      if (workingSet.length > 0 && !workingSet.some(s => s.id === selectedSectionId)) {
        setSelectedSectionId(workingSet[0].id);
      }
      setIsDirty(false);
    }
  }, [selectedPageId, activePage?.revision, activePage?.status]);

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  // Mark dirty on any edit
  const updateSectionsState = (newSections: CmsSection[]) => {
    setSections(newSections);
    setIsDirty(true);
  };

  // Section actions
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // re-assign order numbers
    copy.forEach((s, i) => (s.order = i + 1));
    updateSectionsState(copy);
  };

  const handleDuplicateSection = (sec: CmsSection) => {
    const duplicate: CmsSection = {
      ...sec,
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `${sec.title} (کپی)`,
      order: sections.length + 1
    };
    updateSectionsState([...sections, duplicate]);
    setSelectedSectionId(duplicate.id);
  };

  const handleToggleHide = (secId: string) => {
    const updated = sections.map(s => (s.id === secId ? { ...s, enabled: !s.enabled } : s));
    updateSectionsState(updated);
  };

  const handleDeleteSection = (secId: string) => {
    if (sections.length <= 1) {
      alert('صفحه باید حداقل دارای یک بخش باشد.');
      return;
    }
    const filtered = sections.filter(s => s.id !== secId);
    filtered.forEach((s, i) => (s.order = i + 1));
    updateSectionsState(filtered);
    if (selectedSectionId === secId && filtered.length > 0) {
      setSelectedSectionId(filtered[0].id);
    }
  };

  const handleAddSection = (type: CmsSectionType) => {
    const templates: Record<CmsSectionType, Partial<CmsSection>> = {
      hero: {
        title: 'تیتر جذاب هیرو بنر جدید',
        subtitle: 'توضیحات معرفی خدمات یا دوره‌های آکادمی پارادایس',
        buttonText: 'اقدام به ثبت‌نام',
        buttonLink: '#courses',
        badge: 'ویژه فصل جدید',
        textAlign: 'right',
        padding: 'standard'
      },
      stats: {
        title: 'آمار و ارقام کلیدی',
        subtitle: 'موفقیت‌های به دست آمده با زبان‌آموزان',
        textAlign: 'center',
        padding: 'compact',
        items: [
          { id: `it-${Date.now()}-1`, title: '+۱,۵۰۰', description: 'ساعت آموزش مکالمه' },
          { id: `it-${Date.now()}-2`, title: '۹۹٪', description: 'رضایت اولیا' },
          { id: `it-${Date.now()}-3`, title: '۱۲+', description: 'اساتید مجرب کودک و نوجوان' }
        ]
      },
      features: {
        title: 'ویژگی‌ها و مزیت‌های دوره',
        subtitle: 'چرا آکادمی پارادایس انتخاب اول والدین است؟',
        textAlign: 'right',
        padding: 'standard',
        items: [
          { id: `it-${Date.now()}-1`, title: 'متد فونیکس تعاملی', description: 'یادگیری آواها با بازی و شعر' },
          { id: `it-${Date.now()}-2`, title: 'کلاس‌های زنده کم‌جمعیت', description: 'مکالمه دوطرفه استاد با تک‌تک دانش‌آموزان' }
        ]
      },
      testimonials: {
        title: 'نظرات و تجربیات والدین',
        subtitle: 'داستان‌های موفقیت زبان‌آموزان پارادایس',
        textAlign: 'center',
        padding: 'standard',
        items: [
          {
            id: `it-${Date.now()}-1`,
            title: 'پیشرفت عالی در مکالمه',
            description: 'پسرم در عرض چند ماه لهجه فوق‌العاده‌ای پیدا کرد.',
            authorName: 'مادر آرتین',
            authorRole: 'دوره Phonics',
            rating: 5
          }
        ]
      },
      faq: {
        title: 'پرسش و پاسخ‌های پرتکرار',
        subtitle: 'پاسخ به سوالات اولیا پیرامون کلاس‌ها',
        textAlign: 'right',
        padding: 'standard',
        items: [
          { id: `it-${Date.now()}-1`, title: 'کلاس‌ها چه روزهایی برگزار می‌شود؟', description: 'جلسات در روزهای زوج و فرد طبق جدول زمان‌بندی برگزار می‌شوند.' }
        ]
      },
      cta: {
        title: 'آماده ثبت‌نام در دوره‌های ترم جدید هستید؟',
        subtitle: 'همین حالا مسیر یادگیری فرزندتان را با تعیین سطح آغاز کنید.',
        buttonText: 'شروع تعیین سطح آنلاین',
        buttonLink: '#placement',
        bgColor: 'from-orange-600 via-amber-600 to-orange-700',
        padding: 'spacious',
        textAlign: 'center'
      },
      'text-image': {
        title: 'رویکرد علمی آموزش زبان به کودکان',
        subtitle: 'متدولوژی کمبریج در خدمت یادگیری پایدار',
        content: 'در آکادمی پارادایس، تمرکز اصلی بر تقویت اعتماد به نفس و مکالمه طبیعی کودک است.',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
        textAlign: 'right',
        padding: 'standard'
      },
      courses: {
        title: 'دوره‌های برگزیده ترم',
        subtitle: 'نگاهی به برنامه‌های آموزشی آماده ثبت‌نام',
        textAlign: 'right',
        padding: 'standard'
      },
      banner: {
        title: 'تخفیف ویژه ثبت‌نام زودهنگام',
        subtitle: 'فقط تا پایان این هفته',
        textAlign: 'center',
        padding: 'compact'
      }
    };

    const newSec: CmsSection = {
      id: `sec-${Date.now()}`,
      type,
      title: templates[type].title || 'عنوان بخش',
      subtitle: templates[type].subtitle,
      buttonText: templates[type].buttonText,
      buttonLink: templates[type].buttonLink,
      badge: templates[type].badge,
      imageUrl: templates[type].imageUrl,
      content: templates[type].content,
      bgColor: templates[type].bgColor,
      textAlign: templates[type].textAlign || 'right',
      padding: templates[type].padding || 'standard',
      items: templates[type].items,
      enabled: true,
      order: sections.length + 1
    };

    updateSectionsState([...sections, newSec]);
    setSelectedSectionId(newSec.id);
  };

  const handleUpdateActiveSection = (updates: Partial<CmsSection>) => {
    if (!selectedSectionId) return;
    const updated = sections.map(s => (s.id === selectedSectionId ? { ...s, ...updates } : s));
    updateSectionsState(updated);
  };

  // Save Draft (persisted in Firestore under draftSections)
  const handleSaveDraft = async () => {
    if (!isAdmin) {
      setFeedback({ message: 'دسترسی غیرمجاز: فقط مدیران سیستم مجاز به تغییر محتوا هستند.', type: 'error' });
      return;
    }

    try {
      const updatedPage: CmsPage = {
        ...activePage,
        draftSections: sections,
        status: activePage.status === 'published' ? 'published' : 'draft',
        updatedAt: new Date().toISOString()
      };
      await saveCmsPage(updatedPage);
      setIsDirty(false);
      setFeedback({ message: 'پیش‌نویس صفحه با موفقیت ذخیره شد.', type: 'success' });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ message: 'خطا در ذخیره پیش‌نویس.', type: 'error' });
    }
  };

  // Publish to live site
  const handlePublishLive = async () => {
    if (!isAdmin) {
      setFeedback({ message: 'دسترسی غیرمجاز: فقط مدیران ارشد مجاز به انتشار هستند.', type: 'error' });
      return;
    }

    try {
      // First save draft as current sections
      const updatedPage: CmsPage = {
        ...activePage,
        sections: sections,
        draftSections: undefined,
        status: 'published',
        isPublished: true,
        revision: (activePage.revision || 1) + 1,
        updatedAt: new Date().toISOString()
      };
      await saveCmsPage(updatedPage);
      setIsDirty(false);
      setFeedback({ message: 'صفحه با موفقیت در سایت اصلی منتشر شد و فوراً قابل مشاهده است!', type: 'success' });
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback({ message: 'خطا در انتشار صفحه.', type: 'error' });
    }
  };

  // Unpublish
  const handleUnpublish = async () => {
    if (!confirm('آیا از خارج کردن این صفحه از حالت انتشار اطمینان دارید؟')) return;
    await unpublishCmsPage(activePage.id);
    setFeedback({ message: 'صفحه از حالت انتشار خارج شد.', type: 'success' });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Create new page handler
  const handleCreateNewPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    const created = await createCmsPage(newPageTitle, newPageSlug);
    setSelectedPageId(created.id);
    setIsCreatingPage(false);
    setNewPageTitle('');
    setNewPageSlug('');
    setFeedback({ message: `صفحه «${created.title}» ساخته شد. اکنون می‌توانید بخش‌های آن را طراحی کنید.`, type: 'success' });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 text-right selection:bg-orange-500 selection:text-white">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Page selector & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-black text-slate-800">صفحه فعال:</span>
          </div>

          <select
            value={selectedPageId}
            onChange={(e) => {
              if (isDirty && !confirm('تغییرات ذخیره‌نشده دارید. آیا مایل به ترک بدون ذخیره هستید؟')) {
                return;
              }
              setSelectedPageId(e.target.value);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 cursor-pointer"
          >
            {cmsPages.map(page => (
              <option key={page.id} value={page.id}>
                {page.title} ({page.slug})
              </option>
            ))}
          </select>

          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
            activePage?.status === 'published'
              ? 'bg-emerald-100 text-emerald-800'
              : activePage?.status === 'draft'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {activePage?.status === 'published' ? 'منتشر شده در سایت' : 'پیش‌نویس ذخیره‌شده'}
            {activePage?.revision && ` (نسخه ${activePage.revision})`}
          </span>

          <button
            onClick={() => setIsCreatingPage(true)}
            className="px-3 py-1.5 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>صفحه جدید</span>
          </button>
        </div>

        {/* Device Switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              device === 'desktop' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="نمای دسکتاپ (عرض ۱۰۰٪)"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">دسکتاپ</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              device === 'tablet' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="نمای تبلت (عرض ۷۶۸ پیکسل)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">تبلت</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              device === 'mobile' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="نمای موبایل (عرض ۳۷۵ پیکسل)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">موبایل</span>
          </button>
        </div>

        {/* Save Draft & Publish Controls */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-[11px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold animate-pulse">
              تغییرات ذخیره‌نشده!
            </span>
          )}

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره پیش‌نویس</span>
          </button>

          <button
            onClick={handlePublishLive}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 transition cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span>انتشار در سایت اصلی</span>
          </button>

          {activePage?.slug !== 'home' && (
            <button
              onClick={() => deleteCmsPage(activePage.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
              title="حذف این صفحه"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-2xl flex items-center gap-2 text-xs font-bold border ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Builder Grid: Left = Section Tree & Property Editor | Right = Live Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Section Tree & Property Editor */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section Tree & Add Section */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                لایه‌ها و بخش‌های صفحه ({sections.length})
              </h3>

              {/* Add Section Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold cursor-pointer hover:bg-orange-600 shadow-xs">
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن بخش جدید</span>
                </button>
                <div className="absolute left-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 hidden group-hover:block animate-in fade-in">
                  <div className="text-[10px] text-slate-400 font-bold px-2 py-1">نوع بخش را انتخاب فرمایید:</div>
                  <button onClick={() => handleAddSection('hero')} className="w-full text-right p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">هیرو بنر (Hero)</button>
                  <button onClick={() => handleAddSection('stats')} className="w-full text-right p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">آمار و ارقام (Stats)</button>
                  <button onClick={() => handleAddSection('features')} className="w-full text-right p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">ویژگی‌ها و مزایا (Features)</button>
                  <button onClick={() => handleAddSection('testimonials')} className="w-full text-right p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">نظرات والدین (Testimonials)</button>
                  <button onClick={() => handleAddSection('faq')} className="w-full text-right p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">سوالات متداول (FAQ)</button>
                  <button onClick={() => handleAddSection('cta')} className="w-full text-right p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">باکس اقدام به ثبت‌نام (CTA)</button>
                  <button onClick={() => handleAddSection('text-image')} className="w-full text-right p-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">متن و تصویر (Text & Image)</button>
                </div>
              </div>
            </div>

            {/* Sections Draggable / Reorderable List */}
            <div className="space-y-2">
              {sections.map((sec, idx) => {
                const isSelected = selectedSectionId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-black shrink-0">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="text-xs font-black text-slate-800 block truncate">{sec.title}</span>
                        <span className="text-[10px] text-orange-600 font-bold uppercase">{sec.type}</span>
                      </div>
                    </div>

                    {/* Section Controls */}
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleMoveSection(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1 text-slate-400 hover:text-slate-700 cursor-pointer ${idx === 0 ? 'opacity-30' : ''}`}
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className={`p-1 text-slate-400 hover:text-slate-700 cursor-pointer ${idx === sections.length - 1 ? 'opacity-30' : ''}`}
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleHide(sec.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        title={sec.enabled ? 'مخفی کردن' : 'نمایش دادن'}
                      >
                        {sec.enabled ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                      <button
                        onClick={() => handleDuplicateSection(sec)}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="تکثیر این بخش"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec.id)}
                        className="p-1 text-red-400 hover:text-red-600 cursor-pointer"
                        title="حذف این بخش"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Property Editor */}
          {selectedSection && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-orange-500" />
                    تنظیمات بخش: {selectedSection.title}
                  </h3>
                  <span className="text-[10px] text-slate-400">الگوی چیدمان و متن‌های این قسمت</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md font-mono">
                  {selectedSection.type}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">تیتر اصلی (Title)</label>
                  <input
                    type="text"
                    value={selectedSection.title}
                    onChange={(e) => handleUpdateActiveSection({ title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">زیرعنوان / توضیحات (Subtitle)</label>
                  <textarea
                    rows={2}
                    value={selectedSection.subtitle || ''}
                    onChange={(e) => handleUpdateActiveSection({ subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  ></textarea>
                </div>

                {selectedSection.badge !== undefined && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">برچسب متنی بالا (Badge)</label>
                    <input
                      type="text"
                      value={selectedSection.badge || ''}
                      onChange={(e) => handleUpdateActiveSection({ badge: e.target.value })}
                      placeholder="مثال: تخفیف ویژه ترم پاییز"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Buttons and Links if applicable */}
              {(selectedSection.type === 'hero' || selectedSection.type === 'cta') && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">متن دکمه اول</label>
                    <input
                      type="text"
                      value={selectedSection.buttonText || ''}
                      onChange={(e) => handleUpdateActiveSection({ buttonText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">لینک دکمه اول</label>
                    <input
                      type="text"
                      value={selectedSection.buttonLink || ''}
                      onChange={(e) => handleUpdateActiveSection({ buttonLink: e.target.value })}
                      dir="ltr"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left"
                    />
                  </div>
                </div>
              )}

              {/* Layout Alignment & Padding */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">چینش متن (Alignment)</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleUpdateActiveSection({ textAlign: 'right' })}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center cursor-pointer ${
                        selectedSection.textAlign === 'right' || !selectedSection.textAlign ? 'bg-white shadow-2xs text-orange-600' : 'text-slate-500'
                      }`}
                      title="راست‌چین"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateActiveSection({ textAlign: 'center' })}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center cursor-pointer ${
                        selectedSection.textAlign === 'center' ? 'bg-white shadow-2xs text-orange-600' : 'text-slate-500'
                      }`}
                      title="وسط‌چین"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateActiveSection({ textAlign: 'left' })}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center cursor-pointer ${
                        selectedSection.textAlign === 'left' ? 'bg-white shadow-2xs text-orange-600' : 'text-slate-500'
                      }`}
                      title="چپ‌چین"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">فاصله‌گذاری (Padding)</label>
                  <select
                    value={selectedSection.padding || 'standard'}
                    onChange={(e) => handleUpdateActiveSection({ padding: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white cursor-pointer"
                  >
                    <option value="compact">فشرده (Compact)</option>
                    <option value="standard">استاندارد (Standard)</option>
                    <option value="spacious">جادار و عریض (Spacious)</option>
                  </select>
                </div>
              </div>

              {/* Image URL with Media Library quick-pick */}
              {(selectedSection.type === 'hero' || selectedSection.type === 'text-image') && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">آدرس تصویر (Image URL)</label>
                  <input
                    type="url"
                    value={selectedSection.imageUrl || ''}
                    onChange={(e) => handleUpdateActiveSection({ imageUrl: e.target.value })}
                    dir="ltr"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left"
                    placeholder="https://images.unsplash.com/..."
                  />

                  {/* Media Quick Picker */}
                  <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                    <span className="text-[10px] text-slate-400 shrink-0">تصاویر کتابخانه:</span>
                    {mediaItems.slice(0, 4).map(med => (
                      <button
                        key={med.id}
                        type="button"
                        onClick={() => handleUpdateActiveSection({ imageUrl: med.url })}
                        className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 hover:border-orange-500 transition cursor-pointer"
                        title={med.name}
                      >
                        <img src={med.url} alt={med.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Items List Editor for FAQ / Testimonials / Stats / Features */}
              {selectedSection.items && selectedSection.items.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-slate-700 block">
                      آیتم‌ها و کارت‌های درون این بخش ({selectedSection.items.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newItem: CmsSectionItem = {
                          id: `it-${Date.now()}`,
                          title: 'عنوان آیتم جدید',
                          description: 'توضیحات مربوط به این کارت...'
                        };
                        handleUpdateActiveSection({ items: [...(selectedSection.items || []), newItem] });
                      }}
                      className="text-[10px] text-orange-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>افزودن آیتم</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto p-1">
                    {selectedSection.items.map((item, itemIdx) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updatedItems = [...selectedSection.items!];
                              updatedItems[itemIdx] = { ...item, title: e.target.value };
                              handleUpdateActiveSection({ items: updatedItems });
                            }}
                            className="flex-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const filtered = selectedSection.items!.filter((_, i) => i !== itemIdx);
                              handleUpdateActiveSection({ items: filtered });
                            }}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={item.description || ''}
                          onChange={(e) => {
                            const updatedItems = [...selectedSection.items!];
                            updatedItems[itemIdx] = { ...item, description: e.target.value };
                            handleUpdateActiveSection({ items: updatedItems });
                          }}
                          placeholder="توضیح یا پاسخ..."
                          className="w-full px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px]"
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Responsive Canvas Viewport */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-orange-500" />
                پیش‌نمایش زنده در نمای {device === 'desktop' ? 'دسکتاپ' : device === 'tablet' ? 'تبلت (iPad)' : 'موبایل'}
              </span>
              <span className="text-[11px]">
                {device === 'desktop' ? '۱۰۰٪ عرض مرورگر' : device === 'tablet' ? '۷۶۸px' : '۳۷۵px'}
              </span>
            </div>

            {/* Device Container Frame */}
            <div className="bg-slate-200/80 p-4 rounded-3xl border border-slate-300 overflow-hidden flex justify-center">
              <div
                className={`bg-white shadow-2xl rounded-2xl overflow-y-auto max-h-[750px] transition-all duration-300 border border-slate-200 ${
                  device === 'desktop' ? 'w-full' : device === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                }`}
              >
                {/* Simulated browser header bar for device */}
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="font-en text-[10px] text-slate-500">paradise-academy.ir/{activePage?.slug}</span>
                  <span></span>
                </div>

                {/* Render Actual Dynamic Sections */}
                <DynamicPageRenderer sections={sections} isDraftPreview={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Page Creation Modal */}
      {isCreatingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full space-y-4 text-right">
            <h3 className="text-sm font-black text-slate-900">ساخت صفحه عمومی جدید</h3>

            <form onSubmit={handleCreateNewPage} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">عنوان فارسی صفحه</label>
                <input
                  type="text"
                  required
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="مثال: قوانین و مقررات ترم‌ها"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">شناسه انگلیسی (URL Slug)</label>
                <input
                  type="text"
                  required
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="terms-and-conditions"
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-en text-left"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPage(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-black hover:bg-orange-600 cursor-pointer"
                >
                  ایجاد صفحه و ورود به ویرایشگر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
