/**
 * Centralized branch configuration system
 * Defines all government office branches and their metadata
 */

export type AgencyType = 'LTO' | 'SSS' | 'PhilHealth' | 'DFA' | 'PRC' | 'BIR' | 'DTI' | 'PSA' | 'COMELEC' | 'NBI' | 'PagIBIG';

export interface Branch {
  id: string;
  name: string;
  fullName: string;
  agency: AgencyType;
  address: string;
  city: string;
  province: string;
  hasBackendData: boolean; // Only LTO CDO has live data
  operatingHours?: string;
  contact?: string;
  services: string[];
}

export const BRANCHES: Record<string, Branch> = {
  'psa-region-x': {
    id: 'psa-region-x',
    name: 'PSA Region X',
    fullName: 'Philippine Statistics Authority PSA Region X',
    agency: 'PSA',
    address: 'Limketkai Center, Rosario Cres',
    city: 'Cagayan De Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Vital Records', 'Birth Certificate', 'Marriage Certificate', 'Death Certificate'],
  },
  'sss-main': {
    id: 'sss-main',
    name: 'SSS Main Branch',
    fullName: 'Social Security System SSS Cagayan de Oro Main Branch',
    agency: 'SSS',
    address: 'SSS Building, Carmen–Patag Road',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['SS Number Application', 'Contribution Verification', 'Loan Application', 'UMID Concerns'],
  },
  'sss-lapasan': {
    id: 'sss-lapasan',
    name: 'SSS Lapasan Branch',
    fullName: 'SSS Lapasan Branch',
    agency: 'SSS',
    address: 'Agora Road, Lapasan',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['SS Number Application', 'Contribution Verification', 'Loan Application', 'UMID Concerns'],
  },
  'philhealth-ro10': {
    id: 'philhealth-ro10',
    name: 'PhilHealth Regional Office X',
    fullName: 'PhilHealth Regional Office X',
    agency: 'PhilHealth',
    address: 'Gateway Tower 2, Limketkai Center, Claro M. Recto Avenue',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Membership Registration', 'MDR Update', 'Claims Assistance', 'ID Printing'],
  },
  'philhealth-lhio-cdo': {
    id: 'philhealth-lhio-cdo',
    name: 'PhilHealth LHIO CDO',
    fullName: 'PhilHealth LHIO CDO',
    agency: 'PhilHealth',
    address: 'G/F South Concourse, Limketkai Mall, Brgy. 31',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Membership Registration', 'MDR Update', 'Claims Assistance', 'ID Printing'],
  },
  'philhealth-carmen': {
    id: 'philhealth-carmen',
    name: 'PhilHealth Carmen Business Center',
    fullName: 'PhilHealth Carmen Business Center',
    agency: 'PhilHealth',
    address: 'G/F Stary Building, Max Suniel Street, Barangay Carmen',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Membership Registration', 'MDR Update', 'Claims Assistance', 'ID Printing'],
  },
  'bir-rdo98': {
    id: 'bir-rdo98',
    name: 'BIR RDO 98',
    fullName: 'Bureau of Internal Revenue RDO 98',
    agency: 'BIR',
    address: 'BIR Building, Westbound Terminal Compound, Bulua',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['TIN Registration', 'RDO Transfer', 'Taxpayer Verification', 'Tax Clearance'],
  },
  'lto-cdo-district': {
    id: 'lto-cdo-district',
    name: 'LTO Cagayan de Oro District Office',
    fullName: 'Land Transportation Office LTO Cagayan de Oro District Office',
    agency: 'LTO',
    address: 'JV Seriña Street, Carmen',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: true, // ONLY THIS BRANCH HAS LIVE DATA
    services: ["Driver's License Renewal", 'Student Permit', 'Motor Vehicle Registration', 'Plate Release', 'License Verification'],
  },
  'lto-limketkai': {
    id: 'lto-limketkai',
    name: 'LTO Licensing Center - Limketkai',
    fullName: 'LTO Licensing Center - Limketkai',
    agency: 'LTO',
    address: 'Limketkai Center',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ["Driver's License Renewal", 'Student Permit', 'Motor Vehicle Registration', 'Plate Release'],
  },
  'pagibig-cdo': {
    id: 'pagibig-cdo',
    name: 'Pag-IBIG Fund CDO Branch',
    fullName: 'Pag-IBIG Fund CDO Branch',
    agency: 'PagIBIG',
    address: 'J.R. Borja Extension, Carmen',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['MDF Registration', 'Housing Loan', 'Loyalty Card Plus', 'Contribution Payment'],
  },
  'prc-cdo': {
    id: 'prc-cdo',
    name: 'PRC Cagayan de Oro',
    fullName: 'Professional Regulation Commission PRC Cagayan de Oro',
    agency: 'PRC',
    address: '2nd Floor, Skypark, Limketkai Mall',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Board Exam Application', 'License Renewal', 'License Verification', 'Certificate of Good Standing'],
  },
  'nbi-cdo': {
    id: 'nbi-cdo',
    name: 'NBI CDO District Office',
    fullName: 'National Bureau of Investigation NBI CDO District Office',
    agency: 'NBI',
    address: 'Capt. Vicente Roa Street',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['NBI Clearance', 'Police Clearance Coordination', 'Document Authentication'],
  },
  'comelec-cdo': {
    id: 'comelec-cdo',
    name: 'COMELEC CDO',
    fullName: 'Commission on Elections COMELEC CDO',
    agency: 'COMELEC',
    address: 'City Hall Compound',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Voter Registration', 'Voter Verification', 'Election Information'],
  },
  'dti-region-x': {
    id: 'dti-region-x',
    name: 'DTI Region X',
    fullName: 'Department of Trade and Industry DTI Region X',
    agency: 'DTI',
    address: 'NACIDA Building, Corrales Avenue corner Antonio Luna Street',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Business Registration', 'Business Name Verification', 'Enterprise Development'],
  },
  'dfa-cdo': {
    id: 'dfa-cdo',
    name: 'DFA Consular Office CDO',
    fullName: 'Department of Foreign Affairs DFA Consular Office CDO',
    agency: 'DFA',
    address: 'SM Downtown Premier, Claro M. Recto Avenue',
    city: 'Cagayan de Oro City',
    province: 'Misamis Oriental',
    hasBackendData: false,
    services: ['Passport Processing', 'Passport Renewal', 'Travel Document Issuance'],
  },
};

export const BRANCH_IDS = Object.keys(BRANCHES) as (keyof typeof BRANCHES)[];

// Default branch (LTO CDO - the only branch with backend data)
export const DEFAULT_BRANCH_ID = 'lto-cdo-district';

/**
 * Get a branch by ID
 */
export function getBranch(id: string): Branch | null {
  return BRANCHES[id as keyof typeof BRANCHES] || null;
}

/**
 * Get all branches for a specific agency
 */
export function getBranchesByAgency(agency: AgencyType): Branch[] {
  return Object.values(BRANCHES).filter(branch => branch.agency === agency);
}

/**
 * Check if a branch has backend data available
 */
export function hasBackendData(branchId: string): boolean {
  const branch = getBranch(branchId);
  return branch?.hasBackendData ?? false;
}

/**
 * Get services for a specific branch
 */
export function getBranchServices(branchId: string): string[] {
  const branch = getBranch(branchId);
  return branch?.services ?? [];
}

/**
 * Check if a branch is the active data branch (LTO CDO - only branch with live operational data)
 * Used to determine if admin pages should display live data or "Coming Soon" state
 */
export function isActiveDataBranch(branchId: string): boolean {
  return branchId === DEFAULT_BRANCH_ID;
}
