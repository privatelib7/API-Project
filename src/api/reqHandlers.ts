
import { KoreanHanja, JapanHanaja }  from '../services/scrap/hanja/'
import { OriconMusicRank, BoxofficeMovieRanking } from "../services/scrap/ranking"
import { StockPrice }  from "../services/scrap/stock/"

import { RankingSystem } from '../services/scrap/ranking/RankingSystem';

import { RankType } from "../types/interfaces/ranking";
import { HanjaType, HanjaScraper } from '../types/interfaces/hanja/interface';

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
            hanjaService = new KoreanHanja();
            break;
        case HanjaType.jpHanja:
            hanjaService = new JapanHanaja();
            break;
    }

    return hanjaService.scrapHanjaInfo(hanja)
}

async function scrapStockData(stockCode:string)
{
    let stockPrice = new StockPrice();
    
    return await stockPrice.scrapStockInfo(stockCode);
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
        try
        {
            res.send(await scrapRankData(rankType))
        }
        catch(err)
        {
            res.status(402).send({"error":err.message})
        }
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
        try
        {
            res.send(await scrapHanjaData(lang,hanja))
        }
        catch(err)
        {
            res.status(402).send({"error":err.message})
        }
    }    
}

export async function stockDataReqHandler(req,res)
{
    const stockCode = req.params.stockCode;

    try
    {
        res.send(await scrapStockData(stockCode))
    }
    catch(err)
    {
        res.status(402).send({"error":err.message})
    }
}
