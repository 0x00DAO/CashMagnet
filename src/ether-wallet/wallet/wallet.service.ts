import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '../../utils/config/config.service';

@Injectable()
export class WalletService {
  @Inject()
  private readonly configService: ConfigService;

  getBalance() {
    return 'getBalance';
  }

  getProvider(url: string): ethers.providers.Provider {
    return new ethers.providers.JsonRpcProvider(url);
  }

  getProviderWithNetworkConfig(network: string): ethers.providers.Provider {
    const providers = this.configService.get('providers');
    const provider = providers[network];
    if (!provider) {
      return null;
    }
    return this.getProvider(provider.rpcUrl);
  }
}
