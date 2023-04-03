export interface DefaultConfigProvider {
  name: string;
  network: string;
  rpcUrl: string;
  chainId: number;
  currencySymbol: string;
  blockExplorerUrl: string;
  webSocketUrl: string;
}
