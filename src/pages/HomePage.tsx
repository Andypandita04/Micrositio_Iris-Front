import React from 'react';
import { 
  Brain, 
  Lightbulb, 
  Zap, 
  Rocket, 
  Code, 
  FileText, 
  Share2, 
  Search, 
  BookOpen 
} from 'lucide-react';
import FeatureCard from '../components/cards/FeatureCard';
import InnovationCard from '../components/cards/InnovationCard';

const HomePage: React.FC = () => {
  const innovationTopics = [
    { 
      title: 'Inteligencia Artificial', 
      icon: <Brain size={32} />, 
      to: '/lecciones/inteligencia-artificial' 
    },
    { 
      title: 'Prompting Avanzado', 
      icon: <Lightbulb size={32} />, 
      to: '/lecciones/prompting-avanzado' 
    },
    { 
      title: 'Automatización', 
      icon: <Zap size={32} />, 
      to: '/lecciones/automatizacion' 
    },
    { 
      title: 'Innovación Tecnológica', 
      icon: <Rocket size={32} />, 
      to: '/lecciones/innovacion-tecnologica' 
    },
    { 
      title: 'Desarrollo Web', 
      icon: <Code size={32} />, 
      to: '/lecciones/desarrollo-web' 
    },
    { 
      title: 'Documentación Efectiva', 
      icon: <FileText size={32} />, 
      to: '/lecciones/documentacion-efectiva' 
    },
    { 
      title: 'Colaboración Digital', 
      icon: <Share2 size={32} />, 
      to: '/lecciones/colaboracion-digital' 
    },
    { 
      title: 'SEO y Visibilidad', 
      icon: <Search size={32} />, 
      to: '/lecciones/seo-visibilidad' 
    },
    { 
      title: 'Aprendizaje Continuo', 
      icon: <BookOpen size={32} />, 
      to: '/lecciones/aprendizaje-continuo' 
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Cards Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
              title="Explora los experimentos" 
              description="Descubre nuestros últimos experimentos con tecnologías emergentes y metodologías innovadoras para el desarrollo de soluciones." 
              linkTo="/experimentos"
              colorClass="from-primary-purple to-secondary-purple"
            />
            <FeatureCard 
              title="Tarjetas de Prompts" 
              description="Accede a una colección de prompts optimizados para diferentes casos de uso que maximizan el potencial de los modelos de IA." 
              linkTo="/prompts"
              colorClass="from-primary-yellow to-secondary-orange"
            />
          </div>
        </section>

        {/* Innovation Cards Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recursos de Innovación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {innovationTopics.map((topic, index) => (
              <InnovationCard 
                key={index}
                title={topic.title}
                icon={topic.icon}
                to={topic.to}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;