'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car } from 'lucide-react';
import { vehicleService } from '../../app/services/Vehicle';
import { vehicleSchema, VehicleFormData } from './VehicleModalValidation';
import { VehicleModalProps } from '../../app/types';
import { ValidationRule } from './ValidationRule';

const PLATE_REGEX = {
  OLD_FORMAT: /^[A-Z]{3}[0-9]{4}$/,
  NEW_FORMAT: /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
};

const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PLATE_LENGTH: 7
};

const VehicleModal: React.FC<VehicleModalProps> = ({ 
  isOpen, 
  onClose, 
  vehicle = null,
  onVehicleChange,
  processingVehicleId,
  onNotification
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: '',
      plate: '',
    },
  });

  const name = watch('name') || '';
  const plate = watch('plate') || '';
  const isEditMode = Boolean(vehicle?.id);
  const isProcessing = isSubmitting || Boolean(vehicle?.id && processingVehicleId === vehicle.id);

  useEffect(() => {
    if (isOpen) {
      reset({
        name: vehicle?.name || '',
        plate: vehicle?.plate || '',
      });
    }
  }, [vehicle, reset, isOpen]);

  const formatPlate = (value: string): string => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, VALIDATION_LIMITS.PLATE_LENGTH);
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPlate(e.target.value);
    setValue('plate', formattedValue);
  };

  const getNameValidations = () => ({
    notEmpty: name.trim().length > 0,
    minLength: name.length >= VALIDATION_LIMITS.NAME_MIN_LENGTH,
    maxLength: name.length <= VALIDATION_LIMITS.NAME_MAX_LENGTH,
  });

  const getPlateValidations = () => ({
    notEmpty: plate.length > 0,
    exactLength: plate.length === VALIDATION_LIMITS.PLATE_LENGTH,
    format: PLATE_REGEX.OLD_FORMAT.test(plate) || PLATE_REGEX.NEW_FORMAT.test(plate),
  });

  const nameValidations = getNameValidations();
  const plateValidations = getPlateValidations();
  
  const isFormValid = Object.values(nameValidations).every(Boolean) && 
                      Object.values(plateValidations).every(Boolean);

  const getInputClassName = (hasError: boolean) => {
    const baseClasses = "w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 transition-all duration-200";
    const errorClasses = hasError ? "border-red-300" : "border-gray-300";
    return `${baseClasses} ${errorClasses}`;
  };

  const handleFormSubmit = async (data: VehicleFormData) => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    
    try {
      const vehicleData = {
        name: data.name.trim(),
        plate: data.plate.trim(),
        status: (vehicle?.status || 'active') as 'active' | 'inactive',
      };

      onClose();
      reset();

      if (isEditMode && vehicle?.id) {
        await vehicleService.updateVehicle(vehicle.id, vehicleData);
        onNotification?.('Veículo atualizado com sucesso!', 'success');
      } else {
        await vehicleService.createVehicle(vehicleData);
        onNotification?.('Veículo criado com sucesso!', 'success');
      }

      onVehicleChange?.();

    } catch (err: any) {
      console.error('Erro ao salvar veículo:', err);
      onNotification?.(err.message || 'Erro ao salvar veículo', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      reset();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleModalClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-center gap-3 p-6 pb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditMode ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 pb-6">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Veículo
                  </label>
                  <input
                    id="name"
                    {...register('name')}
                    disabled={isProcessing}
                    className={getInputClassName(name.length > 0 && !Object.values(nameValidations).every(Boolean))}
                    placeholder="Digite o nome do veículo"
                    autoFocus
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                  
                  <div className="mt-2 space-y-1">
                    <ValidationRule passed={nameValidations.notEmpty} text="Nome não pode estar vazio" />
                    <ValidationRule passed={nameValidations.minLength} text="Mínimo 2 caracteres" />
                    <ValidationRule passed={nameValidations.maxLength} text="Máximo 100 caracteres" />
                  </div>
                </div>

                {/* Plate Field */}
                <div>
                  <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-2">
                    Placa do Veículo
                  </label>
                  <input
                    id="plate"
                    value={plate}
                    onChange={handlePlateChange}
                    placeholder="Digite a placa do veículo"
                    disabled={isProcessing}
                    className={`${getInputClassName(plate.length > 0 && !Object.values(plateValidations).every(Boolean))} font-mono text-center tracking-widest`}
                    maxLength={VALIDATION_LIMITS.PLATE_LENGTH}
                  />
                  {errors.plate && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.plate.message}
                    </p>
                  )}

                  <div className="mt-2 space-y-1">
                    <ValidationRule passed={plateValidations.exactLength} text="Deve ter exatamente 7 caracteres" />
                    <ValidationRule passed={plateValidations.format} text="Formato: ABC1234 ou ABC1D23" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isProcessing || !isFormValid}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isEditMode ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={handleModalClose}
              disabled={isProcessing}
              className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehicleModal;