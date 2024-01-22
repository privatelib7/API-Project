import axios, { AxiosInstance } from 'axios'
import ip from 'ip';
import fs from 'fs';
import { jest } from '@jest/globals';

import { KoreanHanjaScraper } from '../../../src/services/hanja/KoreanHanjaScraper';

describe('KoreanHanjaScrap 클래스 단위 테스트', () => {
    it("html 파싱을 정상적으로 수행한다.",async()=>{
        // 객체 생성
        const koreanHanjaScraper = new KoreanHanjaScraper();
        
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
        koreanHanjaScraper.setAxios(mockedAxios);

        // 실행 및 검증
        const result = await koreanHanjaScraper.scrapHanjaInfo("人")
        console.log(result);
    })
    it("html 파싱에 실패한다.",async()=>{
        // 객체 생성
        const koreanHanjaScraper = new KoreanHanjaScraper();

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
        koreanHanjaScraper.setAxios(mockedAxios);

        //실행 및 검증
        try{
            await koreanHanjaScraper.scrapHanjaInfo('人')
        }catch(e){
            expect(e.message).not.toEqual('');
        }
        
    })
});
