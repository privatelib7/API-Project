export * from "./JapanHanaja"
export * from "./KoreanHanja"
export * from "./NaverHanjaInfo"

import { HanjaScraper, HanjaType } from "../../../types/interfaces/hanja";
import { RetryAxiosMng } from "../../../utils/http/axios";
import { JapanHanaja } from "./JapanHanaja";
import { KoreanHanja } from "./KoreanHanja";
import { NaverHanjaInfo } from "./NaverHanjaInfo";

export function scrapHanjaData(lang:HanjaType, hanja:string)
{
    let hanjaService:HanjaScraper;

    switch(lang)
    {
        case HanjaType.korHanja:
            const korUtils = {
                NaverHanjaInfo: NaverHanjaInfo,
                RetryAxiosMng: RetryAxiosMng,
                axios: (new RetryAxiosMng()).createInstance(5, 1000, "https://hanja.dict.naver.com/")
            }

            hanjaService = new KoreanHanja(korUtils);
            break;
            
        case HanjaType.jpHanja:
            const jpUtils = {
                RetryAxiosMng: RetryAxiosMng,
                axios: (new RetryAxiosMng()).createInstance(5, 1000, "https://ja.dict.naver.com/")
            }
            
            hanjaService = new JapanHanaja(jpUtils);
            break;
    }

    return hanjaService.scrapHanjaInfo(hanja)
}