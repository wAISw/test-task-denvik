import type { Node, Edge } from '@xyflow/react';

const NODES_STORAGE_KEY = 'react-flow-nodes';
const EDGES_STORAGE_KEY = 'react-flow-edges';

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

export const saveNodes = (nodes: Node[]): void => {
  try {
    localStorage.setItem(NODES_STORAGE_KEY, JSON.stringify(nodes));
  } catch (error) {
    console.error('Failed to save nodes:', error);
  }
};

export const saveEdges = (edges: Edge[]): void => {
  try {
    localStorage.setItem(EDGES_STORAGE_KEY, JSON.stringify(edges));
  } catch (error) {
    console.error('Failed to save edges:', error);
  }
};

export const loadGraphState = (): GraphState | null => {
  try {
    const storedNodes = localStorage.getItem(NODES_STORAGE_KEY);
    const storedEdges = localStorage.getItem(EDGES_STORAGE_KEY);

    if (!storedNodes && !storedEdges) return null;

    const state: GraphState = {
      nodes: storedNodes ? JSON.parse(storedNodes) : [],
      edges: storedEdges ? JSON.parse(storedEdges) : [],
      timestamp: Date.now(),
    };

    return state;
  } catch (error) {
    console.error('Failed to load graph state:', error);
    return null;
  }
};

export const clearGraphState = (): void => {
  try {
    localStorage.removeItem(NODES_STORAGE_KEY);
    localStorage.removeItem(EDGES_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear graph state:', error);
  }
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
