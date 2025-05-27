import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EthModule } from './eth/eth.module';
import { PrismaService } from './prisma/prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), EthModule],
  providers: [PrismaService],
})
export class AppModule {}
