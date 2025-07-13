'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, FileIcon, InactiveIcon } from '../Icons';

interface StatsCardsProps {
  total: number;
  active: number;
  inactive: number;
}

export default function StatsCards({ total, active, inactive }: StatsCardsProps) {
  const getCountVariant = (delay: number = 0) => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3,
        delay,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Total - anima primeiro (sem delay) */}
      <StatCard 
        icon={<FileIcon className="w-8 h-8 text-blue-500" />} 
        label="Total" 
        count={total} 
        variant={getCountVariant(0)} 
      />
      
      {/* Ativos - anima com pequeno delay */}
      <StatCard 
        icon={<CheckIcon className="w-8 h-8 text-green-500" />} 
        label="Ativos" 
        count={active} 
        variant={getCountVariant(0.1)} 
      />
      
      {/* Inativos - anima por último */}
      <StatCard 
        icon={<InactiveIcon className="w-8 h-8 text-yellow-500" />} 
        label="Inativos" 
        count={inactive} 
        variant={getCountVariant(0.2)} 
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  count,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  variant: any;
}) {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-5 flex items-center gap-4">
      <div className="w-20 h-20 bg-[#F4F7FE] rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={variant.transition}
            className="text-3xl font-bold text-gray-800 block"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}