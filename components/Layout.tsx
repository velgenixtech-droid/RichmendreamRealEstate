import React, { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '../constants';
import { LogOut, Menu, X, Sun, Moon } from 'lucide-react';

const Sidebar: React.FC<{ open: boolean; setOpen: (open: boolean) => void }> = ({ open, setOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNavItems = NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-surface border-r border-border transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">RMD CRM</h1>
          <button onClick={() => setOpen(false)} className="md:hidden text-on-surface">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {filteredNavItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 my-1 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-background hover:bg-gray-700/50'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 z-30 md:hidden"></div>}
    </>
  );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-surface/80 backdrop-blur-sm border-b border-border">
       <button onClick={onMenuClick} className="md:hidden text-on-surface">
          <Menu size={24} />
       </button>
       <div className="md:hidden"></div>
       <div className="flex items-center gap-4 ml-auto">
         {/* Theme toggle could go here */}
         <div className="flex items-center gap-3">
            <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-sm text-on-surface">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
         </div>
         <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors text-on-surface">
           <LogOut size={20} />
         </button>
       </div>
    </header>
  );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 w-full md:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="h-full overflow-y-auto p-4 md:p-8">
            {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
