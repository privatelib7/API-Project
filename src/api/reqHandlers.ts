import { scrapHanjaData, scrapRankData, scrapStockData } from "../services/scrap/";
import { HanjaType, RankType } from "../types/interfaces";

export function unkownTypeHandler(res, type)
{
    const availTypeArray: string[] = Object.values(type);
    const availTypes: string = availTypeArray.join(", ");

    return res.status(402).send({ error: "지원하지 않는 타입(지원 타입:" + availTypes + ")" });
}

function isValidHanjaType(lang: any) {
    return Object.values(HanjaType).includes(lang);
}

function isValidRankType(rankType: any) {
    return !Object.values(RankType).includes(rankType);
}

export async function rankDataReqHandler(req,res)
{
    const rankType = req.params.rankType;

    if(isValidRankType(rankType))
    {
        unkownTypeHandler(res, RankType)
        return;
    }
    
    scrapRankData(rankType).then(result =>{
        res.send(result)
    }).catch(err=>{
        res.status(402).send({"error":err.message})
    })
}


export async function hanjaDataReqHandler(req,res)
{
    const hanja = req.params.hanja;
    const lang = req.params.lang

    if(!isValidHanjaType(lang))
    {
        unkownTypeHandler(res, HanjaType)
        return;
    }
    
    scrapHanjaData(lang,hanja).then(result=>{
        res.send(result)
    }).catch(err=>
        res.status(402).send({"error":err.message})
    ) 
}

export async function stockDataReqHandler(req,res)
{
    const stockCode = req.params.stockCode;

    scrapStockData(stockCode).then(result =>{
        res.send(result)
    }).catch(err=>{
        res.status(402).send({"error":err.message})
    })
}
