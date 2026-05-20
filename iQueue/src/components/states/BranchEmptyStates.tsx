import { AlertCircle, Clock } from 'lucide-react';

interface EmptyStateProps {
  branchName: string;
  type?: 'no-data' | 'coming-soon';
}

export function BranchEmptyState({ branchName, type = 'no-data' }: EmptyStateProps) {
  if (type === 'coming-soon') {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
        <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h3>
        <p className="text-sm text-blue-700 mb-4">
          {branchName} integration is pending. This branch will be available soon.
        </p>
        <p className="text-xs text-blue-600">
          Currently, operational data is only available for LTO Cagayan de Oro District Office.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-amber-900 mb-2">No Data Available</h3>
      <p className="text-sm text-amber-700 mb-4">
        {branchName} does not have operational data yet.
      </p>
      <p className="text-xs text-amber-600">
        Currently, operational data is only available for LTO Cagayan de Oro District Office.
      </p>
    </div>
  );
}

/**
 * Empty table row component
 */
export function EmptyTableRow({ colSpan = 1, message = 'No data available' }: { colSpan?: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-8 text-gray-500 text-sm">
        {message}
      </td>
    </tr>
  );
}

/**
 * Empty chart state
 */
export function EmptyChartState({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="h-64 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function BranchLoadingState() {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" />
          <p className="text-sm font-medium text-gray-900">Switching branches...</p>
        </div>
      </div>
    </div>
  );
}
