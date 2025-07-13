import React from 'react';
import { VehicleStatsCardProps } from '../../app/types';

export const VehicleStatsCard = ({ icon, label, count }: VehicleStatsCardProps) => (
  <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-5 flex items-center gap-4">
    <div className="w-20 h-20 bg-[#F4F7FE] rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{count}</p>
    </div>
  </div>
);