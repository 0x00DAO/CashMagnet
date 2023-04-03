import { DefaultConfigProvider } from './default-config-provider.interface';

export interface DefaultConfig {
  /**
   * The name of the config
   */
  name: string;
  /**
   * The description of the config
   */
  description: string;
  /**
   * The providers of the config
   */
  providers: Map<string, DefaultConfigProvider>;
}
