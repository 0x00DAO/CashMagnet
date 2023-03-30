import { TestingModule } from '@nestjs/testing';
import { HDNode } from 'ethers/lib/utils';
import { CommandTestFactory } from 'nest-commander-testing';
import { HdWalletCreatePathCommander } from './hd-wallet-create-path.commander';
import { HdWalletModule } from './hd-wallet.module';

describe('HdWalletCreatePathCommander', () => {
  let commandInstance: TestingModule;
  let childProcess: HdWalletCreatePathCommander;

  beforeAll(async () => {
    commandInstance = await CommandTestFactory.createTestingCommand({
      imports: [HdWalletModule],
    }).compile();
    childProcess = commandInstance.get(HdWalletCreatePathCommander);
  });

  it('should call the "run" method', async () => {
    const spawnSpy = jest.spyOn(childProcess, 'run');
    await CommandTestFactory.run(commandInstance, [
      'create-path',
      'create',
      'echo Hello World!',
    ]);

    expect(spawnSpy).toHaveBeenCalledTimes(1);
  });

  describe('createPathWallet', () => {
    const rootExtendedKey =
      'xprv9s21ZrQH143K3h4aYCisQVkfbxVRKf9W6TcgMXjNyCXpHJuEtD1i6bfhtL6G3xVnYyYU3RUYGx2neUb9iaiJtSpZo7rPsLxWw4ES7zafqGq';
    const childExtendedKey_0 =
      'xprvA3nEyqraBLv6rpRXVrE8QTribSoxKZwzZjzy92JqqHdAVrKyu3BRFcz83S9eEQfvPWVKTnvbo6E9a2ELyyz6FJqeDj7VY6qCYa4RqZz9zgf';
    const childExtendedKey_0_0 =
      'xprvA56unUZpveBPuyKKAJqHNSPxjudcoRmacdnMuKeVnjdgRaLxh9WfKiUy3T4R7CEJzt72DKw7W3U9nRSzsc742XaBDU8uamKNU7RfLqnvegT';

    it('it is root path', async () => {
      const { wallet, path } = await childProcess.createPathWallet(
        rootExtendedKey,
        0,
        0,
      );

      const hdNode = wallet;
      expect(hdNode.publicKey).toEqual(
        '0x03b8fe3697bb39fe61705dfb6d7e34b2e7a2e3351c3fdbe1b1a1b0d7e208054c44',
      );
      expect(hdNode.index).toEqual(0);
      expect(hdNode.depth).toEqual(5);
      expect(hdNode.extendedKey).toEqual(childExtendedKey_0);

      expect(path).toEqual("m/44'/60'/0'/0/0");
    });

    it('it is child path', async () => {
      const { wallet, path } = await childProcess.createPathWallet(
        childExtendedKey_0,
        0,
        0,
      );

      const hdNode = wallet;
      const hdPublicKey =
        '0x034c10fcf23a3f8ed26146f606c83412ab2eceaf410ee65d4d01afdaf2abddff00';
      expect(hdNode.publicKey).toEqual(hdPublicKey);
      expect(hdNode.index).toEqual(0);
      expect(hdNode.depth).toEqual(6);
      expect(hdNode.extendedKey).toEqual(childExtendedKey_0_0);

      expect(path).toEqual('0');

      const walletRoot = HDNode.fromExtendedKey(rootExtendedKey);
      const walletFromRoot = walletRoot.derivePath("m/44'/60'/0'/0/0" + '/0');

      expect(walletFromRoot.extendedKey).toEqual(childExtendedKey_0_0);
      expect(walletFromRoot.publicKey).toEqual(hdPublicKey);
    });
  });
});
