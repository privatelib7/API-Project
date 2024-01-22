import { ScrapRanking } from "../../types/interfaces/ranking"

export class RankingSystem
{
    private rankingScrapper:ScrapRanking

    constructor()
    {
    }

    setScracpper(rankingScrapper:ScrapRanking)
    {
        this.rankingScrapper = rankingScrapper
    }

    scrap()
    {
        return this.rankingScrapper.scrap()
    }
}