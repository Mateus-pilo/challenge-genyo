import { Inject, Injectable } from '@nestjs/common';
import {
  EMPLOYEE_REPOSITORY,
  EmployeePage,
  EmployeeRepository,
} from '../employee-repository';

@Injectable()
export class ListEmployeesUseCase {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY) private readonly employees: EmployeeRepository,
  ) {}

  execute(page: number, limit: number): Promise<EmployeePage> {
    return this.employees.findPage(page, limit);
  }
}
