import React, { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
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

import { useTheme } from '../../hooks/useTheme';

import {
  obtenerTestingCardsPorSecuencia,
  crearTestingCard,
} from '../../services/testingCardService';

import {
  crear as crearLearningCard,
} from '../../services/learningCardService';

interface FlowEditorProps {
  idSecuencia?: string | number;
}

const nodeTypes: any = {
  testing: TestingCardNode,
  learning: LearningCardNode,
};

const FlowEditor: React.FC<FlowEditorProps> = ({ idSecuencia }) => {
  const { isDarkMode } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  const nodeIdCounter = useRef(1);
  const nodeLevels = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!idSecuencia) return;

    const fetchInitialData = async () => {
      try {
        const testingCards = await obtenerTestingCardsPorSecuencia(idSecuencia);

        const nodesAccum: Node[] = [];
        for (const card of testingCards) {
          const learningCards = card.learning_cards || [];

          const testingNode: Node = {
            id: `testing-${card.id_testing_card}`,
            type: 'testing',
            position: { x: 250, y: 100 + nodesAccum.length * 100 },
            data: {
              ...card,
              onAddTesting: () => handleAddTestingChild(card.id_testing_card.toString()),
              onAddLearning: () => handleAddLearningChild(card.id_testing_card.toString()),
            },
          };

          nodesAccum.push(testingNode);

          for (const lc of learningCards) {
            nodesAccum.push({
              id: `learning-${lc.id}`,
              type: 'learning',
              position: { x: 250, y: testingNode.position.y + 200 },
              data: { ...lc },
            });
          }
        }

        setNodes(nodesAccum);
        generarConexiones(testingCards, nodesAccum);
      } catch (error) {
        console.error('[FlowEditor] Error cargando datos:', error);
      }
    };

    fetchInitialData();
  }, [idSecuencia]);

  const crearPrimeraTestingCard = async () => {
    if (!idSecuencia) return;
    try {
      const nuevaCard = await crearTestingCard({
        id_secuencia: idSecuencia,
        titulo: 'titulodefault',
      });

      const nuevoNodo: Node = {
        id: `testing-${nuevaCard.id_testing_card}`,
        type: 'testing',
        position: { x: 250, y: 100 },
        data: {
          ...nuevaCard,
          onAddTesting: () => handleAddTestingChild(nuevaCard.id_testing_card.toString()),
          onAddLearning: () => handleAddLearningChild(nuevaCard.id_testing_card.toString()),
        },
      };

      setNodes([nuevoNodo]);
    } catch (error) {
      console.error('[FlowEditor] Error creando primera Testing Card:', error);
    }
  };

  const handleAddTestingChild = async (padreId: string) => {
    try {
      const nuevaCard = await crearTestingCard({
        padre_id: parseInt(padreId, 10),
        titulo: `Nueva Testing Card ${Date.now()}`,
        status: 'En validación',
      });

      const nuevoNodo = {
        id: `testing-${nuevaCard.id_testing_card}`,
        type: 'testing',
        position: { x: 250, y: 100 + nodes.length * 100 },
        data: {
          ...nuevaCard,
          onAddTesting: () => handleAddTestingChild(nuevaCard.id_testing_card.toString()),
          onAddLearning: () => handleAddLearningChild(nuevaCard.id_testing_card.toString()),
        },
      };

      setNodes(nds => [...nds, nuevoNodo]);
    } catch (error) {
      console.error('[FlowEditor] Error creando Testing Card:', error);
    }
  };

  const handleAddLearningChild = async (testingCardId: string) => {
    try {
      const testingCardIdNumber = parseInt(testingCardId, 10);
      const nuevaLC = await crearLearningCard({
        id_testing_card: testingCardIdNumber,
        resultado: 'Nuevo aprendizaje',
        estado: 'CUMPLIDO',
      });

      const nuevoNodo: Node = {
        id: `learning-${nuevaLC.id}`,
        type: 'learning',
        position: { x: 250, y: 300 + nodes.length * 100 },
        data: { ...nuevaLC },
      };

      setNodes(nds => [...nds, nuevoNodo]);
      setEdges(eds => [
        ...eds,
        {
          id: `edge-${testingCardId}-to-learning-${nuevaLC.id}`,
          source: `testing-${testingCardId}`,
          target: `learning-${nuevaLC.id}`,
          sourceHandle: 'bottom',
          targetHandle: 'top',
        },
      ]);
    } catch (error) {
      console.error('Error creando Learning Card:', error);
    }
  };

  const generarConexiones = (testingCards: any[], allNodes: Node[]) => {
    const edges: Edge[] = [];

    testingCards.forEach(card => {
      if (card.padre_id) {
        edges.push({
          id: `edge-testing-${card.padre_id}-to-${card.id_testing_card}`,
          source: `testing-${card.padre_id}`,
          target: `testing-${card.id_testing_card}`,
          sourceHandle: 'right',
          targetHandle: 'left',
          style: { stroke: '#6C63FF' },
        });
      }

      const learningCards = allNodes.filter(n =>
        n.type === 'learning' && n.data.id_testing_card === card.id_testing_card
      );

      learningCards.forEach(lc => {
        edges.push({
          id: `edge-testing-${card.id_testing_card}-to-learning-${lc.data.id}`,
          source: `testing-${card.id_testing_card}`,
          target: lc.id,
          sourceHandle: 'bottom',
          targetHandle: 'top',
          style: { stroke: '#06D6A0' },
        });
      });
    });

    setEdges(edges);
  };

  return (
    <div className="flow-editor">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
        </ReactFlow>

        {nodes.length === 0 && (
          <EmptyFlowState onCreateFirstNode={crearPrimeraTestingCard} />
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