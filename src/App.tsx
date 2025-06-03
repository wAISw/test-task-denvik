import { useState, useCallback, useEffect } from 'react';

import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import { saveNodes, saveEdges, loadGraphState, clearGraphState } from './utils/storage';

function App() {
  const initialState = loadGraphState();
  const [nodes, setNodes] = useNodesState<Node>(initialState?.nodes || []);
  const [edges, setEdges] = useEdgesState<Edge>(initialState?.edges || []);
  const [isSaving, setIsSaving] = useState(false);

  const onNodesChangeInternal = useCallback(
    (changes) => {
      setIsSaving(true);
      try {
        const changedNodes = applyNodeChanges(changes, nodes);
        setNodes(changedNodes);
        saveNodes(changedNodes);
      } finally {
        setTimeout(() => setIsSaving(false), 500);
      }
    },
    [nodes, setNodes]
  );

  const onEdgesChangeInternal = useCallback(
    (changes) => {
      setIsSaving(true);
      try {
        const changedEdges = applyEdgeChanges(changes, edges);
        setEdges(changedEdges);
        saveEdges(changedEdges);
      } finally {
        setTimeout(() => setIsSaving(false), 500);
      }
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      saveEdges(newEdges);
    },
    [edges, setEdges]
  );

  const addNode = useCallback(() => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
    };
    const newNodes = nodes.concat(newNode);
    setIsSaving(true);
    setNodes(newNodes);
    saveNodes(newNodes);
    setTimeout(() => setIsSaving(false), 500);
  }, [nodes, setNodes]);

  const handleManualSave = useCallback(() => {
    setIsSaving(true);
    saveNodes(nodes);
    saveEdges(edges);
    setTimeout(() => setIsSaving(false), 1000);
  }, [nodes, edges]);

  const handleClearGraph = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear the graph? This will delete all nodes and edges.'
      )
    ) {
      setNodes([]);
      setEdges([]);
      clearGraphState();
    }
  }, [setNodes, setEdges]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeInternal}
          onEdgesChange={onEdgesChangeInternal}
          onConnect={onConnect}
        >
          <Panel>
            <div className="panel-controls">
              <button className="panel-button" onClick={addNode}>
                Add Node
              </button>
              <button className="panel-button panel-button-primary" onClick={handleManualSave}>
                Save Graph
              </button>
              <button className="panel-button panel-button-danger" onClick={handleClearGraph}>
                Clear Graph
              </button>
              {isSaving && <span className="save-indicator">✓ Saved</span>}
            </div>
          </Panel>
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
