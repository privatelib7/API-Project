import axios from 'axios'
import ip from 'ip';
import fs from 'fs';
import { jest } from '@jest/globals';

import { BoxofficeMovieRanking } from "../../../src/services/rankingScrap/BoxofficeMovieRanking";
import RetryAxiosMng from '../../../src/utils/axios/RetryAxiosMng';

describe('BoxofficeMovieRanking 클래스 단위 테스트', () => {
    it("scrap을 수행하면 axios 요청이 이루어진다.",()=>{
        const boxofficeMovieRanking = new BoxofficeMovieRanking()  
        
        const reqHtmlDataSpy = jest.spyOn((boxofficeMovieRanking as any), 'reqHtmlData').mockReturnValue([{res:{data:"test"}}]);

        boxofficeMovieRanking.scrap();

        expect(reqHtmlDataSpy).toHaveReturned();
    })

    it("html 파싱을 정상적으로 수행한다.",()=>{
        const mockedHtmlContent = fs.readFileSync(__dirname+'/BoxOfficeMockedHtml/normal/dummyHtml.html', 'utf8');
        const mockedResultContent = fs.readFileSync(__dirname+'/BoxOfficeMockedHtml/normal/result.txt', 'utf8');

        const boxofficeMovieRanking = new BoxofficeMovieRanking()
        const result = boxofficeMovieRanking.parseRank(mockedHtmlContent);

        expect(atob(mockedResultContent)==(result as any)).toEqual(true);
    })

    it("html 파싱에 실패한다.",()=>{
        const mockedFailedHtmlContent = fs.readFileSync(__dirname+'/BoxOfficeMockedHtml/failed/dummyHtml.html', 'utf8');
        const mockedResultContent = fs.readFileSync(__dirname+'/BoxOfficeMockedHtml/normal/result.txt', 'utf8');

        const boxofficeMovieRanking = new BoxofficeMovieRanking()
        const result = boxofficeMovieRanking.parseRank(mockedFailedHtmlContent);

        expect(atob(mockedResultContent)==( result as any)).toEqual(false);
    })    
});
