import { ConfigService } from './config.service';

const configString = `
name: Magnet
description: Configuration for Cash Magnet
providers:
  # Common mainnet configuration
  mainnet:
    name: zkSyncEra
    network: mainnet
    rpcUrl: https://mainnet.era.zksync.io
    chainId: 324
    currencySymbol: ETH
    blockExplorerUrl: https://explorer.zksync.io/
    webSocketUrl: wss://mainnet.era.zksync.io/ws
  # Common testnet configuration
  testnet:
    name: zkSyncEra
    network: testnet
    rpcUrl: https://testnet.era.zksync.dev
    chainId: 280
    currencySymbol: ETH
    blockExplorerUrl: https://goerli.explorer.zksync.io/
    webSocketUrl: wss://testnet.era.zksync.dev/ws
  # zkSync Mainnet
  zkSyncEra-MainNet:
    name: zkSyncEra
    network: mainnet
    rpcUrl: https://mainnet.era.zksync.io
    chainId: 324
    currencySymbol: ETH
    blockExplorerUrl: https://explorer.zksync.io/
    webSocketUrl: wss://mainnet.era.zksync.io/ws
  # zkSync Testnet
  zkSyncEra-TesNet:
    name: zkSyncEra
    network: testnet
    rpcUrl: https://testnet.era.zksync.dev
    chainId: 280
    currencySymbol: ETH
    blockExplorerUrl: https://goerli.explorer.zksync.io/
    webSocketUrl: wss://testnet.era.zksync.dev/ws
`;

export const configServiceData = require('js-yaml').load(configString);

export const configServiceMock = {
  provide: ConfigService,
  useValue: {
    get: jest.fn().mockImplementation((key: string) => {
      return configServiceData[key];
    }),
  },
};
