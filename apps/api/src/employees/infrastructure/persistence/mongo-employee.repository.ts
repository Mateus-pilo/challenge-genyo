import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  EmployeePage,
  EmployeeRepository,
} from '../../application/employee-repository';
import { Employee, EmployeeInput } from '../../domain/employee';
import { EmployeeDocument, EmployeeEntity } from './employee.schema';

@Injectable()
export class MongoEmployeeRepository implements EmployeeRepository {
  constructor(
    @InjectModel(EmployeeEntity.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(input: EmployeeInput): Promise<Employee> {
    const document = await this.employeeModel.create(input);
    return this.toEmployee(document);
  }

  async findPage(page: number, limit: number): Promise<EmployeePage> {
    const [total, activeCount] = await Promise.all([
      this.employeeModel.countDocuments().exec(),
      this.employeeModel.countDocuments({ dismissalDate: null }).exec(),
    ]);
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.min(page, Math.max(totalPages, 1));
    const documents = await this.employeeModel
      .find()
      .sort({ admissionDate: 1, name: 1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .exec();

    return {
      items: documents.map((document) => this.toEmployee(document)),
      total,
      page: currentPage,
      limit,
      totalPages,
      activeCount,
    };
  }

  async findById(id: string): Promise<Employee | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.employeeModel.findById(id).exec();
    return document ? this.toEmployee(document) : null;
  }

  async update(id: string, input: EmployeeInput): Promise<Employee | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const document = await this.employeeModel
      .findByIdAndUpdate(id, input, { new: true, runValidators: true })
      .exec();
    return document ? this.toEmployee(document) : null;
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.employeeModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private toEmployee(document: EmployeeDocument): Employee {
    return {
      id: document._id.toString(),
      name: document.name,
      admissionDate: document.admissionDate,
      dismissalDate: document.dismissalDate,
      workStartTime: document.workStartTime,
      workEndTime: document.workEndTime,
      closingFrequency: document.closingFrequency,
    };
  }
}
