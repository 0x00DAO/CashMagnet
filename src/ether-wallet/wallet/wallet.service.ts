import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class WalletService {
  getBalance() {
    return 'getBalance';
  }

  getProvider(url: string): ethers.providers.Provider {
    return new ethers.providers.JsonRpcProvider(url);
  }
}
