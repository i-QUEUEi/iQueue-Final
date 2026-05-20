/**
 * Centralized branch context for global state management
 * All pages consume this context to update based on selected branch
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_BRANCH_ID } from './branches';

interface BranchContextType {
  selectedBranchId: string;
  setSelectedBranchId: (branchId: string) => void;
  isLoading: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const BRANCH_STORAGE_KEY = 'selectedBranchId';

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(DEFAULT_BRANCH_ID);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(BRANCH_STORAGE_KEY);
    if (stored) {
      setSelectedBranchIdState(stored);
    }
  }, []);

  const setSelectedBranchId = useCallback((branchId: string) => {
    setIsLoading(true);
    
    // Simulate data fetch time
    setTimeout(() => {
      setSelectedBranchIdState(branchId);
      sessionStorage.setItem(BRANCH_STORAGE_KEY, branchId);
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <BranchContext.Provider value={{ selectedBranchId, setSelectedBranchId, isLoading }}>
      {children}
    </BranchContext.Provider>
  );
}

/**
 * Hook to access branch context
 * Usage: const { selectedBranchId, setSelectedBranchId } = useBranch();
 */
export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within BranchProvider');
  }
  return context;
}
