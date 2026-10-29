import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar disponibilidade da API' })
  @ApiOkResponse({ schema: { example: { status: 'ok' } } })
  check(): { status: string } {
    return { status: 'ok' };
  }
}
