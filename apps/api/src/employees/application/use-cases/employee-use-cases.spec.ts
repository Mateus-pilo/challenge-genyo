import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  ClosingFrequency,
  Employee,
  EmployeeInput,
  EmployeeNotFoundError,
  EmployeeValidationError,
} from '../../domain/employee';
import { EmployeePage, EmployeeRepository } from '../employee-repository';
import { CreateEmployeeUseCase } from './create-employee.use-case';
import { DeleteEmployeeUseCase } from './delete-employee.use-case';
import { GetEmployeeUseCase } from './get-employee.use-case';
import { ListEmployeesUseCase } from './list-employees.use-case';
import { UpdateEmployeeUseCase } from './update-employee.use-case';

const employeeInput: EmployeeInput = {
  name: ' Ana Silva ',
  admissionDate: '2024-01-01',
  dismissalDate: '2024-01-03',
  workStartTime: '09:00',
  workEndTime: '17:30',
  closingFrequency: ClosingFrequency.Monthly,
};

const employee: Employee = {
  ...employeeInput,
  name: 'Ana Silva',
  id: 'employee-id',
};

const employeePage: EmployeePage = {
  items: [employee],
  total: 21,
  page: 2,
  limit: 10,
  totalPages: 3,
  activeCount: 14,
};

describe('employee use cases', () => {
  let repository: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findPage: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('CreateEmployeeUseCase', () => {
    it('validates, normalizes, and creates the employee', async () => {
      repository.create.mockResolvedValue(employee);
      const useCase = new CreateEmployeeUseCase(repository);

      await expect(useCase.execute(employeeInput)).resolves.toEqual(employee);
      expect(repository.create).toHaveBeenCalledWith({
        ...employeeInput,
        name: 'Ana Silva',
      });
    });

    it('rejects invalid input without calling the repository', async () => {
      const useCase = new CreateEmployeeUseCase(repository);

      expect(() =>
        useCase.execute({ ...employeeInput, name: 'Ana 2' }),
      ).toThrow(EmployeeValidationError);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('DeleteEmployeeUseCase', () => {
    it('deletes an existing employee', async () => {
      repository.delete.mockResolvedValue(true);
      const useCase = new DeleteEmployeeUseCase(repository);

      await expect(useCase.execute(employee.id)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(employee.id);
    });

    it('throws when the employee does not exist', async () => {
      repository.delete.mockResolvedValue(false);
      const useCase = new DeleteEmployeeUseCase(repository);

      await expect(useCase.execute(employee.id)).rejects.toBeInstanceOf(
        EmployeeNotFoundError,
      );
    });
  });

  describe('GetEmployeeUseCase', () => {
    it('returns the requested employee', async () => {
      repository.findById.mockResolvedValue(employee);
      const useCase = new GetEmployeeUseCase(repository);

      await expect(useCase.execute(employee.id)).resolves.toEqual(employee);
      expect(repository.findById).toHaveBeenCalledWith(employee.id);
    });

    it('throws when the employee does not exist', async () => {
      repository.findById.mockResolvedValue(null);
      const useCase = new GetEmployeeUseCase(repository);

      await expect(useCase.execute(employee.id)).rejects.toBeInstanceOf(
        EmployeeNotFoundError,
      );
    });
  });

  describe('ListEmployeesUseCase', () => {
    it('forwards pagination and returns the repository page', async () => {
      repository.findPage.mockResolvedValue(employeePage);
      const useCase = new ListEmployeesUseCase(repository);

      await expect(useCase.execute(2, 10)).resolves.toEqual(employeePage);
      expect(repository.findPage).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('UpdateEmployeeUseCase', () => {
    it('validates, normalizes, and updates the employee', async () => {
      repository.update.mockResolvedValue(employee);
      const useCase = new UpdateEmployeeUseCase(repository);

      await expect(
        useCase.execute(employee.id, employeeInput),
      ).resolves.toEqual(employee);
      expect(repository.update).toHaveBeenCalledWith(employee.id, {
        ...employeeInput,
        name: 'Ana Silva',
      });
    });

    it('throws when the employee does not exist', async () => {
      repository.update.mockResolvedValue(null);
      const useCase = new UpdateEmployeeUseCase(repository);

      await expect(
        useCase.execute(employee.id, employeeInput),
      ).rejects.toBeInstanceOf(EmployeeNotFoundError);
    });

    it('rejects invalid input without calling the repository', async () => {
      const useCase = new UpdateEmployeeUseCase(repository);

      await expect(
        useCase.execute(employee.id, { ...employeeInput, name: 'Ana 2' }),
      ).rejects.toBeInstanceOf(EmployeeValidationError);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
