
import { RankType, ScrapRanking, HtmlDetail } from '../../../../types/interfaces/ranking'

import { BasicRank } from '../BasicRank'

export class OriconMusicRank extends BasicRank implements ScrapRanking
{
    private rankUtils:any

    constructor(rankUtils:any)
    {
        super(RankType.oriconMusic)

        this.rankUtils = rankUtils
    }

    getDateTimeFormated(format: string, date:Date=new Date()): string
    {
        if (format !== "yyyy-mm-dd") {
            throw new Error("지원하는 날짜 포맷이 아닙니다.");
        }
    
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
        const day = date.getDate().toString().padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }
    
    getRecentActiveDay(): string
    {
        const daydiff = 2;

        const date = new Date();
        date.setDate(date.getDate() - daydiff);
    
        return this.getDateTimeFormated('yyyy-mm-dd', date);
    }

    /**
     * 음악 정보 스크래핑 함수
     * @returns A promise that resolves a rank list
     */
    async scrap(): Promise<any> 
    {
        let reqArr =[] 

        // 스크랩은 2일 전의 데이터들부터 안정적으로 파싱이 가능합니다.
        const searchDate = this.getRecentActiveDay();
         
        reqArr.push(
            this.rankUtils.retryAxios.get("/rank/js/d/"+searchDate+"/p/1/",'arraybuffer'),
            this.rankUtils.retryAxios.get("/rank/js/d/"+searchDate+"/p/2/",'arraybuffer'),
            this.rankUtils.retryAxios.get("/rank/js/d/"+searchDate+"/p/3/",'arraybuffer')
        )
        
        let htmlArr: HtmlDetail[] = await this.axios.all(reqArr)

        // rankList 파싱
        const rankList = this.parseRankList(htmlArr);

        // 파싱 정보 로깅
        this.logRankList(htmlArr, rankList);

        return {'rankList':rankList, 'date':searchDate};
    }

    isRankListValid(rankList: any[])
    {
        return rankList.length >= 30 //공동 순위가 존재하는 경우가 있어서 30개 이상이어야 합니다.
    }

    public parseRankPage(html:string)
    {
        let rankList = [];

        const $ = this.cheerio.load(html);
        
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
                const decodedHtml = this.iconv.decode(Buffer.from(htmlArr[i].res.data), 'Shift_JIS');

                rankList = rankList.concat(this.parseRankPage(decodedHtml))
            }
            catch(e)
            {
                this.errLogger.error(`파싱 실패: ${e}`)
            }    
        }
        
        if(!this.isRankListValid(rankList))
        {
            this.errLogger.error(`파싱 실패: 랭크 리스트 검증 실패\r\n${JSON.stringify(rankList)}`)
         
            // 초기화
            rankList = [];
        }

        return rankList
    }
}