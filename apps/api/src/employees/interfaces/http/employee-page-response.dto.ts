import { ApiProperty } from '@nestjs/swagger';
import { EmployeeResponseDto } from './employee-response.dto';

export class EmployeePageResponseDto {
  @ApiProperty({ type: [EmployeeResponseDto] })
  items!: EmployeeResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 2 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;

  @ApiProperty({ example: 31 })
  activeCount!: number;
}
