import {useState, useCallback, useEffect, useMemo} from 'react'

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

    addEdge
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import './App.css';
import { saveGraphState, loadGraphState, clearGraphState, debounce } from './utils/storage';


function App() {
    const initialState = loadGraphState();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialState?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialState?.edges || []);
    const [isSaving, setIsSaving] = useState(false);

    const debouncedSave = useMemo(
        () => debounce((nodes: Node[], edges: Edge[]) => {
            saveGraphState(nodes, edges);
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 500);
        }, 1000),
        []
    );

    // Auto-save
    useEffect(() => {
        debouncedSave(nodes, edges);
    }, [nodes, edges, debouncedSave]);

    const onConnect = useCallback(
        (params) => {
            const newEdges = addEdge(params, edges);
            setEdges(newEdges);
        }, [edges, setEdges],
    );

    const onNodesChangeInternal = useCallback((changes) => {
        const changedNodes = applyNodeChanges(changes, nodes);
        setNodes(changedNodes);
        console.log("Changed nodes:", changedNodes);
    }, [
        nodes,
        setNodes
    ]);

    const onEdgesChangeInternal = useCallback((changes) => {
        const changedEdges = applyEdgeChanges(changes, edges);
        setEdges(changedEdges);
    }, [
        edges,
        setEdges
    ]);

    const addNode = useCallback(() => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            position: {x: Math.random() * 400, y: Math.random() * 400},
            data: {label: `Node ${nodes.length + 1}`}
        };
        setNodes((nds) => nds.concat(newNode));
    }, [
        nodes,
        setNodes
    ]);

    // Manual save
    const handleManualSave = useCallback(() => {
        saveGraphState(nodes, edges);
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    }, [nodes, edges]);

    // Clear
    const handleClearGraph = useCallback(() => {
        if (window.confirm('Are you sure you want to clear the graph? This will delete all nodes and edges.')) {
            setNodes([]);
            setEdges([]);
            clearGraphState();
        }
    }, [setNodes, setEdges]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh'
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
                            <button className="panel-button" onClick={addNode}>Add Node</button>
                            <button className="panel-button panel-button-primary" onClick={handleManualSave}>
                                Save Graph
                            </button>
                            <button className="panel-button panel-button-danger" onClick={handleClearGraph}>
                                Clear Graph
                            </button>
                            {isSaving && <span className="save-indicator">✓ Saved</span>}
                        </div>
                    </Panel>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    )
}

export default App;
