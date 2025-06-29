import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TestingCardNode from './TestingCardNode';
import LearningCardNode from './LearningCardNode';
import LearningCardEditModal from './LearningCardEditModal';
import TestingCardEditModal from './TestingCardEditModal';
import EmptyFlowState from './components/EmptyFlowState';

import { TestingCardData, LearningCardData, NodeData } from './types';
import './styles/FlowEditor.css';

/**
 * Tipos de nodos disponibles en el FlowEditor
 * @constant nodeTypes
 */
const nodeTypes = {
  testing: TestingCardNode,
  learning: LearningCardNode,
};

/**
 * Componente FlowEditor
 * 
 * @component FlowEditor
 * @description Editor de flujo principal que maneja Testing Cards y Learning Cards.
 * Incluye funcionalidades de creación, edición, eliminación y conexión de nodos
 * con posicionamiento automático y z-index dinámico.
 * 
 * Características principales:
 * - Posicionamiento automático de nodos basado en tipo de conexión
 * - Testing Cards se conectan horizontalmente (derecha)
 * - Learning Cards se conectan verticalmente (abajo)
 * - Z-index dinámico para evitar superposiciones
 * - Estado vacío atractivo cuando no hay nodos
 * - Modales de edición para ambos tipos de cards
 * - Gestión completa del estado de nodos y conexiones
 * - useLayoutEffect para cálculos previos al renderizado
 * 
 * @returns {JSX.Element} Editor de flujo completo
 */
