import fs from 'fs';
import { jest } from '@jest/globals';

import { JapanHanaja } from "../../../src/services/scrap/hanja/JapanHanaja";
import { RetryAxiosMng } from '../../../src/utils/http/axios';

describe('JapanHanajaUtil 클래스 단위 테스트', () => {
    it("html 파싱을 정상적으로 수행한다.",async()=>{
        // 객체 생성
        const jpUtils = {
            RetryAxiosMng: RetryAxiosMng,
            axios: (new RetryAxiosMng()).createInstance(5, 1000, "https://ja.dict.naver.com/")
        }
        const japanHanaja = new JapanHanaja(jpUtils);
        
        // axios 리턴값 mocking
        const mockedHtmlContent = fs.readFileSync(__dirname+"/mockedHtml/dummySucc - 人.html", 'utf8');
        const mockedAxios:any = {get:jest.fn(() =>{return new Promise((resolve, reject) => {
            resolve({res:{data:JSON.parse(mockedHtmlContent)}})
        })})}
        japanHanaja.setAxios(mockedAxios);

        // 실행 및 검증
        const result = await japanHanaja.scrapHanjaInfo("人")

        expect(result.expAudioRead).toEqual("じん·にん");
        expect(result.expMeaningRead).toEqual("ひと");
    })
    it("html 파싱에 실패한다.",async()=>{
        // 객체 생성
        const jpUtils = {
            RetryAxiosMng: RetryAxiosMng,
            axios: (new RetryAxiosMng()).createInstance(5, 1000, "https://ja.dict.naver.com/")
        }
        const japanHanaja = new JapanHanaja(jpUtils);

        // axios 리턴값 mocking
        const mockedHtmlContent = fs.readFileSync(__dirname+"/mockedHtml/dummyFail - 人.html", 'utf8');
        const mockedAxios:any = {get:jest.fn(() =>{return new Promise((resolve) => {
            resolve({res:{data:mockedHtmlContent}})
        })})}
        japanHanaja.setAxios(mockedAxios);

        // 실행 및 검증
        try{
            await japanHanaja.scrapHanjaInfo('人')
        }catch(e){
            expect(e.message).toEqual("응답값 파싱에 실패하였습니다.");   
        }
        
    })
});
