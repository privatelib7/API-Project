// import { setCache, getCache, cacheMiddleware } from '../../src/api/reqMiddlewares'; // 실제 파일 경로로 변경해야 합니다.
const { setCache, getCache, cacheMiddleware, clearCache } = require('../../src/api/reqMiddlewares')

describe('Cache Functionality Tests', () => {
  // 캐시 객체를 정의합니다.
  let cache = {};

  // 각 테스트 전에 캐시를 초기화합니다.
  beforeEach(() => {
    cache = {};
    jest.clearAllMocks();
  });

  // setCache 함수 테스트
  describe('setCache function', () => {
    it('should store data with expiry', () => {
      const key = 'testKey';
      const data = 'testData';
      const ttl = 10000; // 10초

      setCache(key, data, ttl);

      expect(getCache(key)).toBeDefined();
      expect(getCache(key).data).toBe(data);
      expect(getCache(key).expiry).toBeGreaterThan(Date.now());
    });
  });

  // getCache 함수 테스트
  describe('getCache function', () => {
    it('should retrieve data if not expired', () => {
      const key = 'testKey';
      const testData = 'testData';
      setCache(key, testData, 10000);

      expect(getCache(key).data).toBe(testData);
    });

    it('should return null if expired', () => {
      const key = 'expiredKey';
      setCache(key, 'testData', -10000); // 과거로 설정하여 만료

      expect(getCache(key)).toBeNull();
    });
  });

  // cacheMiddleware 함수 테스트
  describe('cacheMiddleware function', () => {
    let mockReq, mockRes, nextFunction;

    beforeEach(() => {
      clearCache();
      mockReq = { originalUrl: '/test' };
      mockRes = { send: jest.fn(), sendResponse: jest.fn() };
      nextFunction = jest.fn();
    });

    it('should return cached data for cache hit', () => {
      setCache('/test', 'cachedData', 10000);
      const middleware = cacheMiddleware(10000);

      middleware(mockReq, mockRes, nextFunction);

      expect(mockRes.send).toHaveBeenCalledWith('cachedData');
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should proceed to next middleware for cache miss', () => {
      const middleware = cacheMiddleware(10000);

      middleware(mockReq, mockRes, nextFunction);

      expect(mockRes.sendResponse).not.toHaveBeenCalled();
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
