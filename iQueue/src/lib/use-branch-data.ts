/**
 * Hook to check if current branch has backend data
 * and provide branch-aware data fetching
 */

import { useBranch } from './branch-context';
import { getBranch } from './branches';

export function useBranchData() {
  const { selectedBranchId, branches } = useBranch();
  const branch = branches.find((item) => item.id === selectedBranchId) || getBranch(selectedBranchId);
  const hasBranchData = branch?.hasBackendData ?? false;

  return {
    selectedBranchId,
    branch,
    hasBranchData,
    branchName: branch?.name || 'Unknown Branch',
    isLTOCDO: selectedBranchId === 'lto-cdo-district',
  };
}
