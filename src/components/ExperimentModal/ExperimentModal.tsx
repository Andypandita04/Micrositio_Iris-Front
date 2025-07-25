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
            <h2 className="modal-title">{experiment.Titulo ?? experiment.titulo ?? ''}</h2>
            <div className="modal-meta">
              <span className="modal-campo">{experiment.campo ?? experiment.Campo ?? ''}</span>
              <span className="modal-tipo">{experiment.Tipo ?? experiment.tipo ?? ''}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <div className="description-section">
              <p className="modal-description">{experiment.Descripción ?? experiment.descripcion ?? ''}</p>
            </div>

            <div className="team-skills-section">
              <div className="team-section">
                <span className="section-label">Equipo:</span>
                <div className="team-icons">
                  {getTeamIcon(experiment.Equipo ?? experiment.equipo ?? '')}
                </div>
              </div>
              
              <div className="skills-section">
                <span className="section-label">Habilidades:</span>
                <span className="skills-text">{experiment.Habilidades ?? experiment.habilidades ?? ''}</span>
              </div>
            </div>

            <div className="metrics-section">
              <div className="metrics-grid">
                <div className="metric-item">
                  <PieChart value={parseInt(experiment.Costo ?? experiment.costo ?? '0')} label="Costo" icon={<DollarSign size={20} />} />
                </div>
                <div className="metric-item">
                  <PieChart value={parseInt(experiment["Tiempo de preparación"] ?? experiment.tiempo_de_preparacion ?? '0')} label="Prep." icon={<Clock size={20} />} />
                </div>
                <div className="metric-item">
                  <PieChart value={parseInt(experiment["Tiempo de ejecución"] ?? experiment.tiempo_de_ejecucion ?? '0')} label="Ejec." icon={<Clock size={20} />} />
                </div>
                <div className="metric-item">
                  <PieChart value={parseInt(experiment["Fuerza de evidencia"] ?? experiment.fuerza_de_evidencia ?? '0')} label="Evidencia" icon={<Target size={20} />} />
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
                    {getStatusIcon(experiment.Deseabilidad ?? experiment.deseabilidad ?? '')}
                    <span>{experiment.Deseabilidad ?? experiment.deseabilidad ?? ''}</span>
                  </div>
                </div>
                <div className="status-item">
                  <span>Factibilidad:</span>
                  <div className="status-value">
                    {getStatusIcon(experiment.Factibilidad ?? experiment.factibilidad ?? '')}
                    <span>{experiment.Factibilidad ?? experiment.factibilidad ?? ''}</span>
                  </div>
                </div>
                <div className="status-item">
                  <span>Viabilidad:</span>
                  <div className="status-value">
                    {getStatusIcon(experiment.Viabilidad ?? experiment.viabilidad ?? '')}
                    <span>{experiment.Viabilidad ?? experiment.viabilidad ?? ''}</span>
                  </div>
                </div>
                <div className="status-item">
                  <span>Adaptabilidad:</span>
                  <div className="status-value">
                    {getStatusIcon(experiment.Adaptabilidad ?? experiment.adaptabilidad ?? '')}
                    <span>{experiment.Adaptabilidad ?? experiment.adaptabilidad ?? ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tools-section">
              <h4>Herramientas</h4>
              <div className="tools-list">
                {experiment.Herramientas && typeof experiment.Herramientas === 'object'
                  ? Object.entries(experiment.Herramientas).map(([key, value]) => (
                      <div key={key} className="tool-item">
                        <p>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                      </div>
                    ))
                  : experiment.herramientas && typeof experiment.herramientas === 'object'
                  ? Object.entries(experiment.herramientas).map(([key, value]) => (
                      <div key={key} className="tool-item">
                        <p>{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                      </div>
                    ))
                  : null}
              </div>
            </div>

            <div className="metrics-text-section">
              <h4>Métricas</h4>
              <ul className="metrics-list">
                {Array.isArray(experiment.Metricas)
                  ? experiment.Metricas.map((metric: string, index: number) => (
                      <li key={index}>{metric}</li>
                    ))
                  : Array.isArray(experiment.metricas)
                  ? experiment.metricas.map((metric: string, index: number) => (
                      <li key={index}>{metric}</li>
                    ))
                  : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentModal;