const FlowEditor: React.FC = () => {
  // @state: Estados principales del editor
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  
  // @ref: Contador para generar IDs únicos de nodos
  const nodeIdCounter = useRef(1);
  
  // @ref: Mapa de niveles de nodos para z-index dinámico
  const nodeLevels = useRef<Map<string, number>>(new Map());

  /**
   * Calcula el nivel de profundidad de un nodo en el árbol
   * @function calculateNodeLevel
   * @param {string} nodeId - ID del nodo
   * @param {Node[]} allNodes - Todos los nodos disponibles
   * @param {Edge[]} allEdges - Todas las conexiones disponibles
   * @returns {number} Nivel de profundidad del nodo
   */
  const calculateNodeLevel = useCallback((nodeId: string, allNodes: Node[], allEdges: Edge[]): number => {
    if (nodeLevels.current.has(nodeId)) {
      return nodeLevels.current.get(nodeId)!;
    }

    // @logic: Buscar nodos padre
    const parentEdges = allEdges.filter(edge => edge.target === nodeId);
    
    if (parentEdges.length === 0) {
      // @case: Nodo raíz
      nodeLevels.current.set(nodeId, 0);
      return 0;
    }

    // @logic: Calcular nivel basado en el padre más profundo
    const maxParentLevel = Math.max(
      ...parentEdges.map(edge => calculateNodeLevel(edge.source, allNodes, allEdges))
    );
    
    const level = maxParentLevel + 1;
    nodeLevels.current.set(nodeId, level);
    return level;
  }, []);

  /**
   * Calcula la posición automática para un nuevo nodo basado en su padre y tipo
   * @function getNodePosition
   * @param {Node} parentNode - Nodo padre desde el cual se crea la conexión
   * @param {'testing' | 'learning'} childType - Tipo del nodo hijo
   * @param {Node[]} existingNodes - Nodos existentes para evitar superposiciones
   * @returns {Object} Posición calculada para el nuevo nodo
   */
  const getNodePosition = useCallback((
    parentNode: Node, 
    childType: 'testing' | 'learning',
    existingNodes: Node[]
  ) => {
    const baseOffset = 350; // @config: Distancia base entre nodos
    const verticalOffset = 200; // @config: Offset vertical para Learning Cards
    const collisionPadding = 50; // @config: Padding para evitar superposiciones
    
    let newPosition = {
      x: parentNode.position.x,
      y: parentNode.position.y
    };

    if (childType === 'testing') {
      // @positioning: Testing Cards se posicionan a la derecha del padre
      newPosition.x = parentNode.position.x + baseOffset;
      newPosition.y = parentNode.position.y;
    } else {
      // @positioning: Learning Cards se posicionan debajo del padre
      newPosition.x = parentNode.position.x;
      newPosition.y = parentNode.position.y + verticalOffset;
    }

    // @collision-detection: Verificar superposiciones y ajustar posición
    const checkCollision = (pos: { x: number; y: number }) => {
      return existingNodes.some(node => {
        const distance = Math.sqrt(
          Math.pow(node.position.x - pos.x, 2) + 
          Math.pow(node.position.y - pos.y, 2)
        );
        return distance < collisionPadding;
      });
    };

    // @adjustment: Ajustar posición si hay colisión
    let attempts = 0;
    while (checkCollision(newPosition) && attempts < 10) {
      if (childType === 'testing') {
        newPosition.x += collisionPadding;
      } else {
        newPosition.y += collisionPadding;
      }
      attempts++;
    }

    return newPosition;
  }, []);

  /**
   * Actualiza los z-index de todos los nodos basado en su nivel
   * @function updateNodeZIndex
   */
  const updateNodeZIndex = useCallback(() => {
    setNodes(currentNodes => {
      return currentNodes.map(node => {
        const level = calculateNodeLevel(node.id, currentNodes, edges);
        const zIndex = 1000 + level; // @z-index: Base 1000 + nivel
        
        return {
          ...node,
          style: {
            ...node.style,
            zIndex
          }
        };
      });
    });
  }, [edges, calculateNodeLevel]);

  /**
   * Efecto para actualizar z-index cuando cambian nodos o conexiones
   * @function useLayoutEffect
   */
  useLayoutEffect(() => {
    if (nodes.length > 0) {
      updateNodeZIndex();
    }
  }, [nodes.length, edges.length, updateNodeZIndex]);

  /**
   * Crea el primer nodo Testing Card en el centro del canvas
   * @function createFirstNode
   */
  const createFirstNode = useCallback(() => {
    const newNodeId = `node-${nodeIdCounter.current++}`;
    
    const newNode: Node<TestingCardData> = {
      id: newNodeId,
      type: 'testing',
      position: { x: 250, y: 100 }, // @position: Posición central inicial
      style: { zIndex: 1000 }, // @z-index: Nodo raíz
      data: {
        id: newNodeId,
        type: 'testing',
        title: `Testing Card ${nodeIdCounter.current - 1}`,
        hypothesis: 'Creemos que...',
        experimentType: 'Entrevista',
        description: 'Descripción del experimento',
        metrics: [],
        criteria: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        attachments: [],
        documentationUrls: [],
        responsible: '',
        experimentCategory: 'Descubrimiento',
        status: 'En desarrollo',
        collaborators: [],
        onAddTesting: () => createChildNode(newNodeId, 'testing'),
        onAddLearning: () => createChildNode(newNodeId, 'learning'),
        onEdit: () => openEditModal(newNodeId),
        onDelete: () => deleteNode(newNodeId),
      },
    };
    
    // @action: Resetear niveles y añadir nodo
    nodeLevels.current.clear();
    setNodes([newNode]);
  }, [setNodes]);

  /**
   * Crea un nodo hijo conectado a un nodo padre
   * @function createChildNode
   * @param {string} parentId - ID del nodo padre
   * @param {'testing' | 'learning'} childType - Tipo del nodo hijo a crear
   */
  const createChildNode = useCallback((parentId: string, childType: 'testing' | 'learning') => {
    const parentNode = nodes.find(node => node.id === parentId);
    if (!parentNode) return;

    const newNodeId = `node-${nodeIdCounter.current++}`;
    const newPosition = getNodePosition(parentNode, childType, nodes);
    const parentLevel = calculateNodeLevel(parentId, nodes, edges);
    const newZIndex = 1000 + parentLevel + 1;

    if (childType === 'testing') {
      // @creation: Crear nueva Testing Card
      const newNode: Node<TestingCardData> = {
        id: newNodeId,
        type: 'testing',
        position: newPosition,
        style: { zIndex: newZIndex },
        data: {
          id: newNodeId,
          type: 'testing',
          title: `Testing Card ${nodeIdCounter.current - 1}`,
          hypothesis: 'Creemos que...',
          experimentType: 'Entrevista',
          description: 'Descripción del experimento',
          metrics: [],
          criteria: [],
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          attachments: [],
          documentationUrls: [],
          responsible: '',
          experimentCategory: 'Descubrimiento',
          status: 'En desarrollo',
          collaborators: [],
          onAddTesting: () => createChildNode(newNodeId, 'testing'),
          onAddLearning: () => createChildNode(newNodeId, 'learning'),
          onEdit: () => openEditModal(newNodeId),
          onDelete: () => deleteNode(newNodeId),
        },
      };
      setNodes((nds) => [...nds, newNode]);
      
      // @connection: Crear conexión desde el handle derecho del padre
      const newEdge: Edge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        sourceHandle: 'right',
        targetHandle: 'left',
        style: { stroke: 'var(--color-primary-purple)', strokeWidth: 2 }
      };
      setEdges((eds) => [...eds, newEdge]);
      
    } else {
      // @creation: Crear nueva Learning Card
      const newNode: Node<LearningCardData> = {
        id: newNodeId,
        type: 'learning',
        position: newPosition,
        style: { zIndex: newZIndex },
        data: {
          id: newNodeId,
          type: 'learning',
          testingCardId: parentId,
          result: '',
          actionableInsight: '',
          links: [],
          attachments: [],
          documentationUrls: [],
          collaborators: [],
          onEdit: () => openEditModal(newNodeId),
          onDelete: () => deleteNode(newNodeId),
        },
      };
      setNodes((nds) => [...nds, newNode]);
      
      // @connection: Crear conexión desde el handle inferior del padre
      const newEdge: Edge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        sourceHandle: 'bottom',
        targetHandle: 'top',
        style: { stroke: 'var(--color-success)', strokeWidth: 2 }
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  }, [nodes, setNodes, setEdges, getNodePosition, calculateNodeLevel, edges]);

  /**
   * Elimina un nodo y todas sus conexiones
   * @function deleteNode
   * @param {string} nodeId - ID del nodo a eliminar
   */
  const deleteNode = useCallback((nodeId: string) => {
    // @cleanup: Limpiar niveles del nodo eliminado
    nodeLevels.current.delete(nodeId);
    
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  /**
   * Abre el modal de edición para un nodo específico
   * @function openEditModal
   * @param {string} nodeId - ID del nodo a editar
   */
  const openEditModal = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setEditingNode(node);
      setIsModalOpen(true);
    }
  }, [nodes]);

  /**
   * Maneja las conexiones manuales entre nodos
   * @function onConnect
   * @param {Connection} params - Parámetros de la conexión
   */
  const onConnect = useCallback(
    (params: Connection) => {
      // @styling: Personalizar el estilo de la conexión basado en los tipos de nodos
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      let edgeStyle = { strokeWidth: 2 };
      
      if (sourceNode?.type === 'testing' && targetNode?.type === 'learning') {
        edgeStyle = { ...edgeStyle, stroke: 'var(--color-success)' };
      } else if (sourceNode?.type === 'testing' && targetNode?.type === 'testing') {
        edgeStyle = { ...edgeStyle, stroke: 'var(--color-primary-purple)' };
      }
      
      const newEdge = { ...params, style: edgeStyle };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, nodes]
  );

  /**
   * Actualiza los nodos con los handlers correctos
   * @function nodesWithHandlers
   * @description Esto es necesario para mantener las referencias de funciones actualizadas
   */
  const nodesWithHandlers = nodes.map((node) => {
    if (node.type === 'testing') {
      return {
        ...node,
        data: {
          ...node.data,
          onAddTesting: () => createChildNode(node.id, 'testing'),
          onAddLearning: () => createChildNode(node.id, 'learning'),
          onEdit: () => openEditModal(node.id),
          onDelete: () => deleteNode(node.id),
        },
      };
    } else {
      return {
        ...node,
        data: {
          ...node.data,
          onEdit: () => openEditModal(node.id),
          onDelete: () => deleteNode(node.id),
        },
      };
    }
  });

  return (
    <div className="flow-editor">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          {/* @component: Fondo con patrón de puntos */}
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="var(--theme-text-tertiary)"
          />
          
          {/* @component: Controles de zoom y navegación */}
          <Controls 
            position="top-right"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
        </ReactFlow>

        {/* @component: Mostrar EmptyFlowState solo cuando no hay nodos */}
        {nodes.length === 0 && (
          <EmptyFlowState onCreateFirstNode={createFirstNode} />
        )}
      </ReactFlowProvider>

      {/* @component: Modales de edición condicionales */}
      {isModalOpen && editingNode && (
        editingNode.type === 'testing' ? (
          <TestingCardEditModal
            node={editingNode as Node<TestingCardData>}
            onSave={(updatedData) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === editingNode.id
                    ? { ...node, data: { ...node.data, ...updatedData } }
                    : node
                )
              );
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <LearningCardEditModal
            node={editingNode as Node<LearningCardData>}
            onSave={(updatedData) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === editingNode.id
                    ? { ...node, data: { ...node.data, ...updatedData } }
                    : node
                )
              );
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        )
      )}
    </div>
  );
};

export default FlowEditor;