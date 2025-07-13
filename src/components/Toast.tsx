'use client';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ToastProps } from '../app/types';

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 4000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  const baseStyle =
    'px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300 transform animate-slideInFromTop';

  const typeStyle =
    type === 'success'
      ? 'bg-green-50 border-l-4 border-green-400 text-green-800'
      : 'bg-red-50 border-l-4 border-red-400 text-red-800';

  const toastElement = (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-30px) translateX(10px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0) scale(1);
          }
        }

        @keyframes slideOutToTop {
          from {
            opacity: 1;
            transform: translateY(0) translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-30px) translateX(10px) scale(0.9);
          }
        }

        .animate-slideInFromTop {
          animation: slideInFromTop 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slideOutToTop {
          animation: slideOutToTop 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      <div
        className={`${baseStyle} ${typeStyle}`}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          minWidth: '320px',
          maxWidth: '420px'
        }}
      >
        <div className="flex items-center space-x-2 flex-1">
          {type === 'success' ? (
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <span className="font-medium text-sm leading-relaxed">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  return typeof document !== 'undefined'
    ? createPortal(toastElement, document.body)
    : null;
}