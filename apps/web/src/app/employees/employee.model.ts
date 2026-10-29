export enum ClosingFrequency {
  Monthly = 'Mensal',
  Bimonthly = 'Bimestral',
  Quarterly = 'Trimestral',
  Semiannual = 'Semestral',
  Annual = 'Anual',
}

export interface EmployeeInput {
  name: string;
  admissionDate: string;
  dismissalDate: string | null;
  workStartTime: string;
  workEndTime: string;
  closingFrequency: ClosingFrequency;
}

export interface Employee extends EmployeeInput {
  id: string;
}

export interface EmployeePage {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  activeCount: number;
}

export interface EmployeeSaveRequest {
  input: EmployeeInput;
  dailyHours: string | null;
}
