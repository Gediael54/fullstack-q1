'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CirclePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../app/hooks/useAuth';
import { useVehicles } from '../../app/hooks/useVehicle';

import Sidebar from './Sidebar';
import Header from './Header';
import StatsCards from './StatsCards';
import { VehiclesTable } from './VehiclesTable';
import VehicleModal from './VehicleModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Toast from '../Toast';

import { Vehicle, VehicleToDelete } from '../../app/types';


export default function Dashboard() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleToDelete | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const {
    vehicles,
    isLoading,
    error,
    clearError,
    deleteVehicle,
    updateVehicleStatus,
    activeVehicles,
    inactiveVehicles,
    processingVehicleId,
    refreshVehicles,
  } = useVehicles();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      refreshVehicles?.();
    }
  }, [isAuthenticated, authLoading, refreshVehicles]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (!isAuthenticated) return null;

  const handleEditVehicle = (vehicle: Vehicle) => {
    if (!vehicle.id) return;
    setVehicleToEdit(vehicle);
    setShowModal(true);
  };

  const handleToggleStatus = async (id: number, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateVehicleStatus(id, newStatus);
      setToastMessage(`Veículo ${newStatus === 'active' ? 'arquivado' : 'desarquivado'} com sucesso!`);
      setToastType('success');
    } catch (error) {
      setToastMessage('Erro ao alterar status do veículo');
      setToastType('error');
    }
  };

  const handleDeleteVehicle = async (id: number, vehicleName?: string) => {
    setVehicleToDelete({ id, name: vehicleName || 'Veículo' });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteVehicle(vehicleToDelete.id);
      setToastMessage('Veículo removido com sucesso!');
      setToastType('success');
    } catch (error) {
      setToastMessage('Erro ao remover veículo');
      setToastType('error');
    } finally {
      setShowDeleteModal(false);
      setVehicleToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setVehicleToEdit(null);
  };

  const handleAddVehicleClick = () => {
    setVehicleToEdit(null);
    setShowModal(true);
  };

  const handleVehicleChange = () => {
    refreshVehicles();
  };

  const handleNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
  };

  const validVehicles = vehicles.filter(vehicle => vehicle.id != null);

  return (
    <div className="flex h-screen bg-gray-50 font-inter">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-[9999]"
          >
            <Toast
              message={toastMessage}
              onClose={() => setToastMessage(null)}
              type={toastType}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header logout={logout} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col p-8 overflow-hidden">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Olá {user?.name},</h2>
              <p className="text-gray-600 mt-2 text-lg">Cadastre e gerencie seus veículos</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center text-lg"
              >
                <span>{error}</span>
                <button onClick={clearError} className="text-red-500 hover:text-red-700 text-xl">✕</button>
              </motion.div>
            )}

            <StatsCards
              total={validVehicles.length}
              active={activeVehicles.length}
              inactive={inactiveVehicles.length}
            />

            <div className="mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddVehicleClick}
                className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 flex items-center gap-2 font-medium transition-all duration-200 text-base shadow-sm hover:shadow-md"
              >
                <CirclePlus className="w-5 h-5" />
                Cadastrar Veículo
              </motion.button>
            </div>

            <div className="flex-1 min-h-0">
              <VehiclesTable
                vehicles={validVehicles}
                processingVehicleId={processingVehicleId}
                onEdit={handleEditVehicle}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteVehicle}
              />
            </div>
          </div>
        </main>
      </div>

      <VehicleModal
        isOpen={showModal}
        onClose={handleModalClose}
        vehicle={vehicleToEdit}
        onVehicleChange={handleVehicleChange}
        processingVehicleId={processingVehicleId}
        onNotification={handleNotification}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        vehicleName={vehicleToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}