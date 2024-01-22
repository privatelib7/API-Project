
import { StockPriceScrap }  from "../services/stock/StockPriceScrap"
import { KoreanHanjaScraper }  from '../services/hanja/KoreanHanjaScraper'
import { JapanHanajaScraper } from '../services/hanja/JapanHanajaScraper';

import { OriconMusicRank } from "../services/rankingScrap"
import { RankingSystem } from '../services/rankingScrap/RankingSystem';
import { BoxofficeMovieRanking } from '../services/rankingScrap/BoxofficeMovieRanking';

import { HanjaType, RankType } from "../types/interfaces/ranking";
import { HanjaScraper } from '../types/interfaces/hanja/interface';

export function unkownTypeHandler(res, type)
{
    const availTypeArray: string[] = Object.values(type);
    const availTypes: string = availTypeArray.join(", ");

    return res.status(402).send({ error: "지원하지 않는 타입(지원 타입:" + availTypes + ")" });
}

function scrapRankData(rankType:RankType)
{
    const rankingSystem = new RankingSystem()

    switch(rankType)
    {
        case RankType.oriconMusic:
            rankingSystem.setScracpper(new OriconMusicRank());
            break;
        case RankType.boxofficeMovie:
            rankingSystem.setScracpper(new BoxofficeMovieRanking());
            break;
    }

    return rankingSystem.scrap();
}

function scrapHanjaData(lang:HanjaType, hanja:string)
{
    let hanjaService:HanjaScraper;

    switch(lang)
    {
        case HanjaType.korHanja:
            hanjaService = new KoreanHanjaScraper();
            break;
        case HanjaType.jpHanja:
            hanjaService = new JapanHanajaScraper();
            break;
    }

    return hanjaService.scrapHanjaInfo(hanja)
}

async function scrapStockData(stockCode:string)
{
    let stockPriceScrap = new StockPriceScrap();
    
    return await stockPriceScrap.getStockInfo(stockCode);
}

export async function rankDataReqHandler(req,res)
{
    const rankType = req.params.rankType;

    if(!Object.values(RankType).includes(rankType))
    {
        unkownTypeHandler(res, RankType)
    }
    else
    {
        res.send(await scrapRankData(rankType))
    }
}

export async function hanjaDataReqHandler(req,res)
{
    const hanja = req.params.hanja;
    const lang = req.params.lang

    if(!Object.values(HanjaType).includes(lang))
    {
        unkownTypeHandler(res, HanjaType)
    }
    else
    {
        res.send(await scrapHanjaData(lang,hanja))
    }    
}

export async function stockDataReqHandler(req,res)
{
    const stockCode = req.params.stockCode;

    res.send(await scrapStockData(stockCode))
}