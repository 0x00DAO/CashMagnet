export interface DefaultConfigAccount {
  name: string;
  type: 'privateKey' | 'hdWallet';
  value: any;
}

export interface DefaultConfigAccountPrivateKey extends DefaultConfigAccount {
  type: 'privateKey';
  value: string[];
}
export interface DefaultConfigAccountHDWallet extends DefaultConfigAccount {
  type: 'hdWallet';
  value: {
    extendedKey: string;
    password: string;
    initialIndex: number;
    count: number;
  };
}

export type DefaultConfigAccountConfig =
  | DefaultConfigAccountPrivateKey[]
  | DefaultConfigAccountHDWallet[]
  | DefaultConfigAccount[];
