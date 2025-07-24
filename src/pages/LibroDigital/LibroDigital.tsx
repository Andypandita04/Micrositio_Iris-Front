import React, { useState, useEffect, useContext } from 'react';
import './LibroDigital.css';
import ExperimentCard from '../../components/ExperimentCard/ExperimentCard';
import ExperimentModal from '../../components/ExperimentModal/ExperimentModal';
import Filters from '../../components/Filters/Filters';
import { AppContext } from '../../contexts/AppContext';
import type { AppContextType } from '../../contexts/AppContext';
import TestingCardPlaybookService from '../../services/TestingCardPlaybookService';
import { useTheme } from '../../hooks/useTheme';

const service = new TestingCardPlaybookService();

const LibroDigital: React.FC = () => {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [filteredExperiments, setFilteredExperiments] = useState<any[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { filters } = useContext(AppContext) as AppContextType;
  const { theme } = useTheme();

  // Cargar datos desde el backend usando el service
  useEffect(() => {
    service.listarTodos()
      .then(data => {
        setExperiments(data);
        setFilteredExperiments(data); // Inicialmente sin filtros
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Aplica los filtros consultando al backend
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        if (!filters.campo && !filters.tipo) {
          const data = await service.listarTodos();
          setFilteredExperiments(data);
        } else if (filters.campo && !filters.tipo) {
          const data = await service.buscarPorCampo(filters.campo);
          setFilteredExperiments(data);
        } else if (!filters.campo && filters.tipo) {
          const data = await service.buscarPorTipo(filters.tipo);
          setFilteredExperiments(data);
        } else if (filters.campo && filters.tipo) {
          // Primero filtra por campo, luego por tipo
          const dataCampo = await service.buscarPorCampo(filters.campo);
          const data = dataCampo.filter(exp => exp.tipo === filters.tipo);
          setFilteredExperiments(data);
        }
      } catch (error) {
        console.error('Error fetching filtered data:', error);
        setFilteredExperiments([]);
      }
    };
    fetchFiltered();
  }, [filters]);

  const handleViewMore = (experiment: any) => {
    setSelectedExperiment(experiment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperiment(null);
  };

  return (
    <div className={`libro-digital ${theme}`}>
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