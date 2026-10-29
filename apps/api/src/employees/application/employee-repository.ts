import { Employee, EmployeeInput } from '../domain/employee';

export const EMPLOYEE_REPOSITORY = Symbol('EMPLOYEE_REPOSITORY');

export interface EmployeePage {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  activeCount: number;
}

export interface EmployeeRepository {
  create(input: EmployeeInput): Promise<Employee>;
  findPage(page: number, limit: number): Promise<EmployeePage>;
  findById(id: string): Promise<Employee | null>;
  update(id: string, input: EmployeeInput): Promise<Employee | null>;
  delete(id: string): Promise<boolean>;
}
