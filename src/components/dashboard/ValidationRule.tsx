import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { ValidationRuleProps } from '../../app/types';

export const ValidationRule: React.FC<ValidationRuleProps> = ({ passed, text }) => {
  return (
    <AnimatePresence>
      {!passed && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -5 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -5 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex items-center gap-2 text-xs text-gray-600 overflow-hidden"
        >
          <XCircle className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span>{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};