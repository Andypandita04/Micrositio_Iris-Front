import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  linkTo: string;
  colorClass?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  linkTo,
  colorClass = "from-primary-purple to-secondary-purple"
}) => {
  return (
    <div className={`h-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br ${colorClass} text-white dark:text-gray-50`}>
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="mb-4 flex-grow">{description}</p>
        <Link 
          to={linkTo} 
          className="inline-flex items-center text-white dark:text-gray-50 font-medium hover:underline mt-auto group"
        >
          Explorar <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;