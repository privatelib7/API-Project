interface CacheEntry {
  data: any;
  expiry: number;
}

var cache: Record<string, CacheEntry> = {};

export const clearCache = ()=>{
  cache = {}
}

// 캐시에 데이터를 저장하고 TTL을 설정하는 함수
export const setCache = (key: string, data: any, ttl: number) => {
  const expiry = Date.now() + ttl;
  cache[key] = { data, expiry };
};

// 캐시에서 데이터를 검색하고 만료 여부를 확인하는 함수
export const getCache = (key: string) => {
  const entry = cache[key];
  if (entry && Date.now() < entry.expiry) {
    return entry;
  }
  // 만료되었거나 존재하지 않는 경우
  return null;
};

// 캐시 미들웨어
export const cacheMiddleware = (ttl: number) => {
  return (req: any, res: any, next: () => void) => {
    const key = req.originalUrl || req.url;

    const cachedData = getCache(key)?.data;
    if (cachedData) {
      console.log('Cache hit for:', key);
      res.send(cachedData);
    } else {
      console.log('Cache miss for:', key);
      res.sendResponse = res.send;
      res.send = (body: any) => {
        setCache(key, body, ttl);
        res.sendResponse(body);
      };
      next();
    }
  };
};
