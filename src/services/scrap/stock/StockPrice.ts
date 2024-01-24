const cheerio = require('cheerio');

import { FileLogger, Logger, RetryAxiosMng } from "../../../utils";

import * as fs from 'fs';

let iconv = require('iconv-lite');

export class StockPrice
{
    protected dataLogger: Logger
    protected errLogger: Logger
    protected summaryLogger: Logger
    
    constructor()
    {
        this.dataLogger = new FileLogger("./log/scrapDataLog/stock/");
        this.errLogger = new FileLogger("./log/scrapDataLog/stock/error/");
        this.summaryLogger = new FileLogger("./log/scrapDataLog/stock/summary/");
    }

    //삼성전자: 005930
    //삼성SDS: 018260
    scrapStockInfo(code:string): Promise<{'sharePrice':number, 'company':string}>
    {
        return new Promise(async(resolve,reject)=>{
            const retryAxiosMng = (new RetryAxiosMng()).createInstance(5, 1000, "https://finance.naver.com/", 'arraybuffer')
            const response:any = await retryAxiosMng.get('/item/main.nhn?code='+code);
            
            const decodedHtml = iconv.decode(Buffer.from(response.res.data), 'EUC-KR');
            
            fs.writeFileSync('./test1.html', decodedHtml);
            fs.writeFileSync('./test.html', JSON.stringify(this.parse(decodedHtml)));
            resolve(this.parse(decodedHtml));
        })
    }

    parse(html:string)
    {
        try{
            const $ = cheerio.load(html.toString());
            return {
                'sharePrice':parseInt($('#chart_area > div.rate_info > div > p.no_today > em > .blind')
                .html().replace(/,/g, "")),
                'company':$('#middle > div.h_company > div.wrap_company > h2 > a').html(),
                'currentTime':$('#time > em').html().replace(/<span>.*?<\/span>/g, '').trim(),
                'currentStatus':$('#time > em > span').html(),
                }
        }
        catch(e)
        {
            this.errLogger.error("파싱 실패" + e)

            return {
                'sharePrice':0,
                'company':'',
                'currentTime':'',
                'currentStatus':'',
                }
        }
    }
}