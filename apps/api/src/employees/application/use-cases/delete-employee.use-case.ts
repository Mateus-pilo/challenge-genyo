import { Inject, Injectable } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  EmployeeRepository,
} from '../employee-repository';
import { EmployeeNotFoundError } from '../../domain/employee';

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly employees: EmployeeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    if (!(await this.employees.delete(id))) {
      throw new EmployeeNotFoundError();
    }
  }
}
