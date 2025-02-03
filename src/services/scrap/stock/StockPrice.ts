import { cheerio } from "../../../utils/http";
import { FileLogger } from "../../../utils/logger";

export class StockPrice
{
    private utils:any;

    private cheerio = cheerio;
    private iconv = require('iconv-lite');
    
    private errLogger = new FileLogger("./log/scrapDataLog/stock/error/");
    private dataLogger = new FileLogger("./log/scrapDataLog/stock/");
    private summaryLogger = new FileLogger("./log/scrapDataLog/stock/summary/");

    constructor(utils:any)
    {
        this.utils = utils;        
    }

    async scrapStockInfo(code:string): Promise<{'sharePrice':number, 'company':string}>
    {
        const response:any = await this.utils.retryAxios.get('/item/main.nhn?code='+code);
        const decodedHtml = this.iconv.decode(Buffer.from(response.res.data), 'EUC-KR');
                
        return this.parse(decodedHtml);
    }

    parse(html:string)
    {
        try{
            const $ = this.cheerio.load(html.toString());
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

            throw new Error("확인되지 않은 종목 코드입니다.");
        }
    }
}