export * from "./OriconChart/OriconMusicRank"
export * from "./BoxOfficeMovieRanking/BoxofficeMovieRanking"
export * from './RankingSystem';

import { RankType } from "../../../types/interfaces/ranking";
import { BoxofficeMovieRanking } from "./BoxOfficeMovieRanking/BoxofficeMovieRanking";
import { OriconMusicRank } from "./OriconChart/OriconMusicRank";
import { RankingSystem } from "./RankingSystem";
import { RetryAxiosMng } from "../../../utils/http/axios";

export function scrapRankData(rankType:RankType)
{
    const rankingSystem = new RankingSystem()

    switch(rankType)
    {
        case RankType.oriconMusic:
            const utils={
                retryAxios: (new RetryAxiosMng()).createInstance(5, 1000, "https://www.oricon.co.jp/", 'arraybuffer')
            }
            rankingSystem.setScracpper(new OriconMusicRank(utils));
            break;
        case RankType.boxofficeMovie:
            const boxUtils = {
                retryAxios:(new RetryAxiosMng()).createInstance(5, 1000, "https://www.boxofficemojo.com/")
            }
            rankingSystem.setScracpper(new BoxofficeMovieRanking(boxUtils));
            break;
    }

    return rankingSystem.scrap();
}