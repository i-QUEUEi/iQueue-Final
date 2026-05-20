import { useState } from 'react';
import { ChevronDown, Building2 } from 'lucide-react';
import { BRANCHES, getBranch } from '@/lib/branches';
import { useBranch } from '@/lib/branch-context';

export function HeaderBranchSelector() {
  const { selectedBranchId, setSelectedBranchId } = useBranch();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedBranch = getBranch(selectedBranchId);

  const handleSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredBranches = Object.entries(BRANCHES).filter(([, branch]) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      branch.name.toLowerCase().includes(searchLower) ||
      branch.agency.toLowerCase().includes(searchLower) ||
      branch.city.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        <Building2 className="w-4 h-4 text-blue-600" />
        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Branch</p>
          <p className="text-sm font-semibold text-gray-900">{selectedBranch?.name || 'Select'}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50 w-72">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100 sticky top-0 bg-white">
            <input
              type="text"
              placeholder="Search branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Branch list */}
          <div className="max-h-96 overflow-y-auto">
            {filteredBranches.length > 0 ? (
              filteredBranches.map(([id, branch]) => (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 last:border-b-0 ${
                    selectedBranchId === id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                        selectedBranchId === id ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          selectedBranchId === id ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {branch.name}
                      </p>
                      <p className="text-xs text-gray-600">{branch.address}</p>
                      <p className="text-xs text-gray-500">{branch.city}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {branch.agency}
                        </span>
                        {branch.hasBackendData ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            Live Data
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No branches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
