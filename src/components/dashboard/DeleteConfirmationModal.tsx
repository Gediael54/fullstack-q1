'use client';

import { Trash2, AlertTriangle } from 'lucide-react';
import { DeleteConfirmationModalProps } from '@/app/types';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  vehicleName,
  isLoading = false 
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm relative z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-3 p-6 pb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <div className="px-6 pb-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Confirmar Exclusão
          </h2>
          
          <p className="text-gray-600 mb-6">
            {vehicleName 
              ? `Tem certeza que deseja remover o veículo "${vehicleName}"?`
              : 'Tem certeza que deseja remover este veículo?'
            }
          </p>

          <p className="text-sm text-red-600 mb-6">
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}