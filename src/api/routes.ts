import { Router } from 'express';
const route = Router();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

import { rankDataReqHandler, 
        stockDataReqHandler, 
        hanjaDataReqHandler } from './reqHandlers'
import { cacheMiddleware } from './reqMiddlewares'

export default (app: Router) => {
    app.use("/",route);

    // Swagger 설정
    const options = {
        definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Project',
            version: '1.0.0',
        },
        },
        apis: ['./src/api/routes.ts'], // Swagger 문서를 작성할 파일 경로
    };
  
    const swaggerSpec = swaggerJsdoc(options);

    // Swagger 문서 경로 설정
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    /**
     * @swagger
     * /api/rank/{rankType}:
     *   get:
     *     summary: 랭킹 정보를 반환합니다.
     *     parameters:
     *       - in: path
     *         name: rankType
     *         required: true
     *         description: "랭킹 타입, 지원 랭킹 타입: oriconMusic: 오리콘 차트 데일리 싱글 랭킹(현재 시간 기준 2일 전의 데이터를 반환합니다.), boxofficeMovie: 올해 박스 오피스 랭킹"
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: 성공적인 응답
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 rankList:
     *                   type: array
     *                   items:
     *                     oneOf:
     *                       - $ref: '#/components/schemas/OriconMusicRanking'
     *                       - $ref: '#/components/schemas/BoxOfficeMovieRanking'
     *                 date:
     *                   type: string
     *                   format: date
     *                   example: "2024-01-23"
     *       400:
     *         description: "지원하지 않는 파라미터입니다. (rankType: string 타입, 지원타입 종류: oriconMusic/boxofficeMovie)"
     *       500:
     *         description: "시스템 내부 오류가 발생하였습니다. 관리자에게 문의부탁드립니다."
     * components:
     *   schemas:
     *     OriconMusicRanking:
     *       type: object
     *       properties:
     *         title:
     *           type: string
     *           example: "HEARTBREAKER/C‘monova"
     *         name:
     *           type: string
     *           example: "Kis-My-Ft2"
     *         ranking:
     *           type: integer
     *           example: 1
     *     BoxOfficeMovieRanking:
     *       type: object
     *       properties:
     *         ranking:
     *           type: integer
     *           example: 1
     *         title:
     *           type: string
     *           example: "The Beekeeper"
     */

    route.get("/rank/:rankType", cacheMiddleware(60000), rankDataReqHandler)

    /**
     * @swagger
     * /api/stock/{stockCode}:
     *   get:
     *     summary: 주가 정보를 반환합니다.
     *     parameters:
     *       - in: path
     *         name: stockCode
     *         required: true
     *         description: "종목 코드, 예시) 삼성전자: 005930, 삼성SDS: 018260"
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: 성공적인 응답
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 sharePrice:
     *                   type: integer
     *                   description: 주식의 현재 가격
     *                   example: 74700
     *                 company:
     *                   type: string
     *                   description: 회사명
     *                   example: "삼성전자"
     *                 currentTime:
     *                   type: string
     *                   format: date
     *                   description: 현재 시간
     *                   example: "2024-01-25"
     *                 currentStatus:
     *                   type: string
     *                   description: 현재 상태
     *                   example: "기준(장마감)"
     *       400:
     *         description: "지원하지 않는 파라미터입니다. (stockCode: number 타입, 종목 코드)"
     *       402:
     *         description: "확인되지 않는 종목 코드입니다."
     *       500:
     *         description: "시스템 내부 오류가 발생하였습니다. 관리자에게 문의부탁드립니다."
     */

    route.get("/stock/:stockCode", cacheMiddleware(60000), stockDataReqHandler)

    /**
     * @swagger
     * /api/hanja/{lang}/{hanja}:
     *   get:
     *     summary: 한자 정보를 반환합니다.
     *     parameters:
     *       - in: path
     *         name: lang
     *         required: true
     *         description: "언어, 지원언어 종류: 한국/kor, 일본/jp"
     *         schema:
     *           type: string
     *       - in: path
     *         name: hanja
     *         required: true
     *         description: "검색할 한자"
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: 성공적인 응답
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/HanjaResponseKor'
     *                 - $ref: '#/components/schemas/HanjaResponseJp'
     *       400:
     *         description: "지원하지 않는 타입(지원 타입:kor, jp)"
     *       402:
     *         description: "요청한 한자를 찾을 수 없습니다."
     *       500:
     *         description: "시스템 내부 오류가 발생하였습니다. 관리자에게 문의부탁드립니다."
     * components:
     *   schemas:
     *     HanjaResponseKor:
     *       type: object
     *       properties:
     *         mix_pron:
     *           type: string
     *           description: "한자의 뜻과 음"
     *           example: "사람 인"
     *         learning_info_category:
     *           type: string
     *           description: "한자 구성원리 타이틀"
     *           example: "한자 구성원리"
     *         learning_info_category_1depth:
     *           type: string
     *           description: "한자 종류 명칭"
     *           example: "상형문자"
     *         learning_info_category_1depth_content:
     *           type: string
     *           description: "한자 종류 명칭에 대한 설명"
     *           example: "구체적인 사물의 모양을 본뜸..."
     *         learning_info_body:
     *           type: string
     *           description: "\"그림으로 배우는 한자\" 학습정보 스크랩 html"
     *           example: "<html>...</html>"
     *     HanjaResponseJp:
     *       type: object
     *       properties:
     *         expAudioRead:
     *           type: string
     *           description: "음독"
     *           example: "じん·にん"
     *         expMeaningRead:
     *           type: string
     *           description: "훈독"
     *           example: "ひと"
     */

    route.get("/hanja/:lang/:hanja", cacheMiddleware(60000), hanjaDataReqHandler)
    
    return route
}
