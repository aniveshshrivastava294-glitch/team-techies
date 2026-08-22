import React from 'react';

/**
 * SectionHero Component
 *
 * Renders a restrained-height photography backdrop banner with
 * a deep navy overlay (rgba(31, 42, 56, ...)) across all dashboard sections.
 * Flat fill only — no gradients, no glow.
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
    <div className={`w-full rounded-xl relative overflow-hidden shadow-xs border border-[#E2DED4] bg-[#1F2A38] text-white min-h-[170px] sm:min-h-[185px] flex flex-col justify-between p-6 sm:p-7 ${className}`}>
      
      {/* Background Photographic Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
      )}

      {/* Deep Navy Scrim Overlay (#1F2A38 at ~50% opacity) — flat fill, no gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(31, 42, 56, 0.52)' }}
      />

      {/* Top Bar: Category Pill & Status Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {category && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-medium">
              {CategoryIcon && <CategoryIcon className="w-3.5 h-3.5 text-white/80" />}
              <span>{category}</span>
            </span>
          )}
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4E7A51]/25 border border-[#4E7A51]/50 text-white text-xs font-medium">
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
            <p className="text-xs sm:text-sm text-white/75 font-normal leading-relaxed">
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
