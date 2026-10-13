import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  ChevronDown,
  Star,
  ArrowLeft,
  PlayCircle,
  Quote,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { CmsSection } from '../../types';
import { useApp } from '../../context/AppContext';

interface DynamicPageRendererProps {
  sections: CmsSection[];
  isDraftPreview?: boolean;
}

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({
  sections,
  isDraftPreview = false
}) => {
  const { setIsPlacementModalOpen, setSelectedCourseForCheckout, courses } = useApp();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Filter only enabled sections and sort by order
  const sortedSections = [...sections]
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const getPaddingClass = (padding?: string) => {
    switch (padding) {
      case 'compact':
        return 'py-8 sm:py-12';
      case 'spacious':
        return 'py-20 sm:py-28';
      default:
        return 'py-14 sm:py-20';
    }
  };

  const getTextAlignClass = (align?: string) => {
    switch (align) {
      case 'center':
        return 'text-center mx-auto';
      case 'left':
        return 'text-left';
      default:
        return 'text-right';
    }
  };

  return (
    <div className="space-y-0 text-right selection:bg-orange-500 selection:text-white">
      {sortedSections.map(section => {
        const paddingClass = getPaddingClass(section.padding);
        const alignClass = getTextAlignClass(section.textAlign);

        // 1. HERO SECTION
        if (section.type === 'hero') {
          return (
            <section
              key={section.id}
              className={`relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-amber-50/30 ${paddingClass}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className={`lg:col-span-7 space-y-6 ${alignClass}`}>
                    {section.badge && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-black shadow-xs">
                        <Sparkles className="w-4 h-4 text-orange-600" />
                        <span>{section.badge}</span>
                      </div>
                    )}

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.25] tracking-tight">
                      {section.title}
                    </h1>

                    {section.subtitle && (
                      <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                        {section.subtitle}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      {section.buttonText && (
                        <button
                          onClick={() => {
                            if (section.buttonLink === '#placement') setIsPlacementModalOpen(true);
                            else if (section.buttonLink?.startsWith('#')) {
                              document.querySelector(section.buttonLink)?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-lg shadow-orange-500/25 transition cursor-pointer"
                        >
                          <Compass className="w-5 h-5 text-amber-100" />
                          <span>{section.buttonText}</span>
                        </button>
                      )}

                      {section.secondaryButtonText && (
                        <button
                          onClick={() => {
                            if (section.secondaryButtonLink?.startsWith('#')) {
                              document.querySelector(section.secondaryButtonLink)?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-orange-50 border-2 border-orange-200 text-orange-700 font-black text-sm transition cursor-pointer shadow-xs"
                        >
                          <PlayCircle className="w-5 h-5 text-orange-500" />
                          <span>{section.secondaryButtonText}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {section.imageUrl && (
                    <div className="lg:col-span-5 relative">
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                        <img
                          src={section.imageUrl}
                          alt={section.title}
                          className="w-full h-[380px] object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // 2. STATS SECTION
        if (section.type === 'stats') {
          return (
            <section key={section.id} className={`bg-white border-y border-slate-100 ${paddingClass}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {section.title && (
                  <div className={`mb-8 ${alignClass}`}>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{section.title}</h2>
                    {section.subtitle && <p className="text-xs text-slate-500 mt-1">{section.subtitle}</p>}
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.items?.map(it => (
                    <div key={it.id} className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/80 text-center space-y-1">
                      <span className="text-2xl sm:text-3xl font-black text-orange-600 font-en block">{it.title}</span>
                      <span className="text-xs font-bold text-slate-600 block">{it.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 3. FEATURES SECTION
        if (section.type === 'features') {
          return (
            <section key={section.id} className={`bg-slate-50/60 border-t border-slate-100 ${paddingClass}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`max-w-3xl mb-12 space-y-2 ${alignClass}`}>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{section.title}</h2>
                  {section.subtitle && <p className="text-xs sm:text-sm text-slate-600">{section.subtitle}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.items?.map(it => (
                    <div key={it.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900">{it.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{it.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 4. TESTIMONIALS SECTION
        if (section.type === 'testimonials') {
          return (
            <section key={section.id} className={`bg-white border-t border-slate-100 ${paddingClass}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`max-w-3xl mb-12 space-y-2 ${alignClass}`}>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{section.title}</h2>
                  {section.subtitle && <p className="text-xs sm:text-sm text-slate-600">{section.subtitle}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items?.map(it => (
                    <div key={it.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: it.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <Quote className="w-6 h-6 text-orange-300" />
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        «{it.description}»
                      </p>

                      <div className="pt-2 border-t border-slate-200 text-right">
                        <span className="text-xs font-black text-slate-900 block">{it.authorName}</span>
                        <span className="text-[11px] text-orange-600 font-bold block">{it.authorRole}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 5. FAQ SECTION
        if (section.type === 'faq') {
          return (
            <section key={section.id} className={`bg-slate-50/70 border-t border-slate-200 ${paddingClass}`}>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`mb-10 space-y-2 ${alignClass}`}>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{section.title}</h2>
                  {section.subtitle && <p className="text-xs text-slate-500">{section.subtitle}</p>}
                </div>

                <div className="space-y-3">
                  {section.items?.map((it, idx) => {
                    const isOpen = openFaqId === it.id || (openFaqId === null && idx === 0);
                    return (
                      <div key={it.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                        <button
                          onClick={() => setOpenFaqId(isOpen ? '' : it.id)}
                          className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-800 hover:text-orange-600 cursor-pointer"
                        >
                          <span>{it.title}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                            {it.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        // 6. CTA SECTION
        if (section.type === 'cta') {
          const bgGradient = section.bgColor || 'from-orange-600 via-amber-600 to-orange-700';
          return (
            <section key={section.id} className={`${paddingClass}`}>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`bg-gradient-to-r ${bgGradient} rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-6`}>
                  <div className="max-w-2xl mx-auto space-y-3">
                    <h2 className="text-2xl sm:text-4xl font-black leading-tight">{section.title}</h2>
                    {section.subtitle && <p className="text-xs sm:text-base text-white/90">{section.subtitle}</p>}
                  </div>

                  {section.buttonText && (
                    <button
                      onClick={() => {
                        if (section.buttonLink === '#placement') setIsPlacementModalOpen(true);
                      }}
                      className="px-8 py-4 rounded-2xl bg-white hover:bg-orange-50 text-orange-700 font-black text-sm shadow-md transition cursor-pointer"
                    >
                      {section.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // 7. TEXT & IMAGE SECTION
        if (section.type === 'text-image') {
          return (
            <section key={section.id} className={`bg-white border-t border-slate-100 ${paddingClass}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className={`space-y-4 ${alignClass}`}>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{section.title}</h2>
                    {section.subtitle && <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{section.subtitle}</p>}
                    {section.content && <p className="text-xs text-slate-500 leading-relaxed">{section.content}</p>}
                  </div>
                  {section.imageUrl && (
                    <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                      <img src={section.imageUrl} alt={section.title} className="w-full h-80 object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        }

        // Fallback banner
        return (
          <section key={section.id} className={`bg-slate-50 border-t border-slate-100 ${paddingClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
              <h2 className="text-xl font-black text-slate-900">{section.title}</h2>
              {section.subtitle && <p className="text-xs text-slate-600">{section.subtitle}</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
};
