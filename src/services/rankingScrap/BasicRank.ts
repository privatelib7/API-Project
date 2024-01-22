import { Logger } from "../../types/interfaces/Logger"
import { HtmlDetail } from "../../types/interfaces/ranking";
import { LoggerFile, RankType } from "./utils";

import config from '../../config';

export class  BasicRank
{
    protected rankType: RankType
    protected dataLogger: Logger
    protected errLogger: Logger
    protected summaryLogger: Logger

    constructor(rankType:RankType)
    {
        this.rankType = rankType;

        this.dataLogger = new LoggerFile("./log/scrapDataLog/"+this.rankType+"/");
        this.errLogger = new LoggerFile("./log/scrapDataLog/"+this.rankType+"/error/");
        this.summaryLogger = new LoggerFile("./log/scrapDataLog/"+this.rankType+"/summary/");
    }

    public setDataLogger(dataLogger: Logger)
    {
        this.dataLogger = dataLogger
    }
    public setSummaryLogger(summaryLogger:Logger)
    {
        this.summaryLogger = summaryLogger
    }
    public setErrLogger(errLogger:Logger)
    {
        this.errLogger = errLogger
    }

    protected getMaxAxiosRetryCnt()
    {
        return config.axios.maxRetryCnt
    }

    protected logRankList(htmlArr: HtmlDetail[], rankList:any[])
    {
        const { totalTryCnt, totalfailCnt } = this.parseTotalTryCntFailCnt(htmlArr);
        
        this.dataLogger.log(JSON.stringify(rankList));
        this.summaryLogger.log(this.rankType + " vendor 요약&상세정보 / 전체 호출 횟수 : " + totalTryCnt + " 실패 횟수 : " + totalfailCnt);

        return true
    }

    protected parseTotalTryCntFailCnt(htmlDetailArr: HtmlDetail[])
    {
        let totalTryCnt = 0
        let totalfailCnt = 0

        htmlDetailArr.map(res => 
        {
            const MAX_RETRY_AXIOS = this.getMaxAxiosRetryCnt()
            const tryCnt = MAX_RETRY_AXIOS - res.remainRetryCnt + 1
            const failCnt = MAX_RETRY_AXIOS - res.remainRetryCnt

            totalTryCnt += tryCnt
            totalfailCnt += failCnt
        })

        return { totalTryCnt, totalfailCnt }
    }
}