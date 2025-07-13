import React from 'react';
import { Loader2, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface VehicleActionsProps {
  vehicleId: number;
  status: 'active' | 'inactive';
  processingId: number | null;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export const VehicleActions: React.FC<VehicleActionsProps> = ({
  vehicleId,
  status,
  processingId,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const isProcessing = processingId === vehicleId;

  return (
    <div className="flex justify-end items-center gap-3">
      <button
        disabled={isProcessing}
        onClick={onEdit}
        title="Editar veículo"
        className="p-1 rounded hover:bg-blue-100 transition"
      >
        <Edit className="w-5 h-5 text-blue-600" />
      </button>

      <button
        disabled={isProcessing}
        onClick={onToggleStatus}
        title={status === 'active' ? 'Desativar veículo' : 'Ativar veículo'}
        className="p-1 rounded hover:bg-yellow-100 transition"
      >
        {status === 'active' ? (
          <ToggleLeft className="w-5 h-5 text-yellow-600" />
        ) : (
          <ToggleRight className="w-5 h-5 text-green-600" />
        )}
      </button>

      <button
        disabled={isProcessing}
        onClick={onDelete}
        title="Deletar veículo"
        className="p-1 rounded hover:bg-red-100 transition"
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin text-red-600" />
        ) : (
          <Trash2 className="w-5 h-5 text-red-600" />
        )}
      </button>
    </div>
  );
};
