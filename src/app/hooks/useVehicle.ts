import { useState, useEffect, useCallback, useMemo } from 'react';
import { Vehicle, VehicleStatus, CreateVehicleRequest, UpdateVehicleRequest, UseVehiclesReturn } from '../types';
import { vehicleService } from '../services/Vehicle';

export function useVehicles(): UseVehiclesReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingVehicleId, setProcessingVehicleId] = useState<number | null>(null);

  const activeVehicles = useMemo(() => 
    vehicles.filter(vehicle => vehicle.status === 'active'), 
    [vehicles]
  );
  
  const inactiveVehicles = useMemo(() => 
    vehicles.filter(vehicle => vehicle.status === 'inactive'), 
    [vehicles]
  );

  const clearError = useCallback(() => setError(null), []);

  const refreshVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vehicleService.getVehicles();
      
      const safeVehicles = response.vehicles?.map(v => ({
        ...v,
        id: v.id || 0,
        userId: v.userId || 0,
        status: v.status || 'active' as const,
      })).filter(v => v.id > 0) || [];
      
      setVehicles(safeVehicles);
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao carregar veículos';
      setError(errorMessage);
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVehicle = useCallback(async (vehicleData: CreateVehicleRequest) => {
    try {
      setError(null);
      await vehicleService.createVehicle(vehicleData);
      await refreshVehicles();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar veículo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshVehicles]);

  const updateVehicle = useCallback(async (id: number, vehicleData: UpdateVehicleRequest) => {
    try {
      setProcessingVehicleId(id);
      setError(null);
      await vehicleService.updateVehicle(id, vehicleData);
      await refreshVehicles();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao atualizar veículo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setProcessingVehicleId(null);
    }
  }, [refreshVehicles]);

  const updateVehicleStatus = useCallback(async (id: number, status: VehicleStatus) => {
    try {
      setProcessingVehicleId(id);
      setError(null);
      await vehicleService.updateVehicleStatus(id, status);
      await refreshVehicles();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao alterar status do veículo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setProcessingVehicleId(null);
    }
  }, [refreshVehicles]);

  const deleteVehicle = useCallback(async (id: number) => {
    try {
      setProcessingVehicleId(id);
      setError(null);
      await vehicleService.deleteVehicle(id);
      await refreshVehicles();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao deletar veículo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setProcessingVehicleId(null);
    }
  }, [refreshVehicles]);

  useEffect(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    activeVehicles,
    inactiveVehicles,
    createVehicle,
    updateVehicle,
    updateVehicleStatus,
    deleteVehicle,
    refreshVehicles,
    clearError,
    processingVehicleId,
  };
}