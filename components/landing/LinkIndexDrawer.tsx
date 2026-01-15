'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  REMILIA_LINKS,
  LINK_CATEGORIES,
  searchLinks,
  getLinksByCategory,
  type RemiliaLink,
} from '@/lib/remiliaLinks';

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface LinkIndexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
}

// ─────────────────────────────────────────────────────────────────
// LINK ITEM COMPONENT
// ─────────────────────────────────────────────────────────────────

function LinkItem({ link }: { link: RemiliaLink }) {
  const isExternal = !link.href.startsWith('mailto:') && link.href !== '#';
  const isMail = link.href.startsWith('mailto:');

  return (
    <a
      href={link.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex items-baseline gap-2 py-2 sm:py-1.5"
    >
      {/* Label */}
      <span className="relative text-[13px] sm:text-[14px] font-normal tracking-[0.02em] text-black/80 group-hover:text-black transition-colors">
        {link.label}
        {/* Animated underline */}
        <span className="absolute -bottom-px left-0 w-full h-px bg-black/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-150 ease-out" />
      </span>

      {/* External indicator */}
      {isExternal && (
        <span className="text-[10px] text-black/30 group-hover:text-black/50 transition-colors">
          ↗
        </span>
      )}

      {/* Mail indicator */}
      {isMail && (
        <span className="text-[10px] text-black/30 group-hover:text-black/50 transition-colors">
          ✉
        </span>
      )}

      {/* Note indicator */}
      {link.note && (
        <span className="text-[9px] uppercase tracking-[0.1em] text-black/25">
          ({link.note})
        </span>
      )}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────
// CATEGORY SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────

function CategorySection({ category, links }: { category: string; links: RemiliaLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="mb-10 sm:mb-12">
      {/* Category heading */}
      <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-black/40 mb-4 pb-2 border-b border-black/10">
        {category}
      </h3>

      {/* Links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-0">
        {links.map((link) => (
          <LinkItem key={`${link.category}-${link.label}`} link={link} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

export function LinkIndexDrawer({
  isOpen,
  onClose,
  initialQuery = '',
  initialCategory = '',
}: LinkIndexDrawerProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Reset query when initialQuery/initialCategory changes
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery || initialCategory);
    }
  }, [isOpen, initialQuery, initialCategory]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus input after animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Restore focus
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter links
  const getFilteredLinks = useCallback(() => {
    if (query.trim()) {
      return searchLinks(query);
    }
    return REMILIA_LINKS;
  }, [query]);

  // Group links by category
  const groupedLinks = useCallback(() => {
    const filtered = getFilteredLinks();
    const groups: Record<string, RemiliaLink[]> = {};

    for (const category of LINK_CATEGORIES) {
      const categoryLinks = filtered.filter((l) => l.category === category);
      if (categoryLinks.length > 0) {
        groups[category] = categoryLinks;
      }
    }

    return groups;
  }, [getFilteredLinks]);

  const groups = groupedLinks();
  const totalResults = Object.values(groups).flat().length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#FAFAF8] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {/* Content container */}
          <motion.div
            className="min-h-full"
            initial={{ y: 6 }}
            animate={{ y: 0 }}
            exit={{ y: 6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#FAFAF8]/95 backdrop-blur-sm border-b border-black/5">
              <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 sm:py-6">
                <div className="flex items-center justify-between">
                  {/* Title */}
                  <h2 className="text-[14px] sm:text-[16px] font-medium uppercase tracking-[0.12em] text-black">
                    INDEX
                  </h2>

                  {/* Close hint */}
                  <button
                    onClick={onClose}
                    className="text-[11px] sm:text-[12px] uppercase tracking-[0.1em] text-black/40 hover:text-black transition-colors"
                  >
                    ESC to close
                  </button>
                </div>

                {/* Search input */}
                <div className="mt-4 sm:mt-5">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search links..."
                      className="w-full max-w-md bg-transparent border-b border-black/15 py-2 text-[14px] sm:text-[15px] tracking-[0.02em] text-black placeholder:text-black/30 focus:outline-none focus:border-black/40 transition-colors"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.1em] text-black/30 hover:text-black/60 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Results count */}
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-black/30">
                    {totalResults} {totalResults === 1 ? 'result' : 'results'}
                  </p>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16">
              {totalResults === 0 ? (
                <div className="text-center py-20">
                  <p className="text-[13px] uppercase tracking-[0.1em] text-black/40">
                    No results found
                  </p>
                </div>
              ) : (
                <>
                  {LINK_CATEGORIES.map((category) => {
                    const links = groups[category];
                    if (!links || links.length === 0) return null;
                    return (
                      <CategorySection
                        key={category}
                        category={category}
                        links={links}
                      />
                    );
                  })}
                </>
              )}
            </main>

            {/* Footer */}
            <footer className="border-t border-black/5 py-6 sm:py-8">
              <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
                <p className="text-[9px] uppercase tracking-[0.18em] text-black/25">
                  REMILIA CORPORATION · INSTITUTIONAL INDEX · {new Date().getFullYear()}
                </p>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────
// INDEX TRIGGER HOOK
// ─────────────────────────────────────────────────────────────────

export function useIndexDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');
  const [initialCategory, setInitialCategory] = useState('');

  const open = useCallback((options?: { query?: string; category?: string }) => {
    setInitialQuery(options?.query || '');
    setInitialCategory(options?.category || '');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setInitialQuery('');
    setInitialCategory('');
  }, []);

  // Global "I" key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key.toLowerCase() === 'i' && !isInput && !isOpen) {
        e.preventDefault();
        open();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, open]);

  return {
    isOpen,
    open,
    close,
    initialQuery,
    initialCategory,
  };
}
