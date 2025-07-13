import Image from 'next/image';
import { DashboardIcon, ReportsIcon } from '../Icons';

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-gray-200">
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-32 h-10 relative">
            <Image src="/login-logo.png" alt="EPTA Logo" fill className="object-contain" />
          </div>
        </div>
        <h1 className="text-2xl font-inter font-semibold text-gray-800 mt-4">Navegação</h1>
      </div>

      <nav className="p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium text-lg font-inter">
            <DashboardIcon className="w-6 h-6" />
            Dashboard
          </div>
          <div className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors text-lg font-inter">
            <ReportsIcon className="w-6 h-6" />
            Relatórios
          </div>
        </div>
      </nav>
    </aside>
  );
}
