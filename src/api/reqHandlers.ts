import { scrapHanjaData, scrapRankData, scrapStockData } from "../services/scrap/";
import { HanjaType, RankType } from "../types/interfaces";

export function unkownTypeHandler(res, type)
{
    const availTypeArray: string[] = Object.values(type);
    const availTypes: string = availTypeArray.join(", ");

    return res.status(402).send({ error: "지원하지 않는 타입(지원 타입:" + availTypes + ")" });
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
