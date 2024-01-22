import express from 'express';

import expressLoader from './express';
import { info_logger } from './logger';

export async function init(app: express.Application){
    // Server loader 시작
    info_logger.log("Server loaders loading start...");

    // express load
    await expressLoader(app);
    
    info_logger.log("express loaded");
}