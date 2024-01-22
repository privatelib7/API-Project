// const iconv = require('iconv-lite') 
import { AxiosStatic } from 'axios'
import axios from 'axios'

import * as fs from 'fs'

import { HtmlDetail } from '../../types/interfaces/ranking'
import { BasicRank } from './BasicRank'
import { ScrapRanking, RankType, cheerio, RetryAxiosMng } from './utils'

let iconv = require('iconv-lite');

export class OriconMusicRank extends BasicRank implements ScrapRanking
{
    private axios

    constructor()
    {
        super(RankType.oriconMusic)
        
        const MAX_RETRY_AXIOS = this.getMaxAxiosRetryCnt()
        
        this.axios = (new RetryAxiosMng()).createInstance(MAX_RETRY_AXIOS, 1000, "https://www.oricon.co.jp/", 'arraybuffer');
    }

    getDateTimeFormated(format: string, date:Date=new Date()): string {
        if (format !== "yyyy-mm-dd") {
            throw new Error("지원하는 날짜 포맷이 아닙니다.");
        }
    
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더합니다.
        const day = date.getDate().toString().padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }
    

    /**
     * 음악 정보 스크래핑 함수
     * @returns A promise that resolves a rank list
     */
    async scrap(): Promise<any> 
    {
        let reqArr =[] 

        let searchDate = new Date();

        searchDate.setDate(searchDate.getDate() - 2);
         
        reqArr.push(
            this.axios.get("/rank/js/d/"+this.getDateTimeFormated('yyyy-mm-dd', searchDate)+"/p/1/",'arraybuffer'),
            this.axios.get("/rank/js/d/"+this.getDateTimeFormated('yyyy-mm-dd', searchDate)+"/p/2/",'arraybuffer'),
            this.axios.get("/rank/js/d/"+this.getDateTimeFormated('yyyy-mm-dd', searchDate)+"/p/3/",'arraybuffer')
        )
        
        let htmlArr: HtmlDetail[] = await axios.all(reqArr)

        // rankList 파싱
        const rankList = this.parseRankList(htmlArr);

        // 파싱 정보 로깅
        this.logRankList(htmlArr, rankList);

        return rankList;
    }

    public parseRankPage(html:string)
    {
        let rankList = [];

        const $ = cheerio.load(html);
        
        $('.box-rank-entry').each((index, element) => {
            const title = $(element).find('.title').text().trim();
            const name = $(element).find('.name').text().trim();
            const ranking = parseInt($(element).find('.num').text().trim());
        
            rankList.push({ title, name, ranking });
        });

        return rankList;
    }

    private parseRankList(htmlArr)
    {
        let rankList = [];

        for(let i=0; i<htmlArr.length; i++)
        {
            try
            {
                const decodedHtml = iconv.decode(Buffer.from(htmlArr[i].res.data), 'Shift_JIS');

                rankList = rankList.concat(this.parseRankPage(decodedHtml))
            }
            catch(e)
            {
                this.errLogger.error("파싱 실패" + e)
            }    
        }
        
         return rankList
    }
}