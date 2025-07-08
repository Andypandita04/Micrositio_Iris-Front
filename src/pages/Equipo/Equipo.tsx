import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase,
  Search,
  Filter,
  UserPlus,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';
import { colaboradoresDisponibles } from '../../data/mockData';
import Button from '../../components/ui/Button/Button';
import styles from './Equipo.module.css';

/**
 * Datos extendidos del equipo con información adicional
 * @constant equipoExtendido
 */
const equipoExtendido = colaboradoresDisponibles.map((colaborador, index) => ({
  ...colaborador,
  role: ['Product Manager', 'UX Designer', 'Developer', 'Data Analyst', 'QA Engineer'][index],
  department: ['Producto', 'Diseño', 'Desarrollo', 'Datos', 'Calidad'][index],
  location: ['Madrid, España', 'Barcelona, España', 'Valencia, España', 'Sevilla, España', 'Bilbao, España'][index],
  joinDate: ['2023-01-15', '2023-03-20', '2023-06-10', '2023-09-05', '2024-01-12'][index],
  projectsCount: [8, 6, 12, 4, 7][index],
  status: 'Activo' as const,
  skills: [
    ['Product Strategy', 'Agile', 'Analytics'],
    ['UI/UX', 'Figma', 'User Research'],
    ['React', 'TypeScript', 'Node.js'],
    ['Python', 'SQL', 'Machine Learning'],
    ['Testing', 'Automation', 'Quality Assurance']
  ][index],
  bio: [
    'Especialista en estrategia de producto con 5+ años de experiencia en startups tecnológicas.',
    'Diseñadora UX/UI apasionada por crear experiencias digitales intuitivas y accesibles.',
    'Desarrollador full-stack con expertise en tecnologías modernas y arquitecturas escalables.',
    'Analista de datos enfocado en convertir información en insights accionables para el negocio.',
    'Ingeniera QA con experiencia en automatización y mejora continua de procesos de calidad.'
  ][index]
}));

/**
 * Estadísticas del equipo
 * @constant teamStats
 */
const teamStats = [
  { label: 'Miembros Activos', value: equipoExtendido.length, icon: <Users size={20} /> },
  { label: 'Proyectos Totales', value: equipoExtendido.reduce((sum, member) => sum + member.projectsCount, 0), icon: <Star size={20} /> },
  { label: 'Departamentos', value: new Set(equipoExtendido.map(m => m.department)).size, icon: <Award size={20} /> },
  { label: 'Tasa de Retención', value: '96%', icon: <TrendingUp size={20} /> }
];

/**
 * Componente Equipo
 * 
 * @component Equipo
 * @description Página que muestra información completa del equipo de trabajo,
 * incluyendo perfiles detallados, estadísticas y funcionalidades de búsqueda.
 * 
 * Características principales:
 * - Lista completa de miembros del equipo
 * - Perfiles detallados con información profesional
 * - Estadísticas del equipo
 * - Búsqueda y filtrado por nombre, rol o departamento
 * - Diseño de tarjetas moderno y responsive
 * - Información de contacto y habilidades
 * - Estados de actividad y métricas de rendimiento
 * 
 * Funcionalidades:
 * - Búsqueda en tiempo real
 * - Filtrado por departamento
 * - Vista de perfil expandida
 * - Estadísticas agregadas del equipo
 * 
 * @returns {JSX.Element} Página del equipo
 */
