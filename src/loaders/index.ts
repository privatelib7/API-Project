import { express, 
        expressLoader, FileLogger } from './utils';

export async function init(app: express.Application, config: any) {
    const logger = new FileLogger()

    // Server loader 시작
    logger.log("Server loaders loading start... 🔥");

    // express load
    await expressLoader(app, config);
    
    logger.log("express loaded");

    // Server loader 끝
    logger.log("Server loaders loading End ✅");
}