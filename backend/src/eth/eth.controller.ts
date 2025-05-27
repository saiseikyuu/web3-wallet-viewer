import { Controller, Get, Param } from '@nestjs/common';
import { EthService } from './eth.service';

@Controller('eth')
export class EthController {
  constructor(private ethService: EthService) {}

  @Get(':address')
  getInfo(@Param('address') address: string) {
    return this.ethService.getAccountInfo(address);
  }
}
