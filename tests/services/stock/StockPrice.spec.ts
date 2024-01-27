import fs from 'fs';

import { StockPrice } from "../../../src/services/scrap/stock/StockPrice";
import { RetryAxiosMng } from '../../../src/utils/http/axios';

describe('BoxofficeMovieRanking 클래스 단위 테스트', () => {

    it("html 파싱을 정상적으로 수행한다.",()=>{
        const mockedHtmlContent = fs.readFileSync(__dirname+'/mockedHtml/normal/dummyHtml.html', 'utf8');
        const mockedResultContent = fs.readFileSync(__dirname+'/mockedHtml/normal/result.txt', 'utf8');

        const utils = {
            retryAxios:(new RetryAxiosMng()).createInstance(5, 1000, "https://finance.naver.com/", 'arraybuffer'),
        }
        const stockPrice = new StockPrice(utils)
        const result = stockPrice.parse(mockedHtmlContent);

        expect(mockedResultContent == JSON.stringify(result)).toEqual(true);
    })

    it("html 파싱에 실패한다.",()=>{
        const mockedFailedHtmlContent = fs.readFileSync(__dirname+'/mockedHtml/fail/dummyHtml.html', 'utf8');
        const mockedResultContent = fs.readFileSync(__dirname+'/mockedHtml/fail/result.txt', 'utf8');

        const utils = {
            retryAxios:(new RetryAxiosMng()).createInstance(5, 1000, "https://finance.naver.com/", 'arraybuffer'),
        }
        const stockPrice = new StockPrice(utils)
        const result = stockPrice.parse(mockedFailedHtmlContent);

        expect(mockedResultContent == JSON.stringify(result)).toEqual(false);
    })    
});
