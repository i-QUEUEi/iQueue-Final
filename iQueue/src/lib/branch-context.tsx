/**
 * Centralized branch context for global state management
 * All pages consume this context to update based on selected branch
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_BRANCH_ID, loadPersistedBranches, persistBranches } from './branches';
import type { Branch } from './branches';

interface BranchContextType {
  selectedBranchId: string;
  setSelectedBranchId: (branchId: string) => void;
  isLoading: boolean;
  branches: Branch[];
  addBranch: (branch: Partial<Branch>) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (branchId: string) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const BRANCH_STORAGE_KEY = 'selectedBranchId';

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(DEFAULT_BRANCH_ID);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const storedBranchId = sessionStorage.getItem(BRANCH_STORAGE_KEY);
    if (storedBranchId) {
      setSelectedBranchIdState(storedBranchId);
    }

    const persisted = loadPersistedBranches();
    setBranches(persisted);
  }, []);

  const setSelectedBranchId = useCallback((branchId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedBranchIdState(branchId);
      sessionStorage.setItem(BRANCH_STORAGE_KEY, branchId);
      setIsLoading(false);
    }, 300);
  }, []);

  const addBranch = useCallback((partial: Partial<Branch>) => {
    setBranches((current) => {
      const generatedId = (partial.name || 'branch').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const uniqueId = current.some((b) => b.id === generatedId)
        ? `${generatedId}-${Date.now()}`
        : generatedId;
      const nextBranch: Branch = {
        id: uniqueId,
        name: partial.name || 'New Branch',
        fullName: partial.fullName || partial.name || 'New Branch',
        agency: partial.agency || 'Other',
        address: partial.address || '',
        city: partial.city || '',
        province: partial.province || '',
        hasBackendData: false,
        status: partial.status || 'Pending',
        description: partial.description || '',
        operatingHours: partial.operatingHours || '',
        contact: partial.contact || '',
        logoUrl: partial.logoUrl,
        services: partial.services || [],
      };
      const next = [...current, nextBranch];
      persistBranches(next);
      return next;
    });
  }, []);

  const updateBranch = useCallback((updated: Branch) => {
    setBranches((current) => {
      const next = current.map((branch) => (branch.id === updated.id ? updated : branch));
      persistBranches(next);
      return next;
    });
  }, []);

  const deleteBranch = useCallback((branchId: string) => {
    setBranches((current) => {
      const next = current.filter((branch) => branch.id !== branchId);
      if (branchId === selectedBranchId) {
        setSelectedBranchIdState(DEFAULT_BRANCH_ID);
        sessionStorage.setItem(BRANCH_STORAGE_KEY, DEFAULT_BRANCH_ID);
      }
      persistBranches(next);
      return next;
    });
  }, [selectedBranchId]);

  return (
    <BranchContext.Provider
      value={{
        selectedBranchId,
        setSelectedBranchId,
        isLoading,
        branches,
        addBranch,
        updateBranch,
        deleteBranch,
      }}
    >
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
