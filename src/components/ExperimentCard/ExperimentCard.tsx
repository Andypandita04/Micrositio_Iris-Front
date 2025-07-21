import React from 'react';
import { Users, Eye } from 'lucide-react';
import './ExperimentCard.css';

interface ExperimentCardProps {
  experiment: any;
  onViewMore: () => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment, onViewMore }) => {
  const { theme } = useApp();

  const getTeamIcon = (teamSize: string) => {
    const count = teamSize.includes('1 a 3') ? 3 : teamSize.includes('2 a 4') ? 4 : 1;
    return Array.from({ length: count }, (_, i) => (
      <Users key={i} size={16} className="team-icon" />
    ));
  };

  return (
    <div className={`experiment-card ${theme}`}>
      <div className="card-header">
        <h3 className="card-title">{experiment.Titulo}</h3>
        <span className="card-campo">{experiment.campo}</span>
      </div>
      
      <div className="card-tipo">
        <span className="tipo-badge">{experiment.Tipo}</span>
      </div>
      
      <p className="card-description">{experiment.Descripción}</p>
      
      <div className="card-team">
        <span className="team-label">Equipo:</span>
        <div className="team-icons">
          {getTeamIcon(experiment.Equipo)}
        </div>
      </div>
      
      <div className="card-skills">
        <span className="skills-label">Habilidades:</span>
        <span className="skills-text">{experiment.Habilidades}</span>
      </div>
      
      <button className="view-more-button" onClick={onViewMore}>
        <Eye size={16} />
        Ver más
      </button>
    </div>
  );
};

export default ExperimentCard;

function useApp(): { theme: any; } {
    throw new Error('Function not implemented.');
}
