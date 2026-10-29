import { Inject, Injectable } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from '../employee-repository';
import { Employee, EmployeeInput } from '../../domain/employee';
import { normalizeAndValidateEmployee } from '../../domain/employee-rules';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly employees: EmployeeRepository,
  ) {}

  execute(input: EmployeeInput): Promise<Employee> {
    return this.employees.create(normalizeAndValidateEmployee(input));
  }
}
