export * from "./StockPrice"

import { RetryAxiosMng } from "../../../utils/http/axios";
import { StockPrice } from "./StockPrice";

export async function scrapStockData(stockCode:string)
{
    const utils = {
        retryAxios:(new RetryAxiosMng()).createInstance(5, 1000, "https://finance.naver.com/", 'arraybuffer'),
    }
    
    let stockPrice = new StockPrice(utils);
    
    return await stockPrice.scrapStockInfo(stockCode);
}