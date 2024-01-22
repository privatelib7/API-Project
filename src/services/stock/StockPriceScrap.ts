const cheerio = require('cheerio');

import { RetryAxiosMng } from "../rankingScrap/utils";

let iconv = require('iconv-lite');

export class StockPriceScrap
{
    //삼성전자: 005930
    //삼성SDS: 018260
    getStockInfo(code:string): Promise<{'sharePrice':number, 'company':string}>
    {
        return new Promise(async(resolve,reject)=>{
            const retryAxiosMng = (new RetryAxiosMng()).createInstance(5, 1000, "https://finance.naver.com/", 'arraybuffer')
            const response:any = await retryAxiosMng.get('/item/main.nhn?code='+code);
            
            const decodedHtml = iconv.decode(Buffer.from(response.res.data), 'EUC-KR');
            
            resolve(this.parse(decodedHtml));
        })
    }

    parse(html:string)
    {
        const $ = cheerio.load(html.toString());
        return {
                'sharePrice':parseInt($('#chart_area > div.rate_info > div > p.no_today > em > .blind')
                .html().replace(/,/g, "")),
                'company':$('#middle > div.h_company > div.wrap_company > h2 > a').html(),
                'currentTime':$('#time > em').html().replace(/<span>.*?<\/span>/g, '').trim(),
                'currentStatus':$('#time > em > span').html(),
                }
    }
}