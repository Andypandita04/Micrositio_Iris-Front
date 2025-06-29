import React, { useState, useCallback, useRef } from 'react';
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
 */
const nodeTypes = {
  testing: TestingCardNode,
  learning: LearningCardNode,
};

/**
 * Componente FlowEditor
 * 
 * Editor de flujo principal que maneja Testing Cards y Learning Cards.
 * Incluye funcionalidades de creación, edición, eliminación y conexión de nodos.
 * 
 * Características principales:
 * - Posicionamiento automático de nodos basado en tipo de conexión
 * - Testing Cards se conectan horizontalmente (derecha)
 * - Learning Cards se conectan verticalmente (abajo)
 * - Estado vacío atractivo cuando no hay nodos
 * - Modales de edición para ambos tipos de cards
 * - Gestión completa del estado de nodos y conexiones
 */
const FlowEditor: React.FC = () => {
  // Estados principales del editor
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  
  // Contador para generar IDs únicos de nodos
  const nodeIdCounter = useRef(1);

  /**
   * Calcula la posición automática para un nuevo nodo basado en su padre y tipo
   * 
   * @param parentNode - Nodo padre desde el cual se crea la conexión
   * @param childType - Tipo del nodo hijo ('testing' o 'learning')
   * @returns Posición calculada para el nuevo nodo
   */
  const getNodePosition = useCallback((parentNode: Node, childType: 'testing' | 'learning') => {
    const baseOffset = 350; // Distancia base entre nodos
    const verticalOffset = 200; // Offset vertical para Learning Cards
    
    if (childType === 'testing') {
      // Testing Cards se posicionan a la derecha del padre
      return {
        x: parentNode.position.x + baseOffset,
        y: parentNode.position.y
      };
    } else {
      // Learning Cards se posicionan debajo del padre
      return {
        x: parentNode.position.x,
        y: parentNode.position.y + verticalOffset
      };
    }
  }, []);

  /**
   * Crea el primer nodo Testing Card en el centro del canvas
   */
  const createFirstNode = useCallback(() => {
    const newNodeId = `node-${nodeIdCounter.current++}`;
    
    const newNode: Node<TestingCardData> = {
      id: newNodeId,
      type: 'testing',
      position: { x: 250, y: 100 }, // Posición central inicial
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
        responsible: '',
        experimentCategory: 'Descubrimiento',
        status: 'En desarrollo',
        onAddTesting: () => createChildNode(newNodeId, 'testing'),
        onAddLearning: () => createChildNode(newNodeId, 'learning'),
        onEdit: () => openEditModal(newNodeId),
        onDelete: () => deleteNode(newNodeId),
      },
    };
    
    setNodes([newNode]);
  }, [setNodes]);

  /**
   * Crea un nodo hijo conectado a un nodo padre
   * 
   * @param parentId - ID del nodo padre
   * @param childType - Tipo del nodo hijo a crear
   */
  const createChildNode = useCallback((parentId: string, childType: 'testing' | 'learning') => {
    const parentNode = nodes.find(node => node.id === parentId);
    if (!parentNode) return;

    const newNodeId = `node-${nodeIdCounter.current++}`;
    const newPosition = getNodePosition(parentNode, childType);

    if (childType === 'testing') {
      // Crear nueva Testing Card
      const newNode: Node<TestingCardData> = {
        id: newNodeId,
        type: 'testing',
        position: newPosition,
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
          responsible: '',
          experimentCategory: 'Descubrimiento',
          status: 'En desarrollo',
          onAddTesting: () => createChildNode(newNodeId, 'testing'),
          onAddLearning: () => createChildNode(newNodeId, 'learning'),
          onEdit: () => openEditModal(newNodeId),
          onDelete: () => deleteNode(newNodeId),
        },
      };
      setNodes((nds) => [...nds, newNode]);
      
      // Crear conexión desde el handle derecho del padre
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
      // Crear nueva Learning Card
      const newNode: Node<LearningCardData> = {
        id: newNodeId,
        type: 'learning',
        position: newPosition,
        data: {
          id: newNodeId,
          type: 'learning',
          testingCardId: parentId,
          result: '',
          actionableInsight: '',
          links: [],
          attachments: [],
          onEdit: () => openEditModal(newNodeId),
          onDelete: () => deleteNode(newNodeId),
        },
      };
      setNodes((nds) => [...nds, newNode]);
      
      // Crear conexión desde el handle inferior del padre
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
  }, [nodes, setNodes, setEdges, getNodePosition]);

  /**
   * Elimina un nodo y todas sus conexiones
   * 
   * @param nodeId - ID del nodo a eliminar
   */
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  /**
   * Abre el modal de edición para un nodo específico
   * 
   * @param nodeId - ID del nodo a editar
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
   */
  const onConnect = useCallback(
    (params: Connection) => {
      // Personalizar el estilo de la conexión basado en los tipos de nodos
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
   * Esto es necesario para mantener las referencias de funciones actualizadas
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
          {/* Fondo con patrón de puntos */}
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="var(--theme-text-tertiary)"
          />
          
          {/* Controles de zoom y navegación */}
          <Controls 
            position="top-right"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
        </ReactFlow>

        {/* Mostrar EmptyFlowState solo cuando no hay nodos */}
        {nodes.length === 0 && (
          <EmptyFlowState onCreateFirstNode={createFirstNode} />
        )}
      </ReactFlowProvider>

      {/* Modales de edición condicionales */}
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