import { DefaultConfigCacheTools } from './default-config-cache-tools.interface';
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
   * The version of the config
   */
  version: string;

  /**
   * The cache tools of the config
   */
  cashTools: DefaultConfigCacheTools;
  /**
   * The networks of the config
   */
  networks: Map<string, DefaultConfigProvider>;
}
