import { RankType, ScrapRanking } from '../../../../types/interfaces/ranking'

import { BasicRank } from '../BasicRank'

export class BoxofficeMovieRanking extends BasicRank implements ScrapRanking
{
    private rankUtils:any

    constructor(utils:any)
    {
        super(RankType.oriconMusic)

        this.rankUtils = utils
    }

    getDateMinusDays(days: number): string
    {
        const date = new Date();
        date.setDate(date.getDate() - days); // 현재 날짜에서 days만큼 뺍니다.

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    async reqHtmlData()
    {
        let reqArr = []
        reqArr.push(
            this.rankUtils.retryAxios.get("/year/world/"),
        )
        
        // axios 스크랩
        return this.axios.all(reqArr)
    }

    parseRank(html: string)
    {
        let rankList = [];

        try {
            const $ = this.cheerio.load(html);

            const trWithoutTh = $('tr').filter((i, el) => {
                return $(el).find('th').length === 0;
            });

            trWithoutTh.each((index, element) => {
                const rank = parseInt($(element).find('td.mojo-field-type-rank').text().trim());
                const title = $(element).find('td.mojo-field-type-release_group a').text().trim();

                rankList.push({ "ranking":rank, "title":title });
            });
        } catch (e) {
            this.errLogger.error("파싱 실패" + e)
        }

        return rankList;
    }

    /**
     * 음악 정보 스크래핑 함수
     * @returns A promise that resolves a rank list
     */
    async scrap(): Promise<any>
    {
        //axios 요청
        const htmlArr: any[] = await this.reqHtmlData();

        // rankList 파싱
        let rankList = this.parseRank((htmlArr[0] as any).res.data)

        // 파싱 정보 로깅
        this.logRankList(htmlArr, rankList);

        if(!this.isRankListValid(rankList))
        {
            this.errLogger.error(`파싱 실패: 랭크 리스트 검증 실패\r\n${JSON.stringify(rankList)}`)
         
            // 초기화
            rankList = [];
        }

        return rankList;
    }

    isRankListValid(rankList: any[])
    {
        return rankList.length > 0 && rankList.length < 200
    }
}
