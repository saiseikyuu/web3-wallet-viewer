import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma/prisma.service';
import { PrismaModule } from './prisma/prisma/prisma.module';
import { EthModule } from './eth/eth.module';

@Module({
  imports: [PrismaModule, EthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
