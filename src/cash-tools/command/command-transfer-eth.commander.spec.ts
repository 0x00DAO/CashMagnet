import { TestingModule } from '@nestjs/testing';
import { BigNumber, ethers } from 'ethers';
import { CommandTestFactory } from 'nest-commander-testing';
import { CommandTransferEthCommander } from './command-transfer-eth.commander';
import { CommandModule } from './command.module';

const transferTx = {
  nonce: 0,
  gasPrice: BigNumber.from('0x02540be400'),
  gasLimit: BigNumber.from('0x5208'),
  to: '0xC2977b39917B1Ca5aB4cD981Ea67Db758aDF187a',
  value: BigNumber.from('0x016345785d8a0000'),
  data: '0x',
  chainId: 97,
  v: 229,
  r: '0xb8c6dd5936ab88169f2effe95881124985a3592e1d265c03045c0115aea02761',
  s: '0x72727333e8f08ea6181745cd6b0df00a5e1e37765942c86e8eb634fd5a2fdfd2',
  from: '0x3f1914C88Dd604FdB78bc193073E192d80D4B3bf',
  hash: '0x47a818026ac3cebf97a95f636db838ca6c070bdc472bf52abcccc2f703e826d1',
  type: null,
  confirmations: 0,
  wait: jest.fn(),
};

describe('CommandTransferEthCommander', () => {
  let module: TestingModule;
  let command: CommandTransferEthCommander;

  beforeEach(async () => {
    module = await CommandTestFactory.createTestingCommand({
      imports: [CommandModule],
    }).compile();

    command = module.get<CommandTransferEthCommander>(
      CommandTransferEthCommander
    );
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    beforeEach(() => {
      command.transferEth = jest.fn().mockImplementation(() => transferTx);
    });
    it('should call the "run" method', async () => {
      const spawnSpy = jest.spyOn(command, 'run');
      await CommandTestFactory.run(module, [
        'cash-tools',
        'transfer-eth',
        '0.1',
        '--from',
        '0',
        '--to',
        '1',
      ]);

      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(spawnSpy).toHaveBeenCalledWith(['0.1'], {
        fromAddressIndex: '0',
        toAddressIndex: '1',
      });
    });

    it('run transfer path 0,1', async () => {
      const spawnSpy = jest.spyOn(command, 'run');
      const transferEthSpy = jest.spyOn(command, 'transferEth');

      await CommandTestFactory.run(module, [
        'cash-tools',
        'transfer-eth',
        '0.1',
      ]);

      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(transferEthSpy).toHaveBeenCalledTimes(1);
    });

    it('run transfer path 0,1,0', async () => {
      const spawnSpy = jest.spyOn(command, 'run');
      const transferEthSpy = jest.spyOn(command, 'transferEth');

      await CommandTestFactory.run(module, [
        'cash-tools',
        'transfer-eth',
        '0.1',
        '--transfer-path',
        '0,1,0',
      ]);

      expect(spawnSpy).toHaveBeenCalledTimes(1);
      expect(transferEthSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAccounts', () => {
    it('should return accounts', () => {
      const accounts = command.getAccounts();
      expect(accounts.length).toBeGreaterThan(0);
    });
  });

  describe('transferEth', () => {
    it.skip(
      'should transfer eth',
      async () => {
        const accounts = command.getAccounts();
        const from = accounts[0].privateKey;
        const to = accounts[1].privateKey;
        const amount = '0.1';
        const network = 'testnet';
        const provider = command.getProviderWithNetworkConfig(network);
        const tx = await command.transferEth(
          from,
          to,
          ethers.utils.parseEther(amount),
          provider
        );
        await tx.wait();
        console.log(tx);
      },
      30 * 1000
    );
  });

  describe('getTransferPath', () => {
    it.each([
      ['0,1,2,0', [0, 1, 2, 0]],
      ['0,1,2', [0, 1, 2]],
    ])('should return transfer path', (pathString, expected) => {
      const path = command.getTransferPathIndex(pathString);
      expect(path).toEqual(expected);
    });
  });

  describe('transferEthByPath', () => {
    beforeEach(() => {
      command.transferEth = jest.fn().mockImplementation(() => transferTx);
    });

    it('should transfer eth by path', async () => {
      const accounts = command.getAccounts();
      const amount = '0.1';
      const network = 'testnet';
      const provider = command.getProviderWithNetworkConfig(network);
      const transferPath = [0, 1, 2, 0];

      const transferEthSpy = jest.spyOn(command, 'transferEth');
      const tx = await command.transferEthByPath(
        amount,
        transferPath,
        accounts,
        provider
      );
      console.log(tx);

      expect(transferEthSpy).toHaveBeenCalledTimes(transferPath.length - 1);
    });
  });
});
