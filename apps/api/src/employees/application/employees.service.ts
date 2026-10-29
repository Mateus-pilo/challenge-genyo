import { Injectable } from '@nestjs/common';
import { Employee, EmployeeInput } from '../domain/employee';
import { EmployeePage } from './employee-repository';
import { CreateEmployeeUseCase } from './use-cases/create-employee.use-case';
import { DeleteEmployeeUseCase } from './use-cases/delete-employee.use-case';
import { GetEmployeeUseCase } from './use-cases/get-employee.use-case';
import { ListEmployeesUseCase } from './use-cases/list-employees.use-case';
import { UpdateEmployeeUseCase } from './use-cases/update-employee.use-case';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly createEmployee: CreateEmployeeUseCase,
    private readonly listEmployees: ListEmployeesUseCase,
    private readonly getEmployee: GetEmployeeUseCase,
    private readonly updateEmployee: UpdateEmployeeUseCase,
    private readonly deleteEmployee: DeleteEmployeeUseCase,
  ) {}

  create(input: EmployeeInput): Promise<Employee> {
    return this.createEmployee.execute(input);
  }

  list(page: number, limit: number): Promise<EmployeePage> {
    return this.listEmployees.execute(page, limit);
  }

  get(id: string): Promise<Employee> {
    return this.getEmployee.execute(id);
  }

  update(id: string, input: EmployeeInput): Promise<Employee> {
    return this.updateEmployee.execute(id, input);
  }

  delete(id: string): Promise<void> {
    return this.deleteEmployee.execute(id);
  }
}
