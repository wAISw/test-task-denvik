import type { Node, Edge } from '@xyflow/react';

const STORAGE_KEY = 'react-flow-graph-state';

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

export const saveGraphState = (nodes: Node[], edges: Edge[]): void => {
  try {
    const state: GraphState = {
      nodes,
      edges,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save graph state:', error);
  }
};

export const loadGraphState = (): GraphState | null => {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (!storedState) return null;
    
    const state: GraphState = JSON.parse(storedState);
    return state;
  } catch (error) {
    console.error('Failed to load graph state:', error);
    return null;
  }
};

export const clearGraphState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
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