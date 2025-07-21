import React, { useState, useEffect, useContext } from 'react';
import './LibroDigital.css';
import ExperimentCard from '../../components/ExperimentCard/ExperimentCard';
import ExperimentModal from '../../components/ExperimentModal/ExperimentModal';
import Filters from '../../components/Filters/Filters';
import { AppContext } from '../../contexts/AppContext';
import type { AppContextType } from '../../contexts/AppContext';

const LibroDigital: React.FC = () => {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [filteredExperiments, setFilteredExperiments] = useState<any[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { filters } = useContext(AppContext) as AppContextType;

  // Cargar datos desde el backend
  useEffect(() => {
    fetch('/api/testing-card-playbook') // Ajusta la URL según tu backend
      .then(res => res.json())
      .then(data => {
        setExperiments(data);
        setFilteredExperiments(data); // Inicialmente sin filtros
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Aplica los filtros cada vez que cambian
  useEffect(() => {
    let filtered = experiments;
    if (filters.campo) {
      filtered = filtered.filter(exp => exp.campo === filters.campo);
    }
    if (filters.tipo) {
      filtered = filtered.filter(exp => exp.tipo === filters.tipo);
    }
    setFilteredExperiments(filtered);
  }, [experiments, filters]);

  const handleViewMore = (experiment: any) => {
    setSelectedExperiment(experiment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperiment(null);
  };

  return (
    <div className="libro-digital">
      <Filters />
      <div className="experiments-grid">
        {filteredExperiments.map((experiment, index) => (
          <ExperimentCard
            key={experiment.pagina || index}
            experiment={experiment}
            onViewMore={() => handleViewMore(experiment)}
          />
        ))}
      </div>
      {filteredExperiments.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron experimentos para los filtros seleccionados.</p>
        </div>
      )}
      <ExperimentModal
        experiment={selectedExperiment}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default LibroDigital;