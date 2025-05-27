import { Module } from '@nestjs/common';
import { EthController } from './eth.controller';
import { EthService } from './eth.service';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [EthController],
  providers: [EthService, PrismaService], // ✅ PrismaService goes here
})
export class EthModule {}
