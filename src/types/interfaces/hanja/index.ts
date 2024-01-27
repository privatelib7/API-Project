export type KoreaHanjaDictInfo = {
    mix_pron:string /* 한자의 뜻과 음의 요약 스트링 */
    learning_info_category: string, /* 한자 종류 명칭 */
    learning_info_category_1depth: string, /* 한자 종류 명칭 */
    learning_info_category_1depth_content: string, /* 한자 종류 명칭에 대한 설명 */
    learning_info_body: string /* "그림으로 배우는 한자" 학습정보 스크랩 html */
}

export type JapanHanjaDictInfo = {
    expAudioRead:string, /* 음독 */
    expMeaningRead:string /* 훈독 */
}

export interface HanjaScraper
{
    scrapHanjaInfo(hanja: any): Promise<object>;
}

export enum HanjaType {
    korHanja = "kor",
    jpHanja = "jp"
}