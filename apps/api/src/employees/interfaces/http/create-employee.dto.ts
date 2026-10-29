import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClosingFrequency } from '../../domain/employee';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Ana Silva', description: 'Nome sem números.' })
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do funcionário.' })
  name!: string;

  @ApiProperty({ example: '2024-01-15', format: 'date' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Use o formato AAAA-MM-DD.' })
  admissionDate!: string;

  @ApiPropertyOptional({
    example: '2025-01-15',
    format: 'date',
    nullable: true,
  })
  @IsOptional()
  @ApiProperty({ example: '09:00', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Use o formato AAAA-MM-DD.' })
  dismissalDate!: string | null;

  @ApiProperty({ example: '17:30', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Use o formato HH:mm.' })
  workStartTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Use o formato HH:mm.' })
  workEndTime!: string;

  @ApiProperty({ enum: ClosingFrequency, example: ClosingFrequency.Monthly })
  @IsEnum(ClosingFrequency, { message: 'Selecione uma periodicidade válida.' })
  closingFrequency!: ClosingFrequency;
}
