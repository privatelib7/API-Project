import { AxiosResponse } from "axios";

export interface MusicContent {
    content: any
}

export interface ScrapRanking{
    scrap(): Promise<any>
}

export enum RankType {
    oriconMusic = "oriconMusic",
    boxofficeMovie = "boxofficeMovie"
}

export interface HtmlDetail{
    html: AxiosResponse<any, any>;
    remainRetryCnt: number;
}
