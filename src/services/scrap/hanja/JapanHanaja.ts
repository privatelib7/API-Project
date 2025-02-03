import { HanjaScraper, JapanHanjaDictInfo } from "../../../types/interfaces/hanja";

export class JapanHanaja implements HanjaScraper
{
    private axios:any

    constructor(utils:any)
    {
        this.axios = utils.axios;
    }

    setAxios(axios:any)
    {
        this.axios = axios
    }

    /**
     * 함수 인자로 전달 받은 한자의 네이버 사전의 일본어사전에서 음독과 훈독을 스크래핑 하고 반환한다.
     * @param hanja - 조회할 한자
     * @returns Promise<HanjaLearningInfo> - 한자 학습 정보를 담은 객체를 Promise 형태로 반환합니다. 객체 구조는 아래와 같습니다.
     *    {
     *      expAudioRead: string,
     *      expMeaningRead: string
     *    }
     *
     * @throws Error - 스크래핑 과정에서 문제가 발생할 경우 에러를 throw합니다.
     *
     * @example
     *    getHanjaLearningInfo('曲')
     *    .then(info => console.log(info))
     *    .catch(error => console.error(error));
     */
    public async scrapHanjaInfo(hanja:string):Promise<JapanHanjaDictInfo>
    {
        return this.getDetail(hanja);
    }

    private getUrlPath(hanja:string)
    {
        return '/api3/jako/search?query='+encodeURIComponent(hanja)+'&m=pc&range=entrySearch'
    }

    private parseInfo(responseJson:any)
    {
        if(!responseJson.searchResultMap?.searchResultListMap?.WORD?.items[0]){
            throw new Error("요청한 한자를 찾을 수 없습니다.")
        }

        var expAudioRead = responseJson.searchResultMap.searchResultListMap.WORD.items[0].expAudioRead
        var expMeaningRead = responseJson.searchResultMap.searchResultListMap.WORD.items[0].expMeaningRead

        return {
            expAudioRead:expAudioRead,
            expMeaningRead:expMeaningRead, 
        }
    }

    async getDetail(hanja:string) :Promise<JapanHanjaDictInfo>
    {
        const toptions = await this.getUrlPath(hanja);
        const config = {
            headers: {
                "Referer": "https://ja.dict.naver.com/",
            },
        };
        const response:any = await this.axios.get(toptions, config)
        
        return this.parseInfo(response.res.data);
    }
}