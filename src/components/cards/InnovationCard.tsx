import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface InnovationCardProps {
  title: string;
  icon: React.ReactNode;
  to: string;
}

const InnovationCard: React.FC<InnovationCardProps> = ({ title, icon, to }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-primary-purple dark:text-primary-yellow">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
        <div className="mt-auto pt-3">
          <Link
            to={to}
            className="inline-flex items-center text-secondary-purple dark:text-secondary-purple hover:text-secondary-purple/80 dark:hover:text-secondary-purple/80 font-medium text-sm group"
          >
            Aprende más <ChevronRight className="ml-0.5 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InnovationCard;