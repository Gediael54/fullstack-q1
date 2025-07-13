import { Pencil, Archive, ArchiveRestore, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehiclesTableProps, Vehicle } from '../../app/types';

export function VehiclesTable({
  vehicles,
  processingVehicleId,
  onEdit,
  onToggleStatus,
  onDelete,
}: VehiclesTableProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] h-full flex flex-col">
      <div
        className="flex-1 min-h-0 overflow-y-auto scrollbar-thin-custom"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F8FAFC',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
            transition: all 0.2s ease;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          div::-webkit-scrollbar-thumb:active {
            background: #64748b;
          }
        `}</style>
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[30%]" />
            <col className="w-[30%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="border-b border-blue-100 sticky top-0 bg-white z-10">
            <tr>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider font-inter text-gray-600">
                Veículo
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider font-inter text-gray-600">
                Placa
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider font-inter text-gray-600">
                Status
              </th>
              <th className="px-8 py-5 text-right text-sm font-bold uppercase tracking-wider font-inter text-gray-600">
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-gray-500 text-lg font-inter">
                  Nenhum veículo cadastrado
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {vehicles.map((vehicle: Vehicle, index: number) => {
                  const isActive = vehicle.status === 'active';
                  const isProcessing = processingVehicleId === vehicle.id;
                  
                  return (
                    <motion.tr
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut"
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.95,
                        y: -10,
                        transition: {
                          duration: 0.2,
                          ease: "easeIn"
                        }
                      }}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                      } hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100/50 ${
                        isProcessing ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center min-w-0">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                            className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                          >
                            <span className="text-blue-600 font-bold text-sm">
                              {vehicle.name?.charAt(0)?.toUpperCase() || 'V'}
                            </span>
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 + 0.15 }}
                              className="text-gray-900 font-medium text-base truncate"
                              title={vehicle.name}
                            >
                              {truncateText(vehicle.name, 30)}
                            </motion.div>
                            {isProcessing && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-blue-600 mt-1 flex items-center gap-1"
                              >                   
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.2 }}
                          className="text-gray-900 font-mono text-base font-medium bg-gray-100 px-3 py-2 rounded-lg inline-block tracking-wider min-w-0 truncate"
                        >
                          {vehicle.plate}
                        </motion.div>
                      </td>

                      <td className="px-8 py-6">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.25 }}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap`}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.3, type: "spring", stiffness: 200 }}
                            className={`w-2 h-2 rounded-full mr-2 ${
                              isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {isActive ? 'Ativo' : 'Inativo'}
                        </motion.div>
                      </td>

                      <td className="px-4 py-6 text-right">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                          className="flex justify-end gap-1"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onEdit(vehicle)}
                            disabled={isProcessing}
                            className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100 active:text-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Editar veículo"
                          >
                            <Pencil className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onToggleStatus(vehicle.id, vehicle.status)}
                            disabled={isProcessing}
                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 active:bg-yellow-100 active:text-yellow-700`}
                            title={isActive ? 'Desativar veículo' : 'Ativar veículo'}
                          >
                            {isActive ? (
                              <Archive className="w-4 h-4" />
                            ) : (
                              <ArchiveRestore className="w-4 h-4" />
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDelete(vehicle.id, vehicle.name)}
                            disabled={isProcessing}
                            className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 active:bg-red-100 active:text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Excluir veículo"
                          >
                            <Trash className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}