const Equipo: React.FC = () => {
  // @state: Término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // @state: Filtro de departamento
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  // @state: Miembro seleccionado para vista detallada
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  /**
   * Filtra los miembros del equipo basado en búsqueda y filtros
   * @function filteredTeam
   * @returns {Array} Lista filtrada de miembros
   */
  const filteredTeam = equipoExtendido.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === '' || member.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  /**
   * Obtiene la lista única de departamentos
   * @function departments
   * @returns {Array} Lista de departamentos únicos
   */
  const departments = Array.from(new Set(equipoExtendido.map(member => member.department)));

  /**
   * Formatea la fecha de ingreso
   * @function formatJoinDate
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatJoinDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long'
    });
  };

  /**
   * Genera las iniciales de un nombre
   * @function getInitials
   * @param {string} name - Nombre completo
   * @returns {string} Iniciales
   */
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles['equipo-container']}>
      <div className={styles['equipo-content']}>
        {/* @section: Header con estadísticas */}
        <div className={styles['equipo-header']}>
          <div className={styles['header-content']}>
            <div className={styles['header-text']}>
              <h1 className={styles['equipo-title']}>
                <Users size={32} />
                Nuestro Equipo
              </h1>
              <p className={styles['equipo-description']}>
                Conoce a los profesionales que hacen posible la innovación en nuestra organización
              </p>
            </div>

            {/* @section: Estadísticas del equipo */}
            <div className={styles['team-stats']}>
              {teamStats.map((stat, index) => (
                <div key={index} className={styles['stat-card']}>
                  <div className={styles['stat-icon']}>
                    {stat.icon}
                  </div>
                  <div className={styles['stat-content']}>
                    <span className={styles['stat-value']}>{stat.value}</span>
                    <span className={styles['stat-label']}>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* @section: Controles de búsqueda y filtrado */}
        <div className={styles['controls-section']}>
          <div className={styles['search-controls']}>
            {/* @component: Barra de búsqueda */}
            <div className={styles['search-container']}>
              <Search size={20} className={styles['search-icon']} />
              <input
                type="text"
                placeholder="Buscar por nombre, rol o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles['search-input']}
              />
            </div>

            {/* @component: Filtro de departamento */}
            <div className={styles['filter-container']}>
              <Filter size={20} className={styles['filter-icon']} />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className={styles['filter-select']}
              >
                <option value="">Todos los departamentos</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* @component: Botón para añadir miembro 
          <Button
            variant="primary"
            icon={<UserPlus size={16} />}
            onClick={() => console.log('Añadir nuevo miembro')}
          >
            Añadir Miembro
          </Button>
          */}
        </div>

        {/* @section: Resultados de búsqueda */}
        <div className={styles['results-info']}>
          <p className={styles['results-text']}>
            Mostrando {filteredTeam.length} de {equipoExtendido.length} miembros
            {searchTerm && ` para "${searchTerm}"`}
            {departmentFilter && ` en ${departmentFilter}`}
          </p>
        </div>

        {/* @section: Grid de miembros del equipo */}
        <div className={styles['team-grid']}>
          {filteredTeam.length > 0 ? (
            filteredTeam.map((member) => (
              <div key={member.id} className={styles['member-card']}>
                {/* @section: Header de la tarjeta */}
                <div className={styles['card-header']}>
                  <div className={styles['member-avatar']}>
                    {member.avatar ? (
                      <img 
                        src={member.avatar} 
                        alt={member.nombre}
                        className={styles['avatar-image']}
                      />
                    ) : (
                      <div className={styles['avatar-placeholder']}>
                        {getInitials(member.nombre)}
                      </div>
                    )}
                    <div className={styles['status-indicator']}></div>
                  </div>
                  
                  <div className={styles['member-basic-info']}>
                    <h3 className={styles['member-name']}>{member.nombre}</h3>
                    <p className={styles['member-role']}>{member.role}</p>
                    <p className={styles['member-department']}>{member.department}</p>
                  </div>
                </div>

                {/* @section: Información de contacto */}
                <div className={styles['contact-info']}>
                  <div className={styles['contact-item']}>
                    <Mail size={14} />
                    <span className={styles['contact-text']}>{member.email}</span>
                  </div>
                  {/*
                  <div className={styles['contact-item']}>
                    <MapPin size={14} />
                    <span className={styles['contact-text']}>{member.location}</span>
                  </div>
                  <div className={styles['contact-item']}>
                    <Calendar size={14} />
                    <span className={styles['contact-text']}>
                      Desde {formatJoinDate(member.joinDate)}
                    </span>
                  </div>
                  */}
                </div>

                {/* @section: Métricas del miembro */}
                <div className={styles['member-metrics']}>
                  <div className={styles['metric-item']}>
                    <span className={styles['metric-value']}>{member.projectsCount}</span>
                    <span className={styles['metric-label']}>Proyectos</span>
                  </div>
                  {/*<div className={styles['metric-item']}>
                    <span className={styles['metric-value']}>{member.skills.length}</span>
                    <span className={styles['metric-label']}>Habilidades</span>
                  </div>*/}
                </div>

                {/* @section: Habilidades principales 
                <div className={styles['skills-section']}>
                  <h4 className={styles['skills-title']}>Habilidades principales</h4>
                  <div className={styles['skills-list']}>
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className={styles['skill-tag']}>
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className={styles['skills-more']}>
                        +{member.skills.length - 3} más
                      </span>
                    )}
                  </div>
                </div>
                */}
                {/* @section: Biografía */}
                <div className={styles['bio-section']}>
                  <p className={styles['member-bio']}>{member.bio}</p>
                </div>

                {/* @section: Acciones de la tarjeta 
                <div className={styles['card-actions']}>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                  >
                    <Mail size={14} />
                    Contactar
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setSelectedMember(
                      selectedMember === member.id ? null : member.id
                    )}
                  >
                    <Briefcase size={14} />
                    Ver Proyectos
                  </Button>
                </div> */}
              </div>
            ))
          ) : (
            /* @section: Estado sin resultados */
            <div className={styles['no-results']}>
              <Users size={48} className={styles['no-results-icon']} />
              <h3 className={styles['no-results-title']}>No se encontraron miembros</h3>
              <p className={styles['no-results-description']}>
                Intenta ajustar los filtros de búsqueda o explora todos los miembros del equipo.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('');
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipo;