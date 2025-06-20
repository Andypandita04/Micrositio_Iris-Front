import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  MessageSquare, 
  Beaker, 
  FlaskConical, 
  GraduationCap, 
  Bot,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { 
    path: '/blog', 
    name: 'Blog', 
    icon: <BookOpen size={20} /> 
  },
  { 
    path: '/prompts', 
    name: 'Prompts', 
    icon: <MessageSquare size={20} /> 
  },
  { 
    path: '/experimentos', 
    name: 'Experimentos', 
    icon: <Beaker size={20} /> 
  },
  { 
    path: '/testing-cards', 
    name: 'Testing Cards', 
    icon: <FlaskConical size={20} /> 
  },
  { 
    path: '/learning-cards', 
    name: 'Learning Cards', 
    icon: <GraduationCap size={20} /> 
  },
  { 
    path: '/lecciones-asistente', 
    name: 'Lecciones Asistente', 
    icon: <Bot size={20} /> 
  },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <aside className={`bg-white dark:bg-gray-900 transition-all duration-300 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-theme(spacing.24)-theme(spacing.12)-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.32)-theme(spacing.12)-theme(spacing.16))] relative ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Menú</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-purple dark:bg-primary-yellow text-white dark:text-gray-900' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : 'justify-start'}`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;