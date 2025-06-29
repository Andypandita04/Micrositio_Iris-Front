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

const nodeTypes = {
  testing: TestingCardNode,
  learning: LearningCardNode,
};

const FlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  const nodeIdCounter = useRef(1);

  // Función para crear nodos iniciales
  const createFirstNode = useCallback(() => {
    const newNodeId = `node-${nodeIdCounter.current++}`;
    
    const newNode: Node<TestingCardData> = {
      id: newNodeId,
      type: 'testing',
      position: { x: 250, y: 100 },
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
        onAddTesting: () => {},
        onAddLearning: () => {},
        onEdit: () => {},
        onDelete: () => {},
      },
    };
    setNodes([newNode]);
  }, [setNodes]);

  // Función para crear nodos hijos
  const createChildNode = useCallback((parentId: string, childType: 'testing' | 'learning') => {
    const parentNode = nodes.find(node => node.id === parentId);
    if (!parentNode) return;

    const newNodeId = `node-${nodeIdCounter.current++}`;
    const newPosition = {
      x: parentNode.position.x + (childType === 'learning' ? 300 : 0),
      y: parentNode.position.y + (childType === 'learning' ? 0 : 150),
    };

    if (childType === 'testing') {
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
    } else {
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
    }

    const newEdge: Edge = {
      id: `edge-${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
    };

    setEdges((eds) => [...eds, newEdge]);
  }, [nodes, setNodes, setEdges]);

  // Función para eliminar nodos
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  // Función para abrir modal de edición
  const openEditModal = useCallback((nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      setEditingNode(node);
      setIsModalOpen(true);
    }
  }, [nodes]);

  // Función para manejar conexiones
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Actualizar nodos con los handlers correctos
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
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls position="top-right" />
        </ReactFlow>

        {/* Mostrar EmptyFlowState solo cuando no hay nodos */}
        {nodes.length === 0 && (
          <EmptyFlowState onCreateFirstNode={createFirstNode} />
        )}
      </ReactFlowProvider>

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