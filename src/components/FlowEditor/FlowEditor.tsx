import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TestingCardNode from './TestingCardNode';
import LearningCardNode from './LearningCardNode';
import LearningCardEditModal from './LearningCardEditModal';
import TestingCardEditModal from './TestingCardEditModal';
import EmptyFlowState from './components/EmptyFlowState';
import ConfirmationModal from '../ui/ConfirmationModal/ConfirmationModal';

import { TestingCardData, LearningCardData, NodeData } from './types';
import './styles/FlowEditor.css';

import {
  obtenerTestingCardsPorSecuencia,
  crearTestingCard,
  actualizarTestingCard,
  eliminarTestingCard 
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
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node<NodeData> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testingCardToDelete, setTestingCardToDelete] = useState<Node<TestingCardData> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInitialData = async () => {
    if (!idSecuencia) return;
    try {
      console.log('[FlowEditor] Solicitando Testing Cards con idSecuencia:', idSecuencia);
      const testingCards = await obtenerTestingCardsPorSecuencia(idSecuencia);
      console.log('[FlowEditor] Respuesta de obtenerTestingCardsPorSecuencia:', testingCards);

      const nodesAccum: Node[] = [];
      for (const card of testingCards) {
        const learningCards = card.learning_cards || [];

        const testingNode: Node = {
          id: `testing-${card.id}`, // <-- Usa card.id, que es el mismo que data.id
          type: 'testing',
          position: { x: 250, y: 100 + nodesAccum.length * 100 },
          data: {
            ...card,
            onAddTesting: () => handleAddTestingChild(card.id_testing_card.toString()),
            onAddLearning: () => handleAddLearningChild(card.id_testing_card.toString()),
            onEdit: () => {
              // Log para ver el id cuando se edita
              console.log('[FlowEditor] Editar Testing Card id:', card.id_testing_card);
              setEditingNode({
                ...testingNode,
                data: {
                  ...testingNode.data,
                  onAddTesting: () => handleAddTestingChild(card.id_testing_card.toString()),
                  onAddLearning: () => handleAddLearningChild(card.id_testing_card.toString()),
                  onEdit: () => {},
                  onDelete: () => {
                    const id = card.id_testing_card ?? card.id;
                    if (id !== undefined && id !== null) {
                      handleDeleteTestingCard(id.toString());
                    } else {
                      console.error('No se encontró id_testing_card ni id para eliminar');
                    }
                  },
                  onStatusChange: () => handleStatusChange(card.id_testing_card.toString()),
                }
              });
              setIsModalOpen(true);
            },
            onDelete: () => {
              const id = card.id_testing_card ?? card.id;
              if (id !== undefined && id !== null) {
                handleDeleteTestingCard(id.toString());
              } else {
                console.error('No se encontró id_testing_card ni id para eliminar');
              }
            },
            onStatusChange: () => handleStatusChange(card.id_testing_card.toString()),
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

  useEffect(() => {
    // Solo intenta cargar datos si no acabas de crear la primera Testing Card
    if (nodes.length === 0) {
      fetchInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSecuencia]);

  const crearPrimeraTestingCard = async () => {
    if (!idSecuencia) return;
    try {
      const payload = {
        id_secuencia: Number(idSecuencia),
        titulo: 'Primer experimento', // >= 3 caracteres
        hipotesis: 'Hipótesis inicial de prueba', // >= 10 caracteres
        id_experimento_tipo: 2, // Debe existir en tu catálogo
        descripcion: 'Descripción inicial de prueba', // >= 10 caracteres
        dia_inicio: new Date().toISOString().slice(0, 10),
        dia_fin: new Date().toISOString().slice(0, 10),
        id_responsable: 1, // Cambia por el id de usuario real si lo tienes
        status: 'En desarrollo'
      };
      console.log('[FlowEditor] Enviando payload para crear Testing Card:', payload);
      const nuevaCard = await crearTestingCard(payload);
      console.log('[FlowEditor] Respuesta al crear Testing Card:', nuevaCard);
      // En vez de fetchInitialData, agrega el nodo directamente
      const testingNode = {
        id: `testing-${nuevaCard.id_testing_card}`,
        type: 'testing',
        position: { x: 250, y: 100 },
        data: {
          ...nuevaCard,
          onAddTesting: () => handleAddTestingChild(nuevaCard.id_testing_card.toString()),
          onAddLearning: () => handleAddLearningChild(nuevaCard.id_testing_card.toString()),
          onEdit: () => {
            setEditingNode({
              id: `testing-${nuevaCard.id_testing_card}`,
              type: 'testing',
              position: { x: 250, y: 100 },
              data: {
                ...nuevaCard,
                onAddTesting: () => handleAddTestingChild(nuevaCard.id_testing_card.toString()),
                onAddLearning: () => handleAddLearningChild(nuevaCard.id_testing_card.toString()),
                onEdit: () => {},
                onDelete: () => handleDeleteTestingCard(nuevaCard.id_testing_card.toString()),
                onStatusChange: () => handleStatusChange(nuevaCard.id_testing_card.toString()),
              }
            });
            setIsModalOpen(true);
          },
          onDelete: () => handleDeleteTestingCard(nuevaCard.id_testing_card.toString()),
          onStatusChange: () => handleStatusChange(nuevaCard.id_testing_card.toString()),
        },
      };
      setNodes([testingNode]);
      setEdges([]); // Sin conexiones al inicio
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
        id: `testing-${nuevaCard.id}`,
        type: 'testing',
        position: { x: 250, y: 100 + nodes.length * 100 },
        data: {
          ...nuevaCard,
          onAddTesting: () => handleAddTestingChild(nuevaCard.id_testing_card.toString()),
          onAddLearning: () => handleAddLearningChild(nuevaCard.id_testing_card.toString()),
          onEdit: () => {
            setEditingNode({
              id: `testing-${nuevaCard.id}`,
              type: 'testing',
              position: { x: 250, y: 100 },
              data: {
                ...nuevaCard,
                onAddTesting: () => handleAddTestingChild(nuevaCard.id_testing_card.toString()),
                onAddLearning: () => handleAddLearningChild(nuevaCard.id_testing_card.toString()),
                onEdit: () => {},
                onDelete: () => handleDeleteTestingCard(nuevaCard.id_testing_card.toString()),
                onStatusChange: () => handleStatusChange(nuevaCard.id_testing_card.toString()),
              }
            });
            setIsModalOpen(true);
          },
          onDelete: () => handleDeleteTestingCard(nuevaCard.id_testing_card.toString()),
          onStatusChange: () => handleStatusChange(nuevaCard.id_testing_card.toString()),
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

  // Métodos de acción para nodos (implementaciones mínimas)
  const handleDeleteTestingCard = (id?: string) => {
    if (!id) {
      console.error('ID de Testing Card no definido');
      return;
    }
    const node = nodes.find(n => n.id === `testing-${id}`);
    console.log('[FlowEditor] Nodo seleccionado para eliminar:', node);
    if (node) {
      console.log('[FlowEditor] id_testing_card del nodo:', (node.data as TestingCardData).id_testing_card);
      console.log('[FlowEditor] titulo del nodo:', (node.data as TestingCardData).titulo);
    }
    setTestingCardToDelete(node || null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!testingCardToDelete) return;
    setIsDeleting(true);
    try {
      //await eliminarTestingCard((testingCardToDelete.data as TestingCardData).id_testing_card);
      await eliminarTestingCard((testingCardToDelete.data as TestingCardData).id);
      setNodes(nds => nds.filter(node => node.id !== testingCardToDelete.id));
      setEdges(eds => eds.filter(edge => edge.source !== testingCardToDelete.id && edge.target !== testingCardToDelete.id));
      setShowDeleteModal(false);
      setTestingCardToDelete(null);
    } catch (error) {
      // Manejo de error si lo deseas
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTestingCardToDelete(null);
  };

  const handleStatusChange = (id: string) => {
    // Aquí puedes implementar la lógica real de cambio de estado
    console.log('[FlowEditor] Cambiar status de Testing Card:', id);
    setNodes(nds => nds.map(node => {
      if (node.id === `testing-${id}` && node.type === 'testing' && 'status' in node.data) {
        const currentStatus = (node.data as TestingCardData).status;
        return {
          ...node,
          data: {
            ...node.data,
            status: currentStatus === 'En desarrollo' ? 'En validación' : 'En desarrollo',
          },
        };
      }
      return node;
    }));
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
          onNodeClick={(event, node) => {
            console.log('Click en nodo:', node);
          }}
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
            editingId={(editingNode.data as TestingCardData).id} // <-- Aquí debe ir el id
            onSave={(updatedData) => {
              console.log('[FlowEditor] Objeto enviado para actualizar:', updatedData);
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

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Testing Card"
        message={`¿Eliminar la Testing Card "${testingCardToDelete?.data?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FlowEditor;