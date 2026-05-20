/**
 * Hook to check if current branch has backend data
 * and provide branch-aware data fetching
 */

import { useBranch } from './branch-context';
import { hasBackendData, getBranch } from './branches';

export function useBranchData() {
  const { selectedBranchId } = useBranch();
  const branch = getBranch(selectedBranchId);
  const hasBranchData = hasBackendData(selectedBranchId);

  return {
    selectedBranchId,
    branch,
    hasBranchData,
    branchName: branch?.name || 'Unknown Branch',
    isLTOCDO: selectedBranchId === 'lto-cdo-district',
  };
}
