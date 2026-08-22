import React from 'react';

/**
 * SectionHero Component
 * 
 * Renders a restrained-height photography backdrop banner with
 * a warm dark brown overlay (rgba(43, 29, 18, ...)) across all dashboard sections.
 */
export default function SectionHero({
  image,
  category,
  categoryIcon: CategoryIcon,
  badgeText,
  title,
  subtitle,
  children,
  className = ''
}) {
  const imageUrl = image?.url || image;
  const imageAlt = image?.alt || 'Section backdrop';

  return (
    <div className={`w-full rounded-xl relative overflow-hidden shadow-xs border border-[#E8DCC8] bg-[#2B1D12] text-white min-h-[170px] sm:min-h-[185px] flex flex-col justify-between p-6 sm:p-7 ${className}`}>
      
      {/* Background Photographic Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
      )}

      {/* Warm Dark Brown Scrim Overlay (#2B1D12 at ~50-80% opacity) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(43, 29, 18, 0.84) 0%, rgba(43, 29, 18, 0.65) 50%, rgba(43, 29, 18, 0.46) 100%)'
        }}
      />

      {/* Top Bar: Category Pill & Status Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {category && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF8F2]/90 border border-[#E8DCC8] text-[#2B1D12] text-xs font-medium backdrop-blur-xs">
              {CategoryIcon && <CategoryIcon className="w-3.5 h-3.5 text-[#BC4800]" />}
              <span>{category}</span>
            </span>
          )}
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4E7A51]/25 border border-[#4E7A51]/50 text-white text-xs font-medium backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4E7A51]"></span>
              <span>{badgeText}</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content: Title, Description, & Actions */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pt-3">
        <div className="space-y-1 max-w-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-200 font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Action Slot */}
        {children && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {children}
          </div>
        )}
      </div>

    </div>
  );
}

