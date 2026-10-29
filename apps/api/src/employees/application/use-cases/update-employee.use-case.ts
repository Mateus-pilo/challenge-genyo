import { Inject, Injectable } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from '../employee-repository';
import {
  Employee,
  EmployeeInput,
  EmployeeNotFoundError,
} from '../../domain/employee';
import { normalizeAndValidateEmployee } from '../../domain/employee-rules';

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly employees: EmployeeRepository,
  ) {}

  async execute(id: string, input: EmployeeInput): Promise<Employee> {
    const employee = await this.employees.update(
      id,
      normalizeAndValidateEmployee(input),
    );
    if (!employee) {
      throw new EmployeeNotFoundError();
    }
    return employee;
  }
}
