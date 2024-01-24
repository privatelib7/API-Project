import { jest } from '@jest/globals';
import { init } from '../../src/loaders'; // 모듈 경로는 실제 경로에 맞게 조정하세요.
import { expressLoader, logger } from '../../src/loaders/utils';

jest.mock('../../src/loaders/utils', () => ({
  expressLoader: jest.fn(),
  logger: {
    log: jest.fn()
  }
}));

describe('init', () => {
    it('initializes the server correctly', async () => {
        const mockApp = {} as any; // Express 애플리케이션에 대한 모의 구현

        await init(mockApp);

        expect(expressLoader).toHaveBeenCalledWith(mockApp);
        expect(logger.log).toHaveBeenCalledTimes(3);
        expect(logger.log).toHaveBeenNthCalledWith(1, "Server loaders loading start... 🔥");
        expect(logger.log).toHaveBeenNthCalledWith(2, "express loaded");
        expect(logger.log).toHaveBeenNthCalledWith(3, "Server loaders loading End ✅");
    });
});
