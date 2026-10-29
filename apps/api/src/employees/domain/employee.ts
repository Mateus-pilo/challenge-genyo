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

export class EmployeeValidationError extends Error {
  constructor(readonly fields: Record<string, string>) {
    super(Object.values(fields)[0] ?? 'Os dados do funcionário são inválidos.');
    this.name = 'EmployeeValidationError';
  }
}

export class EmployeeNotFoundError extends Error {
  constructor() {
    super('Funcionário não encontrado.');
    this.name = 'EmployeeNotFoundError';
  }
}
