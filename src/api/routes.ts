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
     *         description: "랭킹 타입, 지원 랭킹 타입: oriconMusic: 오리콘 차트 데일리 싱글 랭킹, boxofficeMovie: 올해 박스 오피스 랭킹"
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: 성공적인 응답. 응답 형식은 'rankType' 파라미터에 따라 다릅니다.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/OriconMusicRanking'
     *                 - $ref: '#/components/schemas/BoxOfficeMovieRanking'
     *       400:
     *         description: "지원하지 않는 파라미터입니다. (rankType: string 타입, 지원타입 종류: oriconMusic/boxofficeMovie)"
     *       500:
     *         description: "시스템 내부 오류가 발생하였습니다. 관리자에게 문의부탁드립니다."
     * components:
     *   schemas:
     *     OriconMusicRanking:
     *       type: array
     *       items:
     *         type: object
     *         properties:
     *           title:
     *             type: string
     *             example: "HEARTBREAKER/C‘monova"
     *           name:
     *             type: string
     *             example: "Kis-My-Ft2"
     *           ranking:
     *             type: integer
     *             example: 1
     *     BoxOfficeMovieRanking:
     *       type: array
     *       items:
     *         type: object
     *         properties:
     *           ranking:
     *             type: integer
     *             example: 1
     *           title:
     *             type: string
     *             example: "The Beekeeper"
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
     *                 curTime:
     *                   type: string
     *                   format: date-time
     *                   description: 현재 시간
     *                   example: "2024-01-21T20:37:18.999Z"
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
     *         description: 성공적인 응답. 응답 형식은 'lang' 파라미터에 따라 다릅니다.
     *         content:
     *           application/json:
     *             schema:
     *               oneOf:
     *                 - $ref: '#/components/schemas/HanjaResponseKor'
     *                 - $ref: '#/components/schemas/HanjaResponseJp'
     *       400:
     *         description: "지원하지 않는 파라미터입니다. (lang: string 타입, 지원언어 종류: kor/jp, hanja: string 타입, 한자)"
     *       402:
     *         description: "확인되지 않는 한자입니다."
     *       500:
     *         description: "시스템 내부 오류가 발생하였습니다. 관리자에게 문의부탁드립니다."
     * components:
     *   schemas:
     *     HanjaResponseKor:
     *       type: object
     *       properties:
     *         mix_pron:
     *           type: string
     *           example: "사람 인"
     *         learning_info_category:
     *           type: string
     *           example: "한자 구성원리"
     *         # ... 기타 한국어 응답에 대한 프로퍼티
     *     HanjaResponseJp:
     *       type: object
     *       properties:
     *         expAudioRead:
     *           type: string
     *           example: "じん·にん"
     *         expMeaningRead:
     *           type: string
     *           example: "ひと"
     *         # ... 기타 일본어 응답에 대한 프로퍼티
     */

    route.get("/hanja/:lang/:hanja", cacheMiddleware(60000), hanjaDataReqHandler)
    
    return route
}
