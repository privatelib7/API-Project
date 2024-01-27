import { HanjaScraper, KoreaHanjaDictInfo } from "../../../types/interfaces/hanja";

export class KoreanHanja implements HanjaScraper
{
    private hanjaInfo:any;
    private axios:any

    constructor(utils:any)
    {   
        this.hanjaInfo = new utils.NaverHanjaInfo();
        this.axios = utils.axios;
    }

    setAxios(axios:any)
    {
        this.axios = axios
    }

    /** 
     * 함수 인자로 전달받은 한자에 대해서 네이버 사전을 통해 한자의 뜻과 음, "그림으로 배우는 한자" 학습 정보를 스크래핑한 후 반환한다.
     * @param hanja - 조회할 한자
     * @returns Promise<HanjaLearningInfo> - 한자 정보를 담은 객체를 Promise 형태로 반환한다. 객체 구조는 아래와 같다.
     *    {
     *      mix_pron:string
     *      learning_info_category: string,
     *      learning_info_category_1depth: string,
     *      learning_info_category_1depth_content: string,
     *      learning_info_body: string
     *    }
     *
     * @throws Error - 스크래핑 과정에서 문제가 발생할 경우 에러를 throw 한다.
     *
     * @example
     *    getHanjaLearningInfo('曲')
     *    .then(info => console.log(info))
     *    .catch(error => console.error(error));
     */
    public async scrapHanjaInfo(hanja:string):Promise<Object>
    {
        const entryId = await this.scrapEntryId(hanja);
        return this.scrapHanjaDetailInfo(entryId);
    }

    public async scrapEntryId(hanja:string): Promise<String>
    {
        const path = this.getScrapEntryIdOptioin(hanja);
        const config = {
            headers: {
                'referer': 'https://hanja.dict.naver.com/',
            },
        };
        const response:any = await this.axios.get(path, config)
        
        return this.parseEntryId(response.res.data);
    }

    private getScrapEntryIdOptioin(hanja:string)
    {
        return '/api3/ccko/search?query='+encodeURIComponent(hanja)+'&m=pc&hid=168865610007880930';
    }

    private parseEntryId(responseJson:any)
    {
        if(!responseJson?.searchResultMap?.searchResultListMap?.LETTER?.items[0]){
            throw new Error("요청한 한자를 찾을 수 없습니다.")
        }

        return responseJson.searchResultMap.searchResultListMap.LETTER.items[0].entryId
    }

    private scrapHanjaDetailInfoOption(entryId:String)
    {
        return '/api/platform/ccko/entry?entryId='+entryId+'&isConjsShowTTS=true&searchResult=false&hid=168864994272756480';
    }

    private parseScrapHanjaDetailInfo(responseJson:any)
    {
        const mix_pron = responseJson.entry.mix_pron
        const learning_info_category = responseJson.entry.group.learningMores[responseJson.entry.group.learningMores.length-1].learning_info_category
        const learning_info_category_1depth = responseJson.entry.group.learningMores[responseJson.entry.group.learningMores.length-1].learning_info_category_1depth
        const learning_info_body = responseJson.entry.group.learningMores[responseJson.entry.group.learningMores.length-1].learning_info_body
        
        const learning_info_category_1depthContObj:any = this.hanjaInfo.getlearning_info_category_1depthContObj();

        const learning_info_category_1depth_content = learning_info_category_1depthContObj[learning_info_category_1depth]

        return {
            mix_pron:mix_pron,
            learning_info_category:learning_info_category, 
            learning_info_category_1depth:learning_info_category_1depth, 
            learning_info_category_1depth_content:learning_info_category_1depth_content,
            learning_info_body:learning_info_body}
    }

    public async scrapHanjaDetailInfo(entryId: String): Promise<KoreaHanjaDictInfo>
    {
        const path = this.scrapHanjaDetailInfoOption(entryId);
        const config = {
            headers: {
                'referer': 'https://hanja.dict.naver.com/'
            },
        };
        const response:any = await this.axios.get(path, config)
        
        return this.parseScrapHanjaDetailInfo(response.res.data);
    }
}