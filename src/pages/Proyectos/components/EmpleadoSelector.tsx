import React from 'react';
import Button from '../../../components/ui/Button/Button';
import styles from './NuevoProyectoModal.module.css';

interface Empleado {
  id_empleado: number;
  nombre_pila: string;
  apellido_paterno: string;
  apellido_materno?: string;
  celular?: string;
  correo: string;
  numero_empleado: string;
  activo: boolean;
}

interface EmpleadoSelectorProps {
  empleados: Empleado[];
  loading: boolean;
  loadingEmpleados: boolean;
  errors: Record<string, string>;
  selectedId: number;
  onSelect: (id: number) => void;
  cargarEmpleados: () => void;
  getNombreCompleto: (empleado: Empleado) => string;
  getIniciales: (empleado: Empleado) => string;
  getAvatarColor: (index: number) => string;
}

const EmpleadoSelector: React.FC<EmpleadoSelectorProps> = ({
  empleados,
  loading,
  loadingEmpleados,
  errors,
  selectedId,
  onSelect,
  cargarEmpleados,
  getNombreCompleto,
  getIniciales,
  getAvatarColor,
}) => {
  return (
    <div className={styles['form-group']}>
      <label className={styles.label}>
        Líder del Proyecto *
        {selectedId > 0 && (
          <span className={styles['selected-info']}>
            {' '}(Seleccionado: {getNombreCompleto(empleados.find(emp => emp.id_empleado === selectedId)!)} )
          </span>
        )}
      </label>
      {loadingEmpleados ? (
        <div className={styles['loading-empleados']}>
          <p>Cargando empleados...</p>
        </div>
      ) : errors.empleados ? (
        <div className={styles.error}>
          {errors.empleados}
          <Button
            variant="outline"
            onClick={cargarEmpleados}
            disabled={loadingEmpleados}
            style={{ marginLeft: '10px', fontSize: '12px', padding: '4px 8px' }}
          >
            Reintentar
          </Button>
        </div>
      ) : empleados.length === 0 ? (
        <div className={styles['no-empleados']}>
          <p>No hay empleados disponibles</p>
        </div>
      ) : (
        <div className={styles['colaboradores-grid']}>
          {empleados.map((empleado, idx) => (
            <div
              key={empleado.id_empleado}
              className={`${styles['colaborador-item']} ${selectedId === empleado.id_empleado ? styles['colaborador-selected'] : ''} ${!empleado.activo ? styles['colaborador-inactivo'] : ''}`}
              onClick={() => !loading && empleado.activo && onSelect(empleado.id_empleado)}
              title={!empleado.activo ? 'Empleado inactivo' : 'Seleccionar como líder'}
              style={{
                cursor: empleado.activo ? 'pointer' : 'not-allowed',
              }}
            >
              <div
                className={styles['colaborador-avatar']}
                style={{
                  background: getAvatarColor(idx),
                  color: '#fff',
                  border: selectedId === empleado.id_empleado
                    ? '2.5px solid #fff'
                    : '2.5px solid #fff'
                }}
              >
                {getIniciales(empleado)}
              </div>
              <div className={styles['colaborador-info']}>
                <span className={styles['colaborador-nombre']}>
                  {getNombreCompleto(empleado)}
                  {!empleado.activo && <span className={styles['inactive-badge']}> (Inactivo)</span>}
                </span>
                <span className={styles['colaborador-email']}>{empleado.correo}</span>
              </div>
              {selectedId === empleado.id_empleado && (
                <div className={styles['colaborador-check']}>✓</div>
              )}
            </div>
          ))}
        </div>
      )}
      {errors.id_lider && <span className={styles.error}>{errors.id_lider}</span>}
    </div>
  );
};

export default EmpleadoSelector;
