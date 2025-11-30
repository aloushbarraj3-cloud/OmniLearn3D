import React from 'react';
import { User, SubjectType } from '../types';
import { Menu, X, Home, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { SUBJECTS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, onNavigate }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm z-20 sticky top-0">
        <span className="font-bold text-xl text-indigo-600">OmniLearn 3D</span>
        <button onClick={toggleSidebar} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 z-10
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex flex-col
      `}>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            OmniLearn 3D
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => { onNavigate('home'); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage === 'home' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}
          >
            <Home size={20} />
            <span className="font-medium">Subjects</span>
          </button>
          
          <button 
             onClick={() => { onNavigate('dashboard'); setSidebarOpen(false); }}
             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>

          <div className="pt-6 pb-2">
             <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Stats</p>
          </div>
          
          {user && (
            <div className="px-4 py-2">
                <div className="flex items-center space-x-3 mb-4">
                    <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-200" />
                    <div>
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-yellow-600">⭐ {user.xp} XP</p>
                    </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2 w-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${Math.min(user.streak * 10, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{user.streak} day streak</p>
            </div>
          )}
        </nav>

        <div className="p-4 border-t">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;