import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { BRANCHES, getBranch } from '@/lib/branches';
import { useBranch } from '@/lib/branch-context';

export function BranchSelector() {
  const { selectedBranchId, setSelectedBranchId } = useBranch();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedBranch = getBranch(selectedBranchId);

  const handleSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="px-4 py-4 border-b border-gray-200">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full cursor-pointer flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center gap-2 flex-1 text-left">
            <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Branch</p>
              <p className="text-sm font-medium text-gray-900 truncate">{selectedBranch?.name}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {Object.entries(BRANCHES).map(([id, branch]) => (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={`w-full cursor-pointer text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 last:border-b-0 ${
                  selectedBranchId === id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${selectedBranchId === id ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${selectedBranchId === id ? 'text-blue-900' : 'text-gray-900'}`}>
                      {branch.name}
                    </p>
                    <p className="text-xs text-gray-600">{branch.agency}</p>
                    <p className="text-xs text-gray-500 mt-1">{branch.address}</p>
                    {!branch.hasBackendData && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                        Coming Soon
                      </span>
                    )}
                    {branch.hasBackendData && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                        Live Data
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
