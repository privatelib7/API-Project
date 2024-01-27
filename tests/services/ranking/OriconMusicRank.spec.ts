import fs from 'fs';
import { jest } from '@jest/globals';

import { OriconMusicRank } from "../../../src/services/scrap/ranking/OriconChart/OriconMusicRank";
import { RetryAxiosMng } from '../../../src/utils/http/axios';

describe('OriconMusicRank 클래스 단위 테스트', () => {
    it("html 파싱을 정상적으로 수행한다.",() => {
        const mockedHtmlContent = fs.readFileSync(__dirname+'/OriconMockedHtml/normal/dummyHtml.html', 'utf8');
        const mockedResultContent = fs.readFileSync(__dirname+'/OriconMockedHtml/normal/result.txt', 'utf8');
       
        const utils={
            retryAxios: (new RetryAxiosMng()).createInstance(5, 1000, "https://www.oricon.co.jp/", 'arraybuffer')
        }
        const oriconMusicRank= new OriconMusicRank(utils)
        const result = oriconMusicRank.parseRankPage(mockedHtmlContent);

        expect(mockedResultContent == JSON.stringify(result)).toEqual(true);
    })

    it("html 파싱에 실패한다.",()=>{
        const mockedFailedHtmlContent = fs.readFileSync(__dirname+'/OriconMockedHtml/fail/dummyHtml.html', 'utf8');
        const mockedResultContent = fs.readFileSync(__dirname+'/OriconMockedHtml/normal/result.txt', 'utf8');

        const utils={
            retryAxios: (new RetryAxiosMng()).createInstance(5, 1000, "https://www.oricon.co.jp/", 'arraybuffer')
        }
        const oriconMusicRank= new OriconMusicRank(utils)
        const result = oriconMusicRank.parseRankPage(mockedFailedHtmlContent);

        expect(mockedResultContent == JSON.stringify(result as any)).toEqual(false);
    })    
});
