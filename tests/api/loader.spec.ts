import { init } from '../../src/loaders';
import { expressLoader } from '../../src/loaders/utils';

// 모의 'log' 메소드 생성
const mockLog = jest.fn();

// 모의 객체 및 함수 생성
jest.mock('../../src/loaders/utils', () => ({
  express: jest.fn(),
  expressLoader: jest.fn(),
  FileLogger: jest.fn().mockImplementation(() => ({
    log: mockLog
  }))
}));

describe('init function', () => {
  it('should initialize correctly', async () => {
    const app = {} as any; // express.Application의 모의 구현
    const config = {}; // 필요한 구성의 모의 구현

    await init(app, config);

    // expressLoader가 올바르게 호출되었는지 확인
    expect(expressLoader).toHaveBeenCalledWith(app, config);

    // 로그가 올바르게 기록되었는지 확인
    expect(mockLog).toHaveBeenCalledWith("Server loaders loading start... 🔥");
    expect(mockLog).toHaveBeenCalledWith("express loaded");
    expect(mockLog).toHaveBeenCalledWith("Server loaders loading End ✅");
  });
});
