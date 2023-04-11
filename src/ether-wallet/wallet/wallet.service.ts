import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { DefaultConfigProvider } from '../../configs/default-config-provider.interface';
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
    const provider = this.getProviderConfig(network);
    if (!provider) {
      return null;
    }
    return this.getProvider(provider.rpcUrl);
  }

  getProviderConfig(network: string): DefaultConfigProvider {
    const providers = this.configService.get('networks');
    const provider = providers[network];
    if (!provider) {
      return null;
    }
    return provider;
  }
}
