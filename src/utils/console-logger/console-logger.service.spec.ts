import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLoggerService } from './console-logger.service';

describe('ConsoleLoggerService', () => {
  let service: ConsoleLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsoleLoggerService],
    }).compile();

    service = module.get<ConsoleLoggerService>(ConsoleLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log', () => {
    const spy = jest.spyOn(service, 'handleLog');
    service.log('test');
    expect(spy).toBeCalledWith('test');
  });

  it('should log with prefix', () => {
    const spy = jest.spyOn(service, 'handleLog');
    service.logPrefix = 'prefix';
    service.log('test');
    expect(spy).toBeCalledWith('prefix', 'test');
  });
});
