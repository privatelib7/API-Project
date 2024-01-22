import { jest } from '@jest/globals';
import RetryAxiosMng from '../../../src/utils/axios/RetryAxiosMng'

import axios from 'axios'

describe('RetryAxiosReq 클래스 단위 테스트', () => {
    let retryAxiosReq;

    it('기본 axios 인스턴스를 생성한다.', async () => {
        retryAxiosReq = new RetryAxiosMng();

        const instance = retryAxiosReq.createBasicInstance('/test')
        
        // 함수가 포함되어있는지 확인하여 검증합니다.
        expect(typeof instance.get).toBe('function');
        expect(typeof instance.post).toBe('function');
        expect(typeof instance.patch).toBe('function');
        expect(typeof instance.delete).toBe('function');
    })

    it('재시도 axios 인스턴스를 생성할 때 인터셉터를 재설정한다.',()=>{
        // axios interceptor mocking
        let mockedInstance = axios.create();
        (mockedInstance.interceptors.response as any)={use:jest.fn(),forEach:jest.fn()};
        let mockedAxios = {create:jest.fn(()=>{return mockedInstance})}
        
        retryAxiosReq = new RetryAxiosMng();
        retryAxiosReq.setAxios(mockedAxios);

        const instance = retryAxiosReq.createInstance(5, 100, 'https://example.com/');

        expect(instance.interceptors.response.use).toHaveBeenCalled();
    })

    it('요청이 2번 실패하고 3번째에 성공 콜백이 호출 된다.', async()=>{
        retryAxiosReq = new RetryAxiosMng();

        let instance = retryAxiosReq.createInstance(5, 100, "https://example.com")  

        const succResp = { result: 'success' };
        const errResp = { result: 'error' };

        // 요청을 2번 실패한다고 가정
        jest.spyOn(instance, 'get').mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].rejected(errResp)
        );
        
        jest.spyOn(retryAxiosReq, 'reqByInstance')
        .mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].rejected(errResp)
        )
        .mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].fulfilled(succResp)
        );

        const result = await instance.get("test");

        expect(result.remainRetryCnt).toEqual(3);
        expect(result.res).toEqual(succResp);
    })

    it('최대 요청 제한 횟수를 모두 실패하면 예외 처리 한다.', async()=>{
        retryAxiosReq = new RetryAxiosMng();

        let instance = retryAxiosReq.createInstance(5, 100, "https://example.com")  

        const succResp = { result: 'asuccess' };
        const errResp = { result: 'error' };

        // 요청을 2번 실패한다고 가정
        jest.spyOn(instance, 'get').mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].rejected(errResp)
        );
        
        jest.spyOn(retryAxiosReq, 'reqByInstance')
        .mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].rejected(errResp)
        )
        .mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].rejected(errResp)
        )
        .mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].rejected(errResp)
        )
        .mockImplementationOnce(() => 
            // 임의로 handlers에 접근하여 성공 콜백을 실행시키는 구조입니다.
            (instance.interceptors.response as any).handlers[0].rejected(errResp)
        )

        await expect(instance.get("test")).rejects.toEqual({err: errResp, remainRetryCnt: 0})
    })


    it('재요청는 지정한 초 시간만큼 대기 후 재요청한다.', async () => {
        jest.useFakeTimers();
        jest.clearAllTimers();

        const MAX_RETRY = 5;
        const RETRY_PERIOD_MS = 1000;

        const dummyOriginalRequest = { url: '/test' };

        retryAxiosReq = new RetryAxiosMng();

        // 재시도 인스턴스 생성, reqByInstance 메서드 spy 생성
        let instance = retryAxiosReq.createInstance(MAX_RETRY, RETRY_PERIOD_MS, "https://example.com")
        const reqByInstanceSpy = jest.spyOn(retryAxiosReq, 'reqByInstance')

        // 재 요청 함수 호출
        retryAxiosReq.reRequest(instance, RETRY_PERIOD_MS, dummyOriginalRequest, "request resolved");
        
        // reqByInstance 메서드 호출 검증
        jest.advanceTimersByTime(RETRY_PERIOD_MS); // 1초 시간을 앞당깁니다.
        expect(reqByInstanceSpy).toHaveBeenCalledTimes(1);
    });
});
