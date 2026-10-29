import { ApiProperty } from '@nestjs/swagger';
import { ClosingFrequency, Employee } from '../../domain/employee';

export class EmployeeResponseDto implements Employee {
  @ApiProperty({ example: '65a1b2c3d4e5f67890123456' })
  id!: string;

  @ApiProperty({ example: 'Ana Silva' })
  name!: string;

  @ApiProperty({ example: '2024-01-15', format: 'date' })
  admissionDate!: string;

  @ApiProperty({ example: '2025-01-15', format: 'date', nullable: true })
  dismissalDate!: string | null;

  @ApiProperty({ example: '09:00' })
  workStartTime!: string;

  @ApiProperty({ example: '17:30' })
  workEndTime!: string;

  @ApiProperty({ enum: ClosingFrequency, example: ClosingFrequency.Monthly })
  closingFrequency!: ClosingFrequency;
}
