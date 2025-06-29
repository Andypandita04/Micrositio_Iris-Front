import React from 'react';
import { Play, GitBranch, Save } from 'lucide-react';
import { Secuencia } from '../../../types/secuencia';
import FlowEditor from '../../../components/FlowEditor/FlowEditor';
import Button from '../../../components/ui/Button/Button';
import styles from './FlowEditorSection.module.css';

interface FlowEditorSectionProps {
  secuenciaSeleccionada: Secuencia | null;
  onGuardarCambios?: () => void;
}

const FlowEditorSection: React.FC<FlowEditorSectionProps> = ({
  secuenciaSeleccionada,
  onGuardarCambios
}) => {
  if (!secuenciaSeleccionada) {
    return (
      <div className={styles['flow-editor-section']}>
        <div className={styles['flow-editor-header']}>
          <div className={styles['flow-editor-title-container']}>
            <h2 className={styles['flow-editor-title']}>Editor de Flujo</h2>
            <p className={styles['flow-editor-subtitle']}>
              Selecciona una secuencia para comenzar a editar
            </p>
          </div>
        </div>

        <div className={styles['flow-editor-container']}>
          <div className={styles['flow-editor-placeholder']}>
            <GitBranch size={48} className={styles['placeholder-icon']} />
            <h3 className={styles['placeholder-title']}>
              Ninguna secuencia seleccionada
            </h3>
            <p className={styles['placeholder-description']}>
              Selecciona una secuencia de la lista anterior para visualizar y editar su flujo de trabajo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['flow-editor-section']}>
      <div className={styles['flow-editor-header']}>
        <div className={styles['flow-editor-title-container']}>
          <h2 className={styles['flow-editor-title']}>Editor de Flujo</h2>
          <p className={styles['flow-editor-subtitle']}>
            Editando flujo de trabajo de la secuencia seleccionada
          </p>
        </div>

        <div className={styles['flow-editor-actions']}>
          <div className={styles['secuencia-badge']}>
            <Play size={14} />
            {secuenciaSeleccionada.nombre}
          </div>
          
          {onGuardarCambios && (
            <Button
              variant="primary"
              size="small"
              icon={<Save size={14} />}
              onClick={onGuardarCambios}
            >
              Guardar
            </Button>
          )}
        </div>
      </div>

      <div className={styles['flow-editor-container']}>
        <FlowEditor key={secuenciaSeleccionada.id} />
      </div>
    </div>
  );
};

export default FlowEditorSection;