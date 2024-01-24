import { express, 
        expressLoader, logger } from './utils';

export async function init(app: express.Application){
    // Server loader 시작
    logger.log("Server loaders loading start... 🔥");

    // express load
    await expressLoader(app);
    
    logger.log("express loaded");

    // Server loader 끝
    logger.log("Server loaders loading End ✅");
}