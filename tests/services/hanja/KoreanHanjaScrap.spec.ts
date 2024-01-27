import fs from 'fs';
import { jest } from '@jest/globals';

import { KoreanHanja } from '../../../src/services/scrap/hanja/KoreanHanja';
import { NaverHanjaInfo } from '../../../src/services/scrap/hanja';
import { RetryAxiosMng } from '../../../src/utils/http/axios';

describe('KoreanHanjaScrap 클래스 단위 테스트', () => {
    it("html 파싱을 정상적으로 수행한다.",async()=>{
        // 객체 생성
        const korUtils = {
            NaverHanjaInfo: NaverHanjaInfo,
            RetryAxiosMng: RetryAxiosMng,
            axios: (new RetryAxiosMng()).createInstance(5, 1000, "https://hanja.dict.naver.com/")
        }
        const koreanHanja = new KoreanHanja(korUtils);
        
        // axios 리턴값 mocking
        const mockedHtmlContent_EntityId = fs.readFileSync(__dirname+"/mockedHtml/korDummySuccEntityId - 人.html", 'utf8');
        const mockedHtmlContent_DetailInfo = fs.readFileSync(__dirname+"/mockedHtml/korDummySuccDetailInfo - 人.html", 'utf8');
        const mockedAxios:any = {get:jest.fn((path:string) =>{return new Promise((resolve, reject) => {
            if(path.startsWith("/api3/ccko/search?query="))
            {
                resolve({res:{data:JSON.parse(mockedHtmlContent_EntityId)}})
            }
            else if(path.startsWith('/api/platform/ccko/entry?entryId='))
            {
                resolve({res:{data:JSON.parse(mockedHtmlContent_DetailInfo)}})
            }
        })})}
        koreanHanja.setAxios(mockedAxios);

        // 실행 및 검증
        const result = await koreanHanja.scrapHanjaInfo("人")
        console.log(result);
    })
    it("html 파싱에 실패한다.",async()=>{
        // 객체 생성
        const korUtils = {
            NaverHanjaInfo: NaverHanjaInfo,
            RetryAxiosMng: RetryAxiosMng,
            axios: (new RetryAxiosMng()).createInstance(5, 1000, "https://hanja.dict.naver.com/")
        }
        const koreanHanja = new KoreanHanja(korUtils);

        // axios 리턴값 mocking
        const mockedHtmlContent_EntityId = fs.readFileSync(__dirname+"/mockedHtml/korDummyFail - 人.html", 'utf8');
        const mockedHtmlContent_DetailInfo = fs.readFileSync(__dirname+"/mockedHtml/korDummyFail - 人.html", 'utf8');
        const mockedAxios:any = {get:jest.fn((path:string) =>{return new Promise((resolve, reject) => {
            if(path.startsWith("/api3/ccko/search?query="))
            {
                resolve({res:{data:JSON.parse(mockedHtmlContent_EntityId)}})
            }
            else if(path.startsWith('/api/platform/ccko/entry?entryId='))
            {
                resolve({res:{data:JSON.parse(mockedHtmlContent_DetailInfo)}})
            }
        })})}
        koreanHanja.setAxios(mockedAxios);

        //실행 및 검증
        try{
            await koreanHanja.scrapHanjaInfo('人')
        }catch(e){
            expect(e.message).not.toEqual('');
        }
        
    })
});
