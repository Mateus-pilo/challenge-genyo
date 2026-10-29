import { Inject, Injectable } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from '../employee-repository';
import { Employee, EmployeeNotFoundError } from '../../domain/employee';

@Injectable()
export class GetEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly employees: EmployeeRepository,
  ) {}

  async execute(id: string): Promise<Employee> {
    const employee = await this.employees.findById(id);
    if (!employee) {
      throw new EmployeeNotFoundError();
    }
    return employee;
  }
}
