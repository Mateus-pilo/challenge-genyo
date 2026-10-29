import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ClosingFrequency } from '../../domain/employee';

export type EmployeeDocument = HydratedDocument<EmployeeEntity>;

@Schema({ timestamps: true, versionKey: false })
export class EmployeeEntity {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true })
  admissionDate!: string;

  @Prop({ type: String, default: null })
  dismissalDate!: string | null;

  @Prop({ required: true })
  workStartTime!: string;

  @Prop({ required: true })
  workEndTime!: string;

  @Prop({ required: true, enum: Object.values(ClosingFrequency) })
  closingFrequency!: ClosingFrequency;
}

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeEntity);
