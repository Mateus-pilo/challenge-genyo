import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  EmployeeNotFoundError,
  EmployeeValidationError,
} from '../../domain/employee';

@Catch(EmployeeValidationError, EmployeeNotFoundError)
export class EmployeesExceptionFilter implements ExceptionFilter {
  catch(
    exception: EmployeeValidationError | EmployeeNotFoundError,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof EmployeeNotFoundError) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json({ message: exception.message });
      return;
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      message: exception.message,
      errors: exception.fields,
    });
  }
}
