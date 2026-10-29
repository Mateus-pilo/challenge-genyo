import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeesService } from '../../application/employees.service';
import { EmployeeResponseDto } from './employee-response.dto';
import { CreateEmployeeDto } from './create-employee.dto';
import { UpdateEmployeeDto } from './update-employee.dto';
import { EmployeesExceptionFilter } from './employees-exception.filter';
import { ListEmployeesQueryDto } from './list-employees-query.dto';
import { EmployeePageResponseDto } from './employee-page-response.dto';

@Controller('employees')
@ApiTags('Funcionários')
@UseFilters(EmployeesExceptionFilter)
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar funcionário' })
  @ApiCreatedResponse({ type: EmployeeResponseDto })
  @ApiBadRequestResponse({ description: 'Os dados enviados são inválidos.' })
  create(@Body() input: CreateEmployeeDto) {
    return this.employees.create(input);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar funcionários por data de admissão crescente',
  })
  @ApiOkResponse({ type: EmployeePageResponseDto })
  list(@Query() query: ListEmployeesQueryDto) {
    return this.employees.list(query.page, query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar funcionário pelo identificador' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado.' })
  get(@Param('id') id: string) {
    return this.employees.get(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar funcionário' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiBadRequestResponse({ description: 'Os dados enviados são inválidos.' })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado.' })
  update(@Param('id') id: string, @Body() input: UpdateEmployeeDto) {
    return this.employees.update(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir funcionário' })
  @ApiNoContentResponse({ description: 'Funcionário excluído.' })
  @ApiNotFoundResponse({ description: 'Funcionário não encontrado.' })
  delete(@Param('id') id: string): Promise<void> {
    return this.employees.delete(id);
  }
}
