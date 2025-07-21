import React from 'react';
import { X, Users, Clock, DollarSign, Target, CheckCircle, XCircle } from 'lucide-react';
import PieChart from '../PieChart/PieChart';
import { useTheme } from '../../hooks/useTheme';
import './ExperimentModal.css';

interface ExperimentModalProps {
  experiment: any;
  isOpen: boolean;
  onClose: () => void;
}

const ExperimentModal: React.FC<ExperimentModalProps> = ({ experiment, isOpen, onClose }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getTeamIcon = (teamSize: string) => {
    const count = teamSize.includes('1 a 3') ? 3 : teamSize.includes('2 a 4') ? 4 : 1;
    return Array.from({ length: count }, (_, i) => (
      <Users key={i} size={16} className="team-icon" />
    ));
  };

  const getStatusIcon = (status: string) => {
    return status === 'Si' ? <CheckCircle size={16} className="status-yes" /> : <XCircle size={16} className="status-no" />;
  };

  return (
    <div className={`modal-overlay ${theme}`} onClick={onClose} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className={`modal-content ${theme}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{experiment.Titulo}</h2>
            <div className="modal-meta">
              <span className="modal-campo">{experiment.campo}</span>
              <span className="modal-tipo">{experiment.Tipo}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <div className="description-section">
              <p className="modal-description">{experiment.Descripción}</p>
            </div>

            <div className="team-skills-section">
              <div className="team-section">
                <span className="section-label">Equipo:</span>
                <div className="team-icons">
                  {getTeamIcon(experiment.Equipo)}
                </div>
              </div>
              
              <div className="skills-section">
                <span className="section-label">Habilidades:</span>
                <span className="skills-text">{experiment.Habilidades}</span>
              </div>
            </div>

            <div className="metrics-section">
              <div className="metrics-grid">
                <div className="metric-item">
                  <PieChart value={parseInt(experiment.Costo)} label="Costo" icon={<DollarSign size={20} />} />
                </div>
                <div className="metric-item">
                  <PieChart value={parseInt(experiment["Tiempo de preparación"])} label="Prep." icon={<Clock size={20} />} />
                </div>
                <div className="metric-item">
                  <PieChart value={parseInt(experiment["Tiempo de ejecución"])} label="Ejec." icon={<Clock size={20} />} />
                </div>
                <div className="metric-item">
                  <PieChart value={parseInt(experiment["Fuerza de evidencia"])} label="Evidencia" icon={<Target size={20} />} />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-right">
            <div className="status-section">
              <h4>Estado del Proyecto</h4>
              <div className="status-grid">
                <div className="status-item">
                  <span>Deseabilidad:</span>
                  <div className="status-value">
                    {getStatusIcon(experiment.Deseabilidad)}
                    <span>{experiment.Deseabilidad}</span>
                  </div>
                </div>
                <div className="status-item">
                  <span>Factibilidad:</span>
                  <div className="status-value">
                    {getStatusIcon(experiment.Factibilidad)}
                    <span>{experiment.Factibilidad}</span>
                  </div>
                </div>
                <div className="status-item">
                  <span>Viabilidad:</span>
                  <div className="status-value">
                    {getStatusIcon(experiment.Viabilidad)}
                    <span>{experiment.Viabilidad}</span>
                  </div>
                </div>
                <div className="status-item">
                  <span>Adaptabilidad:</span>
                  <div className="status-value">
                    {getStatusIcon(experiment.Adaptabilidad)}
                    <span>{experiment.Adaptabilidad}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tools-section">
              <h4>Herramientas</h4>
              <div className="tools-list">
                {experiment.Herramientas && typeof experiment.Herramientas === 'object' &&
                  Object.entries(experiment.Herramientas).map(([key, value]) => (
                    <div key={key} className="tool-item">
                      <p>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="metrics-text-section">
              <h4>Métricas</h4>
              <ul className="metrics-list">
                {Array.isArray(experiment.Metricas) && experiment.Metricas.map((metric: string, index: number) => (
                  <li key={index}>{metric}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentModal;
