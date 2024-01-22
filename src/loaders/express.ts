import express from 'express';

import { Router } from 'express';

import routes from '../api';
import config from '../config';

export default (app: express.Application) => {
  /**
   * Health Check endpoints
   * */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // 라우팅 설정
  app.use(config.api.prefix, routes());

  /// 에러 핸들러
  app.use((err, req, res, next) => {
    res.status(500).send({ error: "시스템 내부 오류가 발생하였습니다. 관리자에게 문의부탁드립니다." });
    // res.status(500).send({ error: err.message });

    return next(err);
  });
};