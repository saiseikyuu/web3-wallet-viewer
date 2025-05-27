import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class EthService {
  private provider: ethers.JsonRpcProvider;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.provider = new ethers.JsonRpcProvider(
      this.config.get<string>('RPC_URL'),
    );
  }

  async getAccountInfo(address: string) {
    const [feeData, blockNumber, balance] = await Promise.all([
      this.provider.getFeeData(),
      this.provider.getBlockNumber(),
      this.provider.getBalance(address),
    ]);

    const gasPrice = feeData.gasPrice ?? 0n;

    const data = {
      address,
      gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
      blockNumber,
      balance: ethers.formatEther(balance),
    };

    await this.prisma.lookup.create({
      data: {
        address: data.address,
        gasPrice: data.gasPrice,
        blockNumber: data.blockNumber,
        balance: data.balance,
      },
    });

    return data;
  }
}
