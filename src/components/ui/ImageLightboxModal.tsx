import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
  title?: string;
  subtitle?: string;
}

export default function ImageLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
  title,
  subtitle,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Image Preview'}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close image preview"
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Wrapper */}
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.8)] bg-[#07090E]">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="max-h-[75vh] w-auto object-contain select-none"
              />
            </div>

            {/* Caption Info */}
            {(title || subtitle) && (
              <div className="mt-4 px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-center text-white">
                {title && <span className="font-bold text-sm mr-2">{title}</span>}
                {subtitle && <span className="text-xs text-neutral-300 font-mono">{subtitle}</span>}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
