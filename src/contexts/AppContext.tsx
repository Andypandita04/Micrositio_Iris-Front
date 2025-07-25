import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Experiment {
  pagina: number;
  Titulo: string;
  campo: string;
  Tipo: string;
  Descripción: string;
  Costo: string;
  "Tiempo de preparación": string;
  "Tiempo de ejecución": string | number;
  "Fuerza de evidencia": string | number;
  "Tipo de riesgo": string | null;
  Deseabilidad: string;
  Factibilidad: string;
  Viabilidad: string;
  Adaptabilidad: string;
  Equipo: string;
  Habilidades: string;
  Herramientas: {
    herramienta1?: string;
    herramienta2?: string;
  };
  Metricas: string[];
}

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  response?: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  experiments: Experiment[];
  filteredExperiments: Experiment[];
  filters: {
    campo: string;
    tipo: string;
  };
  setFilters: (filters: { campo: string; tipo: string }) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockExperiments: Experiment[] = [
  {
    pagina: 15,
    Titulo: "Entrevistas a socios y proveedores",
    campo: "Descubrimiento",
    Tipo: "Exploración",
    Descripción: "Las entrevistas de socios y proveedores son similares a las entrevistas de clientes, pero se pueden enfocar en si es factible administrar el negocio. Ayuda a complementar las actividades y recursos clave que no se pueden o no se quieren hacer internamente.",
    Costo: "3",
    "Tiempo de preparación": "3",
    "Tiempo de ejecución": 3,
    "Fuerza de evidencia": 2,
    "Tipo de riesgo": null,
    Deseabilidad: "Si",
    Factibilidad: "Si",
    Viabilidad: "Si",
    Adaptabilidad: "Si",
    Equipo: "1 a 3 MIEMBROS",
    Habilidades: "INVESTIGACIÓN",
    Herramientas: {
      herramienta1: "SPARK HIRE https://www.sparkhire.com/ Es una plataforma de entrevistas por video, fácil de usar. Cuenta con más de 6,000 clientes que realizan entrevistas por video en más de 100 países.",
      herramienta2: "Skype https://www.skype.com/es/ Millones de personas y empresas ya usan Skype para las entrevistas. Se puede conectar con compañeros de trabajo o socios comerciales."
    },
    Metricas: [
      "Citas de partes interesadas expertas y comentarios de las entrevistas.",
      "Cuando las partes interesadas declaran lo que desean ver estratégicamente de la iniciativa, es una evidencia moderadamente fuerte."
    ]
  },
  {
    pagina: 64,
    Titulo: "Carta de intención",
    campo: "Validación",
    Tipo: "Llamado a la acción",
    Descripción: "Es un documento que delinea un acuerdo preliminar entre dos o más partes antes de que el acuerdo sea finalizado. Sirve para validar el interés de socios o clientes en un producto o servicio.",
    Costo: "2",
    "Tiempo de preparación": "2",
    "Tiempo de ejecución": "2",
    "Fuerza de evidencia": "2",
    "Tipo de riesgo": null,
    Deseabilidad: "Si",
    Factibilidad: "Si",
    Viabilidad: "Si",
    Adaptabilidad: "No",
    Equipo: "1 a 3 MIEMBROS",
    Habilidades: "LEGAL, VENTAS, FINANZAS",
    Herramientas: {
      herramienta1: "DocuSign https://www.docusign.com/ Plataforma para crear, enviar y firmar cartas de intención de manera digital.",
      herramienta2: "PandaDoc https://www.pandadoc.com/ Herramienta para gestionar documentos y obtener firmas electrónicas rápidamente."
    },
    Metricas: [
      "Número de cartas de intención firmadas.",
      "Porcentaje de partes interesadas que avanzan a acuerdos formales."
    ]
  },
  {
    pagina: 25,
    Titulo: "Pruebas A/B",
    campo: "Descubrimiento",
    Tipo: "Prototipos de interacción",
    Descripción: "Las pruebas A/B permiten comparar dos versiones de un elemento para determinar cuál funciona mejor. Es una herramienta fundamental para la toma de decisiones basada en datos.",
    Costo: "4",
    "Tiempo de preparación": "2",
    "Tiempo de ejecución": "4",
    "Fuerza de evidencia": "4",
    "Tipo de riesgo": "Bajo",
    Deseabilidad: "Si",
    Factibilidad: "Si",
    Viabilidad: "Si",
    Adaptabilidad: "Si",
    Equipo: "2 a 4 MIEMBROS",
    Habilidades: "ANÁLISIS DE DATOS, UX/UI",
    Herramientas: {
      herramienta1: "Google Optimize https://marketingplatform.google.com/about/optimize-360/ Controla de manera sencilla los experimentos de pruebas A/B con sus variantes.",
      herramienta2: "ABSmartly https://www.absmartly.com/ A/B Smartly es una plataforma de experimentación A/B con informes en tiempo real."
    },
    Metricas: [
      "Número de tráfico.",
      "Control de la tasa de conversión."
    ]
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState('libro-digital');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [experiments] = useState<Experiment[]>(mockExperiments);
  const [filteredExperiments, setFilteredExperiments] = useState<Experiment[]>(mockExperiments.filter(exp => exp.campo === 'Descubrimiento'));
  const [filters, setFiltersState] = useState({ campo: 'Descubrimiento', tipo: '' });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setFilters = (newFilters: { campo: string; tipo: string }) => {
    setFiltersState(newFilters);
    const filtered = experiments.filter(exp => {
      const matchesCampo = exp.campo === newFilters.campo;
      const matchesTipo = !newFilters.tipo || exp.Tipo === newFilters.tipo;
      return matchesCampo && matchesTipo;
    });
    setFilteredExperiments(filtered);
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      currentPage,
      setCurrentPage,
      sidebarOpen,
      setSidebarOpen,
      sidebarCollapsed,
      setSidebarCollapsed,
      experiments,
      filteredExperiments,
      filters,
      setFilters,
      chatMessages,
      addChatMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type { AppContextType };
export { AppContext };