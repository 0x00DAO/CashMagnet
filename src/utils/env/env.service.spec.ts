import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from './env.service';
import { EnvDataMock } from './env.service.spec.mock';

describe('EnvService', () => {
  let service: EnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvService],
    }).compile();

    service = module.get<EnvService>(EnvService);
    service.loadEnv = jest.fn().mockReturnValue(EnvDataMock);
    service.reloadEnv();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a value', () => {
    expect(service.get('BASIC')).toEqual('basic');
    expect(service.get('BASIC_EXPAND')).toEqual('basic');
    expect(service.get('BASIC_EXPAND_SIMPLE')).toEqual('basic');
  });
});
