import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesService } from './application/employees.service';
import { EMPLOYEE_REPOSITORY } from './application/employee-repository';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { DeleteEmployeeUseCase } from './application/use-cases/delete-employee.use-case';
import { GetEmployeeUseCase } from './application/use-cases/get-employee.use-case';
import { ListEmployeesUseCase } from './application/use-cases/list-employees.use-case';
import { UpdateEmployeeUseCase } from './application/use-cases/update-employee.use-case';
import {
  EmployeeEntity,
  EmployeeSchema,
} from './infrastructure/persistence/employee.schema';
import { MongoEmployeeRepository } from './infrastructure/persistence/mongo-employee.repository';
import { EmployeesController } from './interfaces/http/employees.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeEntity.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    CreateEmployeeUseCase,
    ListEmployeesUseCase,
    GetEmployeeUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
    { provide: EMPLOYEE_REPOSITORY, useClass: MongoEmployeeRepository },
  ],
})
export class EmployeesModule {}
